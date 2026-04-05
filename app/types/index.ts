export interface PlayerAttributes {
  athleticism: number
  kicking: number
  marking: number
  ballWinning: number
  decisionMaking: number
  footballIQ: number
  versatility: number
  competitiveness: number
  ceiling: number
}

export interface CombineStats {
  sprint20m: number | null
  agility: number | null
  verticalJump: number | null
  runningVerticalJump: number | null
  twoKmTimeTrial: string | null
  kickingEfficiency: number | null
}

export interface GameStats {
  gamesPlayed: number | null
  disposals: number | null
  kicks: number | null
  handballs: number | null
  marks: number | null
  tackles: number | null
  contestedPossessions: number | null
  uncontestedPossessions: number | null
  clearances: number | null
  inside50s: number | null
  goals: number | null
  behinds: number | null
  hitouts: number | null
  metresGained: number | null
  disposalEfficiency: number | null
}

export interface Player {
  id: string
  slug: string
  name: string
  firstName: string
  lastName: string
  position: string
  team: string
  state: string
  draftYear: number
  dateOfBirth: string
  height: number
  weight: number
  photoUrl: string | null
  rating: number
  attributes: PlayerAttributes
  combineStats: CombineStats | null
  gameStats: GameStats | null
  bio: string
  scoutingReport: string
  strengths: string[]
  weaknesses: string[]
  projection: string
  youtubeVideoIds: string[]
  createdAt: string
  updatedAt: string
  published: boolean
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: ArticleCategory
  coverImageUrl: string | null
  author: string
  playerTags: string[]
  published: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export type ArticleCategory = 'Draft Analysis' | 'Scouting Report' | 'Preview' | 'Match Report' | 'Opinion'

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'Draft Analysis',
  'Scouting Report',
  'Preview',
  'Match Report',
  'Opinion',
]

export interface RankingEntry {
  id: string
  playerId: string
  playerSlug: string
  draftYear: number
  rank: number
  previousRank: number | null
  updatedAt: string
}

export interface EOISubmission {
  id: string
  name: string
  email: string
  phone: string | null
  playerName: string
  ageGroup: string
  club: string
  message: string
  createdAt: string
  read: boolean
}

export type ReportStatus = 'pending' | 'approved' | 'rejected'

export interface CommunityReport {
  id: string
  playerSlug: string
  authorUid: string
  authorName: string
  authorEmail: string
  content: string
  rating: number
  status: ReportStatus
  likes: string[]
  dislikes: string[]
  createdAt: string
  updatedAt: string
}

export const POSITIONS = ['MID', 'FWD', 'DEF', 'RUCK', 'DEF/MID', 'MID/FWD', 'FWD/RUCK'] as const
export const STATES = ['VIC', 'SA', 'WA', 'QLD', 'NSW', 'TAS', 'NT', 'ACT'] as const

export interface PlayerFilters {
  search?: string
  position?: string
  state?: string
  draftYear?: number
  minRating?: number
  maxRating?: number
  minHeight?: number
  maxHeight?: number
}

export interface ArticleFilters {
  search?: string
  category?: ArticleCategory
  playerTag?: string
}

export function getAttributesArray(attrs: PlayerAttributes): number[] {
  return [
    attrs.athleticism,
    attrs.kicking,
    attrs.marking,
    attrs.ballWinning,
    attrs.decisionMaking,
    attrs.footballIQ,
    attrs.versatility,
    attrs.competitiveness,
    attrs.ceiling,
  ]
}

export function getRatingTier(rating: number): { label: string; scopes: number } {
  if (rating >= 90) return { label: 'Elite Prospect', scopes: 5 }
  if (rating >= 80) return { label: 'Premium Prospect', scopes: 4 }
  if (rating >= 70) return { label: 'Quality Prospect', scopes: 3 }
  if (rating >= 60) return { label: 'Developing Prospect', scopes: 2 }
  return { label: 'Watch List', scopes: 1 }
}
