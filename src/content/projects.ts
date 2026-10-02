import { sources } from './site'
import type { SourceLink } from './types'

export type ProjectCategory = 'Childcare' | 'Community & recreation' | 'Commercial' | 'Industrial' | 'Residential'
export const projectCategories: ProjectCategory[] = ['Childcare', 'Community & recreation', 'Commercial', 'Industrial', 'Residential']

/** Use these carefully: a status must match what the source actually says. */
export type ProjectStatus = 'in-planning' | 'permit-approved' | 'under-construction' | 'completed'
export const statusLabels: Record<ProjectStatus, string> = {
  'in-planning': 'In planning',
  'permit-approved': 'Permit approved',
  'under-construction': 'Under construction',
  completed: 'Completed',
}

export type IllustrationVariant = 'clinic' | 'warehouse' | 'townhouses' | 'hall'
type Fact = { label: string; value: string }
type Milestone = { when: string; label: string; detail: string; source?: SourceLink }

type ProjectBase = {
  slug: string
  title: string
  place: string
  category: ProjectCategory
  status: ProjectStatus
  highlight: string
  summary: string
  keyFacts: Fact[]
  documentedInvolvement: string[]
  milestones: Milestone[]
  outcome: string
  nextSteps: string
  tone: 'blue' | 'sand' | 'sage'
}

/** Real projects. Every statement must be supported by the linked public update. */
export type VerifiedProject = ProjectBase & {
  record: 'verified'
  region: string
  /** Date of the public update (ISO). Status is "as reported" on this date. */
  updateDate: string
  statusNote: string
  cover: { src: string; alt: string; caption: string; position?: string }
  gallery: { src: string; alt: string; caption: string; fit?: 'cover' | 'contain' }[]
  sources: SourceLink[]
}

/** Fictional scenarios that demonstrate the layout. Always labelled "Demo project". */
export type DemoProject = ProjectBase & {
  record: 'demo'
  siteContext: string[]
  planningConsiderations: string[]
  illustration: IllustrationVariant
  cover?: { src: string; alt: string; caption: string; position?: string }
  gallery?: { src: string; alt: string; caption: string; fit?: 'cover' | 'contain' }[]
}

export type Project = VerifiedProject | DemoProject
export const isVerified = (project: Project): project is VerifiedProject => project.record === 'verified'

