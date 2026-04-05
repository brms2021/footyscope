import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: resolve(__dirname, '../.env') })

const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!)

initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore()

// ============================================================
// PLAYERS — Real 2026 AFL Draft Prospects
// ============================================================

const players = [
  {
    slug: 'dougie-cochrane',
    name: 'Dougie Cochrane',
    firstName: 'Dougie',
    lastName: 'Cochrane',
    position: 'FWD',
    team: 'Central District',
    state: 'SA',
    draftYear: 2026,
    dateOfBirth: '2008-05-02',
    height: 196,
    weight: 88,
    photoUrl: null,
    rating: 96,
    attributes: { athleticism: 95, kicking: 88, marking: 90, ballWinning: 78, decisionMaking: 82, footballIQ: 85, versatility: 92, competitiveness: 90, ceiling: 96 },
    combineStats: null,
    bio: 'Consensus No. 1 prospect and a generational talent. Cochrane is a springy key forward with burst speed, a long booming kick, and aerial dominance. Made his SANFL league debut at 17, kicking four first-half goals. Son of Stuart Cochrane (104 AFL games). Tied to Port Adelaide via NGA.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Cochrane is the most exciting draft prospect in years — a 196cm utility who can play as a key forward, through the midfield, or even down back. His combination of size, speed, and skill is remarkable."}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"What Makes Him Special"}]},{"type":"paragraph","content":[{"type":"text","text":"His athleticism for his size is elite. He has genuine burst speed off the mark, can take contested marks overhead, and possesses a booming left-foot kick that travels 60+ metres. In his SANFL league debut, he looked completely at home against senior bodies."}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"Areas to Watch"}]},{"type":"paragraph","content":[{"type":"text","text":"Hamstring durability is the one flag — he missed the U18 Championships in 2025 with a hamstring injury. His contested ground-level work can improve, though this is a minor concern given his age and the fact he primarily plays as a key forward."}]}]}',
    strengths: ['Elite athleticism for size', 'Aerial dominance', 'Booming left-foot kick', 'Positional versatility', 'Already proven at SANFL league level'],
    weaknesses: ['Hamstring injury history', 'Contested ground-level work developing', 'Consistency across four quarters'],
    projection: 'Will be taken by Port Adelaide as an NGA selection. Projected to debut in senior AFL football within his first season and become an All-Australian calibre player.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'cody-walker',
    name: 'Cody Walker',
    firstName: 'Cody',
    lastName: 'Walker',
    position: 'MID',
    team: 'Bendigo Pioneers',
    state: 'VIC',
    draftYear: 2026,
    dateOfBirth: '2008-01-26',
    height: 184,
    weight: 80,
    photoUrl: null,
    rating: 94,
    attributes: { athleticism: 90, kicking: 82, marking: 70, ballWinning: 92, decisionMaking: 85, footballIQ: 88, versatility: 78, competitiveness: 95, ceiling: 92 },
    combineStats: null,
    bio: 'The closest rival to Cochrane for the top pick. Walker is a lightning-quick midfielder with elite contested craft and scoreboard impact. Son of Andrew Walker (202 AFL games at Carlton). Tied to Carlton as a father-son selection. Round 1, 2026: 28 disposals, 8 clearances, 2 goals.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Walker is a complete midfielder in the modern mould — he wins his own ball at the contest, has the speed to break lines, and impacts the scoreboard. His work ethic and professionalism are regularly praised by coaches."}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"Contested Craft"}]},{"type":"paragraph","content":[{"type":"text","text":"His agility through traffic is his standout trait. Walker can weave through congestion, find space, and deliver effectively. His clearance numbers are elite — 7 clearances and 6 inside-50s in the U17 Futures game, and 8 clearances in Round 1 of the 2026 Talent League season."}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"Scoreboard Impact"}]},{"type":"paragraph","content":[{"type":"text","text":"Unlike many inside midfielders, Walker regularly hits the scoreboard. His ability to push forward and finish sets him apart from other mids in this draft class."}]}]}',
    strengths: ['Lightning agility through traffic', 'Elite contested ball winning', 'Scoreboard impact from midfield', 'Professional approach', 'Speed and endurance'],
    weaknesses: ['Standard midfielder build (184cm)', 'Can be overrun in aerial contests', 'Disposal under extreme pressure'],
    projection: 'Will be matched by Carlton as a father-son pick. Projects as a top-10 midfielder in the AFL within 3 years.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'harry-van-hattum',
    name: 'Harry Van Hattum',
    firstName: 'Harry',
    lastName: 'Van Hattum',
    position: 'RUCK',
    team: 'Northern Knights',
    state: 'VIC',
    draftYear: 2026,
    dateOfBirth: '2008-07-01',
    height: 203,
    weight: 96,
    photoUrl: null,
    rating: 91,
    attributes: { athleticism: 85, kicking: 70, marking: 88, ballWinning: 80, decisionMaking: 72, footballIQ: 75, versatility: 78, competitiveness: 85, ceiling: 90 },
    combineStats: null,
    bio: 'Described as one of the most exciting ruck prospects of the decade. Van Hattum combines imposing size with genuine athletic ability and forward craft. Round 1, 2026: 19 disposals, 20 hitouts, 2 goals. Training at Collingwood during pre-season.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Van Hattum is the standout ruck in this draft class by a significant margin. His hitout-to-advantage numbers are already at AFL standard, and he has the forward craft to pinch-hit up the ground and take contested marks."}]},{"type":"paragraph","content":[{"type":"text","text":"His mobility for a 203cm player is impressive — he covers the ground well and can compete at stoppages across the ground rather than just at centre bounces. His leap and running power make him a genuine weapon in the air."}]}]}',
    strengths: ['Dominant tap ruckwork', 'Exceptional leap and running power', 'Contested marking', 'Mobility for size', 'Forward craft'],
    weaknesses: ['Ground-level game developing', 'Kicking efficiency', 'Can tire in the fourth quarter'],
    projection: 'Open prospect — will attract significant first-round interest. Projects as a starting AFL ruckman within two seasons.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'arki-butler',
    name: 'Arki Butler',
    firstName: 'Arki',
    lastName: 'Butler',
    position: 'MID/FWD',
    team: 'Sandringham Dragons',
    state: 'VIC',
    draftYear: 2026,
    dateOfBirth: '2008-04-23',
    height: 180,
    weight: 76,
    photoUrl: null,
    rating: 89,
    attributes: { athleticism: 85, kicking: 82, marking: 68, ballWinning: 88, decisionMaking: 85, footballIQ: 90, versatility: 80, competitiveness: 88, ceiling: 87 },
    combineStats: null,
    bio: 'A freakishly talented forward-midfielder with elite football IQ and contested work. Named Player of the Week in Round 1, 2026: 26 disposals (17 contested), 4 goals. Training at St Kilda during pre-season.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Butler is one of the most naturally gifted players in this draft class. His football intelligence sets him apart — he reads the play at an elite level, positions himself perfectly at the fall of the ball, and makes smart decisions under pressure."}]},{"type":"paragraph","content":[{"type":"text","text":"His Round 1 performance was outstanding: 26 disposals with 17 contested, and 4 goals. He has the ability to play as a dangerous forward or push into the midfield, giving clubs enormous flexibility."}]}]}',
    strengths: ['Elite football IQ', 'Contested ball winning', 'Goal sense', 'Agility and speed', 'Can play forward or midfield'],
    weaknesses: ['Small frame (180cm)', 'Overhead marking against talls', 'Needs to add muscle'],
    projection: 'Open prospect likely to be selected in the top 10. Could develop into a dynamic forward-mid at AFL level.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'marlon-neocleous',
    name: 'Marlon Neocleous',
    firstName: 'Marlon',
    lastName: 'Neocleous',
    position: 'FWD',
    team: 'Gippsland Power',
    state: 'VIC',
    draftYear: 2026,
    dateOfBirth: '2008-02-26',
    height: 168,
    weight: 68,
    photoUrl: null,
    rating: 86,
    attributes: { athleticism: 82, kicking: 85, marking: 60, ballWinning: 78, decisionMaking: 80, footballIQ: 82, versatility: 65, competitiveness: 85, ceiling: 84 },
    combineStats: null,
    bio: 'A small forward with quintessential craft and creativity. Near best-afield in the Futures game with 3 goals and 23 disposals, including a brilliant shot from the boundary. Compared to Nick Watson. Proactive pressure player.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Neocleous is the most creative small forward in this draft class. His goal-kicking craft is varied and exciting — he can snap from the boundary, dribble through traffic, or finish on the run. His pressure acts are also elite."}]},{"type":"paragraph","content":[{"type":"text","text":"The Nick Watson comparisons are warranted. Like Watson, Neocleous makes the game look easy with his quick hands, sharp movement, and ability to find space in the forward 50."}]}]}',
    strengths: ['Creative goal-kicking craft', 'Quick hands and movement', 'Pressure and tackling', 'Football intelligence', 'Varied finishing skills'],
    weaknesses: ['Very small stature (168cm)', 'May struggle with AFL physicality', 'Limited aerial presence'],
    projection: 'Projected first-round pick. His size will concern some clubs but his craft could make him a fan favourite at AFL level.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'heath-mellody',
    name: 'Heath Mellody',
    firstName: 'Heath',
    lastName: 'Mellody',
    position: 'DEF/MID',
    team: 'Claremont',
    state: 'WA',
    draftYear: 2026,
    dateOfBirth: '2008-07-27',
    height: 181,
    weight: 78,
    photoUrl: null,
    rating: 84,
    attributes: { athleticism: 80, kicking: 90, marking: 72, ballWinning: 75, decisionMaking: 85, footballIQ: 82, versatility: 88, competitiveness: 78, ceiling: 82 },
    combineStats: null,
    bio: 'A pure footballer from Western Australia with exceptional dual-footed kicking and clever running patterns. Starred in Claremont\'s Colts premiership and the National Futures game. Can play wing or half-back.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Mellody is the best kick in this draft class, and it is not particularly close. His ability to use both feet at full speed, hitting targets at 50+ metres, gives him a rare weapon. He played a key role in Claremont\'s third consecutive Colts premiership."}]},{"type":"paragraph","content":[{"type":"text","text":"His running patterns off the ball are intelligent — he finds space and creates options for teammates. He can play as a winger or rebounding half-back, giving clubs flexibility."}]}]}',
    strengths: ['Elite dual-footed kicking', 'Running ability and patterns', 'Positional versatility', 'Smart positioning', 'Strong aerial work for size'],
    weaknesses: ['Not overly physical', 'Needs to add contested dimension', 'Can be quiet in low-possession games'],
    projection: 'Projected top 10-15 pick. Could develop into a high-possession wing or half-back at AFL level.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'jack-pickett',
    name: 'Jack Pickett',
    firstName: 'Jack',
    lastName: 'Pickett',
    position: 'FWD',
    team: 'Geelong Falcons',
    state: 'VIC',
    draftYear: 2026,
    dateOfBirth: '2008-03-06',
    height: 193,
    weight: 88,
    photoUrl: null,
    rating: 83,
    attributes: { athleticism: 75, kicking: 82, marking: 88, ballWinning: 65, decisionMaking: 72, footballIQ: 70, versatility: 55, competitiveness: 85, ceiling: 80 },
    combineStats: null,
    bio: 'An out-and-out goalkicking machine. Pickett booted 31 goals in 8 Coates Talent League games including a 7-goal haul. Fearsome marking presence with accurate long kicking. An old-school deep forward who uses physicality.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Pickett is the most prolific goalkicker in this draft class. His 31 goals from 8 games, including a 7-goal haul in a single match, demonstrates his ability to dominate in the forward line."}]},{"type":"paragraph","content":[{"type":"text","text":"He is an old-school key forward who knows his craft — he leads hard, marks overhead, and kicks accurately. His physical presence makes him a handful for defenders."}]}]}',
    strengths: ['Prolific goalkicking', 'Strong contested marking', 'Physical presence', 'Accurate set shot kicking', 'Leading patterns'],
    weaknesses: ['Limited game outside forward craft', 'Defensive pressure inconsistent', 'Speed against elite defenders'],
    projection: 'Projected first-round pick (8-15 range). Could become a 40+ goal per season forward at AFL level.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'lucas-robinson',
    name: 'Lucas Robinson',
    firstName: 'Lucas',
    lastName: 'Robinson',
    position: 'MID',
    team: 'South Fremantle',
    state: 'WA',
    draftYear: 2026,
    dateOfBirth: '2008-02-13',
    height: 189,
    weight: 85,
    photoUrl: null,
    rating: 82,
    attributes: { athleticism: 82, kicking: 72, marking: 78, ballWinning: 90, decisionMaking: 74, footballIQ: 76, versatility: 70, competitiveness: 92, ceiling: 80 },
    combineStats: null,
    bio: 'A powerful inside midfielder from WA with overwhelming strength and impressive contested numbers. WA U16 MVP. From remote Tarin Rock. Tied to Fremantle via NGA. Classic country football toughness and leadership material.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Robinson is a bull at the contest. His strength and power at stoppages are already at a near-AFL level, and his ability to extract the ball from contested situations is elite for his age."}]},{"type":"paragraph","content":[{"type":"text","text":"Coming from remote Tarin Rock in regional WA, Robinson brings a toughness and competitiveness that cannot be coached. He is a natural leader and his teammates gravitate towards him."}]}]}',
    strengths: ['Overwhelming contested strength', 'Clearance extraction', 'Overhead marking for a midfielder', 'Leadership and toughness', 'Size for an inside mid (189cm)'],
    weaknesses: ['Prefers handball over kick', 'Disposal under pressure', 'Outside running game'],
    projection: 'Tied to Fremantle as NGA. Projects as a starting inside midfielder at AFL level.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'kodah-edwards',
    name: 'Kodah Edwards',
    firstName: 'Kodah',
    lastName: 'Edwards',
    position: 'MID/FWD',
    team: 'South Adelaide',
    state: 'SA',
    draftYear: 2026,
    dateOfBirth: '2008-07-25',
    height: 183,
    weight: 79,
    photoUrl: null,
    rating: 80,
    attributes: { athleticism: 80, kicking: 78, marking: 68, ballWinning: 85, decisionMaking: 78, footballIQ: 76, versatility: 75, competitiveness: 88, ceiling: 78 },
    combineStats: null,
    bio: 'A hard-nosed mid-forward with courage and energetic forward running. Edwards has elite skill execution under pressure and is a prolific clearance extractor. Training at Port Adelaide during pre-season.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Edwards plays the game with an intensity that is hard to match. His courage at the contest, willingness to put his body on the line, and ability to extract the ball cleanly from stoppages make him a valuable prospect."}]},{"type":"paragraph","content":[{"type":"text","text":"His forward running from stoppages is a weapon — he regularly pushes forward to impact the scoreboard, adding a dimension that pure inside midfielders often lack."}]}]}',
    strengths: ['Hard-nosed courage', 'Clearance work', 'Goal sense from midfield', 'Skill under pressure', 'Energetic forward running'],
    weaknesses: ['Size for a pure inside mid (183cm)', 'Endurance over four quarters', 'Marking overhead'],
    projection: 'Projected first-round pick. Could develop into a valuable two-way midfielder at AFL level.',
    youtubeVideoIds: [],
    published: true,
  },
  {
    slug: 'koby-lecras',
    name: 'Koby LeCras',
    firstName: 'Koby',
    lastName: 'LeCras',
    position: 'FWD',
    team: 'West Perth',
    state: 'WA',
    draftYear: 2026,
    dateOfBirth: '2008-04-26',
    height: 192,
    weight: 86,
    photoUrl: null,
    rating: 78,
    attributes: { athleticism: 78, kicking: 85, marking: 86, ballWinning: 65, decisionMaking: 72, footballIQ: 74, versatility: 60, competitiveness: 80, ceiling: 80 },
    combineStats: null,
    bio: 'A tall forward with an elite ability to read the ball in flight. Nephew of Mark LeCras (Eagles premiership player). 15 goals from 10 Colts games including two 4-goal hauls. Raking left boot. Named to Marsh AFL National Academy. Training at West Coast during pre-season.',
    scoutingReport: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"LeCras has football in his blood and it shows. His ability to read the ball in flight is his standout trait — he positions himself perfectly under the ball and brings it down cleanly. His left-foot kick is a weapon."}]},{"type":"paragraph","content":[{"type":"text","text":"Named to the Marsh AFL National Academy, LeCras has been training at West Coast during the pre-season and has impressed with his work ethic and coachability."}]}]}',
    strengths: ['Elite reading of ball in flight', 'Raking left-foot kick', 'Contested marking', 'Goal sense', 'Football pedigree'],
    weaknesses: ['Limited game outside forward craft', 'Right foot needs development', 'Physical development still needed'],
    projection: 'Projected second-round pick. Could develop into a damaging key forward at AFL level.',
    youtubeVideoIds: [],
    published: true,
  },
]

