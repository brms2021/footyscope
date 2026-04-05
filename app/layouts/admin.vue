<template>
  <div class="min-h-screen flex bg-background text-foreground">
    <!-- Sidebar -->
    <aside class="hidden lg:flex w-64 flex-col border-r border-border bg-card">
      <div class="flex h-16 items-center gap-2 border-b border-border px-6">
        <NuxtLink to="/" class="font-heading text-lg font-bold text-primary">FOOTYSCOPE</NuxtLink>
        <span class="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Admin</span>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          active-class="!text-primary !bg-primary/10"
        >
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="border-t border-border p-4">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft class="h-4 w-4" />
          Back to site
        </NuxtLink>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin" class="font-heading text-lg font-bold text-primary">FS</NuxtLink>
        <span class="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">Admin</span>
      </div>
      <button @click="mobileOpen = !mobileOpen" class="text-muted-foreground hover:text-foreground">
        <Menu class="h-5 w-5" />
      </button>
    </div>

    <!-- Mobile nav overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="mobileOpen" class="fixed inset-0 z-50 bg-black/60 lg:hidden" @click="mobileOpen = false" />
      </Transition>
      <Transition name="slide">
        <div v-if="mobileOpen" class="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border lg:hidden">
          <div class="flex h-14 items-center justify-between border-b border-border px-4">
            <span class="font-heading text-lg font-bold text-primary">FOOTYSCOPE</span>
            <button @click="mobileOpen = false" class="text-muted-foreground"><X class="h-5 w-5" /></button>
          </div>
          <nav class="p-4 space-y-1">
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              active-class="!text-primary !bg-primary/10"
              @click="mobileOpen = false"
            >
              <component :is="item.icon" class="h-4 w-4" />
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
      </Transition>
    </Teleport>

    <!-- Main content -->
    <main class="flex-1 lg:overflow-auto">
      <div class="pt-14 lg:pt-0">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, FileText, Users, Trophy, Mail, MessageSquare, Shield, ArrowLeft, Menu, X } from 'lucide-vue-next'

const { isOwner } = useAuth()
const mobileOpen = ref(false)

const allNavItems = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, ownerOnly: false },
  { label: 'Articles', to: '/admin/articles', icon: FileText, ownerOnly: false },
  { label: 'Players', to: '/admin/players', icon: Users, ownerOnly: true },
  { label: 'Rankings', to: '/admin/rankings', icon: Trophy, ownerOnly: true },
  { label: 'Reports', to: '/admin/reports', icon: MessageSquare, ownerOnly: false },
  { label: 'Moderators', to: '/admin/moderators', icon: Shield, ownerOnly: true },
  { label: 'Submissions', to: '/admin/submissions', icon: Mail, ownerOnly: true },
]

const navItems = computed(() => allNavItems.filter(item => !item.ownerOnly || isOwner.value))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
