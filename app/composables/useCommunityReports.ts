import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore'
import type { CommunityReport, ReportStatus } from '~/types'

const _allReports = ref<CommunityReport[]>([])
const _loaded = ref(false)

async function loadReports() {
  if (_loaded.value) return
  const db = useFirestore()
  const snap = await getDocs(collection(db, 'communityReports'))
  _allReports.value = snap.docs
    .map(d => ({ ...d.data(), id: d.id } as CommunityReport))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  _loaded.value = true
}

function invalidateCache() {
  _loaded.value = false
  loadReports()
}

export function usePlayerReports(playerSlug: string | Ref<string>) {
  if (import.meta.client && !_loaded.value) loadReports()

  const data = computed(() => {
    const slug = isRef(playerSlug) ? playerSlug.value : playerSlug
    return _allReports.value.filter(r => r.playerSlug === slug && r.status === 'approved')
  })

  return { data, pending: computed(() => !_loaded.value) }
}

export function usePendingReports() {
  if (import.meta.client && !_loaded.value) loadReports()

  const pending = computed(() => _allReports.value.filter(r => r.status === 'pending'))
  const approved = computed(() => _allReports.value.filter(r => r.status === 'approved'))
  const rejected = computed(() => _allReports.value.filter(r => r.status === 'rejected'))

  return { pending, approved, rejected, all: _allReports, loaded: _loaded }
}

export async function submitReport(playerSlug: string, content: string, rating: number) {
  const user = useCurrentUser()
  if (!user.value) throw new Error('Must be signed in')

  const db = useFirestore()
  const now = new Date().toISOString()

  const report: Omit<CommunityReport, 'id'> = {
    playerSlug,
    authorUid: user.value.uid,
    authorName: user.value.displayName || user.value.email?.split('@')[0] || 'Anonymous',
    authorEmail: user.value.email || '',
    content,
    rating,
    status: 'pending',
    likes: [],
    dislikes: [],
    createdAt: now,
    updatedAt: now,
  }

  await addDoc(collection(db, 'communityReports'), report)
  invalidateCache()
}

export async function updateReportStatus(reportId: string, status: ReportStatus) {
  const db = useFirestore()
  await updateDoc(doc(db, 'communityReports', reportId), {
    status,
    updatedAt: new Date().toISOString(),
  })

  const r = _allReports.value.find(r => r.id === reportId)
  if (r) {
    r.status = status
    r.updatedAt = new Date().toISOString()
  }
}

export async function toggleLike(reportId: string) {
  const user = useCurrentUser()
  if (!user.value) throw new Error('Must be signed in')

  const uid = user.value.uid
  const db = useFirestore()
  const report = _allReports.value.find(r => r.id === reportId)
  if (!report) return

  const ref = doc(db, 'communityReports', reportId)

  if (report.likes.includes(uid)) {
    // Remove like
    await updateDoc(ref, { likes: arrayRemove(uid) })
    report.likes = report.likes.filter(id => id !== uid)
  } else {
    // Add like, remove dislike if present
    await updateDoc(ref, { likes: arrayUnion(uid), dislikes: arrayRemove(uid) })
    report.likes = [...report.likes, uid]
    report.dislikes = report.dislikes.filter(id => id !== uid)
  }
}

export async function toggleDislike(reportId: string) {
  const user = useCurrentUser()
  if (!user.value) throw new Error('Must be signed in')

  const uid = user.value.uid
  const db = useFirestore()
  const report = _allReports.value.find(r => r.id === reportId)
  if (!report) return

  const ref = doc(db, 'communityReports', reportId)

  if (report.dislikes.includes(uid)) {
    await updateDoc(ref, { dislikes: arrayRemove(uid) })
    report.dislikes = report.dislikes.filter(id => id !== uid)
  } else {
    await updateDoc(ref, { dislikes: arrayUnion(uid), likes: arrayRemove(uid) })
    report.dislikes = [...report.dislikes, uid]
    report.likes = report.likes.filter(id => id !== uid)
  }
}
