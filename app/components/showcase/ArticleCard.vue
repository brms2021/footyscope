<template>
  <div class="group rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-teal/40 hover:shadow-lg hover:shadow-teal/5">
    <!-- Image area -->
    <div class="relative h-44 overflow-hidden">
      <img
        v-if="coverImageUrl"
        :src="coverImageUrl"
        :alt="title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div v-else class="h-full w-full bg-gradient-to-br from-navy-light to-teal/20" />
      <div class="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
      <span class="absolute top-3 left-3 inline-flex items-center rounded-md bg-teal/90 px-2 py-1 text-xs font-semibold text-navy-dark">
        {{ category }}
      </span>
    </div>
    <!-- Content -->
    <div class="p-5">
      <h3 class="font-heading text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
        {{ title }}
      </h3>
      <p class="mt-2 text-sm text-muted-foreground line-clamp-2">
        {{ excerpt }}
      </p>
      <div class="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{{ author }}</span>
        <span>{{ date }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  coverImageUrl?: string | null
}>()
</script>
