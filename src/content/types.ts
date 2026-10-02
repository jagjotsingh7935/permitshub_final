/**
 * Content status
 * - verified: backed by a public source (linked in `sources`). Safe to publish as fact.
 * - draft:    written for this build from general planning knowledge. Client to review and confirm.
 * - demo:     fictional or illustrative. Always shown with a visible "Demo project" / "Illustrative example" label.
 */
export type ContentStatus = 'verified' | 'draft' | 'demo'

export type SourceLink = { label: string; url: string }

export type Faq = { question: string; answer: string; status: ContentStatus }

/** Broad stages of a client's planning project (not company history). */
export type JourneyStageId = 'site' | 'concept' | 'apply' | 'assess' | 'decide'
