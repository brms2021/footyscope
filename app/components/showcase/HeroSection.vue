<template>
  <section class="relative overflow-hidden bg-navy-dark py-24 sm:py-32">
    <!-- Background layers -->
    <div class="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-teal/10" />
    <img src="/general-stadium-photo.jpg" alt="" class="absolute inset-0 h-full w-full object-cover opacity-15" />
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-teal)_0%,_transparent_50%)] opacity-10" />
    <!-- Grid pattern -->
    <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" />
    <!-- Floating scope crosshairs -->
    <div class="absolute top-10 left-[10%] w-32 h-32 opacity-[0.04] rotate-12">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" stroke="white" stroke-width="2"/>
        <line x1="50" y1="10" x2="50" y2="30" stroke="white" stroke-width="2"/>
        <line x1="50" y1="70" x2="50" y2="90" stroke="white" stroke-width="2"/>
        <line x1="10" y1="50" x2="30" y2="50" stroke="white" stroke-width="2"/>
        <line x1="70" y1="50" x2="90" y2="50" stroke="white" stroke-width="2"/>
      </svg>
    </div>
    <div class="absolute bottom-16 right-[8%] w-48 h-48 opacity-[0.03] -rotate-6">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" stroke="white" stroke-width="1.5"/>
        <circle cx="50" cy="50" r="20" stroke="white" stroke-width="1"/>
        <line x1="50" y1="5" x2="50" y2="25" stroke="white" stroke-width="1.5"/>
        <line x1="50" y1="75" x2="50" y2="95" stroke="white" stroke-width="1.5"/>
        <line x1="5" y1="50" x2="25" y2="50" stroke="white" stroke-width="1.5"/>
        <line x1="75" y1="50" x2="95" y2="50" stroke="white" stroke-width="1.5"/>
      </svg>
    </div>
    <!-- Glow orbs -->
    <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal/5 blur-3xl" />
    <div class="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal/3 blur-3xl" />

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
      <p class="text-sm font-medium uppercase tracking-widest text-teal mb-4">AFL Draft Scouting & Analytics</p>
      <h1 class="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-cream leading-tight">
        2026 AFL Draft
        <span class="block bg-gradient-to-r from-teal to-teal-light bg-clip-text text-transparent">Prospects</span>
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-cream-dark/80">
        Data-driven scouting reports, prospect rankings, and draft analysis.
        The most comprehensive AFL draft resource.
      </p>
      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/rankings"
          class="inline-flex h-12 items-center justify-center rounded-lg bg-teal px-8 text-sm font-semibold text-navy-dark hover:bg-teal-light transition-colors"
        >
          View Rankings
        </NuxtLink>
        <NuxtLink
          to="/articles"
          class="inline-flex h-12 items-center justify-center rounded-lg border border-cream/20 px-8 text-sm font-semibold text-cream hover:bg-cream/10 transition-colors"
        >
          Latest Articles
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style>
.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.1;
}
</style>