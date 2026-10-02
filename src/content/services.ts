import type { LucideIcon } from 'lucide-react'
import { Building2, ClipboardCheck, Compass, FileCheck2, GraduationCap, LandPlot } from 'lucide-react'
import type { ContentStatus, JourneyStageId } from './types'
import type { projectTypes } from './site'

/*
 * The six service titles and one-line descriptions come from the original website.
 * Everything else is DRAFT copy written for this build: the client should confirm scope before publication.
 */
export type Service = {
  id: string
  number: string
  title: string
  description: string
  icon: LucideIcon
  status: ContentStatus
  involves: string
  whoFor: string[]
  situations: string[]
  inputs: string[]
  deliverables: string[]
  conversation: string
  stages: JourneyStageId[]
  relatedProjects?: string[]
  enquiryType: (typeof projectTypes)[number]
}

export const services: Service[] = [
  {
    id: 'planning-permits',
    number: '01',
    title: 'Planning permit support',
    description: 'Clear guidance through the documentation, application and council review process.',
    icon: FileCheck2,
    status: 'draft',
    involves:
      'Preparing a planning permit application and working through council’s assessment. That can include requests for further information, public notice, comments from referral authorities and the conditions attached to a permit. The aim is a complete, well-reasoned application that is easier for council to assess.',
    whoFor: [
      'Landowners and developers with a design that is ready, or close to it',
      'Business operators who need approval for a new use of land',
      'Architects and designers who want a planning lead alongside them',
    ],
    situations: [
      'Your designer has drawings and the application needs a town planning report',
      'Council has issued a request for further information',
      'The application is on public notice and objections have been received',
      'You need to understand what the permit conditions require',
    ],
    inputs: ['Certificate of title and any covenants', 'Survey or site plan', 'Proposed plans and elevations', 'Any previous council correspondence'],
    deliverables: [
      'Town planning report addressing the relevant planning scheme provisions',
      'Application forms and a coordinated document set',
      'Written responses to further information requests',
      'A summary of permit conditions and what they mean for the next stage',
    ],
    conversation: 'Share the property address, what you want to build or use the land for, and any drawings you already have.',
    stages: ['apply', 'assess', 'decide'],
    relatedProjects: ['winchelsea-childcare', 'st-leonards-childcare', 'winter-valley-swim-school'],
    enquiryType: 'Planning permit',
  },
  {
    id: 'site-feasibility',
    number: '02',
    title: 'Site feasibility & due diligence',
    description: 'Explore the planning considerations that matter before committing to a site or concept.',
    icon: Compass,
    status: 'draft',
    involves:
      'An early look at a property’s planning controls before you buy, lease or commit to a design. It sets out what the zone and overlays allow, what may need a permit, and which issues could shape the design, the cost or the timeframe.',
    whoFor: [
      'Buyers comparing sites before signing a contract',
      'Investors testing whether a concept is realistic',
      'Operators searching for a location for a new facility',
      'Landowners weighing up a site’s potential',
    ],
    situations: [
      'Looking at a site with a “development potential” listing',
      'Checking whether a proposed use is permitted, needs a permit or is prohibited',
      'You are unsure how an overlay affects the land',
      'A lender or partner has asked for planning advice',
    ],
    inputs: ['Property address or lot and plan number', 'The use or development you have in mind', 'Any sale contract or Section 32 statement', 'Your timing and budget constraints'],
    deliverables: [
      'Summary of zone, overlays and relevant particular provisions',
      'List of likely permit triggers and approvals',
      'Key constraints and opportunities, marked up on a site plan',
      'Recommended next steps and specialist inputs',
    ],
    conversation: 'Send the address and a sentence about the idea. A listing link or a sketch is helpful but optional.',
    stages: ['site', 'concept'],
    enquiryType: 'Site feasibility',
  },
  {
    id: 'zoning-advice',
    number: '03',
    title: 'Town planning & zoning advice',
    description: 'Make better informed decisions about land use, development potential and approvals.',
    icon: LandPlot,
    status: 'draft',
    involves:
      'Interpreting the planning scheme for your site and your question. That could be whether a use is allowed, how a set of controls applies, or which pathway makes sense. Advice can be verbal or written, depending on what the decision needs.',
    whoFor: [
      'Owners with a specific question about their land',
      'Businesses expanding or changing how a property is used',
      'Design teams checking controls before they finalise a concept',
    ],
    situations: [
      'You have received a council letter and are unsure what it means',
      'The property is affected by an overlay or planning scheme amendment',
      'A proposed use sits between categories in the planning scheme',
      'You need to know whether a permit is required at all',
    ],
    inputs: ['Property address', 'A description of the question or proposal', 'Relevant council letters or previous permits'],
    deliverables: ['Written advice on permit triggers and relevant provisions', 'Commentary on policy and likely areas of focus', 'Options for the approval pathway'],
    conversation: 'Tell us the address and the question you are trying to answer.',
    stages: ['site', 'concept', 'apply', 'assess', 'decide'],
    enquiryType: 'Planning permit',
  },
  {
    id: 'commercial-development',
    number: '04',
    title: 'Commercial development',
    description: 'Planning input for business spaces, facilities and projects with multiple moving parts.',
    icon: Building2,
    status: 'draft',
    involves:
      'Planning support for offices, shops, clinics, warehouses and mixed-use buildings. Commercial proposals often involve car parking, signage, loading, hours of operation and amenity for neighbours. Each of these needs to be addressed clearly in the application.',
    whoFor: [
      'Business owners moving into or fitting out new premises',
      'Developers of commercial or light industrial buildings',
      'Landlords repositioning a property for new tenants',
    ],
    situations: [
      'A tenancy needs a change of use permit',
      'The proposal needs car parking waivers or reductions',
      'New business signage needs a permit',
      'A warehouse or showroom is being extended',
    ],
    inputs: ['Floor plans and proposed operating details', 'Staff and customer numbers', 'Existing permits for the site', 'Car parking and loading arrangements'],
    deliverables: ['Planning report for use and development', 'Car parking and operational statement', 'Signage and advertising assessment', 'Coordination notes for traffic and acoustic inputs'],
    conversation: 'Describe the business, the premises and how you plan to operate from the site.',
    stages: ['concept', 'apply', 'assess'],
    enquiryType: 'Commercial development',
  },
  {
    id: 'childcare-community',
    number: '05',
    title: 'Childcare & community facilities',
    description: 'Thoughtful planning guidance for facilities that serve growing local communities.',
    icon: GraduationCap,
    status: 'draft',
    involves:
      'Planning for early learning centres, recreation facilities and other community uses. These proposals usually attract attention to traffic, drop-off, noise from outdoor play, hours and landscaping. Permits Hub’s public project updates include childcare centres and a swim school.',
    whoFor: ['Childcare operators and developers', 'Community, recreation and sporting organisations', 'Landowners with a site suited to a community use'],
    situations: [
      'Choosing between possible sites for a new centre',
      'Preparing an application for a childcare centre or swim school',
      'Council has raised traffic, noise or amenity concerns',
      'Neighbours have lodged objections',
    ],
    inputs: ['Site address and proposed number of places', 'Concept design or operator brief', 'Proposed hours and staff numbers', 'Traffic, acoustic or arborist reports, if already prepared'],
    deliverables: ['Site suitability review', 'Town planning report and application package', 'Response to amenity and traffic issues', 'Support through council assessment'],
    conversation: 'Share the site, the number of places or facility size, and where the project is up to.',
    stages: ['site', 'concept', 'apply', 'assess'],
    relatedProjects: ['winchelsea-childcare', 'st-leonards-childcare', 'winter-valley-swim-school'],
    enquiryType: 'Childcare or community facility',
  },
  {
    id: 'development-coordination',
    number: '06',
    title: 'Development coordination',
    description: 'A connected view of the journey from early permits toward the next project stage.',
    icon: ClipboardCheck,
    status: 'draft',
    involves:
      'Keeping the planning side of a project connected to design, consultants and the next stage. This can include a roadmap, tracking permit conditions and preparing for building permits, so decisions made at one stage don’t cause problems at the next.',
    whoFor: ['Developers running several consultants at once', 'Owners who want one point of contact for planning matters', 'Builders who need to understand planning conditions'],
    situations: [
      'A permit has been issued and conditions must be satisfied',
      'Several reports need to be prepared in a sensible order',
      'The design has changed and the permit may need amending',
    ],
    inputs: ['Current permits and endorsed plans', 'Consultant list and programme', 'Upcoming deadlines or milestones'],
    deliverables: ['Planning roadmap for the project', 'Tracker for permit conditions', 'Coordinated information for the building surveyor', 'Advice on amendments or secondary consent'],
    conversation: 'Tell us what has been approved so far and what needs to happen next.',
    stages: ['apply', 'assess', 'decide'],
    relatedProjects: ['winchelsea-childcare'],
    enquiryType: 'Other',
  },
]