// ============================================================
// ARTICLES
// ============================================================

const articles = [
  {
    slug: '2026-draft-class-overview',
    title: '2026 AFL Draft: The Definitive Class Overview',
    excerpt: 'Everything you need to know about the 2026 AFL Draft class — the key names, the father-sons, the academy ties, and why this crop could be the deepest in years.',
    content: '{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"A Class of Depth and Star Power"}]},{"type":"paragraph","content":[{"type":"text","text":"The 2026 AFL Draft class is shaping as one of the strongest in recent memory, headlined by two consensus top prospects who happen to be club-tied. Dougie Cochrane (Port Adelaide NGA) and Cody Walker (Carlton father-son) have separated themselves from the pack, but the depth beyond them is what makes this class special."}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"The Big Two"}]},{"type":"paragraph","content":[{"type":"text","text":"Cochrane is a 196cm utility who can play forward, midfield, or defence. His SANFL league debut — four first-half goals at age 17 — announced him as a generational talent. Walker, meanwhile, is a contested midfield bull with lightning agility and scoreboard impact. Both will be matched by their respective clubs."}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"The Open Market"}]},{"type":"paragraph","content":[{"type":"text","text":"For clubs picking in the open market, Harry Van Hattum looms as the premier target. The 203cm ruck-forward from Northern Knights has been described as one of the most exciting ruck prospects of the decade. Arki Butler, Marlon Neocleous, and Heath Mellody round out a strong top tier of open prospects."}]},{"type":"heading","attrs":{"level":3},"content":[{"type":"text","text":"Key Storylines"}]},{"type":"paragraph","content":[{"type":"text","text":"The father-son and academy dynamics will heavily shape this draft. Carlton, Port Adelaide, and Fremantle all have strong ties to top prospects, meaning the open selections at the top of the draft could be limited. Clubs with early picks and no academy ties will be in a strong position."}]}]}',
    category: 'Draft Analysis',
    coverImageUrl: null,
    author: 'FootyScope',
    playerTags: ['dougie-cochrane', 'cody-walker', 'harry-van-hattum', 'arki-butler', 'marlon-neocleous', 'heath-mellody'],
    published: true,
    publishedAt: '2026-03-28T10:00:00Z',
  },
  {
    slug: 'dougie-cochrane-scouting-report',
    title: 'Dougie Cochrane: Scouting the Consensus No. 1',
    excerpt: 'A deep dive into Dougie Cochrane\'s game — the 196cm utility from Central District who has separated himself as the top prospect in the 2026 class.',
    content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"In a draft class brimming with talent, Dougie Cochrane stands alone at the top. The 196cm utility from Central District has been on the radar since dominating the U16 National Championships, and his progression since has only cemented his status."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"SANFL League Debut"}]},{"type":"paragraph","content":[{"type":"text","text":"Cochrane\'s SANFL league debut was the stuff of legend. Four first-half goals against senior bodies at age 17 — not junior footy, not reserves, but league level. The ease with which he dominated was genuinely remarkable. His combination of size, speed, and skill at that level is almost unprecedented for a draft prospect."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"The Complete Package"}]},{"type":"paragraph","content":[{"type":"text","text":"What sets Cochrane apart is his versatility. He can play as a key forward taking contested marks, push through the midfield winning contested ball, or even play as a tall defender. ESPN described his combination of attributes as remarkable — and it is difficult to disagree."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Port Adelaide\'s Prize"}]},{"type":"paragraph","content":[{"type":"text","text":"Cochrane is tied to Port Adelaide through the Next Generation Academy via his Indigenous heritage. His brother Tom already plays for the Power. Barring the unexpected, Cochrane will be a Port Adelaide player come draft night — and he could be the piece that launches them into premiership contention."}]}]}',
    category: 'Scouting Report',
    coverImageUrl: null,
    author: 'FootyScope',
    playerTags: ['dougie-cochrane'],
    published: true,
    publishedAt: '2026-03-25T10:00:00Z',
  },
  {
    slug: 'talent-league-round-1-review',
    title: 'Talent League Round 1: Standout Performances and Draft Risers',
    excerpt: 'The 2026 Talent League season has kicked off. Here are the players who made the biggest impressions in Round 1.',
    content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Round 1 of the 2026 Talent League season is in the books, and several draft prospects have wasted no time making statements. Here are the standout performances from the opening round."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Arki Butler — Sandringham Dragons"}]},{"type":"paragraph","content":[{"type":"text","text":"Butler was named Player of the Week after a dominant display: 26 disposals (17 contested), 4 goals. His ability to impact as both a midfielder and forward was on full display. He is rocketing up draft boards."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Cody Walker — Bendigo Pioneers"}]},{"type":"paragraph","content":[{"type":"text","text":"Walker delivered exactly what was expected: 28 disposals, 8 clearances, 2 goals. He controlled the game through the middle and showed his ability to push forward and hit the scoreboard. The Carlton father-son pick looks every bit a top-3 talent."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Harry Van Hattum — Northern Knights"}]},{"type":"paragraph","content":[{"type":"text","text":"The giant ruckman had a day out: 19 disposals, 20 hitouts, 2 goals. His dominance in the ruck and ability to push forward sets him apart from any other big man in this draft class."}]}]}',
    category: 'Match Report',
    coverImageUrl: null,
    author: 'FootyScope',
    playerTags: ['arki-butler', 'cody-walker', 'harry-van-hattum'],
    published: true,
    publishedAt: '2026-03-24T10:00:00Z',
  },
  {
    slug: 'father-son-academy-guide-2026',
    title: 'Father-Son & Academy Guide: Who Is Tied to Which Club in 2026?',
    excerpt: 'A comprehensive breakdown of every significant father-son and NGA prospect in the 2026 AFL Draft — and how it shapes the draft order.',
    content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The 2026 AFL Draft will be heavily shaped by father-son and Next Generation Academy ties. With the two consensus top prospects both club-tied, understanding these dynamics is essential for predicting how the draft will unfold."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"The Headline Ties"}]},{"type":"paragraph","content":[{"type":"text","text":"Port Adelaide holds NGA rights to Dougie Cochrane, the consensus No. 1 pick. Carlton has father-son access to Cody Walker, the No. 2 prospect. Fremantle holds NGA rights to Lucas Robinson, an inside midfielder from South Fremantle."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"What It Means for the Draft"}]},{"type":"paragraph","content":[{"type":"text","text":"With Cochrane and Walker effectively off the board, the first open selection becomes the most valuable pick in the draft. Harry Van Hattum, Arki Butler, and Marlon Neocleous are the leading candidates to be the first open pick."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Other Notable Ties"}]},{"type":"paragraph","content":[{"type":"text","text":"The Western Bulldogs have several NGA prospects plus potential father-son access to Levi West (son of Scott) and Jax Cooney (son of Adam). Brisbane holds academy rights to Caylen Murray and father-son access to Cooper Hodge (son of Luke). Gold Coast has Archie Hill in their academy."}]}]}',
    category: 'Draft Analysis',
    coverImageUrl: null,
    author: 'FootyScope',
    playerTags: ['dougie-cochrane', 'cody-walker', 'lucas-robinson', 'harry-van-hattum', 'arki-butler', 'marlon-neocleous'],
    published: true,
    publishedAt: '2026-03-20T10:00:00Z',
  },
  {
    slug: 'footyscope-rating-methodology',
    title: 'How We Rate: The FootyScope Scope Rating Methodology',
    excerpt: 'An explanation of our rating system, the nine attributes we assess, and how we evaluate AFL draft prospects.',
    content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"At FootyScope, we believe draft analysis should be transparent and structured. Our Scope Rating system is designed to give fans, analysts, and clubs a clear framework for evaluating prospects."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"The Scope Rating (1-100)"}]},{"type":"paragraph","content":[{"type":"text","text":"Every prospect receives a Scope Rating from 1 to 100, translating to a tier: Elite (90+), Premium (80-89), Quality (70-79), Developing (60-69), and Watch List (below 60). This reflects our overall assessment of draft value and AFL potential."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Nine Key Attributes"}]},{"type":"paragraph","content":[{"type":"text","text":"Each player is evaluated across nine attributes: Athleticism, Kicking, Marking, Ball Winning, Decision Making, Football IQ, Versatility, Competitiveness, and Ceiling. These are displayed as a radar chart on each profile, providing a visual snapshot of strengths and weaknesses."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Our Process"}]},{"type":"paragraph","content":[{"type":"text","text":"Ratings are based on live match observation, video analysis, publicly available data, and industry consultation. We update ratings throughout the season as players develop and new information becomes available."}]}]}',
    category: 'Opinion',
    coverImageUrl: null,
    author: 'FootyScope',
    playerTags: [],
    published: true,
    publishedAt: '2026-02-15T10:00:00Z',
  },
]

