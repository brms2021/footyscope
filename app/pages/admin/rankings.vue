<template>
  <div class="p-6 lg:p-8 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold">Rankings</h1>
      <button @click="saveOrder" class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors">
        Save Order
      </button>
    </div>

    <p class="text-sm text-muted-foreground">Drag to reorder. Changes are saved when you click "Save Order".</p>

    <div class="space-y-2">
      <div
        v-for="(entry, index) in rankedPlayers"
        :key="entry.id"
        class="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3"
      >
        <!-- Rank number -->
        <span class="font-heading text-xl font-extrabold text-muted-foreground w-8 text-center shrink-0">{{ index + 1 }}</span>

        <!-- Move buttons -->
        <div class="flex flex-col gap-0.5 shrink-0">
          <button @click="moveUp(index)" :disabled="index === 0" class="text-muted-foreground hover:text-primary disabled:opacity-20 transition-colors">
            <ChevronUp class="h-4 w-4" />
          </button>
          <button @click="moveDown(index)" :disabled="index === rankedPlayers.length - 1" class="text-muted-foreground hover:text-primary disabled:opacity-20 transition-colors">
            <ChevronDown class="h-4 w-4" />
          </button>
        </div>

        <!-- Player info -->
        <div class="flex-1 min-w-0">
          <p class="font-heading text-sm font-bold truncate">{{ entry.player?.name ?? entry.playerSlug }}</p>
          <p class="text-xs text-muted-foreground">{{ entry.player?.position }} · {{ entry.player?.team }}</p>
        </div>

        <!-- Rating -->
        <span class="font-stats text-sm font-bold" :style="{ color: getRatingColor(entry.player?.rating ?? 0) }">{{ entry.player?.rating }}</span>

        <!-- Remove -->
        <button @click="removeFromRankings(index)" class="text-muted-foreground hover:text-destructive transition-colors">
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Add player -->
    <div class="space-y-2">
      <label class="text-sm font-medium">Add player to rankings</label>
      <select @change="addToRankings($event)" class="w-full max-w-md rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">Select a player...</option>
        <option v-for="p in unrankedPlayers" :key="p.id" :value="p.id">{{ p.name }} ({{ p.position }})</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronUp, ChevronDown, X } from 'lucide-vue-next'
import type { RankingEntry } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()

const rankedPlayers = ref<Array<RankingEntry & { player?: any }>>([])

// Initialize
onMounted(() => {
  loadRankings()
})

function loadRankings() {
  const entries = store.getRankings(2026)
  rankedPlayers.value = entries.map(e => ({
    ...e,
    player: store.players.value.find(p => p.id === e.playerId),
  }))
}

const unrankedPlayers = computed(() => {
  const rankedIds = new Set(rankedPlayers.value.map(r => r.playerId))
  return store.players.value.filter(p => !rankedIds.has(p.id))
})

function moveUp(index: number) {
  if (index <= 0) return
  const arr = rankedPlayers.value
  ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
}

function moveDown(index: number) {
  if (index >= rankedPlayers.value.length - 1) return
  const arr = rankedPlayers.value
  ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
}

function removeFromRankings(index: number) {
  rankedPlayers.value.splice(index, 1)
}

function addToRankings(event: Event) {
  const playerId = (event.target as HTMLSelectElement).value
  if (!playerId) return
  const player = store.players.value.find(p => p.id === playerId)
  if (!player) return
  rankedPlayers.value.push({
    id: crypto.randomUUID(),
    playerId: player.id,
    playerSlug: player.slug,
    draftYear: 2026,
    rank: rankedPlayers.value.length + 1,
    previousRank: null,
    updatedAt: new Date().toISOString(),
    player,
  })
  ;(event.target as HTMLSelectElement).value = ''
}

function saveOrder() {
  const entries: RankingEntry[] = rankedPlayers.value.map((r, i) => ({
    id: r.id,
    playerId: r.playerId,
    playerSlug: r.playerSlug,
    draftYear: r.draftYear,
    rank: i + 1,
    previousRank: r.rank,
    updatedAt: new Date().toISOString(),
  }))
  store.saveRankings(entries)
  alert('Rankings saved!')
}

function getRatingColor(rating: number) {
  if (rating >= 90) return 'var(--color-scope-5)'
  if (rating >= 80) return 'var(--color-scope-4)'
  if (rating >= 70) return 'var(--color-scope-3)'
  if (rating >= 60) return 'var(--color-scope-2)'
  return 'var(--color-scope-1)'
}
</script>
