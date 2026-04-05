<template>
  <div v-if="!data" class="mx-auto max-w-7xl px-4 py-20 text-center">
    <h1 class="text-2xl font-bold text-muted-foreground">Player not found</h1>
    <NuxtLink to="/rankings" class="mt-4 inline-block text-primary hover:text-teal-light">← Back to Rankings</NuxtLink>
  </div>

  <div v-else>
    <!-- Hero header -->
    <section class="relative bg-navy-dark py-12 overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-teal)_0%,_transparent_60%)] opacity-[0.06]" />
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%2780%27 viewBox=%270 0 80 80%27 fill=%27none%27%3E%3Ccircle cx=%2740%27 cy=%2740%27 r=%2718%27 stroke=%27%23ffffff%27 stroke-width=%271%27/%3E%3Ccircle cx=%2740%27 cy=%2740%27 r=%2710%27 stroke=%27%23ffffff%27 stroke-width=%270.5%27/%3E%3Cline x1=%2740%27 y1=%2716%27 x2=%2740%27 y2=%2726%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2740%27 y1=%2754%27 x2=%2740%27 y2=%2764%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2716%27 y1=%2740%27 x2=%2726%27 y2=%2740%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2754%27 y1=%2740%27 x2=%2764%27 y2=%2740%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3C/svg%3E'); background-size: 80px 80px;" />
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1, transition: { delay: 100 } }" class="h-24 w-24 shrink-0 rounded-full ring-4 ring-teal/30 overflow-hidden">
            <img :src="getPlayerImage(data.photoUrl, data.name, 192)" :alt="data.name" class="h-full w-full object-cover" />
          </div>
          <div v-motion :initial="{ x: -20, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 200 } }" class="flex-1">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-cream">{{ data.name }}</h1>
            <p class="mt-1 text-cream-dark">{{ data.position }} · {{ data.team }} · {{ data.state }}</p>
            <div class="mt-3 flex flex-wrap gap-4 text-sm text-cream-dark">
              <span class="font-stats">{{ data.height }}cm</span>
              <span class="font-stats">{{ data.weight }}kg</span>
              <span>DOB: {{ formatDate(data.dateOfBirth) }}</span>
              <span>Draft: {{ data.draftYear }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-3" v-motion :initial="{ scale: 0.5, opacity: 0 }" :enter="{ scale: 1, opacity: 1, transition: { delay: 400, type: 'spring', stiffness: 200 } }">
            <ScopeRating :rating="data.rating" size="lg" />
            <ShareButtons :title="`${data.name} — AFL Draft Profile`" :url="`/players/${slug}`" />
          </div>
        </div>
      </div>
    </section>

    <div class="relative min-h-screen">
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2780%27 height=%2780%27 viewBox=%270 0 80 80%27 fill=%27none%27%3E%3Ccircle cx=%2740%27 cy=%2740%27 r=%2718%27 stroke=%27%23ffffff%27 stroke-width=%271%27/%3E%3Ccircle cx=%2740%27 cy=%2740%27 r=%2710%27 stroke=%27%23ffffff%27 stroke-width=%270.5%27/%3E%3Cline x1=%2740%27 y1=%2716%27 x2=%2740%27 y2=%2726%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2740%27 y1=%2754%27 x2=%2740%27 y2=%2764%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2716%27 y1=%2740%27 x2=%2726%27 y2=%2740%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3Cline x1=%2754%27 y1=%2740%27 x2=%2764%27 y2=%2740%27 stroke=%27%23ffffff%27 stroke-width=%271%27 stroke-linecap=%27round%27/%3E%3C/svg%3E'); background-size: 80px 80px;" />
      <div class="absolute top-32 right-[5%] w-72 h-72 rounded-full bg-teal/3 blur-3xl" />

      <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        <!-- Radar Chart -->
        <section v-motion :initial="{ y: 30, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 600 } }">
          <h2 class="text-xl font-bold mb-4">Player Attributes</h2>
          <div class="max-w-lg mx-auto">
            <ClientOnly>
              <RadarChart :attributes="getAttributesArray(data.attributes)" :player-name="data.name" />
              <template #fallback><div class="h-80 bg-muted/50 rounded-xl animate-pulse" /></template>
            </ClientOnly>
          </div>
        </section>

        <!-- Bio -->
        <section v-if="data.bio" v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }">
          <h2 class="text-xl font-bold mb-4">Overview</h2>
          <p class="text-foreground leading-relaxed">{{ data.bio }}</p>
        </section>

        <!-- Strengths / Weaknesses -->
        <section v-if="data.strengths.length || data.weaknesses.length" v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-if="data.strengths.length">
            <h3 class="text-lg font-bold mb-3 text-teal">Strengths</h3>
            <ul class="space-y-2">
              <li v-for="s in data.strengths" :key="s" class="flex items-start gap-2 text-sm">
                <Check class="h-4 w-4 text-teal shrink-0 mt-0.5" />
                <span>{{ s }}</span>
              </li>
            </ul>
          </div>
          <div v-if="data.weaknesses.length">
            <h3 class="text-lg font-bold mb-3 text-scope-2">Areas for Development</h3>
            <ul class="space-y-2">
              <li v-for="w in data.weaknesses" :key="w" class="flex items-start gap-2 text-sm">
                <AlertTriangle class="h-4 w-4 text-scope-2 shrink-0 mt-0.5" />
                <span>{{ w }}</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Scouting Report -->
        <section v-if="data.scoutingReport" v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }">
          <h2 class="text-xl font-bold mb-4">Scouting Report</h2>
          <div class="rounded-xl border border-border bg-card p-6">
            <ClientOnly>
              <TipTapRenderer :content="data.scoutingReport" />
              <template #fallback><div class="h-40 bg-muted/50 rounded animate-pulse" /></template>
            </ClientOnly>
          </div>
        </section>

        <!-- Game Stats -->
        <section v-if="data.gameStats" v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }">
          <h2 class="text-xl font-bold mb-4">Game Stats <span class="text-sm font-normal text-muted-foreground">(avg per game)</span></h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div v-for="(stat, i) in gameStatsList" :key="stat.label" v-motion :initial="{ scale: 0.9, opacity: 0 }" :visibleOnce="{ scale: 1, opacity: 1, transition: { delay: i * 60 } }" class="rounded-lg border border-border bg-card p-4 text-center hover:border-teal/40 hover:shadow-lg hover:shadow-teal/5 transition-all">
              <p class="font-stats text-lg font-bold text-foreground">{{ stat.value }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </section>

        <!-- Combine Stats -->
        <section v-if="data.combineStats" v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }">
          <h2 class="text-xl font-bold mb-4">Combine Stats</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div v-for="(stat, i) in combineStatsList" :key="stat.label" v-motion :initial="{ scale: 0.9, opacity: 0 }" :visibleOnce="{ scale: 1, opacity: 1, transition: { delay: i * 80 } }" class="rounded-lg border border-border bg-card p-4 text-center hover:border-teal/40 hover:shadow-lg hover:shadow-teal/5 transition-all">
              <p class="font-stats text-lg font-bold text-foreground">{{ stat.value }}</p>
              <p class="text-xs text-muted-foreground mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </section>

        <!-- Projection -->
        <section v-if="data.projection" v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }">
          <h2 class="text-xl font-bold mb-4">Draft Projection</h2>
          <p class="text-foreground leading-relaxed">{{ data.projection }}</p>
        </section>

        <!-- YouTube -->
        <section v-if="data.youtubeVideoIds.length" v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }">
          <h2 class="text-xl font-bold mb-4">Highlights</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="vid in data.youtubeVideoIds" :key="vid" class="aspect-video rounded-xl overflow-hidden bg-navy-dark">
              <iframe :src="`https://www.youtube.com/embed/${vid}`" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" />
            </div>
          </div>
        </section>

        <!-- Community Reports -->
        <section v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold">Community Reports</h2>
            <div class="flex items-center gap-2">
              <span v-if="communityReports.length" class="text-xs text-muted-foreground mr-2">{{ communityReports.length }} report{{ communityReports.length !== 1 ? 's' : '' }}</span>
              <button
                v-for="opt in sortOptions"
                :key="opt.key"
                @click="reportSort = opt.key"
                :class="['px-2.5 py-1 rounded-md text-xs font-medium transition-colors', reportSort === opt.key ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground']"
              >{{ opt.label }}</button>
            </div>
          </div>

          <ReportForm :player-slug="slug" />

          <div v-if="communityReports.length" class="space-y-2 mt-4">
            <ReportCard v-for="report in sortedReports" :key="report.id" :report="report" />
          </div>
          <p v-else class="text-sm text-muted-foreground py-4">No community reports yet — be the first to share your analysis!</p>
        </section>

        <!-- Related Articles -->
        <section v-if="relatedArticles.length" v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 500 } }">
          <h2 class="text-xl font-bold mb-4">Related Articles</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink v-for="article in relatedArticles" :key="article.id" :to="`/articles/${article.slug}`">
              <ArticleCard v-bind="article" :date="formatDate(article.publishedAt)" />
            </NuxtLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, AlertTriangle } from 'lucide-vue-next'
