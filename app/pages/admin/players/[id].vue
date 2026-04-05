<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-5xl">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold">Edit Player</h1>
      <NuxtLink to="/admin/players" class="text-sm text-muted-foreground hover:text-primary transition-colors">← Back</NuxtLink>
    </div>

    <div v-if="!player" class="text-muted-foreground">Player not found.</div>

    <form v-else @submit.prevent="save" class="space-y-8">
      <!-- Profile Image Preview -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Profile Image</h2>
        <div class="flex items-center gap-6">
          <div class="h-24 w-24 shrink-0 rounded-full ring-4 ring-teal/30 overflow-hidden">
            <img :src="getPlayerImage(form.photoUrl, form.firstName + ' ' + form.lastName, 192)" :alt="form.firstName" class="h-full w-full object-cover" />
          </div>
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium">Photo URL</label>
            <input v-model="form.photoUrl" type="url" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="https://..." />
            <p class="text-xs text-muted-foreground">Paste an image URL. Leave empty for auto-generated avatar.</p>
          </div>
        </div>
      </section>

      <!-- Basic Info -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Basic Information</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2"><label class="text-sm font-medium">First Name</label><input v-model="form.firstName" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div class="space-y-2"><label class="text-sm font-medium">Last Name</label><input v-model="form.lastName" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div class="space-y-2"><label class="text-sm font-medium">Slug</label><input v-model="form.slug" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div class="space-y-2"><label class="text-sm font-medium">Position</label><select v-model="form.position" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option v-for="p in POSITIONS" :key="p" :value="p">{{ p }}</option></select></div>
          <div class="space-y-2"><label class="text-sm font-medium">Team</label><input v-model="form.team" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div class="space-y-2"><label class="text-sm font-medium">State</label><select v-model="form.state" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option v-for="s in STATES" :key="s" :value="s">{{ s }}</option></select></div>
          <div class="space-y-2"><label class="text-sm font-medium">Date of Birth</label><input v-model="form.dateOfBirth" type="date" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div class="space-y-2"><label class="text-sm font-medium">Draft Year</label><input v-model.number="form.draftYear" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div class="space-y-2"><label class="text-sm font-medium">Height (cm)</label><input v-model.number="form.height" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div class="space-y-2"><label class="text-sm font-medium">Weight (kg)</label><input v-model.number="form.weight" type="number" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        </div>
      </section>

      <!-- Rating -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Scope Rating & Attributes</h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Overall Rating (1-100)</label>
              <div class="flex items-center gap-4">
                <input v-model.number="form.rating" type="range" min="1" max="100" class="flex-1 accent-teal" />
                <span class="font-stats text-lg font-bold w-10 text-center">{{ form.rating }}</span>
              </div>
            </div>
            <div v-for="attr in attributeLabels" :key="attr.key" class="space-y-1">
              <div class="flex items-center justify-between"><label class="text-sm font-medium">{{ attr.label }}</label><span class="font-stats text-xs text-muted-foreground">{{ (form.attributes as any)[attr.key] }}</span></div>
              <input v-model.number="(form.attributes as any)[attr.key]" type="range" min="0" max="100" class="w-full accent-teal" />
            </div>
          </div>
          <div class="flex items-center justify-center">
            <ClientOnly>
              <RadarChart :attributes="attributesArray" :player-name="form.firstName + ' ' + form.lastName" />
              <template #fallback><div class="w-80 h-80 rounded-xl bg-muted/50 animate-pulse" /></template>
            </ClientOnly>
          </div>
        </div>
      </section>

      <!-- Game Stats -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Game Stats (avg per game)</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div v-for="gs in gameStatLabels" :key="gs.key" class="space-y-1">
            <label class="text-xs font-medium text-muted-foreground">{{ gs.label }}</label>
            <input v-model.number="(form.gameStats as any)[gs.key]" type="number" step="0.1" class="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Content</h2>
        <div class="space-y-2"><label class="text-sm font-medium">Bio</label><textarea v-model="form.bio" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Scouting Report</label>
          <ClientOnly><TipTapEditor v-model="form.scoutingReport" /><template #fallback><div class="h-60 rounded-lg border border-border bg-muted/50 animate-pulse" /></template></ClientOnly>
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
        <div class="space-y-2"><label class="text-sm font-medium">Projection</label><textarea v-model="form.projection" rows="2" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" /></div>
      </section>

      <!-- Media -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold border-b border-border pb-2">Media</h2>
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
        <button type="submit" class="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors">Update Player</button>
        <NuxtLink to="/admin/players" class="rounded-lg border border-border px-6 py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { POSITIONS, STATES, getAttributesArray } from '~/types'
import type { PlayerAttributes, GameStats } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const route = useRoute()
const router = useRouter()
const store = useAdminStore()

const playerId = route.params.id as string
const player = store.getPlayer(playerId)

const attributeLabels = [
  { key: 'athleticism', label: 'Athleticism' }, { key: 'kicking', label: 'Kicking' },
  { key: 'marking', label: 'Marking' }, { key: 'ballWinning', label: 'Ball Winning' },
  { key: 'decisionMaking', label: 'Decision Making' }, { key: 'footballIQ', label: 'Football IQ' },
  { key: 'versatility', label: 'Versatility' }, { key: 'competitiveness', label: 'Competitiveness' },
  { key: 'ceiling', label: 'Ceiling' },
]

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

const defaultGameStats: GameStats = {
  gamesPlayed: null, disposals: null, kicks: null, handballs: null,
  marks: null, tackles: null, contestedPossessions: null, uncontestedPossessions: null,
  clearances: null, inside50s: null, goals: null, behinds: null,
  hitouts: null, metresGained: null, disposalEfficiency: null,
}

const form = reactive({
  firstName: player?.firstName ?? '',
  lastName: player?.lastName ?? '',
  slug: player?.slug ?? '',
  position: player?.position ?? POSITIONS[0],
  team: player?.team ?? '',
  state: player?.state ?? STATES[0],
  dateOfBirth: player?.dateOfBirth ?? '',
  draftYear: player?.draftYear ?? 2026,
  height: player?.height ?? 185,
  weight: player?.weight ?? 80,
  rating: player?.rating ?? 70,
  attributes: { ...(player?.attributes ?? { athleticism: 50, kicking: 50, marking: 50, ballWinning: 50, decisionMaking: 50, footballIQ: 50, versatility: 50, competitiveness: 50, ceiling: 50 }) } as PlayerAttributes,
  gameStats: { ...defaultGameStats, ...(player?.gameStats ?? {}) } as GameStats,
  bio: player?.bio ?? '',
  scoutingReport: player?.scoutingReport ?? '',
  strengths: [...(player?.strengths ?? [''])],
  weaknesses: [...(player?.weaknesses ?? [''])],
  projection: player?.projection ?? '',
  photoUrl: player?.photoUrl ?? '',
  youtubeVideoIds: [...(player?.youtubeVideoIds ?? [])],
  published: player?.published ?? false,
})

const attributesArray = computed(() => getAttributesArray(form.attributes))

function save() {
  if (!player) return
  store.savePlayer({
    ...player,
    ...form,
    name: `${form.firstName} ${form.lastName}`,
    attributes: { ...form.attributes },
    gameStats: Object.values(form.gameStats).some(v => v != null) ? { ...form.gameStats } : null,
    photoUrl: form.photoUrl || null,
    strengths: form.strengths.filter(Boolean),
    weaknesses: form.weaknesses.filter(Boolean),
    youtubeVideoIds: form.youtubeVideoIds.filter(Boolean),
  })
  router.push('/admin/players')
}
</script>
