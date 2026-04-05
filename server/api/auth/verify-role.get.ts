import { getFirestore } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const ownerEmails = config.ownerEmails
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean)

  const userEmail = getHeader(event, 'x-user-email')?.toLowerCase() ?? ''
  if (!userEmail) return { role: 'user' }

  // Check owners (env-based)
  if (ownerEmails.includes(userEmail)) {
    return { role: 'owner' }
  }

  // Check moderators (Firestore)
  try {
    const db = getFirestore()
    const doc = await db.collection('roles').doc(userEmail).get()
    if (doc.exists && doc.data()?.role === 'moderator') {
      return { role: 'moderator' }
    }
  } catch {
    // Firestore not available or error — fall through to user
  }

  return { role: 'user' }
})
