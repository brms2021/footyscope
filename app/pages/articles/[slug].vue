<template>
  <div v-if="!data" class="mx-auto max-w-7xl px-4 py-20 text-center">
    <h1 class="text-2xl font-bold text-muted-foreground">Article not found</h1>
    <NuxtLink to="/articles" class="mt-4 inline-block text-primary hover:text-teal-light">← Back to Articles</NuxtLink>
  </div>

  <article v-else class="mx-auto max-w-3xl px-4 py-10 sm:px-6">
    <!-- Header -->
    <div class="mb-8">
      <span class="inline-flex items-center rounded-md bg-teal/20 px-2.5 py-0.5 text-xs font-semibold text-teal mb-3">
        {{ data.category }}
      </span>
      <h1 class="text-3xl sm:text-4xl font-extrabold leading-tight">{{ data.title }}</h1>
      <div class="mt-3 flex items-center justify-between">
        <div class="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{{ data.author }}</span>
          <span>·</span>
          <span>{{ formatDate(data.publishedAt) }}</span>
        </div>
        <ShareButtons :title="data.title" :url="`/articles/${slug}`" />
      </div>
      <p v-if="data.excerpt" class="mt-4 text-lg text-muted-foreground leading-relaxed">{{ data.excerpt }}</p>
    </div>

    <!-- Cover image -->
    <div v-if="data.coverImageUrl" class="mb-8 rounded-xl overflow-hidden">
      <img :src="data.coverImageUrl" :alt="data.title" class="w-full" />
    </div>

    <!-- Content -->
    <div class="mb-12">
      <ClientOnly>
        <TipTapRenderer :content="data.content" />
        <template #fallback><div class="h-60 bg-muted/50 rounded animate-pulse" /></template>
      </ClientOnly>
    </div>

    <!-- Player tags -->
    <div v-if="data.playerTags.length" class="mb-12">
      <h3 class="text-sm font-medium text-muted-foreground mb-3">Players mentioned</h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="tag in data.playerTags"
          :key="tag"
          :to="`/players/${tag}`"
          class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          {{ getPlayerName(tag) }}
        </NuxtLink>
      </div>
    </div>

    <!-- Back link -->
    <NuxtLink to="/articles" class="text-sm text-primary hover:text-teal-light transition-colors">← Back to Articles</NuxtLink>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data } = useArticle(slug)
const allPlayers = useAllPlayers()

useSocialMeta(computed(() => data.value ? {
  title: data.value.title,
  description: data.value.excerpt || undefined,
  image: data.value.coverImageUrl,
  url: `/articles/${slug}`,
  type: 'article' as const,
  article: {
    publishedTime: data.value.publishedAt,
    author: data.value.author,
    section: data.value.category,
  },
} : null))

function getPlayerName(slug: string) {
  return allPlayers.find(p => p.slug === slug)?.name ?? slug
}

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
