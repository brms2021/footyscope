<template>
  <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/logo.svg" alt="FootyScope" class="h-8 w-8" />
        <span class="font-heading text-xl font-extrabold tracking-tight text-cream">FOOTYSCOPE</span>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {{ link.label }}
        </NuxtLink>
        <ColorModeToggle />
        <template v-if="user">
          <span class="text-xs text-muted-foreground truncate max-w-[150px]" :title="user.email ?? ''">
            {{ user.displayName || user.email }}
          </span>
          <NuxtLink
            v-if="isStaff"
            to="/admin"
            class="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary/10 px-3 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <UserCog class="h-3.5 w-3.5" />
            Admin
          </NuxtLink>
          <button
            @click="handleLogout"
            class="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
          >
            <LogOutIcon class="h-3.5 w-3.5" />
            Logout
          </button>
        </template>
        <NuxtLink
          v-else
          to="/admin/login"
          class="inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
        >
          <LogIn class="h-3.5 w-3.5" />
          Login
        </NuxtLink>
      </nav>

      <!-- Mobile -->
      <div class="md:hidden flex items-center gap-2">
        <ColorModeToggle />
        <MobileNav :links="navLinks" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { LogIn, LogOut as LogOutIcon, UserCog } from 'lucide-vue-next'

const { user, isStaff, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/')
}

const navLinks = [
  { label: 'Rankings', to: '/rankings' },
  { label: 'Articles', to: '/articles' },
  { label: 'Compare', to: '/tools/compare' },
  { label: 'Custom Rankings', to: '/tools/custom-rankings' },
  { label: 'Consensus', to: '/tools/consensus' },
]
</script>
