<template>
  <div class="flex items-center gap-2">
    <span class="text-xs font-medium text-muted-foreground mr-1">Share</span>
    <a
      :href="twitterUrl"
      target="_blank"
      rel="noopener"
      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
      aria-label="Share on X"
    >
      <IconTwitter class="h-3.5 w-3.5" />
    </a>
    <a
      :href="facebookUrl"
      target="_blank"
      rel="noopener"
      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
      aria-label="Share on Facebook"
    >
      <IconFacebook class="h-3.5 w-3.5" />
    </a>
    <button
      @click="copyLink"
      class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
      :aria-label="copied ? 'Link copied!' : 'Copy link'"
    >
      <Check v-if="copied" class="h-3.5 w-3.5 text-teal" />
      <Link2 v-else class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Check, Link2 } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  url: string
}>()

const SITE_URL = 'https://footy-scope.com'
const fullUrl = computed(() => `${SITE_URL}${props.url}`)

const twitterUrl = computed(() =>
  `https://x.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(fullUrl.value)}&via=footyscope`
)

const facebookUrl = computed(() =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl.value)}`
)

const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback for older browsers
    const input = document.createElement('input')
    input.value = fullUrl.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>
