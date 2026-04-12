<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold">Custom Rankings</h1>
          <p class="mt-2 text-muted-foreground">Build your own prospect rankings, then share or download as PDF</p>
        </div>
        <div class="flex gap-2">
          <button @click="resetRankings" class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            Reset
          </button>
          <button @click="shareRankings" v-if="ranked.length" class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            {{ copied ? 'Copied!' : 'Share' }}
          </button>
          <button @click="downloadPdf" v-if="ranked.length" class="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-teal transition-colors">
            Download PDF
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Rankings list -->
        <div class="lg:col-span-2 space-y-2">
          <div v-if="ranked.length === 0" class="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground text-sm">
            Add players from the panel on the right to start building your rankings.
          </div>

          <div
            v-for="(player, i) in ranked"
            :key="player.slug"
            class="flex items-center gap-3 rounded-lg border border-teal/30 bg-card px-4 py-3"
          >
            <span class="font-heading text-xl font-extrabold text-muted-foreground w-8 text-center shrink-0">{{ i + 1 }}</span>
            <div class="h-8 w-8 rounded-full ring-1 ring-border overflow-hidden shrink-0">
              <img :src="getPlayerImage(player.photoUrl, player.name, 64)" :alt="player.name" class="h-full w-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold truncate">{{ player.name }}</p>
              <p class="text-xs text-muted-foreground">{{ player.position }} · {{ player.team }}</p>
            </div>
            <span class="font-stats text-xs font-bold" :style="{ color: getRatingColor(player.rating) }">{{ player.rating }}</span>
            <div class="flex gap-1">
              <button @click="moveUp(i)" :disabled="i === 0" class="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                <ChevronUp class="h-4 w-4" />
              </button>
              <button @click="moveDown(i)" :disabled="i === ranked.length - 1" class="p-1 text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                <ChevronDown class="h-4 w-4" />
              </button>
              <button @click="removeRanked(i)" class="p-1 text-muted-foreground hover:text-destructive transition-colors">
                <X class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Available players sidebar -->
        <div class="space-y-3">
          <h3 class="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Available Prospects</h3>
          <input v-model="search" type="text" placeholder="Search..." class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <div class="space-y-1 max-h-[600px] overflow-y-auto">
            <button
              v-for="p in filteredAvailable"
              :key="p.slug"
              @click="addToRankings(p)"
              class="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left hover:bg-muted/50 transition-colors"
            >
              <div class="h-7 w-7 rounded-full ring-1 ring-border overflow-hidden shrink-0">
                <img :src="getPlayerImage(p.photoUrl, p.name, 56)" :alt="p.name" class="h-full w-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold truncate">{{ p.name }}</p>
                <p class="text-[10px] text-muted-foreground">{{ p.position }} · {{ p.team }}</p>
              </div>
              <span class="font-stats text-[10px] font-bold" :style="{ color: getRatingColor(p.rating) }">{{ p.rating }}</span>
            </button>
            <p v-if="filteredAvailable.length === 0" class="text-xs text-muted-foreground py-4 text-center">All prospects ranked</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden PDF template -->
    <div id="pdf-content" class="hidden">
      <div style="font-family: sans-serif; padding: 32px; max-width: 600px;">
        <h1 style="font-size: 22px; font-weight: 800; margin-bottom: 4px;">My Custom AFL Draft Rankings</h1>
        <p style="font-size: 12px; color: #666; margin-bottom: 24px;">Built on FootyScope</p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #eee;">
              <th style="text-align: left; padding: 6px 8px; font-size: 11px; color: #888;">#</th>
              <th style="text-align: left; padding: 6px 8px; font-size: 11px; color: #888;">Player</th>
              <th style="text-align: left; padding: 6px 8px; font-size: 11px; color: #888;">Pos</th>
              <th style="text-align: left; padding: 6px 8px; font-size: 11px; color: #888;">Team</th>
              <th style="text-align: right; padding: 6px 8px; font-size: 11px; color: #888;">Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, i) in ranked" :key="p.slug" style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 8px; font-weight: 700; font-size: 14px; color: #aaa;">{{ i + 1 }}</td>
              <td style="padding: 8px; font-weight: 600; font-size: 13px;">{{ p.name }}</td>
              <td style="padding: 8px; font-size: 12px; color: #555;">{{ p.position }}</td>
              <td style="padding: 8px; font-size: 12px; color: #555;">{{ p.team }}</td>
              <td style="padding: 8px; text-align: right; font-weight: 700; font-size: 13px;">{{ p.rating }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, ChevronUp, ChevronDown } from 'lucide-vue-next'
import type { Player } from '~/types'

useHead({ title: 'Custom Rankings — FootyScope' })

const allPlayers = useAllPlayers()
const search = ref('')
const copied = ref(false)
const ranked = ref<Player[]>([])

const rankedSlugs = computed(() => new Set(ranked.value.map(p => p.slug)))

const availablePlayers = computed(() => {
  const players = allPlayers.value ?? []
  return players
    .filter((p: Player) => !rankedSlugs.value.has(p.slug))
    .sort((a: Player, b: Player) => b.rating - a.rating)
})

const filteredAvailable = computed(() => {
  if (!search.value) return availablePlayers.value
  const q = search.value.toLowerCase()
  return availablePlayers.value.filter((p: Player) =>
    p.name.toLowerCase().includes(q) || p.position.toLowerCase().includes(q)
  )
})

function addToRankings(player: Player) {
  ranked.value.push(player)
}

function removeRanked(index: number) {
  ranked.value.splice(index, 1)
}

function moveUp(index: number) {
  if (index === 0) return
  const arr = [...ranked.value]
  ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
  ranked.value = arr
}

function moveDown(index: number) {
  if (index === ranked.value.length - 1) return
  const arr = [...ranked.value]
  ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
  ranked.value = arr
}

function resetRankings() {
  ranked.value = []
}

function shareRankings() {
  const lines = ranked.value.map((p, i) => `${i + 1}. ${p.name} (${p.position}, ${p.rating})`).join('\n')
  const text = `My AFL Draft Rankings\n\n${lines}\n\nBuilt on FootyScope`
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

async function downloadPdf() {
  const { default: html2pdf } = await import('html2pdf.js').catch(() => ({ default: null }))
  if (!html2pdf) {
    // Fallback: print window
    window.print()
    return
  }
  const el = document.getElementById('pdf-content')
  if (!el) return
  el.classList.remove('hidden')
  html2pdf().set({
    margin: 0,
    filename: 'my-afl-draft-rankings.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(el).save().then(() => {
    el.classList.add('hidden')
  })
}

function getRatingColor(rating: number) {
  if (rating >= 90) return 'var(--color-scope-5)'
  if (rating >= 80) return 'var(--color-scope-4)'
  if (rating >= 70) return 'var(--color-scope-3)'
  if (rating >= 60) return 'var(--color-scope-2)'
  return 'var(--color-scope-1)'
}
</script>
