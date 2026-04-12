/**
 * FootyScope Weekly Stats Sync
 *
 * Fetches current season stats from:
 * - Coates Talent League API (VIC/NSW/QLD/TAS players)
 * - WAFL Colts via Sportix Cloud API (WA players)
 * - SANFL Under 18s via PlayHQ GraphQL API (SA players)
 *
 * Matches players by name to Firestore and updates gameStats.
 * Run via GitHub Actions every Monday, or manually.
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// ─── Firebase init ────────────────────────────────────────────────────────────
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// ─── Helpers ─────────────────────────────────────────────────────────────────
function normaliseName(name) {
  return name.toLowerCase().replace(/[^a-z\s]/g, '').trim()
}

function matchName(a, b) {
  return normaliseName(a) === normaliseName(b)
}

async function getFirestorePlayers() {
  const snap = await db.collection('players').get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

async function updatePlayerStats(playerId, stats) {
  await db.collection('players').doc(playerId).update({
    gameStats: stats,
    updatedAt: new Date().toISOString(),
  })
  console.log(`  ✓ Updated stats for player ${playerId}`)
}

// ─── Coates Talent League (AFL statspro API) ─────────────────────────────────
// Covers VIC, NSW, QLD, TAS players
// Season ID format: CD_S{YEAR}011 — e.g. CD_S2026011 for 2026
async function fetchCoatesStats() {
  console.log('\n📡 Fetching Coates Talent League stats...')

  const year = new Date().getFullYear()
  const seasonId = `CD_S${year}011`

  const tokenRes = await fetch('https://api.afl.com.au/cfs/afl/WMCTok', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  const { token } = await tokenRes.json()

  const res = await fetch(
    `https://api.afl.com.au/statspro/playersStats/seasons/${seasonId}`,
    {
      headers: {
        'x-media-mis-token': token,
        'Accept': 'application/json',
        'Accept-Encoding': 'identity',
      },
    }
  )

  if (!res.ok) {
    console.log(`  Season ${seasonId} returned ${res.status} — trying previous year`)
    const fallbackId = `CD_S${year - 1}011`
    const res2 = await fetch(
      `https://api.afl.com.au/statspro/playersStats/seasons/${fallbackId}`,
      { headers: { 'x-media-mis-token': token, 'Accept': 'application/json', 'Accept-Encoding': 'identity' } }
    )
    if (!res2.ok) throw new Error(`Both ${seasonId} and ${fallbackId} failed`)
    return parseCoatesResponse(await res2.json())
  }

  return parseCoatesResponse(await res.json())
}

function parseCoatesResponse(data) {
  const players = data?.players ?? []
  console.log(`  Found ${players.length} Coates Talent League players`)
  const result = {}
  for (const p of players) {
    const g = p.gamesPlayed
    if (!g) continue
    const name = `${p.playerDetails?.givenName ?? ''} ${p.playerDetails?.surname ?? ''}`.trim()
    if (!name) continue
    const avg = p.averages ?? {}
    result[name] = {
      gamesPlayed: g,
      disposals: avg.disposals ?? null,
      kicks: avg.kicks ?? null,
      handballs: avg.handballs ?? null,
      marks: avg.marks ?? null,
      tackles: avg.tackles ?? null,
      goals: avg.goals ?? null,
      behinds: avg.behinds ?? null,
      hitouts: avg.hitouts > 0 ? avg.hitouts : null,
      inside50s: avg.inside50s ?? null,
      contestedPossessions: avg.contestedPossessions ?? null,
      uncontestedPossessions: avg.uncontestedPossessions ?? null,
      clearances: avg.clearances ?? null,
      metresGained: avg.metresGained ?? null,
      disposalEfficiency: avg.disposalEfficiency ?? null,
    }
  }
  return result
}

// ─── WAFL Colts (Sportix Cloud API) ──────────────────────────────────────────
// Covers WA players
async function fetchWaflStats() {
  console.log('\n📡 Fetching WAFL Colts stats...')

  const headers = {
    'Authorization': 'Bearer 290|yQfFH5WycjbEb8eUtVtTCXZt2aWOxFpDjUYEdxgQ9326de46',
    'tenant-id': '3b47430d-e8a4-4f13-bc22-1b622d4e9bda',
    'Accept': 'application/json',
  }

  // Colts competition ID and current season
  const COLTS_COMP = '59d1ca00-4bd7-11e9-89ba-2b0e32046063'
  const SEASON_2026 = '72f8ddef-2d2f-483e-b4b0-e87d7bc7dccc'

  const res = await fetch(
    `https://api.sportix.cloud/public/statistics?competition=${COLTS_COMP}&season=${SEASON_2026}`,
    { headers }
  )
  const data = await res.json()
  const players = data?.data ?? []
  console.log(`  Found ${players.length} WAFL Colts players`)

  const result = {}
  for (const p of players) {
    const name = `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim()
    if (!name || !p.games) continue
    result[name] = {
      gamesPlayed: p.games ?? null,
      disposals: round2(p.disposals / p.games) ?? null,
      kicks: round2(p.kicks / p.games) ?? null,
      handballs: round2(p.handballs / p.games) ?? null,
      marks: round2(p.marks / p.games) ?? null,
      tackles: round2(p.tackles / p.games) ?? null,
      goals: round2(p.goals / p.games) ?? null,
      behinds: round2(p.behinds / p.games) ?? null,
      hitouts: p.hitouts > 0 ? round2(p.hitouts / p.games) : null,
      contestedPossessions: null,
      uncontestedPossessions: null,
      inside50s: null,
      clearances: null,
      metresGained: null,
      disposalEfficiency: null,
    }
  }

  return result
}

// ─── SANFL Under 18s (PlayHQ GraphQL) ────────────────────────────────────────
// Covers SA players
async function fetchSanflStats() {
  console.log('\n📡 Fetching SANFL Under 18s stats...')

  const GRADE_ID = 'f9328499'
  const allPlayers = {}
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const res = await fetch('https://api.playhq.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'tenant': 'afl' },
      body: JSON.stringify({
        query: `query publicGradeStatistics($gradeID: ID!, $filter: GradePlayerStatisticsFilter) {
          gradePlayerStatistics(gradeID: $gradeID, filter: $filter) {
            meta { page totalPages totalRecords }
            results {
              profile { firstName lastName }
              team { name }
              statistics { count details { value } }
            }
          }
        }`,
        variables: {
          gradeID: GRADE_ID,
          filter: {
            sort: [{ column: 'APPEARANCES', direction: 'DESC' }],
            pagination: { page, limit: 50 },
          },
        },
      }),
    })

    const data = await res.json()
    const results = data?.data?.gradePlayerStatistics?.results ?? []
    totalPages = data?.data?.gradePlayerStatistics?.meta?.totalPages ?? 1

    for (const p of results) {
      const name = `${p.profile?.firstName ?? ''} ${p.profile?.lastName ?? ''}`.trim()
      if (!name) continue
      const appearances = p.statistics?.find(s => s.count === 'APPEARANCES')?.details?.[0]?.value ?? 0
      const goals = p.statistics?.find(s => s.count === 'GOAL_COUNT')?.details?.[0]?.value ?? 0
      // PlayHQ only returns appearances + goals for SANFL U18
      allPlayers[name] = {
        gamesPlayed: appearances || null,
        goals: appearances > 0 ? round2(goals / appearances) : null,
        disposals: null, kicks: null, handballs: null,
        marks: null, tackles: null, behinds: null,
        hitouts: null, contestedPossessions: null,
        uncontestedPossessions: null, inside50s: null,
        clearances: null, metresGained: null, disposalEfficiency: null,
      }
    }
    page++
  }

  console.log(`  Found ${Object.keys(allPlayers).length} SANFL U18 players`)
  return allPlayers
}

// ─── Match & update ───────────────────────────────────────────────────────────
function round2(n) {
  return Math.round(n * 10) / 10
}

async function main() {
  console.log('🏈 FootyScope Stats Sync — ' + new Date().toISOString())

  const [firestorePlayers, coatesStats, waflStats, sanflStats] = await Promise.all([
    getFirestorePlayers(),
    fetchCoatesStats().catch(e => { console.error('Coates fetch failed:', e.message); return {} }),
    fetchWaflStats().catch(e => { console.error('WAFL fetch failed:', e.message); return {} }),
    fetchSanflStats().catch(e => { console.error('SANFL fetch failed:', e.message); return {} }),
  ])

  const allStats = { ...coatesStats, ...waflStats, ...sanflStats }
  console.log(`\n🔍 Matching ${firestorePlayers.length} Firestore players against ${Object.keys(allStats).length} fetched players...`)

  let updated = 0
  let notFound = []

  for (const player of firestorePlayers) {
    const match = Object.entries(allStats).find(([name]) => matchName(name, player.name))
    if (match) {
      await updatePlayerStats(player.id, match[1])
      updated++
    } else {
      notFound.push(player.name)
    }
  }

  console.log(`\n✅ Updated: ${updated} players`)
  if (notFound.length) {
    console.log(`⚠️  No stats found for: ${notFound.join(', ')}`)
  }
  console.log('\nDone.')
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1) })
