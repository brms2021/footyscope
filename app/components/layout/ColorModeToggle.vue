<template>
  <button
    @click="toggle"
    class="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
    aria-label="Toggle color mode"
  >
    <IconSun v-if="colorMode.value === 'dark'" class="h-5 w-5" />
    <IconMoon v-else class="h-5 w-5" />
  </button>
</template>

<script setup lang="ts">
import { Sun as IconSun, Moon as IconMoon } from 'lucide-vue-next'

const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
