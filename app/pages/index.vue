<template>
  <div>
    <HeroSection />

    <div class="relative">
      <PageBackground />
      <div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-16">
        <div v-motion :initial="{ y: 30, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 600 } }">
          <FeatureGrid />
        </div>

        <!-- Top Prospects -->
        <section v-motion :initial="{ y: 30, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 600 } }">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-extrabold text-foreground">Top Prospects</h2>
            <NuxtLink to="/rankings" class="text-sm font-medium text-primary hover:text-teal-light transition-colors">
              View All Rankings →
            </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlayerCard
              v-for="(player, i) in topProspects"
              :key="player.slug"
              v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { delay: i * 100 } }"
              :name="player.name"
              :position="player.position"
              :team="player.team"
              :rating="player.rating"
              :height="`${player.height}cm`"
              :weight="`${player.weight}kg`"
              :kick-eff="player.combineStats?.kickingEfficiency ?? 0"
              :slug="player.slug"
              :photo-url="player.photoUrl"
            />
          </div>
        </section>

        <!-- Latest Articles -->
        <section v-motion :initial="{ y: 30, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 600 } }">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-extrabold text-foreground">Latest Articles</h2>
            <NuxtLink to="/articles" class="text-sm font-medium text-primary hover:text-teal-light transition-colors">
              View All →
            </NuxtLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink v-for="(article, i) in latestArticles" :key="article.id" :to="`/articles/${article.slug}`"
              v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { delay: i * 100 } }">
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
        </section>

        <!-- Compare CTA -->
        <section v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1, transition: { duration: 600 } }" class="text-center py-8">
          <h2 class="text-2xl font-extrabold mb-3">Compare Prospects</h2>
          <p class="text-muted-foreground mb-6">Side-by-side comparison with radar charts and attribute breakdowns</p>
          <NuxtLink to="/tools/compare" class="inline-flex h-12 items-center justify-center rounded-lg bg-teal px-8 text-sm font-semibold text-navy-dark hover:bg-teal-light transition-colors">
            Open Comparison Tool
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSocialMeta({
  title: 'AFL Draft Scouting & Analytics',
  description: 'The sharpest eye on the AFL draft. Prospect rankings, scouting reports, player comparisons, and in-depth draft analysis.',
  url: '/',
})

const { data: topProspects } = useTopProspects(3)
const { data: latestArticles } = useLatestArticles(3)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
