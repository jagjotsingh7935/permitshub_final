/*
 * Types and small helpers shared across the site. All site content (text, services, projects, FAQs…)
 * is managed in the admin portal and loaded from the backend API: see `src/site/SiteProvider.tsx`.
 */
import type { LucideIcon } from 'lucide-react'

export type SourceLink = { label: string; url: string }

export type Faq = { id: string; question: string; answer: string }
export type FaqItem = Faq & { category: string }

export type JourneyStageId = string
export type JourneyStage = { id: JourneyStageId; label: string; short: string }

export type Service = {
  id: string
  number: string
  title: string
  description: string
  icon: LucideIcon
  involves: string
  whoFor: string[]
  situations: string[]
  inputs: string[]
  deliverables: string[]
  conversation: string
  stages: JourneyStageId[]
  relatedProjects: string[]
  enquiryType: string
}

export type ServiceFinderOption = { stage: JourneyStageId; prompt: string; answer: string; services: string[] }

export type ProjectStatus = 'in-planning' | 'permit-approved' | 'under-construction' | 'completed'
export const statusLabels: Record<ProjectStatus, string> = {
  'in-planning': 'In planning',
  'permit-approved': 'Permit approved',
  'under-construction': 'Under construction',
  completed: 'Completed',
}

export type IllustrationVariant = 'clinic' | 'warehouse' | 'townhouses' | 'hall'
export type ProjectCategory = string

export type Media = { src: string; alt: string; caption: string; position?: string | null; width?: number | null; height?: number | null }
export type GalleryImage = Media & { fit: 'cover' | 'contain' }
export type Fact = { label: string; value: string }
export type Milestone = { when: string; label: string; detail: string; source?: SourceLink | null }

export type Project = {
  record: 'verified' | 'demo'
  slug: string
  title: string
  place: string
  region: string
  category: ProjectCategory
  status: ProjectStatus
  statusNote: string
  /** Date of the public update (ISO). Empty for demo projects. */
  updateDate: string
  highlight: string
  summary: string
  tone: 'blue' | 'sand' | 'sage'
  outcome: string
  nextSteps: string
  documentedInvolvement: string[]
  siteContext: string[]
  planningConsiderations: string[]
  illustration: IllustrationVariant | ''
  keyFacts: Fact[]
  milestones: Milestone[]
  cover: Media | null
  gallery: GalleryImage[]
  sources: SourceLink[]
  featured: boolean
  homeOrder: number | null
}

export type Sector = { slug: string; title: string; summary: string; considerations: string[]; showInPortfolio: boolean }

export type ChapterMedia =
  | { kind: 'record'; title: string; lines: Fact[]; source: SourceLink | null }
  | { kind: 'checklist'; title: string; items: string[] }
  | { kind: 'projects'; slugs: string[] }
  | { kind: 'figures'; items: { value: string; label: string; href: string }[] }
  | { kind: 'regions' }
  | { kind: 'cta' }

export type Chapter = {
  id: string
  marker: string
  type: 'milestone' | 'perspective' | 'now' | 'next'
  title: string
  eyebrow: string
  body: string[]
  /** Index into the evolution stages. */
  stage: number
  media: ChapterMedia
}

export const isVerified = (project: Project) => project.record === 'verified'

const longFormat = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
const shortFormat = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })

/** Formats ISO dates in Australian style. Non-ISO values (such as "Stage 1") are returned unchanged. */
export function formatDate(value: string, style: 'long' | 'short' = 'long') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = new Date(`${value}T00:00:00`)
  return (style === 'long' ? longFormat : shortFormat).format(date)
}

export const navigation = [
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
]
