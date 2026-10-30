// Same-origin by default (Caddy / the Vite dev proxy route /api and /media to Django).
// Set VITE_API_URL only if the frontend is hosted on a different origin than the backend.
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

type Pair = { label: string; url: string }
type ProjectMediaDto = { src: string; alt: string; caption: string; position: string | null; width: number | null; height: number | null }

/** The JSON returned by `GET /api/site/`. */
export type SiteDto = {
  settings: {
    brandPrimary: string
    brandSecondary: string
    companyName: string
    logo: string
    contactEmail: string
    contactPhone: string
    contactPhoneHref: string
    facebookUrl: string
    disclaimer: string
  }
  text: Record<string, string>
  images: Record<string, { url: string; alt: string; position: string | null; width: number | null; height: number | null }>
  services: {
    id: string; number: string; title: string; description: string; icon: string; involves: string
    whoFor: string[]; situations: string[]; inputs: string[]; deliverables: string[]; conversation: string
    enquiryType: string; stages: string[]; relatedProjects: string[]
  }[]
  stages: { id: string; label: string; short: string }[]
  finder: { stage: string; prompt: string; answer: string; services: string[] }[]
  sectors: { slug: string; title: string; summary: string; considerations: string[]; showInPortfolio: boolean }[]
  projects: {
    record: 'verified' | 'demo'; slug: string; title: string; place: string; region: string; category: string
    status: 'in-planning' | 'permit-approved' | 'under-construction' | 'completed'; statusNote: string; updateDate: string
    highlight: string; summary: string; tone: 'blue' | 'sand' | 'sage'; outcome: string; nextSteps: string
    documentedInvolvement: string[]; siteContext: string[]; planningConsiderations: string[]; illustration: string
    keyFacts: { label: string; value: string }[]
    milestones: { when: string; label: string; detail: string; source?: Pair | null }[]
    cover: ProjectMediaDto | null
    gallery: (ProjectMediaDto & { fit: 'cover' | 'contain' })[]
    sources: Pair[]
    featured: boolean
    homeOrder: number | null
  }[]
  faqs: { id: string; question: string; answer: string; placement: 'faqs' | 'home' | 'services' | 'contact'; category: string }[]
  faqCategories: string[]
  lists: Record<string, { title: string; body: string; detail: string; lines: string[] }[]>
  chapters: {
    id: string; marker: string; type: 'milestone' | 'perspective' | 'now' | 'next'; title: string; eyebrow: string
    body: string[]; stage: number; media: Record<string, unknown> & { kind: string }
  }[]
  regions: { name: string; note: string; source: Pair | null }[]
  projectTypes: string[]
  projectStages: string[]
  siteUrl: string
  pages: Record<string, { title: string; description: string; noindex: boolean }>
}

declare global {
  interface Window { __SITE__?: SiteDto }
}

export type EnquiryInput = {
  name: string
  email: string
  phone: string
  location: string
  project_type: string
  stage: string
  service: string
  message: string
  website?: string
}

/** Turns a backend media path such as /media/x.webp into a loadable URL. */
export function mediaUrl(path: string) {
  return path.startsWith('/') ? `${API_BASE}${path}` : path
}

export async function fetchSite(): Promise<SiteDto> {
  const response = await fetch(`${API_BASE}/api/site/`, { headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Site request failed (${response.status})`)
  return response.json()
}

export async function submitEnquiry(input: EnquiryInput): Promise<{ confirmationSent: boolean }> {
  const response = await fetch(`${API_BASE}/api/enquiries/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) throw new Error(`Enquiry request failed (${response.status})`)
  const data = await response.json()
  return { confirmationSent: Boolean(data.confirmationSent) }
}
