import { collection, addDoc } from 'firebase/firestore'
import type { EOISubmission } from '~/types'

export function useEOI() {
  const pending = ref(false)
  const success = ref(false)
  const error = ref<string | null>(null)

  async function submitEOI(data: Omit<EOISubmission, 'id' | 'createdAt' | 'read'>) {
    pending.value = true
    error.value = null
    success.value = false

    try {
      const db = useFirestore()
      await addDoc(collection(db, 'eoiSubmissions'), {
        ...data,
        createdAt: new Date().toISOString(),
        read: false,
      })
      success.value = true
    } catch (e: any) {
      error.value = e.message ?? 'Failed to submit. Please try again.'
    } finally {
      pending.value = false
    }
  }

  function reset() {
    success.value = false
    error.value = null
  }

  return { submitEOI, pending, success, error, reset }
}
