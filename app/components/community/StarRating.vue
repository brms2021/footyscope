<template>
  <div class="inline-flex items-center gap-0.5">
    <button
      v-for="i in 5"
      :key="i"
      type="button"
      :disabled="readonly"
      @click="!readonly && emit('update:modelValue', i)"
      :class="[readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform']"
    >
      <Star
        :class="[
          sizeClass,
          i <= (modelValue ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30',
          !readonly && 'hover:text-amber-400',
        ]"
      />
    </button>
    <span v-if="showValue && modelValue" class="ml-1.5 font-stats text-xs text-muted-foreground">{{ modelValue }}/5</span>
  </div>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = defineProps<{
  modelValue?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const sizeClass = computed(() => ({
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}[props.size ?? 'md']))
</script>