export const journeyStages: { id: JourneyStageId; label: string; short: string }[] = [
  { id: 'site', label: 'Before you commit', short: 'Site' },
  { id: 'concept', label: 'Concept & design', short: 'Concept' },
  { id: 'apply', label: 'Application', short: 'Apply' },
  { id: 'assess', label: 'Council assessment', short: 'Assess' },
  { id: 'decide', label: 'After a decision', short: 'Decide' },
]

/** Service finder on the Services page (draft). */
export const serviceFinder: { stage: JourneyStageId; prompt: string; answer: string; services: string[] }[] = [
  { stage: 'site', prompt: 'I’m looking at a site', answer: 'Start with a feasibility review. It shows what the zone and overlays allow before you commit to the land.', services: ['site-feasibility', 'zoning-advice'] },
  { stage: 'concept', prompt: 'I’m working on a design', answer: 'Planning input during design can align the concept with the controls before drawings are finalised.', services: ['zoning-advice', 'commercial-development', 'childcare-community'] },
  { stage: 'apply', prompt: 'I’m ready to apply', answer: 'The application needs a planning report and a coordinated set of documents that address the relevant provisions.', services: ['planning-permits', 'development-coordination'] },
  { stage: 'assess', prompt: 'Council has come back to me', answer: 'A clear, well-reasoned response to further information requests or objections can keep the assessment moving.', services: ['planning-permits', 'childcare-community'] },
  { stage: 'decide', prompt: 'I have a permit', answer: 'Permit conditions and endorsed plans shape the next stage. Coordination keeps them connected to the building permit.', services: ['development-coordination', 'planning-permits'] },
]

