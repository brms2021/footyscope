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

// Real player photos sourced from Rookie Me Central / AFL media
const playerPhotos: Record<string, string> = {
  'dougie-cochrane': 'https://cdn.central.rookieme.com/wp-content/uploads/2024/07/SA-Dougie-Cochrane-MVP.jpg',
  'cody-walker': 'https://cdn.central.rookieme.com/wp-content/uploads/2024/07/Cody-Walker-VC-2024-AFL-U16s-1.jpg',
  'harry-van-hattum': 'https://cdn.central.rookieme.com/wp-content/uploads/2026/03/Harry-Van-Hattum-Northern-Knights-2026-preseason-testing.jpg',
  'arki-butler': 'https://cdn.central.rookieme.com/wp-content/uploads/2026/03/Arki-Butler-R1-POTW.jpg',
  'marlon-neocleous': 'https://cdn.central.rookieme.com/wp-content/uploads/2026/02/RM-Central_Race-to-Number-1-02.jpg',
  'jack-pickett': 'https://cdn.central.rookieme.com/wp-content/uploads/2025/09/Jack-Pickett-GF-1-2025-CTL.jpg',
  'lucas-robinson': 'https://cdn.central.rookieme.com/wp-content/uploads/2024/07/Lucas-Robinson-WA-MVP-2024-AFL-U16s.jpg',
  'kodah-edwards': '', // No image found yet — keep DiceBear
  'koby-lecras': 'https://cdn.central.rookieme.com/wp-content/uploads/2024/07/Koby-LeCras-WA-2024-AFL-U16s.jpg',
  'heath-mellody': '', // No individual photo found yet
}

// DiceBear fallback for players without photos
function getDiceBear(name: string): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1a2332&textColor=2d9d78&fontSize=36&size=256`
}

async function updateImages() {
  console.log('🖼️  Updating player images in Firestore...\n')

  const playersSnap = await db.collection('players').get()
  for (const doc of playersSnap.docs) {
    const slug = doc.data().slug
    const name = doc.data().name
    const photoUrl = playerPhotos[slug]

    if (photoUrl) {
      await doc.ref.update({ photoUrl })
      console.log(`  ✓ ${name}: real photo`)
    } else {
      const fallback = getDiceBear(name)
      await doc.ref.update({ photoUrl: fallback })
      console.log(`  ○ ${name}: DiceBear avatar (no photo found)`)
    }
  }

  console.log('\n✅ Player images updated!')
}

updateImages().catch(console.error)
