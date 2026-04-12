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

// ─── Coates Talent League (AFL API) ──────────────────────────────────────────
// Covers VIC, NSW, QLD, TAS players
async function fetchCoatesStats() {
  console.log('\n📡 Fetching Coates Talent League stats...')

  // Get auth token
  const tokenRes = await fetch('https://api.afl.com.au/cfs/afl/WMCTok', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  const { token } = await tokenRes.json()
  const headers = { 'x-media-mis-token': token }

  // Get current season rounds (competition 13 = Coates Talent League Boys)
  const seasonRes = await fetch(
    'https://api.afl.com.au/cfs/afl/season?seasonId=CD_S2026011',
    { headers }
  )
  const seasonData = await seasonRes.json()
  const rounds = seasonData?.nav?.rounds ?? []
  console.log(`  Found ${rounds.length} rounds`)

  // Aggregate stats per player across all rounds
  const playerStats = {}

  for (const round of rounds) {
    const roundId = round.providerId
    if (!roundId) continue

    const matchesRes = await fetch(
      `https://api.afl.com.au/cfs/afl/matchItems/round/${roundId}`,
      { headers }
    )
    const matchesData = await matchesRes.json()
    const matches = matchesData?.matches ?? []

    for (const match of matches) {
      const matchId = match.providerId
      if (!matchId) continue

      const statsRes = await fetch(
        `https://api.afl.com.au/cfs/afl/playerStats/match/${matchId}`,
        { headers }
      )
      const statsData = await statsRes.json()
      const allPlayers = [
        ...(statsData?.homeTeamPlayerStats?.playerStats ?? []),
        ...(statsData?.awayTeamPlayerStats?.playerStats ?? []),
      ]

      for (const p of allPlayers) {
        const name = `${p.player?.givenName ?? ''} ${p.player?.surname ?? ''}`.trim()
        if (!name) continue
        if (!playerStats[name]) {
          playerStats[name] = {
            gamesPlayed: 0, disposals: 0, kicks: 0, handballs: 0,
            marks: 0, tackles: 0, goals: 0, behinds: 0,
            contestedPossessions: 0, inside50s: 0, hitouts: 0,
          }
        }
        const s = playerStats[name]
        const st = p.playerStats?.stats ?? {}
        s.gamesPlayed += 1
        s.disposals += st.disposals ?? 0
        s.kicks += st.kicks ?? 0
        s.handballs += st.handballs ?? 0
        s.marks += st.marks ?? 0
        s.tackles += st.tackles ?? 0
        s.goals += st.goals ?? 0
        s.behinds += st.behinds ?? 0
        s.contestedPossessions += st.contestedPossessions ?? 0
        s.inside50s += st.inside50s ?? 0
        s.hitouts += st.hitouts ?? 0
      }
    }
  }

  // Average out per game
  const averaged = {}
  for (const [name, s] of Object.entries(playerStats)) {
    if (s.gamesPlayed === 0) continue
    averaged[name] = {
      gamesPlayed: s.gamesPlayed,
      disposals: round2(s.disposals / s.gamesPlayed),
      kicks: round2(s.kicks / s.gamesPlayed),
      handballs: round2(s.handballs / s.gamesPlayed),
      marks: round2(s.marks / s.gamesPlayed),
      tackles: round2(s.tackles / s.gamesPlayed),
      goals: round2(s.goals / s.gamesPlayed),
      behinds: round2(s.behinds / s.gamesPlayed),
      contestedPossessions: round2(s.contestedPossessions / s.gamesPlayed),
      inside50s: round2(s.inside50s / s.gamesPlayed),
      hitouts: s.hitouts > 0 ? round2(s.hitouts / s.gamesPlayed) : null,
      uncontestedPossessions: null,
      clearances: null,
      metresGained: null,
      disposalEfficiency: null,
    }
  }

  console.log(`  Aggregated stats for ${Object.keys(averaged).length} players`)
  return averaged
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
