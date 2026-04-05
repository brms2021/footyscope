<template>
  <div />
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'

const user = useCurrentUser()
const auth = useFirebaseAuth()
const config = useRuntimeConfig()
const clientId = config.public.googleClientId as string

onMounted(() => {
  if (user.value || !clientId || !auth) return

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        try {
          const credential = GoogleAuthProvider.credential(response.credential)
          await signInWithCredential(auth, credential)
        } catch (e) {
          console.error('One Tap sign-in failed:', e)
        }
      },
      auto_select: true,
      cancel_on_tap_outside: false,
      use_fedcm_for_prompt: false,
    })
    window.google.accounts.id.prompt()
  }
  document.head.appendChild(script)
})

watch(user, (u) => {
  if (u && window.google?.accounts?.id) {
    window.google.accounts.id.cancel()
  }
})
</script>
