<template>
  <div>
    <!-- Authenticated: clean inline form -->
    <div v-if="user">
      <div v-if="submitted" class="py-3">
        <p class="text-sm font-medium text-teal">Your report has been submitted for review.</p>
        <button @click="submitted = false" class="mt-1 text-xs text-muted-foreground hover:text-primary">Submit another</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-2">
        <textarea
          v-model="content"
          rows="3"
          required
          maxlength="2000"
          placeholder="Share your analysis — strengths, weaknesses, projection..."
          class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <StarRating v-model="rating" size="sm" />
            <span class="text-xs text-muted-foreground">{{ content.length }}/2000</span>
          </div>
          <button
            type="submit"
            :disabled="pending || !content.trim() || !rating"
            class="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-teal transition-colors disabled:opacity-50"
          >
            {{ pending ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
        <div v-if="error" class="text-xs text-destructive">{{ error }}</div>
      </form>
    </div>

    <!-- Not authenticated -->
    <AuthPrompt v-else message="Sign in to submit your scouting report" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  playerSlug: string
}>()

const { user } = useAuth()

const content = ref('')
const rating = ref(0)
const pending = ref(false)
const submitted = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!content.value.trim() || !rating.value) return
  pending.value = true
  error.value = null
  try {
    await submitReport(props.playerSlug, content.value.trim(), rating.value)
    submitted.value = true
    content.value = ''
    rating.value = 0
  } catch (e: any) {
    error.value = e.message ?? 'Failed to submit report'
  } finally {
    pending.value = false
  }
}
</script>
