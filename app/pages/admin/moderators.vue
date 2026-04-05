<template>
  <div class="p-6 lg:p-8 space-y-6">
    <h1 class="text-2xl font-extrabold">Moderators</h1>
    <p class="text-sm text-muted-foreground">Moderators can create/edit articles and approve community reports.</p>

    <!-- Add moderator -->
    <form @submit.prevent="addMod" class="flex gap-3 max-w-md">
      <input
        v-model="newEmail"
        type="email"
        required
        placeholder="moderator@email.com"
        class="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button type="submit" :disabled="adding" class="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors disabled:opacity-50">
        {{ adding ? 'Adding...' : 'Add' }}
      </button>
    </form>

    <div v-if="error" class="text-sm text-destructive">{{ error }}</div>

    <!-- Moderators list -->
    <div v-if="moderators.length === 0" class="text-sm text-muted-foreground py-8">
      No moderators added yet.
    </div>

    <div v-else class="space-y-2 max-w-lg">
      <div v-for="mod in moderators" :key="mod.email" class="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
        <div>
          <p class="text-sm font-medium">{{ mod.email }}</p>
          <p class="text-xs text-muted-foreground">Added {{ formatDate(mod.createdAt) }} by {{ mod.addedBy }}</p>
        </div>
        <button @click="removeMod(mod.email)" class="text-xs text-destructive hover:text-red-400 transition-colors">Remove</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore'

definePageMeta({ layout: 'admin', middleware: ['admin'] })

const { user } = useAuth()

interface Moderator {
  email: string
  role: string
  addedBy: string
  createdAt: string
}

const moderators = ref<Moderator[]>([])
const newEmail = ref('')
const adding = ref(false)
const error = ref<string | null>(null)

onMounted(loadModerators)

async function loadModerators() {
  const db = useFirestore()
  const snap = await getDocs(collection(db, 'roles'))
  moderators.value = snap.docs
    .map(d => d.data() as Moderator)
    .filter(m => m.role === 'moderator')
    .sort((a, b) => a.email.localeCompare(b.email))
}

async function addMod() {
  const email = newEmail.value.trim().toLowerCase()
  if (!email) return
  adding.value = true
  error.value = null
  try {
    const db = useFirestore()
    await setDoc(doc(db, 'roles', email), {
      email,
      role: 'moderator',
      addedBy: user.value?.email ?? 'unknown',
      createdAt: new Date().toISOString(),
    })
    newEmail.value = ''
    await loadModerators()
  } catch (e: any) {
    error.value = e.message ?? 'Failed to add moderator'
  } finally {
    adding.value = false
  }
}

async function removeMod(email: string) {
  if (!confirm(`Remove ${email} as moderator?`)) return
  try {
    const db = useFirestore()
    await deleteDoc(doc(db, 'roles', email))
    await loadModerators()
  } catch (e: any) {
    error.value = e.message ?? 'Failed to remove moderator'
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
