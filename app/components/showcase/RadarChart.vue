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
} from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  attributes: number[]
  playerName?: string
}>()

const labels = [
  'Speed / Agility',
  'Strength / Power',
  'Work Rate',
  'Kicking',
  'Marking',
  'Ball Winning',
  'Football IQ',
  'Versatility',
  'Competitiveness',
  'Ceiling',
]

const chartData = computed(() => ({
  labels,
  datasets: [
    {
      label: props.playerName ?? 'Player',
      data: props.attributes,
      backgroundColor: 'rgba(45, 157, 120, 0.15)',
      borderColor: '#2d9d78',
      borderWidth: 2,
      pointBackgroundColor: '#2d9d78',
      pointBorderColor: '#2d9d78',
      pointRadius: 4,
      pointHoverRadius: 6,
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
      ticks: {
        stepSize: 20,
        display: false,
      },
      grid: {
        color: colorMode.value === 'dark' ? 'rgba(240, 230, 211, 0.1)' : 'rgba(26, 35, 50, 0.1)',
      },
      angleLines: {
        color: colorMode.value === 'dark' ? 'rgba(240, 230, 211, 0.1)' : 'rgba(26, 35, 50, 0.1)',
      },
      pointLabels: {
        color: colorMode.value === 'dark' ? '#d9cbb3' : '#1a2332',
        font: { size: 11, family: 'Inter' },
      },
    },
  },
  plugins: {
    tooltip: {
      backgroundColor: '#1a2332',
      titleColor: '#f0e6d3',
      bodyColor: '#f0e6d3',
      borderColor: '#2d9d78',
      borderWidth: 1,
    },
  },
}))
</script>
