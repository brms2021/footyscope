import { collection, getDocs } from 'firebase/firestore'
import type { Article, ArticleFilters } from '~/types'

function applyFilters(articles: Article[], filters?: ArticleFilters): Article[] {
  if (!filters) return articles
  let result = [...articles]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q))
  }
  if (filters.category) {
    result = result.filter(a => a.category === filters.category)
  }
  if (filters.playerTag) {
    result = result.filter(a => a.playerTags.includes(filters.playerTag!))
  }
  return result
}

const _articles = ref<Article[]>([])
const _loaded = ref(false)

async function loadArticles() {
  if (_loaded.value) return
  const db = useFirestore()
  const snap = await getDocs(collection(db, 'articles'))
  _articles.value = snap.docs
    .map(d => ({ ...d.data(), id: d.id } as Article))
    .filter(a => a.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  _loaded.value = true
}

export function useArticles(filters?: Ref<ArticleFilters> | ArticleFilters) {
  if (import.meta.client && !_loaded.value) loadArticles()

  const data = computed(() => {
    const f = isRef(filters) ? filters.value : filters
    return applyFilters(_articles.value, f)
  })
  return { data, pending: computed(() => !_loaded.value), error: ref(null) }
}

export function useArticle(slug: string | Ref<string>) {
  const data = ref<Article | null>(null)
  const pending = ref(true)

  if (import.meta.client) {
    loadArticles().then(() => {
      const s = isRef(slug) ? slug.value : slug
      data.value = _articles.value.find(a => a.slug === s) ?? null
      pending.value = false
    })
  }

  return { data, pending, error: ref(null) }
}

export function useLatestArticles(limit: number = 3) {
  if (import.meta.client && !_loaded.value) loadArticles()

  const data = computed(() => _articles.value.slice(0, limit))
  return { data, pending: computed(() => !_loaded.value), error: ref(null) }
}