/** Who commonly contributes to an application. Not a list of staff. */
export const coordinationRoles = [
  { role: 'Architect or building designer', input: 'Site plan, floor plans and elevations' },
  { role: 'Land surveyor', input: 'Feature and level survey of the site' },
  { role: 'Traffic engineer', input: 'Car parking, access and traffic impact' },
  { role: 'Acoustic consultant', input: 'Noise assessment for sensitive neighbours' },
  { role: 'Arborist', input: 'Assessment of trees on and near the site' },
  { role: 'Landscape architect', input: 'Landscape concept and planting plan' },
  { role: 'Council planning officer', input: 'Assessment, requests and the decision' },
  { role: 'Building surveyor', input: 'Building permit at the next stage' },
]

/** Example engagement formats. No prices; scope and fees are confirmed per project (draft). */
export const engagementFormats = [
  { title: 'Initial conversation', body: 'A first discussion about the site and the idea, to understand the questions and what support might help.', suits: 'Anyone at an early stage' },
  { title: 'Feasibility review', body: 'A written review of the planning controls and constraints for a specific site and proposal.', suits: 'Buyers and early-stage projects' },
  { title: 'Application support', body: 'Preparing and managing a planning application from lodgement through to council’s decision.', suits: 'Projects with a design ready' },
  { title: 'Ongoing coordination', body: 'Planning support across several stages, including conditions, amendments and consultant inputs.', suits: 'Larger or multi-stage projects' },
]

export const consultationPrep = [
  { item: 'Property address', why: 'Confirms the planning zone, overlays and any site history.' },
  { item: 'Certificate of title', why: 'Shows covenants, easements and restrictions that can affect a proposal.' },
  { item: 'Photos of the site and street', why: 'Helps describe the context before anyone visits.' },
  { item: 'Any sketches or drawings', why: 'Even rough ideas help frame the planning questions.' },
  { item: 'Council letters or permits', why: 'Existing correspondence often sets the next step.' },
  { item: 'Your timeframe and budget range', why: 'Helps suggest a realistic pathway and level of support.' },
]
