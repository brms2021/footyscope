<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="text-center">
        <h1 class="font-heading text-2xl font-extrabold text-primary">FOOTYSCOPE</h1>
        <p class="mt-1 text-sm text-muted-foreground">Admin Login</p>
      </div>

      <!-- Google Sign In -->
      <button
        @click="handleGoogle"
        :disabled="pending"
        class="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <div class="relative">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-border" /></div>
        <div class="relative flex justify-center text-xs"><span class="bg-background px-2 text-muted-foreground">or</span></div>
      </div>

      <!-- Email/Password -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@example.com"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Password</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="pending"
          class="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors disabled:opacity-50"
        >
          {{ pending ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-muted-foreground hover:text-primary transition-colors">← Back to site</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { login, loginWithGoogle, error, user } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const pending = ref(false)

watch(user, (u) => {
  if (u) router.push('/admin')
}, { immediate: true })

async function handleGoogle() {
  pending.value = true
  try {
    await loginWithGoogle()
  } catch {
    // error is set in useAuth
  } finally {
    pending.value = false
  }
}

async function handleLogin() {
  pending.value = true
  try {
    await login(email.value, password.value)
  } catch {
    // error is set in useAuth
  } finally {
    pending.value = false
  }
}
</script>
