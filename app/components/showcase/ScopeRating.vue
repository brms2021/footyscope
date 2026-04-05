<template>
  <div class="flex flex-col items-center gap-1" :class="sizeClasses.wrapper">
    <!-- Circular ring -->
    <div class="relative" :class="sizeClasses.ring">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
        <!-- Background circle -->
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="6" class="text-muted" />
        <!-- Progress arc -->
        <circle
          cx="50" cy="50" r="42"
          fill="none"
          :stroke="tierColor"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="circumference - (circumference * rating) / 100"
          class="transition-all duration-1000 ease-out"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="font-stats font-bold" :class="[sizeClasses.number, `text-[${tierColor}]`]" :style="{ color: tierColor }">
          {{ rating }}
        </span>
      </div>
    </div>
    <!-- Tier label -->
    <span class="font-heading text-center leading-tight" :class="sizeClasses.label" :style="{ color: tierColor }">
      {{ tierLabel }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  rating: number
  size?: 'sm' | 'md' | 'lg'
}>()

const circumference = 2 * Math.PI * 42

const tierColor = computed(() => {
  if (props.rating >= 90) return 'var(--color-scope-5)'
  if (props.rating >= 80) return 'var(--color-scope-4)'
  if (props.rating >= 70) return 'var(--color-scope-3)'
  if (props.rating >= 60) return 'var(--color-scope-2)'
  return 'var(--color-scope-1)'
})

const tierLabel = computed(() => {
  if (props.rating >= 90) return 'Elite'
  if (props.rating >= 80) return 'Premium'
  if (props.rating >= 70) return 'Quality'
  if (props.rating >= 60) return 'Developing'
  return 'Watch List'
})

const size = computed(() => props.size ?? 'md')

const sizeClasses = computed(() => ({
  wrapper: { sm: 'w-14', md: 'w-20', lg: 'w-28' }[size.value],
  ring: { sm: 'w-12 h-12', md: 'w-18 h-18', lg: 'w-24 h-24' }[size.value],
  number: { sm: 'text-xs', md: 'text-base', lg: 'text-xl' }[size.value],
  label: { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' }[size.value],
}))
</script>