import { getAttributesArray } from '~/types'

const route = useRoute()
const slug = route.params.slug as string

const { data } = usePlayer(slug)

useSocialMeta(computed(() => data.value ? {
  title: data.value.name,
  description: `${data.value.name} - ${data.value.position} from ${data.value.team}. Scope Rating: ${data.value.rating}/100. AFL draft scouting profile.`,
  image: data.value.photoUrl,
  url: `/players/${slug}`,
  type: 'profile' as const,
} : null))

useHead({
  script: computed(() => data.value ? [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.value.name,
      description: data.value.bio,
      height: { '@type': 'QuantitativeValue', value: data.value.height, unitCode: 'CMT' },
      weight: { '@type': 'QuantitativeValue', value: data.value.weight, unitCode: 'KGM' },
      birthDate: data.value.dateOfBirth,
      memberOf: { '@type': 'SportsTeam', name: data.value.team },
    }),
  }] : []),
})

const { data: relatedArticles } = useArticles(computed(() => ({ playerTag: slug })))
const { data: communityReports } = usePlayerReports(slug)

const reportSort = ref<'top' | 'newest' | 'oldest'>('top')
const sortOptions = [
  { key: 'top' as const, label: 'Top' },
  { key: 'newest' as const, label: 'Newest' },
  { key: 'oldest' as const, label: 'Oldest' },
]
const sortedReports = computed(() => {
  const reports = [...communityReports.value]
  if (reportSort.value === 'top') return reports.sort((a, b) => (b.likes.length - b.dislikes.length) - (a.likes.length - a.dislikes.length))
  if (reportSort.value === 'newest') return reports.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return reports.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
})

