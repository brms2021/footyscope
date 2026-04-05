<template>
  <div class="relative min-h-screen">
    <PageBackground />
    <div class="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-16">
    <!-- About section -->
    <section class="max-w-3xl">
      <h1 class="text-3xl font-extrabold mb-6">About FootyScope</h1>
      <div class="space-y-4 text-foreground leading-relaxed">
        <p>
          FootyScope is a data-driven AFL draft scouting platform built to fill a gap in the Australian football landscape.
          While the US has 247Sports and ESPN recruiting databases, AFL fans have lacked a structured, analytical resource for evaluating draft prospects.
        </p>
        <p>
          We provide comprehensive prospect rankings, individual player profiles with detailed scouting reports, and
          in-depth draft analysis — all presented through a modern, accessible interface.
        </p>
        <p>
          Every prospect is evaluated using our Scope Rating system, which assesses players across nine key attributes:
          Athleticism, Kicking, Marking, Ball Winning, Decision Making, Football IQ, Versatility, Competitiveness, and Ceiling.
        </p>
      </div>
    </section>

    <!-- EOI Form -->
    <section id="contact" class="max-w-2xl">
      <h2 class="text-2xl font-extrabold mb-2">Junior Scouting Reports</h2>
      <p class="text-muted-foreground mb-6">
        Interested in a personalised scouting report for a junior player? Fill out the form below and we'll be in touch.
      </p>

      <div v-if="success" class="rounded-xl border border-teal bg-teal/10 p-6 text-center">
        <p class="text-lg font-bold text-teal">Thank you!</p>
        <p class="mt-1 text-sm text-muted-foreground">Your expression of interest has been submitted. We'll be in touch soon.</p>
        <button @click="resetForm" class="mt-4 text-sm text-primary hover:text-teal-light">Submit another</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Your Name *</label>
            <input v-model="form.name" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Email *</label>
            <input v-model="form.email" type="email" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Phone</label>
            <input v-model="form.phone" type="tel" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Player Name *</label>
            <input v-model="form.playerName" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Age Group *</label>
            <input v-model="form.ageGroup" type="text" required placeholder="e.g. U16, U18" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Club *</label>
            <input v-model="form.club" type="text" required class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Message</label>
          <textarea v-model="form.message" rows="4" class="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Tell us what you're looking for..." />
        </div>

        <div v-if="error" class="text-sm text-destructive">{{ error }}</div>

        <button type="submit" :disabled="pending" class="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-teal transition-colors disabled:opacity-50">
          {{ pending ? 'Submitting...' : 'Submit Expression of Interest' }}
        </button>
      </form>
    </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useSocialMeta({
  title: 'About',
  description: 'FootyScope is a data-driven AFL draft scouting platform. Comprehensive prospect rankings, scouting reports, and draft analysis.',
  url: '/about',
})

const { submitEOI, pending, success, error, reset } = useEOI()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  playerName: '',
  ageGroup: '',
  club: '',
  message: '',
})

async function handleSubmit() {
  await submitEOI(form)
}

function resetForm() {
  reset()
  form.name = ''
  form.email = ''
  form.phone = ''
  form.playerName = ''
  form.ageGroup = ''
  form.club = ''
  form.message = ''
}
</script>
