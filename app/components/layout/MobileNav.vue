<template>
  <div>
    <button
      @click="open = true"
      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
      aria-label="Open menu"
    >
      <IconMenu class="h-5 w-5" />
    </button>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="open" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" @click="open = false" />
      </Transition>
      <Transition name="slide">
        <div
          v-if="open"
          class="fixed inset-y-0 right-0 z-50 w-72 bg-background border-l border-border shadow-xl"
        >
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span class="font-heading text-lg font-bold text-primary">FOOTYSCOPE</span>
            <button
              @click="open = false"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary transition-colors"
            >
              <IconX class="h-5 w-5" />
            </button>
          </div>
          <nav class="flex flex-col gap-1 p-4">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              @click="open = false"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Menu as IconMenu, X as IconX } from 'lucide-vue-next'

defineProps<{
  links: Array<{ label: string; to: string }>
}>()

const open = ref(false)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
