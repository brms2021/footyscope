<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-5xl">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold">Add Player</h1>
      <NuxtLink to="/admin/players" class="text-sm text-muted-foreground hover:text-primary transition-colors">← Back</NuxtLink>
    </div>

    <form @submit.prevent="save" class="space-y-8">
      <!-- Basic Info -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Basic Information</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">First Name</label>
            <input v-model="form.firstName" @input="updateNameAndSlug" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Last Name</label>
            <input v-model="form.lastName" @input="updateNameAndSlug" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Slug</label>
            <input v-model="form.slug" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Position</label>
            <select v-model="form.position" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option v-for="pos in POSITIONS" :key="pos" :value="pos">{{ pos }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Team</label>
            <input v-model="form.team" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">State</label>
            <select v-model="form.state" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option v-for="s in STATES" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Date of Birth</label>
            <input v-model="form.dateOfBirth" type="date" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Draft Year</label>
            <input v-model.number="form.draftYear" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Height (cm)</label>
            <input v-model.number="form.height" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Weight (kg)</label>
            <input v-model.number="form.weight" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </section>

      <!-- Rating & Attributes -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Scope Rating & Attributes</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Overall Rating (1-100)</label>
              <div class="flex items-center gap-4">
                <input v-model.number="form.rating" type="range" min="1" max="100" class="flex-1 accent-teal" />
                <span class="font-stats text-lg font-bold w-10 text-center" :style="{ color: getRatingColor(form.rating) }">{{ form.rating }}</span>
              </div>
            </div>
            <div v-for="attr in attributeLabels" :key="attr.key" class="space-y-1">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium">{{ attr.label }}</label>
                <span class="font-stats text-xs text-muted-foreground">{{ (form.attributes as any)[attr.key] }}</span>
              </div>
              <input v-model.number="(form.attributes as any)[attr.key]" type="range" min="0" max="100" class="w-full accent-teal" />
            </div>
          </div>
          <!-- Live radar chart preview -->
          <div class="flex items-center justify-center">
            <ClientOnly>
              <RadarChart :attributes="attributesArray" :player-name="form.firstName + ' ' + form.lastName" />
              <template #fallback>
                <div class="w-80 h-80 rounded-xl bg-muted/50 animate-pulse" />
              </template>
            </ClientOnly>
          </div>
        </div>
      </section>

      <!-- Game Stats -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Game Stats <span class="text-sm text-muted-foreground font-normal">(avg per game)</span></h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="gs in gameStatLabels" :key="gs.key" class="space-y-1">
            <label class="text-xs font-medium text-muted-foreground">{{ gs.label }}</label>
            <input v-model.number="(gameStatsForm as any)[gs.key]" type="number" step="0.1" class="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </section>

      <!-- Combine Stats -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Combine Stats <span class="text-sm text-muted-foreground font-normal">(optional)</span></h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">20m Sprint (s)</label>
            <input v-model.number="combineStats.sprint20m" type="number" step="0.01" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" placeholder="2.95" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Agility (s)</label>
            <input v-model.number="combineStats.agility" type="number" step="0.01" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" placeholder="8.10" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Vertical Jump (cm)</label>
            <input v-model.number="combineStats.verticalJump" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" placeholder="68" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Running Vert (cm)</label>
            <input v-model.number="combineStats.runningVerticalJump" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" placeholder="76" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">2km Time Trial</label>
            <input v-model="combineStats.twoKmTimeTrial" type="text" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" placeholder="6:15" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Kick Eff (%)</label>
            <input v-model.number="combineStats.kickingEfficiency" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" placeholder="65" />
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Content</h2>
        <div class="space-y-2">
          <label class="text-sm font-medium">Bio</label>
          <textarea v-model="form.bio" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Brief player overview..." />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Scouting Report</label>
          <ClientOnly>
            <TipTapEditor v-model="form.scoutingReport" placeholder="Detailed scouting analysis..." />
            <template #fallback><div class="h-60 rounded-lg border border-border bg-muted/50 animate-pulse" /></template>
          </ClientOnly>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Strengths</label>
            <div class="space-y-1">
              <div v-for="(s, i) in form.strengths" :key="i" class="flex gap-2">
                <input v-model="form.strengths[i]" class="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" @click="form.strengths.splice(i, 1)" class="text-destructive text-sm px-2">×</button>
              </div>
              <button type="button" @click="form.strengths.push('')" class="text-sm text-primary hover:text-teal-light">+ Add strength</button>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Weaknesses</label>
            <div class="space-y-1">
              <div v-for="(w, i) in form.weaknesses" :key="i" class="flex gap-2">
                <input v-model="form.weaknesses[i]" class="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                <button type="button" @click="form.weaknesses.splice(i, 1)" class="text-destructive text-sm px-2">×</button>
              </div>
              <button type="button" @click="form.weaknesses.push('')" class="text-sm text-primary hover:text-teal-light">+ Add weakness</button>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Projection</label>
          <textarea v-model="form.projection" rows="2" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Draft projection and AFL outlook..." />
        </div>
      </section>

      <!-- Media -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Media</h2>
        <div class="space-y-2">
          <label class="text-sm font-medium">Photo URL</label>
          <input v-model="form.photoUrl" type="url" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="https://..." />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">YouTube Video IDs</label>
          <div class="space-y-1">
            <div v-for="(vid, i) in form.youtubeVideoIds" :key="i" class="flex gap-2">
              <input v-model="form.youtubeVideoIds[i]" class="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" placeholder="dQw4w9WgXcQ" />
              <button type="button" @click="form.youtubeVideoIds.splice(i, 1)" class="text-destructive text-sm px-2">×</button>
            </div>
            <button type="button" @click="form.youtubeVideoIds.push('')" class="text-sm text-primary hover:text-teal-light">+ Add video</button>
          </div>
        </div>
      </section>

      <!-- Published + Save -->
      <div class="flex items-center gap-3">
        <button type="button" @click="form.published = !form.published"
          :class="['relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer', form.published ? 'bg-primary' : 'bg-muted']">
          <span :class="['pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform', form.published ? 'translate-x-5' : 'translate-x-0']" />
        </button>
        <span class="text-sm font-medium">{{ form.published ? 'Published' : 'Draft' }}</span>
      </div>

      <div class="flex gap-3">
        <button type="submit" class="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors">Save Player</button>
        <NuxtLink to="/admin/players" class="rounded-lg border border-border px-6 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { POSITIONS, STATES, getAttributesArray } from '~/types'
import type { Player, PlayerAttributes, GameStats } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()
const router = useRouter()

const attributeLabels = [
  { key: 'athleticism', label: 'Athleticism' },
  { key: 'kicking', label: 'Kicking' },
  { key: 'marking', label: 'Marking' },
  { key: 'ballWinning', label: 'Ball Winning' },
  { key: 'decisionMaking', label: 'Decision Making' },
  { key: 'footballIQ', label: 'Football IQ' },
  { key: 'versatility', label: 'Versatility' },
  { key: 'competitiveness', label: 'Competitiveness' },
  { key: 'ceiling', label: 'Ceiling' },
]

const form = reactive({
  firstName: '',
  lastName: '',
  slug: '',
  position: POSITIONS[0] as string,
  team: '',
  state: STATES[0] as string,
  dateOfBirth: '',
  draftYear: 2026,
  height: 185,
  weight: 80,
  rating: 70,
  attributes: {
    athleticism: 50, kicking: 50, marking: 50, ballWinning: 50,
    decisionMaking: 50, footballIQ: 50, versatility: 50, competitiveness: 50, ceiling: 50,
  } as PlayerAttributes,
  bio: '',
  scoutingReport: '',
  strengths: [''] as string[],
  weaknesses: [''] as string[],
  projection: '',
  photoUrl: '',
  youtubeVideoIds: [] as string[],
  published: false,
})

const gameStatLabels = [
  { key: 'gamesPlayed', label: 'Games' },
  { key: 'disposals', label: 'Disposals' },
  { key: 'kicks', label: 'Kicks' },
  { key: 'handballs', label: 'Handballs' },
  { key: 'marks', label: 'Marks' },
  { key: 'tackles', label: 'Tackles' },
  { key: 'contestedPossessions', label: 'Contested Poss.' },
  { key: 'uncontestedPossessions', label: 'Uncontested Poss.' },
  { key: 'clearances', label: 'Clearances' },
  { key: 'inside50s', label: 'Inside 50s' },
  { key: 'goals', label: 'Goals' },
  { key: 'behinds', label: 'Behinds' },
  { key: 'hitouts', label: 'Hitouts' },
  { key: 'metresGained', label: 'Metres Gained' },
  { key: 'disposalEfficiency', label: 'Disposal Eff. (%)' },
]

const gameStatsForm = reactive<GameStats>({
  gamesPlayed: null, disposals: null, kicks: null, handballs: null,
  marks: null, tackles: null, contestedPossessions: null, uncontestedPossessions: null,
  clearances: null, inside50s: null, goals: null, behinds: null,
  hitouts: null, metresGained: null, disposalEfficiency: null,
})

const combineStats = reactive({
  sprint20m: null as number | null,
  agility: null as number | null,
  verticalJump: null as number | null,
  runningVerticalJump: null as number | null,
  twoKmTimeTrial: '' as string | null,
  kickingEfficiency: null as number | null,
})

const attributesArray = computed(() => getAttributesArray(form.attributes))

function updateNameAndSlug() {
  form.slug = `${form.firstName}-${form.lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function getRatingColor(rating: number) {
  if (rating >= 90) return 'var(--color-scope-5)'
  if (rating >= 80) return 'var(--color-scope-4)'
  if (rating >= 70) return 'var(--color-scope-3)'
  if (rating >= 60) return 'var(--color-scope-2)'
  return 'var(--color-scope-1)'
}

function save() {
  const hasCombine = combineStats.sprint20m || combineStats.agility || combineStats.verticalJump
  const player: Player = {
    id: crypto.randomUUID(),
    slug: form.slug,
    name: `${form.firstName} ${form.lastName}`,
    firstName: form.firstName,
    lastName: form.lastName,
    position: form.position,
    team: form.team,
    state: form.state,
    dateOfBirth: form.dateOfBirth,
    draftYear: form.draftYear,
    height: form.height,
    weight: form.weight,
    rating: form.rating,
    attributes: { ...form.attributes },
    combineStats: hasCombine ? { ...combineStats, twoKmTimeTrial: combineStats.twoKmTimeTrial || null } : null,
    gameStats: Object.values(gameStatsForm).some(v => v != null) ? { ...gameStatsForm } : null,
    bio: form.bio,
    scoutingReport: form.scoutingReport,
    strengths: form.strengths.filter(Boolean),
    weaknesses: form.weaknesses.filter(Boolean),
    projection: form.projection,
    photoUrl: form.photoUrl || null,
    youtubeVideoIds: form.youtubeVideoIds.filter(Boolean),
    published: form.published,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  store.savePlayer(player)
  router.push('/admin/players')
}
</script>
