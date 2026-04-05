import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export type UserRole = 'owner' | 'moderator' | 'user'

// Owner emails - loaded from runtime config
const OWNER_EMAILS = ['rieleyjc@outlook.com', 'brandtmatstevenson@gmail.com', 'brandt@quotehound.com.au']

const _role = ref<UserRole>('user')
const _roleLoaded = ref(false)

export function useAuth() {
  const user = useCurrentUser()
  const error = ref<string | null>(null)

  const isOwner = computed(() => _role.value === 'owner')
  const isMod = computed(() => _role.value === 'moderator')
  const isStaff = computed(() => _role.value === 'owner' || _role.value === 'moderator')
  const role = computed(() => _role.value)

  if (import.meta.client) {
    watch(user, async (u) => {
      if (u?.email) {
        await fetchRole(u.email)
      } else {
        _role.value = 'user'
        _roleLoaded.value = false
      }
    }, { immediate: true })
  }

  async function fetchRole(email: string) {
    const lower = email.toLowerCase()

    // Check owners
    if (OWNER_EMAILS.map(e => e.toLowerCase()).includes(lower)) {
      _role.value = 'owner'
      _roleLoaded.value = true
      return
    }

    // Check moderators in Firestore
    try {
      const db = useFirestore()
      const roleDoc = await getDoc(doc(db, 'roles', lower))
      if (roleDoc.exists() && roleDoc.data()?.role === 'moderator') {
        _role.value = 'moderator'
        _roleLoaded.value = true
        return
      }
    } catch {}

    _role.value = 'user'
    _roleLoaded.value = true
  }

  async function login(email: string, password: string) {
    const auth = useFirebaseAuth()
    if (!auth) return
    error.value = null
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: any) {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
        error.value = 'Invalid email or password'
      } else {
        error.value = e.message ?? 'Login failed'
      }
      throw e
    }
  }

  async function loginWithGoogle() {
    const auth = useFirebaseAuth()
    if (!auth) return
    error.value = null
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user') return
      error.value = e.message ?? 'Google sign-in failed'
      throw e
    }
  }

  async function logout() {
    const auth = useFirebaseAuth()
    if (!auth) return
    await signOut(auth)
    _role.value = 'user'
    _roleLoaded.value = false
  }

  return { user, role, isOwner, isMod, isStaff, error, login, loginWithGoogle, logout, roleLoaded: _roleLoaded }
}
