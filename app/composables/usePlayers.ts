import { collection, query, getDocs, orderBy } from 'firebase/firestore'
import type { Player, PlayerFilters } from '~/types'

function applyFilters(players: Player[], filters?: PlayerFilters): Player[] {
  if (!filters) return players
  return players.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.team.toLowerCase().includes(q) && !p.position.toLowerCase().includes(q)) return false
    }
    if (filters.position && p.position !== filters.position) return false
    if (filters.state && p.state !== filters.state) return false
    if (filters.draftYear && p.draftYear !== filters.draftYear) return false
    if (filters.minRating && p.rating < filters.minRating) return false
    if (filters.maxRating && p.rating > filters.maxRating) return false
    if (filters.minHeight && p.height < filters.minHeight) return false
    if (filters.maxHeight && p.height > filters.maxHeight) return false
    return true
  })
}

// Shared reactive cache
const _players = ref<Player[]>([])
const _loaded = ref(false)

async function loadPlayers() {
  if (_loaded.value) return
  const db = useFirestore()
  const snap = await getDocs(collection(db, 'players'))
  _players.value = snap.docs
    .map(d => ({ ...d.data(), id: d.id } as Player))
    .filter(p => p.published)
    .sort((a, b) => b.rating - a.rating)
  _loaded.value = true
}

export function usePlayers(filters?: Ref<PlayerFilters> | PlayerFilters) {
  if (import.meta.client && !_loaded.value) loadPlayers()

  const data = computed(() => {
    const f = isRef(filters) ? filters.value : filters
    return applyFilters(_players.value, f)
  })
  return { data, pending: computed(() => !_loaded.value), error: ref(null) }
}

export function usePlayer(slug: string | Ref<string>) {
  const data = ref<Player | null>(null)
  const pending = ref(true)

  if (import.meta.client) {
    loadPlayers().then(() => {
      const s = isRef(slug) ? slug.value : slug
      data.value = _players.value.find(p => p.slug === s) ?? null
      pending.value = false
    })
  }

  return { data, pending, error: ref(null) }
}

export function useTopProspects(limit: number = 3) {
  if (import.meta.client && !_loaded.value) loadPlayers()

  const data = computed(() => _players.value.slice(0, limit))
  return { data, pending: computed(() => !_loaded.value), error: ref(null) }
}

export function useAllPlayers() {
  if (import.meta.client && !_loaded.value) loadPlayers()
  return _players
}
