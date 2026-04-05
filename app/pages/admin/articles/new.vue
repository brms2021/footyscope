<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-4xl">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold">New Article</h1>
      <NuxtLink to="/admin/articles" class="text-sm text-muted-foreground hover:text-primary transition-colors">← Back</NuxtLink>
    </div>

    <form @submit.prevent="save" class="space-y-6">
      <!-- Title -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Title</label>
        <input v-model="form.title" @input="autoSlug" type="text" required
          class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Article title" />
      </div>

      <!-- Slug -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Slug</label>
        <input v-model="form.slug" type="text" required
          class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground font-stats placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="article-url-slug" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Category -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Category</label>
          <select v-model="form.category"
            class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option v-for="cat in ARTICLE_CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Author -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Author</label>
          <input v-model="form.author" type="text"
            class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Author name" />
        </div>
      </div>

      <!-- Excerpt -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Excerpt</label>
        <textarea v-model="form.excerpt" rows="2"
          class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="Brief summary for article cards and SEO" />
      </div>

      <!-- Cover Image URL -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Cover Image URL <span class="text-muted-foreground">(optional)</span></label>
        <input v-model="form.coverImageUrl" type="url"
          class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="https://..." />
      </div>

      <!-- Player Tags -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Player Tags</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <span v-for="tag in form.playerTags" :key="tag"
            class="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
            {{ getPlayerName(tag) }}
            <button type="button" @click="removeTag(tag)" class="hover:text-destructive">×</button>
          </span>
        </div>
        <select @change="addTag($event)" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Add player tag...</option>
          <option v-for="p in availablePlayers" :key="p.slug" :value="p.slug">{{ p.name }}</option>
        </select>
      </div>

      <!-- Content (TipTap) -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground">Content</label>
        <ClientOnly>
          <TipTapEditor v-model="form.content" placeholder="Write your article..." />
          <template #fallback>
            <div class="h-80 rounded-lg border border-border bg-muted/50 animate-pulse" />
          </template>
        </ClientOnly>
      </div>

      <!-- Published toggle -->
      <div class="flex items-center gap-3">
        <button type="button" @click="form.published = !form.published"
          :class="['relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer', form.published ? 'bg-primary' : 'bg-muted']">
          <span :class="['pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform', form.published ? 'translate-x-5' : 'translate-x-0']" />
        </button>
        <span class="text-sm font-medium text-foreground">{{ form.published ? 'Published' : 'Draft' }}</span>
      </div>

      <!-- Save -->
      <div class="flex gap-3">
        <button type="submit" class="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors">
          Save Article
        </button>
        <NuxtLink to="/admin/articles" class="rounded-lg border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
          Cancel
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ARTICLE_CATEGORIES } from '~/types'
import type { Article } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()
const router = useRouter()

const form = reactive({
  title: '',
  slug: '',
  category: ARTICLE_CATEGORIES[0],
  author: 'FootyScope',
  excerpt: '',
  coverImageUrl: '',
  content: '',
  playerTags: [] as string[],
  published: false,
})

function autoSlug() {
  form.slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const availablePlayers = computed(() =>
  store.players.value.filter(p => !form.playerTags.includes(p.slug))
)

function getPlayerName(slug: string) {
  return store.players.value.find(p => p.slug === slug)?.name ?? slug
}

function addTag(event: Event) {
  const val = (event.target as HTMLSelectElement).value
  if (val && !form.playerTags.includes(val)) {
    form.playerTags.push(val)
  }
  ;(event.target as HTMLSelectElement).value = ''
}

function removeTag(slug: string) {
  form.playerTags = form.playerTags.filter(t => t !== slug)
}

function save() {
  const article: Article = {
    id: crypto.randomUUID(),
    slug: form.slug,
    title: form.title,
    excerpt: form.excerpt,
    content: form.content,
    category: form.category,
    coverImageUrl: form.coverImageUrl || null,
    author: form.author,
    playerTags: [...form.playerTags],
    published: form.published,
    publishedAt: form.published ? new Date().toISOString() : '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  store.saveArticle(article)
  router.push('/admin/articles')
}
</script>
