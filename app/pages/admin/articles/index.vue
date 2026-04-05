<template>
  <div class="p-6 lg:p-8 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold">Articles</h1>
      <NuxtLink to="/admin/articles/new" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors">
        <Plus class="h-4 w-4" /> New Article
      </NuxtLink>
    </div>

    <div class="rounded-xl border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border bg-muted/30">
            <th class="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Category</th>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Date</th>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th class="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in sortedArticles" :key="article.id" class="border-b border-border/50 hover:bg-muted/20">
            <td class="px-4 py-3 font-medium">{{ article.title }}</td>
            <td class="px-4 py-3 text-muted-foreground hidden sm:table-cell">{{ article.category }}</td>
            <td class="px-4 py-3 text-muted-foreground hidden md:table-cell font-stats text-xs">{{ formatDate(article.publishedAt) }}</td>
            <td class="px-4 py-3">
              <span :class="['inline-flex px-2 py-0.5 rounded-full text-xs font-medium', article.published ? 'bg-teal/20 text-teal' : 'bg-muted text-muted-foreground']">
                {{ article.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-3">
              <NuxtLink :to="`/admin/articles/${article.id}`" class="text-primary hover:text-teal-light text-sm">Edit</NuxtLink>
              <button @click="handleDelete(article.id)" class="text-destructive hover:text-red-400 text-sm">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()

const sortedArticles = computed(() =>
  [...store.articles.value].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this article?')) {
    store.deleteArticle(id)
  }
}
</script>