const gameStatsList = computed(() => {
  const gs = data.value?.gameStats
  if (!gs) return []
  return [
    gs.gamesPlayed != null && { label: 'Games', value: gs.gamesPlayed },
    gs.disposals != null && { label: 'Disposals', value: gs.disposals },
    gs.kicks != null && { label: 'Kicks', value: gs.kicks },
    gs.handballs != null && { label: 'Handballs', value: gs.handballs },
    gs.marks != null && { label: 'Marks', value: gs.marks },
    gs.tackles != null && { label: 'Tackles', value: gs.tackles },
    gs.contestedPossessions != null && { label: 'Contested Poss.', value: gs.contestedPossessions },
    gs.uncontestedPossessions != null && { label: 'Uncontested Poss.', value: gs.uncontestedPossessions },
    gs.clearances != null && { label: 'Clearances', value: gs.clearances },
    gs.inside50s != null && { label: 'Inside 50s', value: gs.inside50s },
    gs.goals != null && { label: 'Goals', value: gs.goals },
    gs.behinds != null && { label: 'Behinds', value: gs.behinds },
    gs.hitouts != null && { label: 'Hitouts', value: gs.hitouts },
    gs.metresGained != null && { label: 'Metres Gained', value: gs.metresGained },
    gs.disposalEfficiency != null && { label: 'Disposal Eff.', value: `${gs.disposalEfficiency}%` },
  ].filter(Boolean) as { label: string; value: string | number }[]
})

const combineStatsList = computed(() => {
  const cs = data.value?.combineStats
  if (!cs) return []
  return [
    { label: '20m Sprint', value: cs.sprint20m ? `${cs.sprint20m}s` : '—' },
    { label: 'Agility', value: cs.agility ? `${cs.agility}s` : '—' },
    { label: 'Vert Jump', value: cs.verticalJump ? `${cs.verticalJump}cm` : '—' },
    { label: 'Running Vert', value: cs.runningVerticalJump ? `${cs.runningVerticalJump}cm` : '—' },
    { label: '2km TT', value: cs.twoKmTimeTrial ?? '—' },
    { label: 'Kick Eff', value: cs.kickingEfficiency ? `${cs.kickingEfficiency}%` : '—' },
  ]
})

function formatDate(date: string) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
