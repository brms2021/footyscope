<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold">Live Draft Tracker</h1>
        <p class="mt-2 text-muted-foreground">Follow every pick as it happens on draft night</p>
      </div>

      <!-- Status banner -->
      <div class="rounded-xl border border-border bg-card p-6 mb-8 text-center">
        <div v-if="!draftStarted" class="space-y-3">
          <div class="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <Clock class="h-4 w-4" />
            Draft Not Yet Started
          </div>
          <p class="text-2xl font-extrabold text-foreground">2026 AFL National Draft</p>
          <p class="text-muted-foreground">Marvel Stadium, Melbourne</p>
          <p class="text-sm text-muted-foreground">Late November 2026 — Date TBC</p>
          <p class="text-xs text-muted-foreground mt-4">When the draft begins, picks will appear here in real time. Owners can update picks from the admin panel.</p>
        </div>

        <div v-else class="space-y-3">
          <div class="inline-flex items-center gap-2 rounded-full bg-teal/20 px-4 py-1.5 text-sm font-medium text-teal animate-pulse">
            <Radio class="h-4 w-4" />
            LIVE
          </div>
          <p class="text-2xl font-extrabold text-foreground">2026 AFL National Draft</p>
          <p class="text-sm text-muted-foreground">{{ livePicks.length }} pick{{ livePicks.length !== 1 ? 's' : '' }} made</p>
        </div>
      </div>

      <!-- Picks list -->
      <div v-if="livePicks.length" class="space-y-2">
        <div
          v-for="pick in livePicks"
          :key="pick.pickNumber"
          v-motion :initial="{ x: -20, opacity: 0 }" :enter="{ x: 0, opacity: 1 }"
          class="flex items-center gap-4 rounded-lg border border-teal/30 bg-card px-4 py-3"
        >
          <span class="font-heading text-2xl font-extrabold text-muted-foreground w-8 text-center shrink-0">{{ pick.pickNumber }}</span>
          <div class="w-28 shrink-0">
            <p class="text-xs font-bold text-foreground">{{ pick.club }}</p>
          </div>
          <div class="h-10 w-10 shrink-0 rounded-full ring-2 ring-teal/30 overflow-hidden">
            <img :src="getPlayerImage(pick.photoUrl, pick.playerName, 80)" :alt="pick.playerName" class="h-full w-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <NuxtLink v-if="pick.playerSlug" :to="`/players/${pick.playerSlug}`" class="font-heading text-sm font-bold hover:text-primary transition-colors">{{ pick.playerName }}</NuxtLink>
            <p v-else class="font-heading text-sm font-bold">{{ pick.playerName }}</p>
            <p class="text-xs text-muted-foreground">{{ pick.position }} · {{ pick.from }}</p>
          </div>
          <div v-if="pick.note" class="hidden sm:block text-xs text-muted-foreground max-w-48 truncate">{{ pick.note }}</div>
        </div>
      </div>

      <!-- Pre-draft: show predictions -->
      <div v-if="!draftStarted" class="mt-8">
        <h2 class="text-xl font-bold mb-4">FootyScope Predictions</h2>
        <p class="text-sm text-muted-foreground mb-6">Our predicted draft order based on current rankings and club needs.</p>
        <div class="space-y-2">
          <NuxtLink
            v-for="entry in rankings"
            :key="entry.id"
            :to="`/players/${entry.player.slug}`"
            class="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 hover:border-teal/40 transition-all"
          >
            <span class="font-heading text-xl font-extrabold text-muted-foreground w-8 text-center shrink-0">{{ entry.rank }}</span>
            <div class="h-8 w-8 shrink-0 rounded-full ring-1 ring-border overflow-hidden">
              <img :src="getPlayerImage(entry.player.photoUrl, entry.player.name, 64)" :alt="entry.player.name" class="h-full w-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold truncate">{{ entry.player.name }}</p>
              <p class="text-xs text-muted-foreground">{{ entry.player.position }} · {{ entry.player.team }}</p>
            </div>
            <ScopeRating :rating="entry.player.rating" size="sm" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Radio } from 'lucide-vue-next'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

useHead({ title: 'Live Draft Tracker — FootyScope' })

const { data: rankings } = useRankings(2026)

interface LivePick {
  pickNumber: number
  club: string
  playerName: string
  playerSlug: string | null
  position: string
  from: string
  photoUrl: string | null
  note: string
}

const livePicks = ref<LivePick[]>([])
const draftStarted = computed(() => livePicks.value.length > 0)

// Load live picks from Firestore
onMounted(async () => {
  try {
    const db = useFirestore()
    const snap = await getDocs(query(collection(db, 'draftPicks'), orderBy('pickNumber', 'asc')))
    livePicks.value = snap.docs.map(d => d.data() as LivePick)
  } catch {
    // No picks yet — draft hasn't started
  }
})
</script>
