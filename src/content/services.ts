import type { LucideIcon } from 'lucide-react'
import { Building2, ClipboardCheck, Compass, FileCheck2, LandPlot } from 'lucide-react'
import type { ContentStatus, JourneyStageId } from './types'
import type { projectTypes } from './site'

/*
 * The five service names come from the client's brief (October 2026).
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
    id: 'due-diligence',
    number: '01',
    title: 'Town Planning – Due Diligence Services',
    description: 'Understand the planning controls, constraints and opportunities of a site before you commit to buying or developing it.',
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
    enquiryType: 'Site due diligence',
  },
  {
    id: 'multi-lot-subdivisions',
    number: '02',
    title: 'Town Planning – Multi Lot Subdivisions',
    description: 'Planning guidance for dividing land into multiple lots, from the first concept through to council approval.',
    icon: LandPlot,
    status: 'draft',
    involves:
      'Planning support for dividing land into several lots. Subdivision involves the planning scheme, council requirements and design decisions that all affect one another, such as lot sizes, access, servicing and the way each lot relates to the street. The aim is a concept that responds to the controls from the start.',
    whoFor: [
      'Landowners considering dividing a large lot',
      'Developers testing the yield of a site',
      'Design and survey teams preparing a subdivision layout',
    ],
    situations: [
      'You want to know how many lots a site could realistically support',
      'The layout needs a planning permit before plans can be certified',
      'Council has asked for more information about the proposed lots',
      'Neighbours or authorities have commented on the proposal',
    ],
    inputs: ['Certificate of title and any covenants or easements', 'Survey or site plan', 'A concept lot layout, if you have one', 'Any previous council correspondence'],
    deliverables: [
      'Feasibility view of how the land could be divided',
      'Town planning report for the subdivision application',
      'Coordinated application documents',
      'Written responses to council requests for further information',
    ],
    conversation: 'Share the address, the size of the land and how many lots you have in mind.',
    stages: ['concept', 'apply', 'assess', 'decide'],
    enquiryType: 'Subdivision',
  },
  {
    id: 'use-and-development-permits',
    number: '03',
    title: 'Town Planning – Use and Development Permits',
    description: 'Design documentation and town planning services to prepare and manage permit applications for a new use or development.',
    icon: FileCheck2,
    status: 'draft',
    involves:
      'Preparing a planning permit application for a new use or development and working through council’s assessment. That can include design documentation, a town planning report, requests for further information, public notice, referral comments and the conditions attached to a permit.',
    whoFor: [
      'Landowners and developers with a design that is ready, or close to it',
      'Business operators who need approval for a new use of land',
      'Architects and designers who want a planning lead alongside them',
    ],
    situations: [
      'Your designer has drawings and the application needs a town planning report',
      'A building needs a change of use permit',
      'Council has issued a request for further information',
      'The application is on public notice and objections have been received',
    ],
    inputs: ['Certificate of title and any covenants', 'Survey or site plan', 'Proposed plans and elevations', 'Any previous council correspondence'],
    deliverables: [
      'Design documentation coordinated for the application',
      'Town planning report addressing the relevant planning scheme provisions',
      'Application forms and a coordinated document set',
      'A summary of permit conditions and what they mean for the next stage',
    ],
    conversation: 'Share the property address, what you want to build or use the land for, and any drawings you already have.',
    stages: ['concept', 'apply', 'assess', 'decide'],
    relatedProjects: ['winchelsea-childcare', 'st-leonards-childcare', 'winter-valley-swim-school'],
    enquiryType: 'Planning or building permit',
  },
  {
    id: 'building-permit',
    number: '04',
    title: 'Building Permit – Design and Documentation',
    description: 'Design and documentation prepared to support a building permit application once planning is in place.',
    icon: Building2,
    status: 'draft',
    involves:
      'Design and documentation that supports a building permit application, the step that usually follows planning approval. Building permits are issued by a building surveyor, so the documentation needs to match the planning permit and its endorsed plans.',
    whoFor: [
      'Owners and developers who have a planning permit and need to move to construction',
      'Builders who need documentation that reflects the permit conditions',
      'Project teams who want planning and building documents kept consistent',
    ],
    situations: [
      'A planning permit has been issued and the design is being developed further',
      'Permit conditions need to be reflected in the construction documents',
      'The design has changed and the permit may need amending',
    ],
    inputs: ['Planning permit and endorsed plans', 'Current design drawings', 'Consultant reports', 'Your preferred building surveyor, if you have one'],
    deliverables: [
      'Coordinated design and documentation set for the building permit',
      'Check of documentation against planning permit conditions',
      'Support with the building permit application',
      'Advice on amendments where the design has changed',
    ],
    conversation: 'Tell us what has been approved so far and where the design is up to.',
    stages: ['concept', 'decide'],
    relatedProjects: ['winchelsea-childcare'],
    enquiryType: 'Planning or building permit',
  },
  {
    id: 'construction-management',
    number: '05',
    title: 'Construction Stage – Project Consultation and Management',
    description: 'Consultation and management support as your project moves from approval into construction.',
    icon: ClipboardCheck,
    status: 'draft',
    involves:
      'Consultation and project management support through the construction stage, so decisions, documentation and milestones stay connected from approval to completion. Permits Hub does not supervise trades or administer building contracts; see the disclaimer on this page.',
    whoFor: [
      'Developers running several consultants and contractors at once',
      'Owners who want one point of contact for project questions',
      'Teams who need permit conditions tracked through construction',
    ],
    situations: [
      'A permit has been issued and conditions must be satisfied',
      'Several parties need to work from the same up-to-date information',
      'Decisions arise on site that affect the approved plans',
    ],
    inputs: ['Current permits and endorsed plans', 'Consultant and contractor list and programme', 'Upcoming deadlines or milestones'],
    deliverables: [
      'Project roadmap through to construction completion',
      'Tracker for permit conditions and milestones',
      'Consultation on project questions as they arise',
      'Coordinated information for the project team',
    ],
    conversation: 'Tell us where the project is up to and what support would help most.',
    stages: ['decide'],
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
  { stage: 'site', prompt: 'I’m looking at a site', answer: 'Start with due diligence. It shows what the zone and overlays allow before you commit to the land.', services: ['due-diligence', 'multi-lot-subdivisions'] },
  { stage: 'concept', prompt: 'I’m working on a design', answer: 'Planning input during design can align the concept with the controls before drawings are finalised.', services: ['use-and-development-permits', 'multi-lot-subdivisions', 'building-permit'] },
  { stage: 'apply', prompt: 'I’m ready to apply', answer: 'The application needs a planning report and a coordinated set of documents that address the relevant provisions.', services: ['use-and-development-permits', 'multi-lot-subdivisions'] },
  { stage: 'assess', prompt: 'Council has come back to me', answer: 'A clear, well-reasoned response to further information requests or objections can keep the assessment moving.', services: ['use-and-development-permits', 'multi-lot-subdivisions'] },
  { stage: 'decide', prompt: 'I have a permit', answer: 'Permit conditions and endorsed plans shape the next stage. Building permit documentation and construction-stage support keep them connected.', services: ['building-permit', 'construction-management'] },
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
