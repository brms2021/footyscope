<template>
  <div class="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:scale-[1.02] hover:border-teal/40 hover:shadow-lg hover:shadow-teal/5">
    <div class="flex items-start gap-4">
      <!-- Photo -->
      <div class="h-16 w-16 shrink-0 rounded-full ring-2 ring-teal/30 overflow-hidden">
        <img :src="getPlayerImage(photoUrl, name, 128)" :alt="name" class="h-full w-full object-cover" />
      </div>
      <!-- Info -->
      <div class="flex-1 min-w-0">
        <h3 class="font-heading text-lg font-bold text-foreground truncate">{{ name }}</h3>
        <p class="text-sm text-muted-foreground">{{ position }} · {{ team }}</p>
      </div>
      <!-- Rating -->
      <ScopeRating :rating="rating" size="sm" />
    </div>

    <!-- Stats -->
    <div class="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3">
      <div class="text-center">
        <p class="font-stats text-sm font-semibold text-foreground">{{ height }}</p>
        <p class="text-xs text-muted-foreground">Height</p>
      </div>
      <div class="text-center">
        <p class="font-stats text-sm font-semibold text-foreground">{{ weight }}</p>
        <p class="text-xs text-muted-foreground">Weight</p>
      </div>
      <div class="text-center">
        <p class="font-stats text-sm font-semibold text-foreground">{{ kickEff }}%</p>
        <p class="text-xs text-muted-foreground">Kick Eff</p>
      </div>
    </div>

    <div class="mt-4">
      <NuxtLink
        :to="`/players/${slug}`"
        class="text-sm font-medium text-primary hover:text-teal-light transition-colors"
      >
        View Profile →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  position: string
  team: string
  rating: number
  height: string
  weight: string
  kickEff: number
  slug: string
  photoUrl?: string | null
}>()
</script>
