import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
config({ path: resolve(__dirname, '../.env') })

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!)
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// Article cover images — using Unsplash (freely licensed)
const articleImages: Record<string, string> = {
  '2026-draft-class-overview': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=450&fit=crop',
  'dougie-cochrane-scouting-report': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop',
  'talent-league-round-1-review': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=450&fit=crop',
  'father-son-academy-guide-2026': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=450&fit=crop',
  'footyscope-rating-methodology': 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=450&fit=crop',
}

// Player profile images — DiceBear initials avatars with sport-themed styling
// These generate unique, consistent avatars based on the player name
function getPlayerAvatar(name: string): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1a2332&textColor=2d9d78&fontSize=36&size=256`
}

async function addImages() {
  console.log('🖼️  Adding images to Firestore...\n')

  // Update articles
  const articlesSnap = await db.collection('articles').get()
  for (const doc of articlesSnap.docs) {
    const slug = doc.data().slug
    const imageUrl = articleImages[slug]
    if (imageUrl) {
      await doc.ref.update({ coverImageUrl: imageUrl })
      console.log(`  ✓ Article cover: ${slug}`)
    }
  }

  // Update players with DiceBear avatars
  const playersSnap = await db.collection('players').get()
  for (const doc of playersSnap.docs) {
    const name = doc.data().name
    const avatarUrl = getPlayerAvatar(name)
    await doc.ref.update({ photoUrl: avatarUrl })
    console.log(`  ✓ Player avatar: ${name}`)
  }

  console.log('\n✅ Images added!')
}

addImages().catch(console.error)