export const verifiedProjects: VerifiedProject[] = [
  {
    record: 'verified',
    slug: 'st-leonards-childcare',
    title: '94-place childcare centre',
    place: 'St Leonards, Greater Geelong',
    region: 'Greater Geelong',
    category: 'Childcare',
    status: 'permit-approved',
    statusNote: 'Reported as approved on 12 June 2025',
    updateDate: '2025-06-12',
    highlight: '94 places',
    summary: 'A public update from Permits Hub announced approval of a 94-place childcare centre in St Leonards, within the City of Greater Geelong.',
    keyFacts: [
      { label: 'Use', value: 'Childcare centre' },
      { label: 'Capacity', value: '94 places' },
      { label: 'Council named', value: 'Geelong City Council' },
      { label: 'Reported status', value: 'Approved (June 2025)' },
    ],
    documentedInvolvement: [
      'Permits Hub announced the approval in its own public project update.',
      'The update described the project as “10 years in the making for local families”.',
    ],
    milestones: [{ when: '2025-06-12', label: 'Approval announced', detail: 'Permits Hub shared “Childcare approved!” for St Leonards, naming Geelong City Council and 94 places.', source: sources.stLeonards }],
    cover: {
      src: '/images/crops/st-leonards-render.jpg',
      alt: 'Architectural render of the proposed St Leonards childcare centre behind established trees',
      caption: 'Architectural render cropped from Permits Hub’s announcement. A proposed design, not a photograph of a completed building.',
      position: '55% 60%',
    },
    gallery: [
      {
        src: 'https://images.pexels.com/photos/259243/pexels-photo-259243.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Architectural rendering of a modern childcare facility',
        caption: 'Architectural concept rendering. Representative design, not a photograph of a completed building.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/4458210/pexels-photo-4458210.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Architectural floor plan close-up',
        caption: 'Representative architectural floor plan documentation.',
        fit: 'cover',
      },
      {
        src: '/images/st-leonards-childcare.jpg',
        alt: 'Permits Hub announcement: Childcare approved, St Leonards, Geelong City Council, 94 kids capacity, 10 years in the making for local families',
        caption: 'The full announcement graphic as published on Facebook, 12 June 2025.',
        fit: 'contain',
      },
    ],
    outcome: 'The public update reports that the proposal was approved. It does not describe permit conditions or a construction date, so none are stated here.',
    nextSteps: 'Later stages, such as satisfying any permit conditions and obtaining a building permit, would be confirmed by the project team. This page will be updated if a new public update is shared.',
    sources: [sources.stLeonards],
    tone: 'sand',
  },
  {
    record: 'verified',
    slug: 'winchelsea-childcare',
    title: '100-place childcare centre in Winchelsea',
    place: 'Winchelsea, Victoria',
    region: 'Surf Coast',
    category: 'Childcare',
    status: 'permit-approved',
    statusNote: 'Planning & building permits reported on 10 June 2025',
    updateDate: '2025-06-10',
    highlight: '100 places',
    summary: 'Permits Hub reported that the planning permit was approved in two months and the building permit finalised for a 100-place childcare centre in Winchelsea.',
    keyFacts: [
      { label: 'Use', value: 'Childcare centre' },
      { label: 'Capacity', value: '100 places' },
      { label: 'Planning permit', value: 'Reported approved in 2 months' },
      { label: 'Building permit', value: 'Reported finalised' },
    ],
    documentedInvolvement: [
      'Permits Hub announced the planning permit and building permit in its public update.',
      'The update described Winchelsea as a high demand area for childcare.',
    ],
    milestones: [
      { when: '2025-06-10', label: 'Planning permit reported approved', detail: 'The announcement stated the planning permit was approved in just two months.', source: sources.winchelsea },
      { when: '2025-06-10', label: 'Building permit reported finalised', detail: 'The same update stated the building permit was finalised.', source: sources.winchelsea },
      { when: 'June 2025 forecast', label: 'Construction “commencing soon”', detail: 'This was a forecast in June 2025, not a confirmed current status. Current construction progress has not been publicly confirmed.' },
    ],
    cover: {
      src: '/images/crops/winchelsea-render.jpg',
      alt: 'Architectural render of the proposed Winchelsea childcare centre with gabled brick and glazed forms',
      caption: 'Architectural render shared by Permits Hub. A proposed design, not a photograph of a completed building.',
      position: '50% 55%',
    },
    gallery: [
      {
        src: 'https://images.pexels.com/photos/36934806/pexels-photo-36934806.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern building facade representative of a childcare centre proposal',
        caption: 'Concept image representative of a modern childcare facility. Not a photograph of the completed Winchelsea centre.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/8470057/pexels-photo-8470057.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Construction documents and planning paperwork',
        caption: 'Representative planning and building documentation.',
        fit: 'cover',
      },
      { src: '/images/winchelsea-render.jpg', alt: 'Full architectural render of the proposed Winchelsea childcare centre', caption: 'Full render as shared by Permits Hub.' },
      {
        src: '/images/winchelsea-announcement.jpg',
        alt: 'Permits Hub announcement: childcare centre coming soon, Winchelsea, high demand area, planning permit approved in just 2 months, building permit finalised, 100 places',
        caption: 'Announcement graphic from the June 2025 update. Client to confirm this graphic matches the linked post.',
        fit: 'contain',
      },
    ],
    outcome: 'The public update reports two approvals: a planning permit, approved in about two months, and a finalised building permit.',
    nextSteps: 'In June 2025 construction was described as commencing soon. Treat that as a historical forecast until the client confirms whether the centre is under construction or completed.',
    sources: [sources.winchelsea],
    tone: 'sage',
  },
  {
    record: 'verified',
    slug: 'winter-valley-swim-school',
    title: 'A new swim school for Winter Valley',
    place: 'Winter Valley, Ballarat',
    region: 'Ballarat',
    category: 'Community & recreation',
    status: 'permit-approved',
    statusNote: 'Reported as approved on 16 June 2025',
    updateDate: '2025-06-16',
    highlight: 'Permit approved',
    summary: 'Permits Hub shared that a permit had been approved for a new swim school in Winter Valley, Ballarat, and described the project as ready to build.',
    keyFacts: [
      { label: 'Use', value: 'Swim school' },
      { label: 'Location', value: 'Winter Valley, Ballarat' },
      { label: 'Reported status', value: 'Permit approved' },
      { label: 'Described as', value: 'Ready to build (June 2025)' },
    ],
    documentedInvolvement: [
      'Permits Hub announced the approval in its public update.',
      'The graphic described the project as helping the Ballarat community access better facilities.',
    ],
    milestones: [{ when: '2025-06-16', label: 'Approval announced', detail: 'Permits Hub shared “Swim school approved!” for Winter Valley, Ballarat.', source: sources.winterValley }],
    cover: {
      src: '/images/crops/winter-valley-views.jpg',
      alt: 'Three circular design views of the proposed Winter Valley swim school building',
      caption: 'Design views cropped from Permits Hub’s announcement graphic. Proposed design, not a completed building.',
      position: '50% 50%',
    },
    gallery: [
      {
        src: 'https://images.pexels.com/photos/13155141/pexels-photo-13155141.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Indoor swimming pool representative of a swim school facility',
        caption: 'Representative image of an indoor swim school environment. Not a photograph of the Winter Valley facility.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/6011891/pexels-photo-6011891.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Indoor swimming pool lane',
        caption: 'Representative swim school environment.',
        fit: 'cover',
      },
      {
        src: '/images/winter-valley-swim-school.jpg',
        alt: 'Permits Hub announcement: Swim school approved, Winter Valley, Ballarat, helping the Ballarat community access better facilities',
        caption: 'The full announcement graphic as published on Facebook, 16 June 2025.',
        fit: 'contain',
      },
    ],
    outcome: 'The update reports that the permit was approved and that the project was ready to build at that time.',
    nextSteps: 'Current construction status has not been publicly confirmed. Client to advise before any later status is shown.',
    sources: [sources.winterValley],
    tone: 'blue',
  },
]

