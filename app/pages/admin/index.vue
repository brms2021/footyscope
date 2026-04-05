<template>
  <div class="p-6 lg:p-8 space-y-8">
    <h1 class="text-2xl font-extrabold">Dashboard</h1>

    <!-- Stats cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">{{ stat.label }}</p>
        <p class="mt-1 font-stats text-2xl font-bold text-foreground">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="flex flex-wrap gap-3">
      <NuxtLink to="/admin/articles/new" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors">
        <Plus class="h-4 w-4" /> New Article
      </NuxtLink>
      <NuxtLink to="/admin/players/new" class="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent transition-colors">
        <Plus class="h-4 w-4" /> Add Player
      </NuxtLink>
    </div>

    <!-- Recent articles -->
    <div>
      <h2 class="text-lg font-bold mb-3">Recent Articles</h2>
      <div class="rounded-xl border border-border overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border bg-muted/30">
              <th class="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
              <th class="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Category</th>
              <th class="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Status</th>
              <th class="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in recentArticles" :key="article.id" class="border-b border-border/50 hover:bg-muted/20">
              <td class="px-4 py-3 font-medium">{{ article.title }}</td>
              <td class="px-4 py-3 text-muted-foreground hidden sm:table-cell">{{ article.category }}</td>
              <td class="px-4 py-3 hidden md:table-cell">
                <span :class="article.published ? 'text-teal' : 'text-muted-foreground'">{{ article.published ? 'Published' : 'Draft' }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <NuxtLink :to="`/admin/articles/${article.id}`" class="text-primary hover:text-teal-light text-sm">Edit</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()

const stats = computed(() => [
  { label: 'Total Players', value: store.players.value.length },
  { label: 'Total Articles', value: store.articles.value.length },
  { label: 'Published Articles', value: store.articles.value.filter(a => a.published).length },
  { label: 'EOI Submissions', value: store.eoiSubmissions.value.length },
])

const recentArticles = computed(() =>
  [...store.articles.value]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5)
)
</script>
