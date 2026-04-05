<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="item in features"
      :key="item.label"
      class="group relative rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-teal/40 hover:shadow-lg hover:shadow-teal/5"
    >
      <!-- Glow on hover -->
      <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div class="relative">
        <component :is="item.icon" class="mx-auto h-8 w-8 text-primary mb-3" />
        <p class="font-stats text-2xl font-bold text-foreground">{{ item.value }}</p>
        <p class="mt-1 text-sm text-muted-foreground">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, Target, RefreshCw, Unlock } from 'lucide-vue-next'

const features = [
  { icon: Users, value: '150+', label: 'Prospects' },
  { icon: Target, value: '9', label: 'Rating Attributes' },
  { icon: RefreshCw, value: 'Weekly', label: 'Updates' },
  { icon: Unlock, value: 'Free', label: 'Access' },
]
</script>
