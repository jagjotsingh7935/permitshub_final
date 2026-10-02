export type FaqCategory =
  | 'Getting started'
  | 'Planning and building permits'
  | 'After an approval'
  | 'Working with Permits Hub'

export interface FaqItem {
  id: string
  category: FaqCategory
  question: string
  answer: string
}

export const faqCategories: FaqCategory[] = [
  'Getting started',
  'Planning and building permits',
  'After an approval',
  'Working with Permits Hub',
]

export const allFaqs: FaqItem[] = [
  {
    id: 'when-to-seek-advice',
    category: 'Getting started',
    question: 'When should I seek town planning advice?',
    answer:
      'As early as possible, and ideally before you commit to purchasing a property, signing a commercial lease, or finalizing architectural drawings. Planning controls shape what can be built, what uses are permitted, and what parking and traffic requirements will apply.',
  },
  {
    id: 'first-consultation',
    category: 'Getting started',
    question: 'What information should I have ready for a first consultation?',
    answer:
      'Any details you have are helpful: the property address or Certificate of Title, concept sketches, existing site photos, and a brief description of what you intend to do (for example, desired child places for a childcare facility or floor area for commercial use).',
  },
  {
    id: 'do-i-need-a-permit',
    category: 'Getting started',
    question: 'How do I know if my project needs a planning permit in Victoria?',
    answer:
      'It depends on the site zoning, planning overlays (such as Heritage, Design & Development, or Special Building Overlays), and the specific land use or building works proposed. We conduct a preliminary planning review to establish exactly which permit triggers apply.',
  },
  {
    id: 'planning-vs-building',
    category: 'Planning and building permits',
    question: 'What is the difference between a planning permit and a building permit?',
    answer:
      'A planning permit is granted by the local council and decides how land can be used and developed in relation to neighbourhood character and amenity. A building permit is issued by a private or municipal building surveyor and ensures construction adheres to the Building Code of Australia and Victorian building regulations.',
  },
  {
    id: 'timeframes',
    category: 'Planning and building permits',
    question: 'How long does a council planning permit application usually take?',
    answer:
      'Standard statutory timelines are nominally 60 statutory days, but overall timeframes typically range from 3 to 9 months depending on council requests for further information (RFIs), public advertising, and referrals to external authorities such as VicRoads or water authorities.',
  },
  {
    id: 'rfi-management',
    category: 'Planning and building permits',
    question: 'What happens when council requests further information (RFI)?',
    answer:
      'Council commonly issues an RFI letter outlining specific technical clarifications needed—such as traffic swept paths, acoustic reports, or drainage layouts. Permits Hub coordinates with your consultants to ensure all requested items are addressed comprehensively in a single submission.',
  },
  {
    id: 'permit-conditions',
    category: 'After an approval',
    question: 'What happens after council approves the planning permit?',
    answer:
      'A permit is issued with conditions (Condition 1 commonly requires amended plans before endorsement). Permits Hub assists in reviewing and coordinating the satisfaction of these conditions so your plans can be officially endorsed for construction.',
  },
  {
    id: 'move-to-building-permit',
    category: 'After an approval',
    question: 'How do we transition from planning approval to a building permit?',
    answer:
      'Once planning plans are endorsed, detailed engineering and architectural working drawings must be submitted to a building surveyor. Having a coordinator ensures that the building documentation faithfully mirrors the approved planning conditions without conflict.',
  },
  {
    id: 'single-coordinator',
    category: 'Working with Permits Hub',
    question: 'Why is having a single point of coordination valuable?',
    answer:
      'Without a coordinator, you become the switchboard managing communications between council planners, architects, traffic engineers, acoustic specialists, surveyors, and builders. Permits Hub provides one clear line of accountability and keeps the entire project team aligned.',
  },
  {
    id: 'coverage-regions',
    category: 'Working with Permits Hub',
    question: 'Which areas in Victoria does Permits Hub service?',
    answer:
      'We work across regional Victoria and metropolitan Melbourne, with publicly documented approvals in Greater Geelong, Ballarat, Melton, and the Surf Coast Shire.',
  },
]
