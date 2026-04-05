<template>
  <div class="p-6 lg:p-8 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold">Players</h1>
      <NuxtLink to="/admin/players/new" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors">
        <Plus class="h-4 w-4" /> Add Player
      </NuxtLink>
    </div>

    <div class="rounded-xl border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border bg-muted/30">
            <th class="px-4 py-3 text-left font-medium text-muted-foreground">Player</th>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Position</th>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Team</th>
            <th class="px-4 py-3 text-center font-medium text-muted-foreground">Rating</th>
            <th class="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            <th class="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in sortedPlayers" :key="player.id" class="border-b border-border/50 hover:bg-muted/20">
            <td class="px-4 py-3 font-medium">{{ player.name }}</td>
            <td class="px-4 py-3 text-muted-foreground hidden sm:table-cell">{{ player.position }}</td>
            <td class="px-4 py-3 text-muted-foreground hidden md:table-cell">{{ player.team }}</td>
            <td class="px-4 py-3 text-center font-stats font-bold" :style="{ color: getRatingColor(player.rating) }">{{ player.rating }}</td>
            <td class="px-4 py-3">
              <span :class="['inline-flex px-2 py-0.5 rounded-full text-xs font-medium', player.published ? 'bg-teal/20 text-teal' : 'bg-muted text-muted-foreground']">
                {{ player.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-3">
              <NuxtLink :to="`/admin/players/${player.id}`" class="text-primary hover:text-teal-light text-sm">Edit</NuxtLink>
              <button @click="handleDelete(player.id)" class="text-destructive hover:text-red-400 text-sm">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()

const sortedPlayers = computed(() =>
  [...store.players.value].sort((a, b) => b.rating - a.rating)
)

function getRatingColor(rating: number) {
  if (rating >= 90) return 'var(--color-scope-5)'
  if (rating >= 80) return 'var(--color-scope-4)'
  if (rating >= 70) return 'var(--color-scope-3)'
  if (rating >= 60) return 'var(--color-scope-2)'
  return 'var(--color-scope-1)'
}

function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this player?')) {
    store.deletePlayer(id)
  }
}
</script>
