const SITE_URL = 'https://footy-scope.com'
const SITE_NAME = 'FootyScope'
const DEFAULT_DESCRIPTION = 'AFL draft prospect scouting, rankings, and analytics platform.'
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`
const TWITTER_HANDLE = '@footyscope'

interface SocialMetaOptions {
  title: string
  description?: string
  image?: string | null
  url?: string
  type?: 'website' | 'article' | 'profile'
  article?: {
    publishedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
}

export function useSocialMeta(options: SocialMetaOptions | Ref<SocialMetaOptions | null>) {
  useHead({
    title: computed(() => {
      const opts = unref(options)
      return opts ? `${opts.title} — ${SITE_NAME}` : `${SITE_NAME} — AFL Draft Scouting & Analytics`
    }),
    meta: computed(() => {
      const opts = unref(options)
      if (!opts) return []

      const title = `${opts.title} — ${SITE_NAME}`
      const description = opts.description || DEFAULT_DESCRIPTION
      const image = opts.image || DEFAULT_IMAGE
      const url = opts.url ? `${SITE_URL}${opts.url}` : SITE_URL
      const type = opts.type || 'website'

      const tags = [
        { name: 'description', content: description },
        // Open Graph
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: type },
        { property: 'og:site_name', content: SITE_NAME },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: TWITTER_HANDLE },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ]

      if (opts.article) {
        if (opts.article.publishedTime) tags.push({ property: 'article:published_time', content: opts.article.publishedTime } as any)
        if (opts.article.author) tags.push({ property: 'article:author', content: opts.article.author } as any)
        if (opts.article.section) tags.push({ property: 'article:section', content: opts.article.section } as any)
        opts.article.tags?.forEach(tag => tags.push({ property: 'article:tag', content: tag } as any))
      }

      return tags
    }),
    link: computed(() => {
      const opts = unref(options)
      if (!opts?.url) return []
      return [{ rel: 'canonical', href: `${SITE_URL}${opts.url}` }]
    }),
  })
}
