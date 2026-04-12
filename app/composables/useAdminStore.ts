import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, setDoc,
  query, where, orderBy, getDoc,
} from 'firebase/firestore'
import type { Player, Article, RankingEntry, EOISubmission, ConsensusRow, SiteContent } from '~/types'

const players = ref<Player[]>([])
const articles = ref<Article[]>([])
const rankings = ref<RankingEntry[]>([])
const eoiSubmissions = ref<EOISubmission[]>([])
const consensusRows = ref<ConsensusRow[]>([])
const siteContent = ref<SiteContent>({ consensusDisclaimer: '', homepageHeader: '' })
const loaded = ref(false)

export function useAdminStore() {
  const db = useFirestore()

  // Load all data from Firestore
  async function loadAll() {
    if (loaded.value) return
    const [pSnap, aSnap, rSnap, eSnap, cSnap, scDoc] = await Promise.all([
      getDocs(query(collection(db, 'players'), orderBy('rating', 'desc'))),
      getDocs(query(collection(db, 'articles'), orderBy('updatedAt', 'desc'))),
      getDocs(query(collection(db, 'rankings'), orderBy('rank', 'asc'))),
      getDocs(query(collection(db, 'eoiSubmissions'), orderBy('createdAt', 'desc'))),
      getDocs(query(collection(db, 'consensus'), orderBy('order', 'asc'))),
      getDoc(doc(db, 'siteContent', 'main')),
    ])

    players.value = pSnap.docs.map(d => ({ ...d.data(), id: d.id } as Player))
    articles.value = aSnap.docs.map(d => ({ ...d.data(), id: d.id } as Article))
    rankings.value = rSnap.docs.map(d => ({ ...d.data(), id: d.id } as RankingEntry))
    eoiSubmissions.value = eSnap.docs.map(d => ({ ...d.data(), id: d.id } as EOISubmission))
    consensusRows.value = cSnap.docs.map(d => ({ ...d.data(), id: d.id } as ConsensusRow))
    if (scDoc.exists()) siteContent.value = scDoc.data() as SiteContent
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

  // Consensus Rankings
  async function saveConsensus(rows: ConsensusRow[]) {
    // Delete existing
    const existing = await getDocs(collection(db, 'consensus'))
    for (const d of existing.docs) await deleteDoc(d.ref)
    // Write new
    const saved: ConsensusRow[] = []
    for (let i = 0; i < rows.length; i++) {
      const { id: _id, ...data } = { ...rows[i], order: i }
      const docRef = await addDoc(collection(db, 'consensus'), data)
      saved.push({ ...rows[i], id: docRef.id, order: i })
    }
    consensusRows.value = saved
  }

  // Site Content (disclaimers, editable text)
  async function saveSiteContent(content: Partial<SiteContent>) {
    await setDoc(doc(db, 'siteContent', 'main'), content, { merge: true })
    siteContent.value = { ...siteContent.value, ...content }
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
    consensusRows,
    siteContent,
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
    saveConsensus,
    saveSiteContent,
    getSubmissions,
    markSubmissionRead,
  }
}
