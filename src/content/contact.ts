import type { Faq } from './types'

/* Contact and Services guidance. DRAFT: client to review wording and confirm the process. */

export const prepareItems = [
  { title: 'Where the site is', body: 'An address, or a suburb if the site is not yet chosen. It tells us which planning scheme and controls apply.' },
  { title: 'What you want to do', body: 'The use, the building or the change you have in mind. A sentence is enough to begin.' },
  { title: 'Where you are up to', body: 'Exploring, designing, lodged or already in council review. Each stage suggests a different first step.' },
  { title: 'What you already have', body: 'Drawings, reports, council letters or a permit. Mention them even if they are rough or incomplete.' },
]

export const firstConversationChecklist = [
  'The property address or lot and plan number',
  'A short description of the proposal',
  'Any sketches, drawings or photos of the site',
  'Letters or requests from council',
  'Existing permits or endorsed plans',
  'Your ideal timeframe',
]

export const afterContactSteps = [
  { title: 'The team reviews your enquiry', body: 'Your details are read to understand the site, the proposal and any urgency.' },
  { title: 'A first conversation', body: 'A call or email to clarify the questions and what information would help.' },
  { title: 'A suggested next step', body: 'That might be a feasibility review, advice, or support with an application. Scope and fees are confirmed before any work begins.' },
]

export const contactFaqs: Faq[] = [
  { status: 'draft', question: 'Does this form send my enquiry?', answer: 'No. It prepares an email on your device with your details filled in. You review it and send it from your own email app. Nothing is stored or sent by this website.' },
  { status: 'draft', question: 'Do I need drawings before I get in touch?', answer: 'No. Many conversations start with just an address and an idea. Drawings help later, and early planning input can shape them.' },
  { status: 'draft', question: 'Can I call instead?', answer: 'Yes. Phone 0409 198 597 to talk through your project.' },
  { status: 'draft', question: 'Do you work outside the regions listed on this site?', answer: 'The regions shown are where public updates place Permits Hub’s work. Enquiries from elsewhere in Victoria are welcome; the team can advise whether they can help.' },
  { status: 'draft', question: 'Is the first conversation free?', answer: 'Placeholder for the client to confirm. Fees and scope are agreed before any work begins.' },
]

export const servicesFaqs: Faq[] = [
  { status: 'draft', question: 'Which service should I start with?', answer: 'If you are unsure, start with a conversation. Most projects begin with a feasibility review or advice, and then move to an application when a design is ready.' },
  { status: 'draft', question: 'Can Permits Hub guarantee a permit?', answer: 'No planner can guarantee a council decision. The aim is a well-prepared application that addresses the relevant planning controls clearly.' },
  { status: 'draft', question: 'What is a request for further information?', answer: 'Council may ask for more detail before it can assess an application. There is usually a deadline to respond, so it helps to act on it promptly.' },
  { status: 'draft', question: 'Do I need other consultants?', answer: 'It depends on the site and proposal. Traffic, acoustic, arborist or heritage input is common. The planning review can identify what is likely to be needed.' },
  { status: 'draft', question: 'Do you prepare building permits?', answer: 'Permits Hub provides design and documentation to support a building permit application. Building permits themselves are issued by a building surveyor.' },
]
