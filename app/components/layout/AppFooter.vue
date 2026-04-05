<template>
  <footer class="border-t border-border bg-background">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Newsletter -->
      <div class="mb-8 rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex-1">
          <h3 class="font-heading text-sm font-bold text-foreground">Stay across the draft</h3>
          <p class="text-xs text-muted-foreground mt-0.5">Rankings updates, new scouting reports, and draft analysis — straight to your inbox.</p>
        </div>
        <form v-if="!nlSuccess" @submit.prevent="subscribeNewsletter" class="flex gap-2 w-full sm:w-auto">
          <input v-model="nlEmail" type="email" required placeholder="you@email.com" class="rounded-lg border border-input bg-background px-3 py-2 text-sm w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-ring" />
          <button type="submit" :disabled="nlPending" class="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors disabled:opacity-50">
            {{ nlPending ? '...' : 'Subscribe' }}
          </button>
        </form>
        <p v-else class="text-sm text-teal font-medium">Subscribed!</p>
      </div>

      <div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <div class="flex flex-col items-center gap-2 md:items-start">
          <span class="font-heading text-lg font-bold text-primary">FOOTYSCOPE</span>
          <p class="text-sm text-muted-foreground">AFL Draft Scouting & Analytics</p>
        </div>
        <nav class="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <div class="flex items-center gap-6">
            <NuxtLink to="/about" class="text-sm text-muted-foreground hover:text-primary transition-colors">About</NuxtLink>
            <NuxtLink to="/about#contact" class="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</NuxtLink>
            <NuxtLink to="/links" class="text-sm text-muted-foreground hover:text-primary transition-colors">Links</NuxtLink>
          </div>
          <div class="flex items-center gap-3">
            <a href="https://instagram.com/footyscope" target="_blank" rel="noopener" class="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
              <IconInstagram class="h-5 w-5" />
            </a>
            <a href="https://x.com/footyscope" target="_blank" rel="noopener" class="text-muted-foreground hover:text-primary transition-colors" aria-label="X / Twitter">
              <IconTwitter class="h-5 w-5" />
            </a>
            <a href="https://tiktok.com/@footyscope" target="_blank" rel="noopener" class="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
              <IconTikTok class="h-5 w-5" />
            </a>
            <a href="https://facebook.com/footyscope" target="_blank" rel="noopener" class="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
              <IconFacebook class="h-5 w-5" />
            </a>
          </div>
        </nav>
      </div>
      <div class="mt-8 border-t border-border pt-6 text-center">
        <p class="text-xs text-muted-foreground">&copy; {{ new Date().getFullYear() }} FootyScope. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Instagram as IconInstagram } from 'lucide-vue-next'
import { collection, addDoc } from 'firebase/firestore'

const nlEmail = ref('')
const nlPending = ref(false)
const nlSuccess = ref(false)

async function subscribeNewsletter() {
  if (!nlEmail.value) return
  nlPending.value = true
  try {
    const db = useFirestore()
    await addDoc(collection(db, 'newsletterSubscribers'), {
      email: nlEmail.value.trim().toLowerCase(),
      subscribedAt: new Date().toISOString(),
    })
    nlSuccess.value = true
    nlEmail.value = ''
  } catch (e) {
    console.error('Newsletter signup failed:', e)
  } finally {
    nlPending.value = false
  }
}
</script>
