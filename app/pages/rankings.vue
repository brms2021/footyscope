<template>
  <div class="relative min-h-screen">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%2780%27 viewBox=%270 0 80 80%27 fill=%27none%27%3E%3Ccircle cx=%2740%27 cy=%2740%27 r=%2718%27 stroke=%27%23ffffff%27 stroke-width=%271%27/%3E%3Ccircle cx=%2740%27 cy=%2740%27 r=%2710%27 stroke=%27%23ffffff%27 stroke-width=%270.5%27/%3E%3Cline x1=%2740%27 y1=%2716%27 x2=%2740%27 y2=%2726%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2740%27 y1=%2754%27 x2=%2740%27 y2=%2764%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2716%27 y1=%2740%27 x2=%2726%27 y2=%2740%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2754%27 y1=%2740%27 x2=%2764%27 y2=%2740%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3C/svg%3E'); background-size: 80px 80px;" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-teal)_0%,_transparent_60%)] opacity-[0.04]" />
    <div class="absolute top-20 right-[5%] w-64 h-64 rounded-full bg-teal/5 blur-3xl" />
    <div class="absolute bottom-40 left-[5%] w-48 h-48 rounded-full bg-teal/3 blur-3xl" />

    <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold">2026 AFL Draft Rankings</h1>
      <p class="mt-2 text-muted-foreground">FootyScope prospect rankings — sortable and filterable</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search players..."
        class="rounded-lg border border-input bg-background px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select v-model="filters.position" class="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">All Positions</option>
        <option v-for="pos in POSITIONS" :key="pos" :value="pos">{{ pos }}</option>
      </select>
      <select v-model="filters.state" class="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">All States</option>
        <option v-for="s in STATES" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <!-- Rankings list -->
    <div class="space-y-2">
      <NuxtLink
        v-for="entry in data"
        :key="entry.id"
        :to="`/players/${entry.player.slug}`"
        class="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-teal/40 hover:bg-muted/30"
      >
        <span class="font-heading text-2xl font-extrabold text-muted-foreground w-8 text-center shrink-0">{{ entry.rank }}</span>
        <div class="h-10 w-10 shrink-0 rounded-full ring-2 ring-border overflow-hidden">
          <img :src="getPlayerImage(entry.player.photoUrl, entry.player.name, 80)" :alt="entry.player.name" class="h-full w-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-heading text-sm font-bold truncate">{{ entry.player.name }}</p>
          <p class="text-xs text-muted-foreground">{{ entry.player.position }} · {{ entry.player.team }} · {{ entry.player.state }}</p>
        </div>
        <div v-if="entry.previousRank !== null && entry.previousRank !== entry.rank" class="flex items-center gap-0.5 shrink-0">
          <TrendingUp v-if="entry.previousRank > entry.rank" class="h-3.5 w-3.5 text-teal" />
          <TrendingDown v-else class="h-3.5 w-3.5 text-scope-1" />
          <span class="font-stats text-xs" :class="entry.previousRank > entry.rank ? 'text-teal' : 'text-scope-1'">
            {{ Math.abs(entry.previousRank - entry.rank) }}
          </span>
        </div>
        <ScopeRating :rating="entry.player.rating" size="sm" />
      </NuxtLink>
    </div>

    <div v-if="data.length === 0" class="text-center py-12 text-muted-foreground">
      No prospects match your filters.
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import { POSITIONS, STATES } from '~/types'
import type { PlayerFilters } from '~/types'

useSocialMeta({
  title: '2026 AFL Draft Rankings',
  description: 'Complete 2026 AFL Draft prospect rankings. Sortable and filterable by position, state, and rating. Powered by the FootyScope Scope Rating system.',
  url: '/rankings',
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '2026 AFL Draft Rankings',
      description: 'FootyScope prospect rankings for the 2026 AFL Draft',
      url: 'https://footy-scope.com/rankings',
    }),
  }],
})

const filters = reactive<PlayerFilters>({
  search: '',
  position: '',
  state: '',
})

const { data } = useRankings(2026, filters)
</script>
