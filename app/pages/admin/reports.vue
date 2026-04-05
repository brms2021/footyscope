<template>
  <div class="p-6 lg:p-8 space-y-6">
    <h1 class="text-2xl font-extrabold">Community Reports</h1>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-border">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
          activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
        ]"
      >
        {{ tab.label }}
        <span class="ml-1.5 text-xs text-muted-foreground">({{ tab.count }})</span>
      </button>
    </div>

    <!-- Reports list -->
    <div v-if="currentReports.length === 0" class="text-center py-12 text-muted-foreground">
      No {{ activeTab }} reports.
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="report in currentReports"
        :key="report.id"
        class="rounded-xl border border-border bg-card p-5 space-y-3"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-heading text-sm font-bold">{{ report.authorName }}</p>
              <span class="text-xs text-muted-foreground">({{ report.authorEmail }})</span>
            </div>
            <NuxtLink :to="`/players/${report.playerSlug}`" class="text-xs text-primary hover:text-teal-light">
              {{ report.playerSlug }}
            </NuxtLink>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <StarRating :model-value="report.rating" readonly size="sm" />
            <span class="text-xs text-muted-foreground font-stats">{{ formatDate(report.createdAt) }}</span>
          </div>
        </div>

        <p class="text-sm text-foreground whitespace-pre-line">{{ report.content }}</p>

        <div class="flex items-center gap-3 pt-1">
          <span class="text-xs text-muted-foreground">
            {{ report.likes.length }} likes · {{ report.dislikes.length }} dislikes
          </span>

          <div v-if="activeTab === 'pending'" class="flex items-center gap-2 ml-auto">
            <button @click="handleApprove(report.id)" class="rounded-lg bg-teal px-4 py-1.5 text-xs font-semibold text-navy-dark hover:bg-teal-light transition-colors">
              Approve
            </button>
            <button @click="handleReject(report.id)" class="rounded-lg border border-destructive px-4 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors">
              Reject
            </button>
          </div>

          <div v-else-if="activeTab === 'approved'" class="ml-auto">
            <button @click="handleReject(report.id)" class="text-xs text-destructive hover:text-red-400 transition-colors">Remove</button>
          </div>

          <div v-else-if="activeTab === 'rejected'" class="ml-auto">
            <button @click="handleApprove(report.id)" class="text-xs text-primary hover:text-teal-light transition-colors">Restore</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ReportStatus } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { pending: pendingReports, approved, rejected } = usePendingReports()

const activeTab = ref<ReportStatus>('pending')

const tabs = computed(() => [
  { key: 'pending' as const, label: 'Pending', count: pendingReports.value.length },
  { key: 'approved' as const, label: 'Approved', count: approved.value.length },
  { key: 'rejected' as const, label: 'Rejected', count: rejected.value.length },
])

const currentReports = computed(() => {
  if (activeTab.value === 'pending') return pendingReports.value
  if (activeTab.value === 'approved') return approved.value
  return rejected.value
})

async function handleApprove(id: string) {
  await updateReportStatus(id, 'approved')
}

async function handleReject(id: string) {
  await updateReportStatus(id, 'rejected')
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
