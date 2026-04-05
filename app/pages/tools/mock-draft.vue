<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold">Mock Draft Builder</h1>
        <p class="mt-2 text-muted-foreground">Build your own phantom draft — drag prospects to picks and share your predictions</p>
      </div>

      <!-- Draft year + reset -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-muted-foreground">2026 National Draft</span>
          <span class="text-xs text-muted-foreground">{{ draftPicks.filter(p => p.player).length }}/{{ draftPicks.length }} picks made</span>
        </div>
        <div class="flex gap-2">
          <button @click="resetDraft" class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            Reset
          </button>
          <button @click="shareDraft" v-if="draftPicks.some(p => p.player)" class="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-teal transition-colors">
            {{ copied ? 'Copied!' : 'Share Draft' }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Draft board -->
        <div class="lg:col-span-2 space-y-2">
          <div
            v-for="pick in draftPicks"
            :key="pick.number"
            class="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-all"
            :class="pick.player ? 'border-teal/30' : 'border-border border-dashed'"
          >
            <span class="font-heading text-xl font-extrabold text-muted-foreground w-8 text-center shrink-0">{{ pick.number }}</span>

            <!-- Club -->
            <div class="w-28 shrink-0">
              <p class="text-xs font-medium text-muted-foreground truncate">{{ pick.club }}</p>
            </div>

            <!-- Player slot -->
            <div v-if="pick.player" class="flex-1 flex items-center gap-3">
              <div class="h-8 w-8 rounded-full ring-1 ring-border overflow-hidden shrink-0">
                <img :src="getPlayerImage(pick.player.photoUrl, pick.player.name, 64)" :alt="pick.player.name" class="h-full w-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold truncate">{{ pick.player.name }}</p>
                <p class="text-xs text-muted-foreground">{{ pick.player.position }} · {{ pick.player.team }}</p>
              </div>
              <span class="font-stats text-xs font-bold" :style="{ color: getRatingColor(pick.player.rating) }">{{ pick.player.rating }}</span>
              <button @click="removePick(pick.number)" class="text-muted-foreground hover:text-destructive transition-colors">
                <X class="h-4 w-4" />
              </button>
            </div>

            <!-- Empty slot -->
            <div v-else class="flex-1">
              <select @change="assignPick(pick.number, $event)" class="w-full rounded-md border-0 bg-transparent text-sm text-muted-foreground focus:outline-none cursor-pointer">
                <option value="">Select prospect...</option>
                <option v-for="p in availablePlayers" :key="p.slug" :value="p.slug">{{ p.name }} ({{ p.position }}, {{ p.rating }})</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Available players sidebar -->
        <div class="space-y-3">
          <h3 class="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Available Prospects</h3>
          <input v-model="search" type="text" placeholder="Search..." class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <div class="space-y-1 max-h-[600px] overflow-y-auto">
            <button
              v-for="p in filteredAvailable"
              :key="p.slug"
              @click="assignToNextEmpty(p)"
              class="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-muted/50 transition-colors"
            >
              <div class="h-7 w-7 rounded-full ring-1 ring-border overflow-hidden shrink-0">
                <img :src="getPlayerImage(p.photoUrl, p.name, 56)" :alt="p.name" class="h-full w-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold truncate">{{ p.name }}</p>
                <p class="text-[10px] text-muted-foreground">{{ p.position }} · {{ p.team }}</p>
              </div>
              <span class="font-stats text-[10px] font-bold" :style="{ color: getRatingColor(p.rating) }">{{ p.rating }}</span>
            </button>
            <p v-if="filteredAvailable.length === 0" class="text-xs text-muted-foreground py-4 text-center">All prospects assigned</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { Player } from '~/types'

useHead({ title: 'Mock Draft Builder — FootyScope' })

const allPlayers = useAllPlayers()
const search = ref('')
const copied = ref(false)

// 2026 draft order (approximate — first 18 picks)
const DRAFT_ORDER = [
  { number: 1, club: 'North Melbourne' },
  { number: 2, club: 'West Coast' },
  { number: 3, club: 'Richmond' },
  { number: 4, club: 'Adelaide' },
  { number: 5, club: 'Essendon' },
  { number: 6, club: 'Gold Coast' },
  { number: 7, club: 'St Kilda' },
  { number: 8, club: 'Melbourne' },
  { number: 9, club: 'Fremantle' },
  { number: 10, club: 'GWS Giants' },
  { number: 11, club: 'Collingwood' },
  { number: 12, club: 'Western Bulldogs' },
  { number: 13, club: 'Geelong' },
  { number: 14, club: 'Port Adelaide' },
  { number: 15, club: 'Hawthorn' },
  { number: 16, club: 'Carlton' },
  { number: 17, club: 'Sydney' },
  { number: 18, club: 'Brisbane' },
]

interface DraftPick {
  number: number
  club: string
  player: Player | null
}

const draftPicks = ref<DraftPick[]>(DRAFT_ORDER.map(d => ({ ...d, player: null })))

const assignedSlugs = computed(() => new Set(draftPicks.value.filter(p => p.player).map(p => p.player!.slug)))

const availablePlayers = computed(() => {
  const players = allPlayers.value ?? []
  return players
    .filter((p: Player) => !assignedSlugs.value.has(p.slug))
    .sort((a: Player, b: Player) => b.rating - a.rating)
})

const filteredAvailable = computed(() => {
  if (!search.value) return availablePlayers.value
  const q = search.value.toLowerCase()
  return availablePlayers.value.filter((p: Player) =>
    p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q)
  )
})

function assignPick(pickNumber: number, event: Event) {
  const slug = (event.target as HTMLSelectElement).value
  if (!slug) return
  const player = (allPlayers.value ?? []).find((p: Player) => p.slug === slug)
  if (!player) return
  const pick = draftPicks.value.find(p => p.number === pickNumber)
  if (pick) pick.player = player
  ;(event.target as HTMLSelectElement).value = ''
}

function assignToNextEmpty(player: Player) {
  const emptyPick = draftPicks.value.find(p => !p.player)
  if (emptyPick) emptyPick.player = player
}

function removePick(pickNumber: number) {
  const pick = draftPicks.value.find(p => p.number === pickNumber)
  if (pick) pick.player = null
}

function resetDraft() {
  draftPicks.value.forEach(p => p.player = null)
}

function shareDraft() {
  const lines = draftPicks.value
    .filter(p => p.player)
    .map(p => `${p.number}. ${p.club} — ${p.player!.name} (${p.player!.position})`)
    .join('\n')
  const text = `My 2026 AFL Mock Draft 🏈\n\n${lines}\n\nBuilt on FootyScope — footy-scope.com/tools/mock-draft`
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

function getRatingColor(rating: number) {
  if (rating >= 90) return 'var(--color-scope-5)'
  if (rating >= 80) return 'var(--color-scope-4)'
  if (rating >= 70) return 'var(--color-scope-3)'
  if (rating >= 60) return 'var(--color-scope-2)'
  return 'var(--color-scope-1)'
}
</script>
