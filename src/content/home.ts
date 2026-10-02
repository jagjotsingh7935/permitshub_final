import type { Faq } from './types'

/* Home page content. All DRAFT unless noted: written for this build, client to review. */

export const audiences = [
  { title: 'Landowners', body: 'Understanding what a property can support before spending on design.' },
  { title: 'Developers & investors', body: 'Testing sites and managing applications with several moving parts.' },
  { title: 'Business owners', body: 'Moving into new premises or changing how a property is used.' },
  { title: 'Childcare & community operators', body: 'Planning facilities that serve local families and neighbourhoods.' },
  { title: 'Builders & design teams', body: 'A planning lead alongside the drawings, reports and conditions.' },
]

export const enquiryGroups = [
  { heading: 'Using land', items: ['A change of use for a shop, clinic or office', 'A new childcare or early learning centre', 'A community or recreation facility'] },
  { heading: 'Building something new', items: ['Commercial and light industrial buildings', 'Townhouses and multi-dwelling proposals', 'Extensions that trigger a planning permit'] },
  { heading: 'Understanding a site', items: ['Feasibility before you buy', 'What the zone and overlays allow', 'Easements, covenants and restrictions on title'] },
  { heading: 'Working through council', items: ['Requests for further information', 'Public notice and objections', 'Permit conditions and amendments'] },
]

export const challenges = [
  { challenge: 'Council has asked for more information', response: 'Read the request against the planning scheme, confirm exactly what is needed and prepare one clear, complete response.' },
  { challenge: 'The property has an overlay I do not understand', response: 'Explain what the overlay controls, whether it triggers a permit and what it may mean for the design.' },
  { challenge: 'I’m not sure my idea is allowed', response: 'Check the zone first: whether the use is permitted, needs a permit or is prohibited, then look at the details.' },
  { challenge: 'Neighbours have objected', response: 'Understand the concerns, see whether the design can respond, and address the issues clearly for council.' },
  { challenge: 'My permit came with a long list of conditions', response: 'Map each condition, who is responsible and what must happen before works or occupation.' },
  { challenge: 'Too many consultants and no clear order', response: 'Set out which reports are needed, in what order, and keep them based on the same drawings.' },
]

export const planningJourney = [
  { number: '01', title: 'The idea', body: 'Tell us about the site, the intended use and what you hope to achieve.', bring: 'An address and a sentence about the idea' },
  { number: '02', title: 'The planning context', body: 'Review the zone, overlays and constraints that shape a sensible pathway.', bring: 'Title, photos, any council history' },
  { number: '03', title: 'The application', body: 'Bring the plans, reports and planning assessment together for lodgement.', bring: 'Drawings and consultant reports' },
  { number: '04', title: 'Assessment', body: 'Respond to council requests, referrals and any public notice.', bring: 'Quick decisions on design changes' },
  { number: '05', title: 'The next decision', body: 'Understand the conditions, amendments and the step after a planning outcome.', bring: 'The permit and endorsed plans' },
]

export const homeFaqs: Faq[] = [
  // The first four answers are from the original website.
  { status: 'verified', question: 'When should I speak with a town planner?', answer: 'Early in the process is helpful, especially before you commit to a site, finalise a design or lodge an application. An initial discussion can help identify the questions worth investigating first.' },
  { status: 'verified', question: 'Can you help me understand whether my idea is feasible?', answer: 'Permits Hub offers planning and feasibility guidance. Share the property address and a short description of your idea so the team can discuss the appropriate next step.' },
  { status: 'verified', question: 'Do all projects follow the same approval process?', answer: 'No. The pathway depends on the property, proposed use, design and applicable planning controls. The site can help you start the conversation, but project-specific advice comes after a review of your details.' },
  { status: 'draft', question: 'What is the difference between a planning permit and a building permit?', answer: 'A planning permit considers whether a use or development is appropriate for the land under the planning scheme, and is issued by council. A building permit deals with construction standards and safety, and is issued by a building surveyor. Many projects need both, usually planning first.' },
  { status: 'draft', question: 'What are zones and overlays?', answer: 'Zones set out which uses are allowed on land and the general rules for development. Overlays add extra controls for specific issues such as heritage, flooding, bushfire or vegetation. Together they shape what needs a permit.' },
  { status: 'verified', question: 'What should I include in my first enquiry?', answer: 'A property address or general location, the type of development, your current stage and any drawings or plans you already have are a useful starting point.' },
]
