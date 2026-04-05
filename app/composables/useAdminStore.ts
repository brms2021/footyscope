import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy,
} from 'firebase/firestore'
import type { Player, Article, RankingEntry, EOISubmission } from '~/types'

const players = ref<Player[]>([])
const articles = ref<Article[]>([])
const rankings = ref<RankingEntry[]>([])
const eoiSubmissions = ref<EOISubmission[]>([])
const loaded = ref(false)

export function useAdminStore() {
  const db = useFirestore()

  // Load all data from Firestore
  async function loadAll() {
    if (loaded.value) return
    const [pSnap, aSnap, rSnap, eSnap] = await Promise.all([
      getDocs(query(collection(db, 'players'), orderBy('rating', 'desc'))),
      getDocs(query(collection(db, 'articles'), orderBy('updatedAt', 'desc'))),
      getDocs(query(collection(db, 'rankings'), orderBy('rank', 'asc'))),
      getDocs(query(collection(db, 'eoiSubmissions'), orderBy('createdAt', 'desc'))),
    ])

    players.value = pSnap.docs.map(d => ({ ...d.data(), id: d.id } as Player))
    articles.value = aSnap.docs.map(d => ({ ...d.data(), id: d.id } as Article))
    rankings.value = rSnap.docs.map(d => ({ ...d.data(), id: d.id } as RankingEntry))
    eoiSubmissions.value = eSnap.docs.map(d => ({ ...d.data(), id: d.id } as EOISubmission))
    loaded.value = true
  }

  // Initialize on first use
  if (import.meta.client && !loaded.value) {
    loadAll()
  }

  // Players
  function getPlayer(id: string) {
    return players.value.find(p => p.id === id)
  }

  async function savePlayer(player: Player) {
    const now = new Date().toISOString()
    const idx = players.value.findIndex(p => p.id === player.id)

    if (idx >= 0) {
      // Update existing
      const { id, ...data } = { ...player, updatedAt: now }
      await updateDoc(doc(db, 'players', id), data as any)
      players.value[idx] = { ...player, updatedAt: now }
    } else {
      // Create new
      const { id: _id, ...data } = { ...player, createdAt: now, updatedAt: now }
      const docRef = await addDoc(collection(db, 'players'), data)
      players.value.push({ ...player, id: docRef.id, createdAt: now, updatedAt: now })
    }
  }

  async function deletePlayer(id: string) {
    await deleteDoc(doc(db, 'players', id))
    players.value = players.value.filter(p => p.id !== id)

    // Also remove from rankings
    const rankDocs = await getDocs(query(collection(db, 'rankings'), where('playerId', '==', id)))
    for (const d of rankDocs.docs) {
      await deleteDoc(d.ref)
    }
    rankings.value = rankings.value.filter(r => r.playerId !== id)
  }

  // Articles
  function getArticle(id: string) {
    return articles.value.find(a => a.id === id)
  }

  async function saveArticle(article: Article) {
    const now = new Date().toISOString()
    const idx = articles.value.findIndex(a => a.id === article.id)

    if (idx >= 0) {
      const { id, ...data } = { ...article, updatedAt: now }
      await updateDoc(doc(db, 'articles', id), data as any)
      articles.value[idx] = { ...article, updatedAt: now }
    } else {
      const { id: _id, ...data } = { ...article, createdAt: now, updatedAt: now }
      const docRef = await addDoc(collection(db, 'articles'), data)
      articles.value.push({ ...article, id: docRef.id, createdAt: now, updatedAt: now })
    }
  }

  async function deleteArticle(id: string) {
    await deleteDoc(doc(db, 'articles', id))
    articles.value = articles.value.filter(a => a.id !== id)
  }

  // Rankings
  async function saveRankings(entries: RankingEntry[]) {
    const year = entries[0]?.draftYear
    if (!year) return

    // Delete existing rankings for this year
    const existing = await getDocs(query(collection(db, 'rankings'), where('draftYear', '==', year)))
    for (const d of existing.docs) {
      await deleteDoc(d.ref)
    }

    // Write new rankings
    const newRankings: RankingEntry[] = []
    for (let i = 0; i < entries.length; i++) {
      const { id: _id, ...data } = { ...entries[i], rank: i + 1, updatedAt: new Date().toISOString() }
      const docRef = await addDoc(collection(db, 'rankings'), data)
      newRankings.push({ ...entries[i], id: docRef.id, rank: i + 1 })
    }

    rankings.value = [
      ...rankings.value.filter(r => r.draftYear !== year),
      ...newRankings,
    ]
  }

  function getRankings(draftYear: number) {
    return rankings.value
      .filter(r => r.draftYear === draftYear)
      .sort((a, b) => a.rank - b.rank)
  }

  // EOI
  function getSubmissions() {
    return eoiSubmissions.value.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }

  async function markSubmissionRead(id: string) {
    await updateDoc(doc(db, 'eoiSubmissions', id), { read: true })
    const sub = eoiSubmissions.value.find(s => s.id === id)
    if (sub) sub.read = true
  }

  return {
    players,
    articles,
    rankings,
    eoiSubmissions,
    loaded,
    loadAll,
    getPlayer,
    savePlayer,
    deletePlayer,
    getArticle,
    saveArticle,
    deleteArticle,
    saveRankings,
    getRankings,
    getSubmissions,
    markSubmissionRead,
  }
}
