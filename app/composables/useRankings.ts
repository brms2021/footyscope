import { collection, getDocs } from 'firebase/firestore'
import type { Player, PlayerFilters, RankingEntry } from '~/types'

export interface RankedPlayer extends RankingEntry {
  player: Player
}

const _rankings = ref<RankedPlayer[]>([])
const _loaded = ref(false)

async function loadRankings() {
  if (_loaded.value) return
  const db = useFirestore()

  const [rankSnap, playerSnap] = await Promise.all([
    getDocs(collection(db, 'rankings')),
    getDocs(collection(db, 'players')),
  ])

  const playerMap = new Map<string, Player>()
  playerSnap.forEach(d => {
    const p = { ...d.data(), id: d.id } as Player
    if (p.published) playerMap.set(d.id, p)
  })

  const ranked: RankedPlayer[] = []
  rankSnap.forEach(d => {
    const r = { ...d.data(), id: d.id } as RankingEntry
    const player = playerMap.get(r.playerId)
    if (player) ranked.push({ ...r, player })
  })

  _rankings.value = ranked.sort((a, b) => a.rank - b.rank)
  _loaded.value = true
}

export function useRankings(draftYear?: Ref<number> | number, filters?: Ref<PlayerFilters> | PlayerFilters) {
  if (import.meta.client && !_loaded.value) loadRankings()

  const data = computed(() => {
    const year = isRef(draftYear) ? draftYear.value : (draftYear ?? 2026)
    let result = _rankings.value.filter(r => r.draftYear === year)

    const f = isRef(filters) ? filters.value : filters
    if (f) {
      result = result.filter(r => {
        const p = r.player
        if (f.search) {
          const q = f.search.toLowerCase()
          if (!p.name.toLowerCase().includes(q) && !p.team.toLowerCase().includes(q)) return false
        }
        if (f.position && p.position !== f.position) return false
        if (f.state && p.state !== f.state) return false
        if (f.minRating && p.rating < f.minRating) return false
        if (f.maxRating && p.rating > f.maxRating) return false
        return true
      })
    }
    return result
  })

  return { data, pending: computed(() => !_loaded.value), error: ref(null) }
}