// ============================================================
// RANKINGS
// ============================================================
// Will be populated after players are seeded (need doc IDs)

// ============================================================
// SEED FUNCTION
// ============================================================

async function seed() {
  console.log('🌱 Seeding FootyScope Firestore...\n')

  // Clear existing data
  for (const col of ['players', 'articles', 'rankings', 'eoiSubmissions']) {
    const snapshot = await db.collection(col).get()
    const batch = db.batch()
    snapshot.docs.forEach(d => batch.delete(d.ref))
    await batch.commit()
    console.log(`  Cleared ${col} (${snapshot.size} docs)`)
  }

  // Seed players
  const playerIdMap = new Map<string, string>() // slug -> firestoreId
  for (const player of players) {
    const now = new Date().toISOString()
    const ref = await db.collection('players').add({
      ...player,
      createdAt: now,
      updatedAt: now,
    })
    playerIdMap.set(player.slug, ref.id)
    console.log(`  ✓ Player: ${player.name} (${ref.id})`)
  }

  // Seed articles
  for (const article of articles) {
    const now = new Date().toISOString()
    const ref = await db.collection('articles').add({
      ...article,
      createdAt: now,
      updatedAt: now,
    })
    console.log(`  ✓ Article: ${article.title.substring(0, 50)}... (${ref.id})`)
  }

  // Seed rankings
  const rankedSlugs = [
    'dougie-cochrane', 'cody-walker', 'harry-van-hattum', 'arki-butler',
    'marlon-neocleous', 'heath-mellody', 'jack-pickett', 'lucas-robinson',
    'kodah-edwards', 'koby-lecras',
  ]

  for (let i = 0; i < rankedSlugs.length; i++) {
    const slug = rankedSlugs[i]
    const playerId = playerIdMap.get(slug)
    if (!playerId) continue
    await db.collection('rankings').add({
      playerId,
      playerSlug: slug,
      draftYear: 2026,
      rank: i + 1,
      previousRank: null,
      updatedAt: new Date().toISOString(),
    })
    console.log(`  ✓ Ranking #${i + 1}: ${slug}`)
  }

  console.log('\n✅ Seed complete!')
}

seed().catch(console.error)
