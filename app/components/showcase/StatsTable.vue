<template>
  <div class="overflow-x-auto rounded-xl border border-border">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-border bg-muted/50">
          <th
            v-for="col in columns"
            :key="col.key"
            class="px-4 py-3 text-left font-heading text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-primary transition-colors"
            :class="{ 'sticky left-0 z-10 bg-muted/80 backdrop-blur': col.key === 'name' }"
            @click="sort(col.key)"
          >
            <span class="inline-flex items-center gap-1">
              {{ col.label }}
              <IconChevronUp v-if="sortKey === col.key && sortDir === 'asc'" class="h-3 w-3" />
              <IconChevronDown v-else-if="sortKey === col.key && sortDir === 'desc'" class="h-3 w-3" />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in sortedData"
          :key="row.name"
          class="border-b border-border/50 transition-colors hover:bg-muted/30"
          :class="{ 'bg-muted/20': i % 2 === 1 }"
        >
          <td class="sticky left-0 z-10 bg-card px-4 py-3 font-medium text-foreground">{{ row.name }}</td>
          <td class="px-4 py-3 font-stats text-foreground">{{ row.height }}</td>
          <td class="px-4 py-3 font-stats text-foreground">{{ row.weight }}</td>
          <td class="px-4 py-3 font-stats" :class="isBest(row.sprint, 'sprint') ? 'text-teal font-bold' : 'text-foreground'">{{ row.sprint }}s</td>
          <td class="px-4 py-3 font-stats" :class="isBest(row.agility, 'agility') ? 'text-teal font-bold' : 'text-foreground'">{{ row.agility }}s</td>
          <td class="px-4 py-3 font-stats" :class="isBest(row.vertJump, 'vertJump') ? 'text-teal font-bold' : 'text-foreground'">{{ row.vertJump }}cm</td>
          <td class="px-4 py-3 font-stats" :class="isBest(row.twoKm, 'twoKm') ? 'text-teal font-bold' : 'text-foreground'">{{ row.twoKm }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ChevronUp as IconChevronUp, ChevronDown as IconChevronDown } from 'lucide-vue-next'

const columns = [
  { key: 'name', label: 'Player' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'sprint', label: '20m Sprint' },
  { key: 'agility', label: 'Agility' },
  { key: 'vertJump', label: 'Vert Jump' },
  { key: 'twoKm', label: '2km TT' },
]

const data = ref([
  { name: 'Jaxon Bragg', height: '191cm', weight: '84kg', sprint: 2.96, agility: 8.12, vertJump: 68, twoKm: '6:15' },
  { name: 'Eli Parker', height: '185cm', weight: '78kg', sprint: 2.89, agility: 7.98, vertJump: 72, twoKm: '6:02' },
  { name: 'Noah Fielding', height: '194cm', weight: '90kg', sprint: 3.05, agility: 8.34, vertJump: 65, twoKm: '6:28' },
  { name: 'Taj Morrison', height: '180cm', weight: '75kg', sprint: 2.84, agility: 7.85, vertJump: 74, twoKm: '5:55' },
  { name: 'Lachie Dunn', height: '188cm', weight: '82kg', sprint: 2.92, agility: 8.05, vertJump: 70, twoKm: '6:10' },
  { name: 'Sam Whitford', height: '196cm', weight: '92kg', sprint: 3.10, agility: 8.45, vertJump: 62, twoKm: '6:35' },
])

const sortKey = ref('name')
const sortDir = ref<'asc' | 'desc'>('asc')

function sort(key: string) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const sortedData = computed(() => {
  const d = [...data.value]
  d.sort((a: any, b: any) => {
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
    return sortDir.value === 'asc' ? cmp : -cmp
  })
  return d
})

const bestValues = computed(() => ({
  sprint: Math.min(...data.value.map(d => d.sprint)),
  agility: Math.min(...data.value.map(d => d.agility)),
  vertJump: Math.max(...data.value.map(d => d.vertJump)),
  twoKm: data.value.reduce((best, d) => d.twoKm < best ? d.twoKm : best, '99:99'),
}))

function isBest(val: any, key: string) {
  return val === (bestValues.value as any)[key]
}
</script>
