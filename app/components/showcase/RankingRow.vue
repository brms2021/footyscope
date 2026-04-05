<template>
  <div class="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-teal/40 hover:bg-muted/30">
    <!-- Rank -->
    <span class="font-heading text-2xl font-extrabold text-muted-foreground w-8 text-center shrink-0">
      {{ rank }}
    </span>

    <!-- Photo -->
    <div class="h-10 w-10 shrink-0 rounded-full ring-2 ring-border overflow-hidden">
      <img :src="getPlayerImage(photoUrl, name, 80)" :alt="name" class="h-full w-full object-cover" />
    </div>

    <!-- Player info -->
    <div class="flex-1 min-w-0">
      <p class="font-heading text-sm font-bold text-foreground truncate">{{ name }}</p>
      <p class="text-xs text-muted-foreground">{{ position }} · {{ team }}</p>
    </div>

    <!-- Change indicator -->
    <div v-if="change !== 0" class="flex items-center gap-0.5 shrink-0">
      <IconTrendingUp v-if="change > 0" class="h-3.5 w-3.5 text-teal" />
      <IconTrendingDown v-else class="h-3.5 w-3.5 text-scope-1" />
      <span class="font-stats text-xs" :class="change > 0 ? 'text-teal' : 'text-scope-1'">
        {{ Math.abs(change) }}
      </span>
    </div>

    <!-- Rating -->
    <ScopeRating :rating="rating" size="sm" />
  </div>
</template>

<script setup lang="ts">
import { TrendingUp as IconTrendingUp, TrendingDown as IconTrendingDown } from 'lucide-vue-next'

defineProps<{
  rank: number
  name: string
  position: string
  team: string
  rating: number
  change: number
  photoUrl?: string | null
}>()
</script>
