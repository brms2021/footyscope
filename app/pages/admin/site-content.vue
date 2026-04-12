<template>
  <div class="p-6 lg:p-8 space-y-6 max-w-3xl">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-extrabold">Site Content</h1>
      <NuxtLink to="/admin" class="text-sm text-muted-foreground hover:text-primary transition-colors">← Dashboard</NuxtLink>
    </div>

    <p class="text-sm text-muted-foreground">Edit the editable text snippets and disclaimers shown around the site.</p>

    <form @submit.prevent="save" class="space-y-6">
      <!-- Homepage header -->
      <section class="space-y-3 rounded-xl border border-border bg-card p-5">
        <h2 class="text-base font-bold">Homepage Header</h2>
        <p class="text-xs text-muted-foreground">The main headline shown on the homepage hero section.</p>
        <input v-model="form.homepageHeader" type="text" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Australia's Premier AFL Draft Hub" />
      </section>

      <!-- Consensus disclaimer -->
      <section class="space-y-3 rounded-xl border border-border bg-card p-5">
        <h2 class="text-base font-bold">Consensus Rankings Disclaimer</h2>
        <p class="text-xs text-muted-foreground">Displayed below the consensus rankings table. Include sources, dates, and attribution.</p>
        <textarea v-model="form.consensusDisclaimer" rows="4" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Rankings sourced from publicly available phantom drafts and prospect rankings. Last updated: March 2026. Sources: FootyScope, AFL.com.au (Cal Twomey), ESPN (Knightmare), Rookie Me Central, The Mongrel Punt." />
      </section>

      <div class="flex items-center gap-4">
        <button type="submit" :disabled="saving" class="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors disabled:opacity-60">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
        <p v-if="saved" class="text-sm text-teal">Saved successfully.</p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['admin'] })

const store = useAdminStore()

const form = reactive({
  homepageHeader: store.siteContent.value?.homepageHeader ?? '',
  consensusDisclaimer: store.siteContent.value?.consensusDisclaimer ?? '',
})

watch(() => store.siteContent.value, (val) => {
  if (val) {
    form.homepageHeader = val.homepageHeader ?? ''
    form.consensusDisclaimer = val.consensusDisclaimer ?? ''
  }
}, { once: true })

const saving = ref(false)
const saved = ref(false)

async function save() {
  saving.value = true
  saved.value = false
  await store.saveSiteContent({ ...form })
  saving.value = false
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
}
</script>