/* DEMO PROJECTS: fictional scenarios for layout demonstration. Replace or remove before launch. */
export const demoProjects: DemoProject[] = [
  {
    record: 'demo',
    slug: 'demo-shopfront-clinic',
    title: 'Shopfront to allied health clinic',
    place: 'Illustrative suburban strip, regional Victoria',
    category: 'Commercial',
    status: 'permit-approved',
    highlight: 'Change of use',
    summary: 'A fictional scenario: a vacant shop in a small commercial strip is converted to an allied health clinic with four consulting rooms.',
    keyFacts: [
      { label: 'Scenario', value: 'Change of use and minor works' },
      { label: 'Floor area', value: 'About 180 m² (illustrative)' },
      { label: 'Key issue', value: 'Car parking reduction' },
      { label: 'Stage shown', value: 'Illustrative permit approved' },
    ],
    siteContext: ['Single-storey shop in a row of five tenancies', 'On-street parking only, with a supermarket car park nearby', 'Residential properties behind a rear laneway'],
    planningConsiderations: ['Whether the use needs a permit in the commercial zone', 'Car parking demand compared with the previous use', 'Signage on the existing shopfront', 'Hours of operation and rear lane access'],
    documentedInvolvement: ['Illustrative role: review of zone and parking provisions', 'Car parking statement prepared with a traffic engineer', 'Planning report and application lodged with council'],
    milestones: [
      { when: 'Stage 1', label: 'Feasibility check', detail: 'Zone, overlays and parking requirements reviewed before the lease was signed.' },
      { when: 'Stage 2', label: 'Application lodged', detail: 'Planning report, floor plan and parking statement submitted.' },
      { when: 'Stage 3', label: 'Further information', detail: 'Council requested clarification of practitioner numbers.' },
      { when: 'Stage 4', label: 'Permit issued', detail: 'Illustrative outcome with conditions on hours and signage.' },
    ],
    outcome: 'Illustrative outcome: a permit with conditions limiting hours and requiring a signage plan.',
    nextSteps: 'In a real project, the fit-out would proceed once conditions are satisfied and a building permit is issued.',
    illustration: 'clinic',
    tone: 'blue',
    cover: {
      src: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Modern commercial storefront and medical consulting rooms',
      caption: 'Representative allied health consulting rooms. Conceptual scenario, not a real project.',
    },
    gallery: [
      {
        src: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern commercial shopfront exterior',
        caption: 'Representative shopfront facade suitable for commercial conversion.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern clinic consultation room interior',
        caption: 'Representative allied health consulting room layout.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/4458210/pexels-photo-4458210.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Commercial architectural floor plan and car parking diagram',
        caption: 'Illustrative floor plan documentation for a commercial change-of-use application.',
        fit: 'cover',
      },
    ],
  },
  {
    record: 'demo',
    slug: 'demo-warehouse-extension',
    title: 'Warehouse extension and loading bay',
    place: 'Illustrative industrial estate',
    category: 'Industrial',
    status: 'under-construction',
    highlight: '+1,200 m²',
    summary: 'A fictional scenario: an existing warehouse adds a storage bay and a new loading area on land at the rear of the lot.',
    keyFacts: [
      { label: 'Scenario', value: 'Buildings and works' },
      { label: 'Extension', value: 'About 1,200 m² (illustrative)' },
      { label: 'Key issue', value: 'Truck movements and landscaping' },
      { label: 'Stage shown', value: 'Illustrative construction' },
    ],
    siteContext: ['Large lot in an industrial zone', 'Existing crossover used by trucks', 'Landscape strip required along the street frontage'],
    planningConsiderations: ['Setbacks and landscaping along the frontage', 'Swept paths for larger vehicles', 'Stormwater management for the new hardstand', 'Interface with a nearby residential zone'],
    documentedInvolvement: ['Illustrative role: permit application and coordination', 'Traffic and civil inputs brought into one document set', 'Conditions tracked through to the building permit'],
    milestones: [
      { when: 'Stage 1', label: 'Concept review', detail: 'Extension positioned to keep the existing crossover.' },
      { when: 'Stage 2', label: 'Permit application', detail: 'Planning report with swept path and drainage plans.' },
      { when: 'Stage 3', label: 'Permit and conditions', detail: 'Landscape plan endorsed as a condition.' },
      { when: 'Stage 4', label: 'Construction', detail: 'Illustrative current stage.' },
    ],
    outcome: 'Illustrative outcome: permit issued, conditions satisfied and construction commenced.',
    nextSteps: 'In a real project, the landscape plan would be checked on completion.',
    illustration: 'warehouse',
    tone: 'sage',
    cover: {
      src: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Industrial warehouse building with concrete hardstand and loading area',
      caption: 'Representative industrial logistics building. Conceptual scenario, not a real project.',
    },
    gallery: [
      {
        src: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Industrial facility exterior and loading bay',
        caption: 'Representative warehouse extension and loading area.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Warehouse storage interior with high-bay racking',
        caption: 'Representative high-bay industrial storage space.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/8470057/pexels-photo-8470057.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Civil engineering drawings and swept path documentation',
        caption: 'Illustrative vehicle swept path and stormwater documentation.',
        fit: 'cover',
      },
    ],
  },
  {
    record: 'demo',
    slug: 'demo-three-townhouses',
    title: 'Three townhouses on a suburban lot',
    place: 'Illustrative residential street',
    category: 'Residential',
    status: 'in-planning',
    highlight: '3 dwellings',
    summary: 'A fictional scenario: an existing house is replaced by three double-storey townhouses on a long, narrow lot.',
    keyFacts: [
      { label: 'Scenario', value: 'Multi-dwelling development' },
      { label: 'Dwellings', value: '3 townhouses (illustrative)' },
      { label: 'Key issue', value: 'Neighbourhood character' },
      { label: 'Stage shown', value: 'Illustrative planning stage' },
    ],
    siteContext: ['Deep lot with a single street frontage', 'Established street trees and front gardens', 'Single-storey neighbours on both sides'],
    planningConsiderations: ['Neighbourhood character and street setbacks', 'Overlooking and overshadowing of neighbours', 'Private open space for each dwelling', 'Driveway width and car parking'],
    documentedInvolvement: ['Illustrative role: design review against residential standards', 'Early meeting with council to test the layout', 'Application preparation'],
    milestones: [
      { when: 'Stage 1', label: 'Site analysis', detail: 'Neighbouring windows and open space mapped.' },
      { when: 'Stage 2', label: 'Design response', detail: 'Upper levels set back to reduce overlooking.' },
      { when: 'Stage 3', label: 'Pre-application meeting', detail: 'Illustrative current stage.' },
    ],
    outcome: 'Illustrative outcome: not yet lodged. This scenario shows how an in-progress project could be presented.',
    nextSteps: 'In a real project, the application would be lodged after the design is refined.',
    illustration: 'townhouses',
    tone: 'sand',
    cover: {
      src: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Contemporary multi-dwelling residential townhouses',
      caption: 'Representative residential townhouse development. Conceptual scenario, not a real project.',
    },
    gallery: [
      {
        src: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern residential townhouse facade and landscaping',
        caption: 'Representative architectural townhouse facade.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Townhouse entrance and private open space',
        caption: 'Representative private open space and streetscape presentation.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/4134179/pexels-photo-4134179.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Architectural residential plans and elevations',
        caption: 'Illustrative residential subdivision and building envelope drawings.',
        fit: 'cover',
      },
    ],
  },
  {
    record: 'demo',
    slug: 'demo-community-hall',
    title: 'Community hall accessibility upgrade',
    place: 'Illustrative township',
    category: 'Community & recreation',
    status: 'completed',
    highlight: 'Accessible entry',
    summary: 'A fictional scenario: an older weatherboard hall adds an accessible entry, ramp and amenities wing while keeping its heritage character.',
    keyFacts: [
      { label: 'Scenario', value: 'Alterations in a heritage overlay' },
      { label: 'Works', value: 'Ramp, entry and amenities wing' },
      { label: 'Key issue', value: 'Heritage character' },
      { label: 'Stage shown', value: 'Illustrative completed' },
    ],
    siteContext: ['Early 20th-century weatherboard hall', 'Heritage overlay across the township centre', 'Shared car park with a sports reserve'],
    planningConsiderations: ['Heritage overlay permit for external works', 'New wing designed to read as secondary', 'Access and disabled parking', 'Materials and colours'],
    documentedInvolvement: ['Illustrative role: heritage and planning pathway', 'Coordination with a heritage adviser', 'Application and condition sign-off'],
    milestones: [
      { when: 'Stage 1', label: 'Heritage review', detail: 'Significant fabric identified before design began.' },
      { when: 'Stage 2', label: 'Permit application', detail: 'Plans lodged with a heritage impact statement.' },
      { when: 'Stage 3', label: 'Permit issued', detail: 'Conditions on materials and colours.' },
      { when: 'Stage 4', label: 'Completed', detail: 'Illustrative final stage.' },
    ],
    outcome: 'Illustrative outcome: the hall reopens with an accessible entry and new amenities.',
    nextSteps: 'In a real project, this page could include before-and-after photographs supplied by the client.',
    illustration: 'hall',
    tone: 'sage',
    cover: {
      src: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Community civic pavilion with accessible entrance',
      caption: 'Representative community hall and civic facility. Conceptual scenario, not a real project.',
    },
    gallery: [
      {
        src: 'https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Civic community pavilion exterior',
        caption: 'Representative heritage civic building exterior.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Accessible ramp and timber entrance wing',
        caption: 'Representative accessible public entryway.',
        fit: 'cover',
      },
      {
        src: 'https://images.pexels.com/photos/8470057/pexels-photo-8470057.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Heritage impact statement and architectural specifications',
        caption: 'Illustrative heritage impact and compliance documentation.',
        fit: 'cover',
      },
    ],
  },
]

