<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-5xl">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold">Consensus Rankings</h1>
      <NuxtLink to="/admin" class="text-sm text-muted-foreground hover:text-primary transition-colors">← Dashboard</NuxtLink>
    </div>

    <p class="text-sm text-muted-foreground">Manually set the consensus rankings and each source's position for each player. Rows are sorted by their order in the list.</p>

    <!-- Sources legend -->
    <div class="flex flex-wrap gap-2">
      <span v-for="source in sources" :key="source.name" class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium" :style="{ backgroundColor: source.color + '20', color: source.color }">
        <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: source.color }" />
        {{ source.name }} ({{ source.short }})
      </span>
    </div>

    <!-- Rows -->
    <div class="space-y-2">
      <div
        v-for="(row, i) in rows"
        :key="i"
        class="rounded-lg border border-border bg-card p-4 space-y-3"
      >
        <div class="flex items-center gap-3">
          <span class="font-heading text-lg font-extrabold text-muted-foreground w-6 shrink-0">{{ i + 1 }}</span>
          <select v-model="row.slug" class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            <option value="">— Select player —</option>
            <option v-for="p in allPlayers" :key="p.slug" :value="p.slug">{{ p.name }} ({{ p.position }})</option>
          </select>
          <div class="flex gap-1">
            <button type="button" @click="moveUp(i)" :disabled="i === 0" class="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
              <ChevronUp class="h-4 w-4" />
            </button>
            <button type="button" @click="moveDown(i)" :disabled="i === rows.length - 1" class="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
              <ChevronDown class="h-4 w-4" />
            </button>
            <button type="button" @click="removeRow(i)" class="p-1.5 rounded border border-border text-muted-foreground hover:text-destructive transition-colors">
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 pl-9">
          <div v-for="source in sources" :key="source.name" class="space-y-1">
            <label class="text-xs font-medium text-muted-foreground">{{ source.short }}</label>
            <input v-model.number="row.ranks[source.name]" type="number" min="1" placeholder="—"
              class="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-stats focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
      </div>
    </div>

    <button @click="addRow" type="button" class="text-sm text-primary hover:text-teal-light transition-colors">
      + Add player
    </button>

    <!-- Disclaimer text -->
    <section class="space-y-2 pt-4 border-t border-border">
      <h2 class="text-lg font-bold">Disclaimer Text</h2>
      <p class="text-xs text-muted-foreground">This appears below the consensus table on the public page.</p>
      <textarea v-model="disclaimer" rows="3" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Rankings sourced from publicly available phantom drafts..." />
    </section>

    <div class="flex gap-3 pt-2">
      <button @click="save" :disabled="saving" class="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors disabled:opacity-60">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
      <NuxtLink to="/tools/consensus" target="_blank" class="rounded-lg border border-border px-6 py-2 text-sm font-medium hover:bg-accent transition-colors">
        Preview
      </NuxtLink>
    </div>

    <p v-if="saved" class="text-sm text-teal">Changes saved successfully.</p>
  </div>
</template>

<script setup lang="ts">
import { X, ChevronUp, ChevronDown } from 'lucide-vue-next'
import type { ConsensusRow } from '~/types'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()
const allPlayers = computed(() => store.players.value)

const sources = [
  { name: 'FootyScope', short: 'FS', color: '#2d9d78' },
  { name: 'AFL.com.au', short: 'AFL', color: '#e74c3c' },
  { name: 'ESPN', short: 'ESPN', color: '#f59e0b' },
  { name: 'Rookie Me', short: 'RMC', color: '#8b5cf6' },
  { name: 'Mongrel', short: 'TMP', color: '#ec4899' },
]

const defaultRanks = () => Object.fromEntries(sources.map(s => [s.name, null as number | null]))

const rows = ref<Array<{ slug: string; ranks: Record<string, number | null> }>>(
  store.consensusRows.value.length
    ? store.consensusRows.value.map(r => ({ slug: r.slug, ranks: { ...defaultRanks(), ...r.ranks } }))
    : [{ slug: '', ranks: defaultRanks() }]
)

const disclaimer = ref(store.siteContent.value?.consensusDisclaimer ?? '')

watch(() => store.consensusRows.value, (newRows) => {
  if (newRows.length && rows.value.every(r => !r.slug)) {
    rows.value = newRows.map(r => ({ slug: r.slug, ranks: { ...defaultRanks(), ...r.ranks } }))
  }
}, { once: true })

function addRow() {
  rows.value.push({ slug: '', ranks: defaultRanks() })
}

function removeRow(i: number) {
  rows.value.splice(i, 1)
}

function moveUp(i: number) {
  if (i === 0) return
  const arr = [...rows.value]
  ;[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
  rows.value = arr
}

function moveDown(i: number) {
  if (i === rows.value.length - 1) return
  const arr = [...rows.value]
  ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
  rows.value = arr
}

const saving = ref(false)
const saved = ref(false)

async function save() {
  saving.value = true
  saved.value = false
  const entries: ConsensusRow[] = rows.value
    .filter(r => r.slug)
    .map((r, i) => ({
      id: '',
      order: i,
      slug: r.slug,
      ranks: r.ranks,
    }))
  await store.saveConsensus(entries)
  await store.saveSiteContent({ consensusDisclaimer: disclaimer.value })
  saving.value = false
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
}
</script>
