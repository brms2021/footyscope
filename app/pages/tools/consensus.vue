<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold">Consensus Rankings</h1>
        <p class="mt-2 text-muted-foreground">Aggregated prospect rankings across multiple AFL draft analysts</p>
      </div>

      <!-- Source legend -->
      <div class="flex flex-wrap gap-2 mb-6">
        <span v-for="source in sources" :key="source.name" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" :style="{ backgroundColor: source.color + '20', color: source.color }">
          <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: source.color }" />
          {{ source.name }}
        </span>
      </div>

      <!-- Consensus table -->
      <div class="rounded-xl border border-border overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/30">
              <th class="px-4 py-3 text-center font-heading text-xs uppercase text-muted-foreground w-16">Cons.</th>
              <th class="px-4 py-3 text-left font-heading text-xs uppercase text-muted-foreground">Player</th>
              <th v-for="source in sources" :key="source.name" class="px-3 py-3 text-center font-heading text-xs uppercase text-muted-foreground hidden md:table-cell" :title="source.name">
                {{ source.short }}
              </th>
              <th class="px-4 py-3 text-center font-heading text-xs uppercase text-muted-foreground">Avg</th>
              <th class="px-4 py-3 text-center font-heading text-xs uppercase text-muted-foreground hidden sm:table-cell">Range</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in consensusData" :key="row.slug" class="border-b border-border/50 hover:bg-muted/20">
              <td class="px-4 py-3 text-center font-heading text-lg font-extrabold text-muted-foreground">{{ i + 1 }}</td>
              <td class="px-4 py-3">
                <NuxtLink :to="`/players/${row.slug}`" class="flex items-center gap-3 hover:text-primary transition-colors">
                  <div class="h-8 w-8 rounded-full ring-1 ring-border overflow-hidden shrink-0">
                    <img :src="getPlayerImage(row.photoUrl, row.name, 64)" :alt="row.name" class="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p class="font-bold text-sm">{{ row.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ row.position }}</p>
                  </div>
                </NuxtLink>
              </td>
              <td v-for="source in sources" :key="source.name" class="px-3 py-3 text-center font-stats text-xs hidden md:table-cell" :class="row.ranks[source.name] ? 'text-foreground' : 'text-muted-foreground/30'">
                {{ row.ranks[source.name] ?? '—' }}
              </td>
              <td class="px-4 py-3 text-center font-stats text-sm font-bold text-teal">{{ row.avg.toFixed(1) }}</td>
              <td class="px-4 py-3 text-center font-stats text-xs text-muted-foreground hidden sm:table-cell">{{ row.min }}-{{ row.max }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="mt-6 text-xs text-muted-foreground">
        {{ disclaimer || 'Rankings sourced from publicly available phantom drafts and prospect rankings.' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~/types'

useHead({ title: 'Consensus Rankings — FootyScope' })

const allPlayers = useAllPlayers()
const store = useAdminStore()

const sources = [
  { name: 'FootyScope', short: 'FS', color: '#2d9d78' },
  { name: 'AFL.com.au', short: 'AFL', color: '#e74c3c' },
  { name: 'ESPN', short: 'ESPN', color: '#f59e0b' },
  { name: 'Rookie Me', short: 'RMC', color: '#8b5cf6' },
  { name: 'Mongrel', short: 'TMP', color: '#ec4899' },
]

const disclaimer = computed(() => store.siteContent.value?.consensusDisclaimer)

const consensusData = computed(() => {
  const players = allPlayers.value ?? []
  const rows = store.consensusRows.value
  if (!rows.length) return []
  return rows.map(c => {
    const player = players.find((p: Player) => p.slug === c.slug)
    const values = Object.values(c.ranks).filter((v): v is number => v != null)
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 99
    return {
      slug: c.slug,
      name: player?.name ?? c.slug,
      position: player?.position ?? '',
      photoUrl: player?.photoUrl ?? null,
      ranks: c.ranks,
      avg,
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
    }
  }).sort((a, b) => a.avg - b.avg)
})
</script>
