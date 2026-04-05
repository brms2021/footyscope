<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold">Articles & Reports</h1>
      <p class="mt-2 text-muted-foreground">Draft analysis, scouting reports, and AFL draft coverage</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-8">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Search articles..."
        class="rounded-lg border border-input bg-background px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select v-model="filters.category" class="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">All Categories</option>
        <option v-for="cat in ARTICLE_CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Articles grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink v-for="article in data" :key="article.id" :to="`/articles/${article.slug}`">
        <ArticleCard
          :title="article.title"
          :excerpt="article.excerpt"
          :category="article.category"
          :author="article.author"
          :date="formatDate(article.publishedAt)"
          :cover-image-url="article.coverImageUrl"
        />
      </NuxtLink>
    </div>

    <div v-if="data.length === 0" class="text-center py-12 text-muted-foreground">
      No articles match your filters.
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ARTICLE_CATEGORIES } from '~/types'
import type { ArticleFilters } from '~/types'

useHead({ title: 'Articles & Reports — FootyScope' })

const filters = reactive<ArticleFilters>({
  search: '',
  category: undefined,
})

const { data } = useArticles(filters)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
