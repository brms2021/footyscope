<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold">Player Comparison</h1>
        <p class="mt-2 text-muted-foreground">Compare two prospects side by side</p>
      </div>

      <!-- Player selectors -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <select v-model="playerASlug" class="rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Select Player A...</option>
          <option v-for="p in allPlayers" :key="p.slug" :value="p.slug">{{ p.name }} ({{ p.position }})</option>
        </select>
        <select v-model="playerBSlug" class="rounded-lg border border-input bg-background px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Select Player B...</option>
          <option v-for="p in allPlayers" :key="p.slug" :value="p.slug">{{ p.name }} ({{ p.position }})</option>
        </select>
      </div>

      <!-- Comparison -->
      <div v-if="playerA && playerB" class="space-y-10">
        <!-- Header cards -->
        <div class="grid grid-cols-2 gap-4">
          <div v-for="p in [playerA, playerB]" :key="p.slug" v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="rounded-xl border border-border bg-card p-5 text-center">
            <div class="h-20 w-20 mx-auto rounded-full ring-2 ring-teal/30 overflow-hidden mb-3">
              <img :src="getPlayerImage(p.photoUrl, p.name, 160)" :alt="p.name" class="h-full w-full object-cover" />
            </div>
            <h3 class="font-heading text-lg font-bold">{{ p.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ p.position }} · {{ p.team }}</p>
            <div class="mt-2">
              <ScopeRating :rating="p.rating" size="sm" />
            </div>
          </div>
        </div>

        <!-- Radar chart overlay -->
        <section v-motion :initial="{ scale: 0.95, opacity: 0 }" :visibleOnce="{ scale: 1, opacity: 1, transition: { duration: 600 } }">
          <h2 class="text-xl font-bold mb-4 text-center">Attribute Comparison</h2>
          <div class="max-w-lg mx-auto">
            <ClientOnly>
              <ComparisonRadar :player-a="playerA" :player-b="playerB" />
              <template #fallback><div class="h-80 bg-muted/50 rounded-xl animate-pulse" /></template>
            </ClientOnly>
          </div>
        </section>

        <!-- Stats comparison table -->
        <section v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1 }">
          <h2 class="text-xl font-bold mb-4 text-center">Head to Head</h2>
          <div class="rounded-xl border border-border overflow-hidden">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border bg-muted/30">
                  <th class="px-4 py-3 text-right font-heading text-xs uppercase text-muted-foreground w-[40%]">{{ playerA.name }}</th>
                  <th class="px-4 py-3 text-center font-heading text-xs uppercase text-muted-foreground w-[20%]">Stat</th>
                  <th class="px-4 py-3 text-left font-heading text-xs uppercase text-muted-foreground w-[40%]">{{ playerB.name }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(row, i) in comparisonRows" :key="row.label">
                  <tr v-if="row.label === 'Games'" class="bg-muted/20">
                    <td colspan="3" class="px-4 py-2 text-center font-heading text-xs uppercase tracking-wider text-muted-foreground">Game Stats (avg per game)</td>
                  </tr>
                  <tr v-if="row.label === '20m Sprint'" class="bg-muted/20">
                    <td colspan="3" class="px-4 py-2 text-center font-heading text-xs uppercase tracking-wider text-muted-foreground">Combine</td>
                  </tr>
                  <tr class="border-b border-border/50">
                    <td class="px-4 py-2.5 text-right font-stats" :class="row.aWins ? 'text-teal font-bold' : 'text-foreground'">{{ row.a }}</td>
                    <td class="px-4 py-2.5 text-center text-xs text-muted-foreground">{{ row.label }}</td>
                    <td class="px-4 py-2.5 text-left font-stats" :class="row.bWins ? 'text-teal font-bold' : 'text-foreground'">{{ row.b }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Attribute bars -->
        <section v-motion :initial="{ y: 20, opacity: 0 }" :visibleOnce="{ y: 0, opacity: 1 }">
          <h2 class="text-xl font-bold mb-4 text-center">Attributes Breakdown</h2>
          <div class="space-y-3 max-w-2xl mx-auto">
            <div v-for="attr in attributeComparison" :key="attr.label" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-stats w-8 text-right" :class="attr.aVal > attr.bVal ? 'text-teal' : 'text-muted-foreground'">{{ attr.aVal }}</span>
                <span class="text-muted-foreground font-medium">{{ attr.label }}</span>
                <span class="font-stats w-8" :class="attr.bVal > attr.aVal ? 'text-teal' : 'text-muted-foreground'">{{ attr.bVal }}</span>
              </div>
              <div class="flex gap-1 h-2">
                <div class="flex-1 flex justify-end">
                  <div class="h-full rounded-l-full bg-teal/60 transition-all duration-700" :style="{ width: attr.aVal + '%' }" />
                </div>
                <div class="flex-1">
                  <div class="h-full rounded-r-full bg-scope-3/60 transition-all duration-700" :style="{ width: attr.bVal + '%' }" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center gap-8 mt-4 text-xs text-muted-foreground">
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded-full bg-teal/60" /> {{ playerA.name }}</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-2 rounded-full bg-scope-3/60" /> {{ playerB.name }}</span>
          </div>
        </section>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-20 text-muted-foreground">
        <p class="text-lg">Select two players above to compare them</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '~/types'
import { getAttributesArray } from '~/types'

useHead({ title: 'Player Comparison — FootyScope' })

const allPlayers = useAllPlayers()
const playerASlug = ref('')
const playerBSlug = ref('')

const playerA = computed(() => allPlayers.value?.find((p: Player) => p.slug === playerASlug.value) ?? null)
const playerB = computed(() => allPlayers.value?.find((p: Player) => p.slug === playerBSlug.value) ?? null)

function statRow(label: string, aVal: number | string | null, bVal: number | string | null, suffix = '', higher = true) {
  const aNum = typeof aVal === 'number' ? aVal : null
  const bNum = typeof bVal === 'number' ? bVal : null
  const aDisplay = aVal != null ? `${aVal}${suffix}` : '—'
  const bDisplay = bVal != null ? `${bVal}${suffix}` : '—'
  const aWins = aNum != null && bNum != null && (higher ? aNum > bNum : aNum < bNum)
  const bWins = aNum != null && bNum != null && (higher ? bNum > aNum : aNum > bNum)
  return { label, a: aDisplay, b: bDisplay, aWins, bWins }
}

const comparisonRows = computed(() => {
  if (!playerA.value || !playerB.value) return []
  const a = playerA.value
  const b = playerB.value
  const rows = [
    statRow('Rating', a.rating, b.rating),
    statRow('Height', a.height, b.height, 'cm'),
    statRow('Weight', a.weight, b.weight, 'kg'),
    { label: 'Position', a: a.position, b: b.position, aWins: false, bWins: false },
    { label: 'Team', a: a.team, b: b.team, aWins: false, bWins: false },
    { label: 'State', a: a.state, b: b.state, aWins: false, bWins: false },
  ]
  // Game stats (per-game averages)
  const ag = a.gameStats
  const bg = b.gameStats
  if (ag || bg) {
    rows.push(
      statRow('Games', ag?.gamesPlayed ?? null, bg?.gamesPlayed ?? null),
      statRow('Disposals', ag?.disposals ?? null, bg?.disposals ?? null),
      statRow('Kicks', ag?.kicks ?? null, bg?.kicks ?? null),
      statRow('Handballs', ag?.handballs ?? null, bg?.handballs ?? null),
      statRow('Marks', ag?.marks ?? null, bg?.marks ?? null),
      statRow('Tackles', ag?.tackles ?? null, bg?.tackles ?? null),
      statRow('Contested Poss.', ag?.contestedPossessions ?? null, bg?.contestedPossessions ?? null),
      statRow('Uncontested Poss.', ag?.uncontestedPossessions ?? null, bg?.uncontestedPossessions ?? null),
      statRow('Clearances', ag?.clearances ?? null, bg?.clearances ?? null),
      statRow('Inside 50s', ag?.inside50s ?? null, bg?.inside50s ?? null),
      statRow('Goals', ag?.goals ?? null, bg?.goals ?? null),
      statRow('Behinds', ag?.behinds ?? null, bg?.behinds ?? null),
      statRow('Hitouts', ag?.hitouts ?? null, bg?.hitouts ?? null),
      statRow('Metres Gained', ag?.metresGained ?? null, bg?.metresGained ?? null),
      statRow('Disposal Eff.', ag?.disposalEfficiency ?? null, bg?.disposalEfficiency ?? null, '%'),
    )
  }
  // Combine stats
  const ac = a.combineStats
  const bc = b.combineStats
  if (ac || bc) {
    rows.push(
      statRow('20m Sprint', ac?.sprint20m ?? null, bc?.sprint20m ?? null, 's', false),
      statRow('Agility', ac?.agility ?? null, bc?.agility ?? null, 's', false),
      statRow('Vert. Jump', ac?.verticalJump ?? null, bc?.verticalJump ?? null, 'cm'),
      statRow('Running Vert.', ac?.runningVerticalJump ?? null, bc?.runningVerticalJump ?? null, 'cm'),
      statRow('2km TT', ac?.twoKmTimeTrial ?? null, bc?.twoKmTimeTrial ?? null),
      statRow('Kick Eff.', ac?.kickingEfficiency ?? null, bc?.kickingEfficiency ?? null, '%'),
    )
  }
  return rows
})

const attrLabels = ['Athleticism', 'Kicking', 'Marking', 'Ball Winning', 'Decision Making', 'Football IQ', 'Versatility', 'Competitiveness', 'Ceiling']

const attributeComparison = computed(() => {
  if (!playerA.value || !playerB.value) return []
  const aArr = getAttributesArray(playerA.value.attributes)
  const bArr = getAttributesArray(playerB.value.attributes)
  return attrLabels.map((label, i) => ({
    label,
    aVal: aArr[i],
    bVal: bArr[i],
  }))
})
</script>
