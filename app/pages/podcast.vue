<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-extrabold">FootyScope Podcast</h1>
        <p class="mt-2 text-muted-foreground">Weekly AFL draft analysis, prospect breakdowns, and hot takes</p>
      </div>

      <!-- Podcast platforms -->
      <div class="flex flex-wrap justify-center gap-3 mb-10">
        <a v-for="platform in platforms" :key="platform.name" :href="platform.url" target="_blank" rel="noopener"
          class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:border-teal/40 hover:shadow-lg hover:shadow-teal/5 transition-all">
          <component :is="platform.icon" class="h-4 w-4" />
          {{ platform.name }}
        </a>
      </div>

      <!-- Latest episodes -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold">Latest Episodes</h2>

        <!-- Spotify embed placeholder -->
        <div class="rounded-xl border border-border bg-card p-6 text-center space-y-4">
          <Mic class="h-12 w-12 text-muted-foreground mx-auto" />
          <p class="text-lg font-bold text-foreground">Coming Soon</p>
          <p class="text-sm text-muted-foreground max-w-md mx-auto">
            The FootyScope Podcast is in the works. We'll be covering the 2026 draft class with weekly episodes featuring prospect analysis, industry interviews, and draft predictions.
          </p>
          <p class="text-sm text-muted-foreground">Subscribe to our newsletter below to get notified when we launch.</p>
        </div>

        <!-- When episodes are live, they'll embed like this: -->
        <!--
        <div v-for="episode in episodes" :key="episode.id" class="rounded-xl border border-border overflow-hidden">
          <iframe
            :src="`https://open.spotify.com/embed/episode/${episode.spotifyId}?theme=0`"
            width="100%"
            height="152"
            frameborder="0"
            allowfullscreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
        -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mic, Headphones, Radio, Rss } from 'lucide-vue-next'

useHead({ title: 'Podcast — FootyScope' })

const platforms = [
  { name: 'Spotify', url: '#', icon: Headphones },
  { name: 'Apple Podcasts', url: '#', icon: Radio },
  { name: 'RSS Feed', url: '#', icon: Rss },
]
</script>
