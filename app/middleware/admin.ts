const OWNER_ONLY_PATHS = ['/admin/players', '/admin/rankings', '/admin/submissions', '/admin/moderators']

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return
  if (import.meta.server) return

  const { user, isStaff, isOwner, roleLoaded } = useAuth()

  // Wait for auth to resolve
  if (user.value === undefined) {
    await new Promise<void>((resolve) => {
      const stop = watch(user, () => { stop(); resolve() })
    })
  }

  if (!user.value) {
    return navigateTo('/admin/login')
  }

  // Wait for role to load
  if (!roleLoaded.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(roleLoaded, (v) => { if (v) { stop(); resolve() } })
    })
  }

  // Must be at least staff (owner or mod) to access /admin
  if (!isStaff.value) {
    return navigateTo('/')
  }

  // Owner-only pages
  if (OWNER_ONLY_PATHS.some(p => to.path.startsWith(p)) && !isOwner.value) {
    return navigateTo('/admin')
  }
})
