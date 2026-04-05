<template>
  <div class="border-b border-border/50 py-3 space-y-2">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-full overflow-hidden ring-1 ring-border">
          <img :src="getPlayerImage(null, report.authorName, 64)" :alt="report.authorName" class="h-full w-full object-cover" />
        </div>
        <div>
          <p class="text-sm font-medium text-foreground">{{ report.authorName }}</p>
          <p class="text-xs text-muted-foreground">{{ formatDate(report.createdAt) }}</p>
        </div>
      </div>
      <StarRating :model-value="report.rating" readonly size="sm" />
    </div>

    <!-- Content -->
    <p class="text-sm text-foreground leading-relaxed whitespace-pre-line">{{ report.content }}</p>

    <!-- Actions -->
    <div class="flex items-center gap-4 pt-1">
      <button
        @click="handleLike"
        :disabled="!canVote"
        :class="[
          'inline-flex items-center gap-1.5 text-xs transition-colors',
          hasLiked ? 'text-teal font-medium' : 'text-muted-foreground hover:text-teal',
          !canVote && !hasLiked && 'opacity-50',
        ]"
        :title="!user ? 'Sign in to like' : undefined"
      >
        <ThumbsUp class="h-3.5 w-3.5" :class="{ 'fill-current': hasLiked }" />
        {{ report.likes.length }}
      </button>
      <button
        @click="handleDislike"
        :disabled="!canVote"
        :class="[
          'inline-flex items-center gap-1.5 text-xs transition-colors',
          hasDisliked ? 'text-scope-1 font-medium' : 'text-muted-foreground hover:text-scope-1',
          !canVote && !hasDisliked && 'opacity-50',
        ]"
        :title="!user ? 'Sign in to dislike' : undefined"
      >
        <ThumbsDown class="h-3.5 w-3.5" :class="{ 'fill-current': hasDisliked }" />
        {{ report.dislikes.length }}
      </button>
      <span v-if="!user" class="text-xs text-muted-foreground">
        <NuxtLink to="/admin/login" class="text-primary hover:text-teal-light">Sign in</NuxtLink> to vote
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ThumbsUp, ThumbsDown } from 'lucide-vue-next'
import type { CommunityReport } from '~/types'

const props = defineProps<{
  report: CommunityReport
}>()

const { user } = useAuth()

const canVote = computed(() => !!user.value)
const hasLiked = computed(() => user.value ? props.report.likes.includes(user.value.uid) : false)
const hasDisliked = computed(() => user.value ? props.report.dislikes.includes(user.value.uid) : false)

async function handleLike() {
  if (!user.value) return
  await toggleLike(props.report.id)
}

async function handleDislike() {
  if (!user.value) return
  await toggleDislike(props.report.id)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
