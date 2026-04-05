<template>
  <div class="p-6 lg:p-8 space-y-6">
    <h1 class="text-2xl font-extrabold">EOI Submissions</h1>
    <p class="text-sm text-muted-foreground">Expressions of interest for junior scouting reports, submitted via the About page.</p>

    <div v-if="submissions.length === 0" class="text-center py-12 text-muted-foreground">
      No submissions yet.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="sub in submissions"
        :key="sub.id"
        class="rounded-xl border bg-card p-5 space-y-3"
        :class="sub.read ? 'border-border' : 'border-teal/40'"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-heading text-sm font-bold">{{ sub.name }}</p>
              <span v-if="!sub.read" class="inline-flex h-5 items-center rounded-full bg-teal/20 px-2 text-[10px] font-semibold text-teal">New</span>
            </div>
            <p class="text-xs text-muted-foreground">{{ sub.email }}<span v-if="sub.phone"> · {{ sub.phone }}</span></p>
          </div>
          <span class="text-xs text-muted-foreground font-stats shrink-0">{{ formatDate(sub.createdAt) }}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
          <div><span class="text-muted-foreground">Player:</span> <span class="font-medium">{{ sub.playerName }}</span></div>
          <div><span class="text-muted-foreground">Age Group:</span> <span class="font-medium">{{ sub.ageGroup }}</span></div>
          <div><span class="text-muted-foreground">Club:</span> <span class="font-medium">{{ sub.club }}</span></div>
        </div>

        <p v-if="sub.message" class="text-sm text-foreground">{{ sub.message }}</p>

        <button
          v-if="!sub.read"
          @click="markRead(sub.id)"
          class="text-xs text-primary hover:text-teal-light transition-colors"
        >
          Mark as read
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()
const submissions = computed(() => store.getSubmissions())

function markRead(id: string) {
  store.markSubmissionRead(id)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
