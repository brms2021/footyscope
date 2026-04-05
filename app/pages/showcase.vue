<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
    <div class="text-center">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-foreground">Component Showcase</h1>
      <p class="mt-2 text-muted-foreground">FootyScope UI components and design system preview</p>
    </div>

    <!-- 1. Hero Section -->
    <section>
      <h2 class="text-xl font-bold text-foreground mb-4">1. Hero Section</h2>
      <p class="text-sm text-muted-foreground mb-6">Full-width homepage hero with gradient background and CTAs.</p>
    </section>
    <HeroSection class="-mx-4 sm:-mx-6 lg:-mx-8" />

    <hr class="border-border" />

    <!-- 2. Player Cards -->
    <section>
      <h2 class="text-xl font-bold text-foreground mb-4">2. Player Cards</h2>
      <p class="text-sm text-muted-foreground mb-6">Prospect card with rating, key stats, and profile link.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlayerCard
          v-for="player in mockPlayers"
          :key="player.slug"
          v-bind="player"
        />
      </div>
    </section>

    <hr class="border-border" />

    <!-- 3. Scope Rating -->
    <section>
      <h2 class="text-xl font-bold text-foreground mb-4">3. Scope Rating</h2>
      <p class="text-sm text-muted-foreground mb-6">Circular rating badge with tier labels and color coding.</p>
      <div class="flex flex-wrap items-end justify-center gap-8">
        <ScopeRating :rating="95" size="lg" />
        <ScopeRating :rating="84" size="lg" />
        <ScopeRating :rating="73" size="lg" />
        <ScopeRating :rating="64" size="lg" />
        <ScopeRating :rating="52" size="lg" />
      </div>
    </section>

    <hr class="border-border" />

    <!-- 4. Rankings Rows -->
    <section>
      <h2 class="text-xl font-bold text-foreground mb-4">4. Ranking Rows</h2>
      <p class="text-sm text-muted-foreground mb-6">247Sports-style ranking list entries with movement indicators.</p>
      <div class="space-y-2 max-w-3xl">
        <RankingRow :rank="1" name="Taj Morrison" position="MID" team="Sandringham Dragons" :rating="95" :change="0" />
        <RankingRow :rank="2" name="Eli Parker" position="FWD" team="Gippsland Power" :rating="92" :change="2" />
        <RankingRow :rank="3" name="Jaxon Bragg" position="DEF/MID" team="GWV Rebels" :rating="89" :change="-1" />
        <RankingRow :rank="4" name="Lachie Dunn" position="RUCK" team="Oakleigh Chargers" :rating="86" :change="1" />
        <RankingRow :rank="5" name="Noah Fielding" position="DEF" team="Murray Bushrangers" :rating="84" :change="-2" />
      </div>
    </section>

    <hr class="border-border" />

    <!-- 5. Radar Chart -->
    <section>
      <h2 class="text-xl font-bold text-foreground mb-4">5. Radar Chart</h2>
      <p class="text-sm text-muted-foreground mb-6">9-attribute spider chart for player scouting profiles.</p>
      <RadarChart :attributes="[88, 75, 65, 90, 82, 85, 70, 92, 88]" player-name="Taj Morrison" />
    </section>

    <hr class="border-border" />

    <!-- 6. Stats Table -->
    <section>
      <h2 class="text-xl font-bold text-foreground mb-4">6. Combine Stats Table</h2>
      <p class="text-sm text-muted-foreground mb-6">Sortable data table with best-in-class highlighting.</p>
      <StatsTable />
    </section>

    <hr class="border-border" />

    <!-- 7. Article Cards -->
    <section>
      <h2 class="text-xl font-bold text-foreground mb-4">7. Article Cards</h2>
      <p class="text-sm text-muted-foreground mb-6">Content cards for scouting reports and draft analysis articles.</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          v-for="article in mockArticles"
          :key="article.title"
          v-bind="article"
        />
      </div>
    </section>

    <hr class="border-border" />

    <!-- 8. Feature Grid -->
    <section>
      <h2 class="text-xl font-bold text-foreground mb-4">8. Feature Grid</h2>
      <p class="text-sm text-muted-foreground mb-6">Metric highlight cards for site features or key stats.</p>
      <FeatureGrid />
    </section>
  </div>
</template>

<script setup lang="ts">
const mockPlayers = [
  { name: 'Taj Morrison', position: 'MID', team: 'Sandringham Dragons', rating: 95, height: '180cm', weight: '75kg', kickEff: 68, slug: 'taj-morrison' },
  { name: 'Eli Parker', position: 'FWD', team: 'Gippsland Power', rating: 92, height: '185cm', weight: '78kg', kickEff: 72, slug: 'eli-parker' },
  { name: 'Jaxon Bragg', position: 'DEF/MID', team: 'GWV Rebels', rating: 89, height: '191cm', weight: '84kg', kickEff: 65, slug: 'jaxon-bragg' },
]

const mockArticles = [
  { title: '2026 Draft Class: Top 10 Prospects Breakdown', excerpt: 'An in-depth look at the ten most exciting prospects heading into the 2026 AFL Draft.', category: 'Draft Analysis', author: 'FootyScope', date: 'Mar 28, 2026' },
  { title: 'Taj Morrison: The Complete Midfielder', excerpt: 'Breaking down why Morrison is the consensus number one pick for the 2026 draft.', category: 'Scouting Report', author: 'FootyScope', date: 'Mar 25, 2026' },
  { title: 'National Championships Preview', excerpt: 'What to watch for at the U18 National Championships and which prospects to keep an eye on.', category: 'Preview', author: 'FootyScope', date: 'Mar 20, 2026' },
]
</script>
