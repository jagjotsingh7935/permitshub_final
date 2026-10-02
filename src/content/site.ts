import type { SourceLink } from './types'

// ---- Verified contact details (unchanged from the original site) ----
export const contactEmail = 'permits@permitshub.com.au'
export const contactPhone = '0409 198 597'
export const contactPhoneHref = 'tel:0409198597'
export const facebookUrl = 'https://www.facebook.com/abromacdevelopments'

export const sources = {
  abr: { label: 'Australian Business Register', url: 'https://abr.business.gov.au/ABN/View?id=58653444047' },
  melton: {
    label: 'City of Melton planning report (PDF)',
    url: 'https://www.melton.vic.gov.au/files/assets/public/v/1/services/building-planning-amp-transport/statutory-planning/advertised-planning-applications/2022/july-2022/pa2021-7770/pa2021-7770-1-rfi-town-planning-report.pdf',
  },
  winchelsea: { label: 'Facebook update, 10 June 2025', url: 'https://www.facebook.com/abromacdevelopments/posts/pfbid0y7eaJjexjDBuBDwYk41boH3hvm7ppWu31LUT2CFfFKfA7Yhmfk1QLwvAPQzVFs9nl' },
  stLeonards: { label: 'Facebook update, 12 June 2025', url: 'https://www.facebook.com/abromacdevelopments/posts/pfbid02wJUhCLwqH1nRQbcsC3NUgPuv5FjtTpZ9H8PYSPR14Mxo3bsPLiTMiVuxJt4mvr9jl' },
  winterValley: { label: 'Facebook update, 16 June 2025', url: 'https://www.facebook.com/abromacdevelopments/posts/pfbid0dCeDmKaWHs5kAYDHEYGKm4JDH6SJSzy84NUMYq78qkZuvBUYtz52qnq3A18fFiRPl' },
} satisfies Record<string, SourceLink>

export const navigation = [
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
]

export const pageTitles: Record<string, string> = {
  '/': 'Permits Hub — Planning with a clearer path forward',
  '/services': 'Planning Services — Permits Hub',
  '/projects': 'Projects — Permits Hub',
  '/about': 'About Permits Hub',
  '/faqs': 'FAQs — Permits Hub',
  '/contact': 'Contact Permits Hub',
}

/** Options shared by the Home starter and the Contact form. */
export const projectTypes = [
  'Childcare or community facility',
  'Commercial development',
  'Residential development',
  'Site feasibility',
  'Planning permit',
  'Other',
] as const

export const projectStages = [
  'Exploring an idea',
  'Preparing an application',
  'Already in council review',
  'Permit issued, planning next steps',
] as const

/** Regions where a public source places Permits Hub's work. */
export const publicRegions: { name: string; note: string; source: SourceLink }[] = [
  { name: 'Melton', note: 'Town planning report for an 81-place childcare centre (2022)', source: sources.melton },
  { name: 'Ballarat', note: 'Winter Valley swim school approval (June 2025)', source: sources.winterValley },
  { name: 'Greater Geelong', note: 'St Leonards 94-place childcare approval (June 2025)', source: sources.stLeonards },
  { name: 'Surf Coast', note: 'Winchelsea 100-place childcare permits (June 2025)', source: sources.winchelsea },
]