export const projects: Project[] = [...verifiedProjects, ...demoProjects]

/** General, educational guidance shown under "Typical considerations for this project type". Draft. */
export const typicalConsiderations: Record<ProjectCategory, string[]> = {
  Childcare: [
    'Traffic, drop-off and pick-up arrangements at peak times',
    'Noise from outdoor play areas and mechanical plant',
    'Car parking for staff and families',
    'Hours of operation',
    'Landscaping and fencing to neighbouring properties',
    'Location relative to other childcare centres and services',
  ],
  'Community & recreation': [
    'Access, car parking and public transport',
    'Hours of use and events',
    'Noise and light spill for neighbours',
    'Building bulk and design in the local setting',
    'Accessibility for people of all abilities',
  ],
  Commercial: [
    'Whether the use needs a permit in the zone',
    'Car parking and loading provisions',
    'Business signage',
    'Hours of operation and amenity',
    'Waste collection and servicing',
  ],
  Industrial: [
    'Truck access and swept paths',
    'Setbacks and landscaping to the street',
    'Stormwater and drainage',
    'Interfaces with nearby sensitive uses',
    'Outdoor storage and screening',
  ],
  Residential: [
    'Neighbourhood character and street setbacks',
    'Overlooking and overshadowing',
    'Private open space and landscaping',
    'Driveways, car parking and access',
    'Trees on and around the site',
  ],
}

const longFormat = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
const shortFormat = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })

/** Formats ISO dates in Australian style. Non-ISO values (such as "Stage 1") are returned unchanged. */
export function formatDate(value: string, style: 'long' | 'short' = 'long') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = new Date(`${value}T00:00:00`)
  return (style === 'long' ? longFormat : shortFormat).format(date)
}
