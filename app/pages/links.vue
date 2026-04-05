<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-md px-4 py-16 sm:px-6">
      <!-- Profile -->
      <div class="flex flex-col items-center text-center mb-10">
        <div class="h-24 w-24 rounded-full ring-4 ring-teal/30 overflow-hidden mb-4 bg-navy-dark p-3">
          <img src="/logo.svg" alt="FootyScope" class="h-full w-full" />
        </div>
        <h1 class="font-heading text-2xl font-extrabold text-foreground">FootyScope</h1>
        <p class="text-sm text-muted-foreground mt-1">AFL Draft Scouting & Analytics</p>
        <p class="text-sm text-muted-foreground">See the draft differently.</p>
      </div>

      <!-- Links -->
      <div class="space-y-3">
        <a
          v-for="link in links"
          :key="link.url"
          :href="link.url"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener' : undefined"
          class="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-teal/40 hover:bg-muted/30 hover:scale-[1.02] group"
        >
          <component :is="link.icon" class="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <div class="flex-1">
            <p class="text-sm font-semibold text-foreground">{{ link.label }}</p>
            <p v-if="link.description" class="text-xs text-muted-foreground">{{ link.description }}</p>
          </div>
          <ExternalLink v-if="link.external" class="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      <!-- Social icons row -->
      <div class="flex items-center justify-center gap-4 mt-10">
        <a
          v-for="social in socials"
          :key="social.url"
          :href="social.url"
          target="_blank"
          rel="noopener"
          :aria-label="social.label"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-teal/40 transition-colors"
        >
          <component :is="social.icon" class="h-5 w-5" />
        </a>
      </div>

      <p class="text-center text-xs text-muted-foreground mt-8">&copy; {{ new Date().getFullYear() }} FootyScope</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3, Users, FileText, GitCompareArrows, Mail, ExternalLink, Instagram } from 'lucide-vue-next'

useSocialMeta({
  title: 'Links',
  description: 'All FootyScope links in one place. Rankings, articles, scouting reports, and social media.',
  url: '/links',
})

const links = [
  {
    label: '2026 AFL Draft Rankings',
    description: 'Sortable prospect rankings with Scope Ratings',
    url: '/rankings',
    icon: BarChart3,
    external: false,
  },
  {
    label: 'Player Profiles',
    description: 'Detailed scouting reports and radar charts',
    url: '/players',
    icon: Users,
    external: false,
  },
  {
    label: 'Articles & Analysis',
    description: 'Draft breakdowns, match reports, and opinion pieces',
    url: '/articles',
    icon: FileText,
    external: false,
  },
  {
    label: 'Prospect Comparison Tool',
    description: 'Side-by-side player comparison with attribute breakdown',
    url: '/tools/compare',
    icon: GitCompareArrows,
    external: false,
  },
  {
    label: 'Junior Scouting Reports',
    description: 'Expression of interest for personalised reports',
    url: '/about#contact',
    icon: Mail,
    external: false,
  },
]

const socials = [
  { label: 'Instagram', url: 'https://instagram.com/footyscope', icon: Instagram },
  { label: 'X / Twitter', url: 'https://x.com/footyscope', icon: resolveComponent('IconTwitter') },
  { label: 'TikTok', url: 'https://tiktok.com/@footyscope', icon: resolveComponent('IconTikTok') },
  { label: 'Facebook', url: 'https://facebook.com/footyscope', icon: resolveComponent('IconFacebook') },
]
</script>
