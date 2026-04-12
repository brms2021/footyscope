<template>
  <ClientOnly>
    <div class="w-full max-w-md mx-auto">
      <Radar :data="chartData" :options="chartOptions" />
    </div>
    <template #fallback>
      <div class="w-full max-w-md mx-auto h-80 rounded-xl bg-muted/50 animate-pulse" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import type { Player } from '~/types'
import { getAttributesArray } from '~/types'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{
  playerA: Player
  playerB: Player
}>()

const labels = ['Speed / Agility', 'Strength / Power', 'Work Rate', 'Kicking', 'Marking', 'Ball Winning', 'Football IQ', 'Versatility', 'Competitiveness', 'Ceiling']

const chartData = computed(() => ({
  labels,
  datasets: [
    {
      label: props.playerA.name,
      data: getAttributesArray(props.playerA.attributes),
      backgroundColor: 'rgba(45, 157, 120, 0.15)',
      borderColor: '#2d9d78',
      borderWidth: 2,
      pointBackgroundColor: '#2d9d78',
      pointRadius: 3,
    },
    {
      label: props.playerB.name,
      data: getAttributesArray(props.playerB.attributes),
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: '#f59e0b',
      borderWidth: 2,
      pointBackgroundColor: '#f59e0b',
      pointRadius: 3,
    },
  ],
}))

const colorMode = useColorMode()

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      ticks: { stepSize: 20, display: false },
      grid: { color: colorMode.value === 'dark' ? 'rgba(240, 230, 211, 0.1)' : 'rgba(26, 35, 50, 0.1)' },
      angleLines: { color: colorMode.value === 'dark' ? 'rgba(240, 230, 211, 0.1)' : 'rgba(26, 35, 50, 0.1)' },
      pointLabels: { color: colorMode.value === 'dark' ? '#d9cbb3' : '#1a2332', font: { size: 10, family: 'Inter' } },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: { color: colorMode.value === 'dark' ? '#d9cbb3' : '#1a2332', font: { size: 12, family: 'Inter' }, padding: 20 },
    },
    tooltip: { backgroundColor: '#1a2332', titleColor: '#f0e6d3', bodyColor: '#f0e6d3', borderColor: '#2d9d78', borderWidth: 1 },
  },
}))
</script>
