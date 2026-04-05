<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <AppHeader />
    <ClientOnly>
      <GoogleOneTap />
    </ClientOnly>
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
