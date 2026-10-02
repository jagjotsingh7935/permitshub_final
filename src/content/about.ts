import { sources } from './site'
import type { SourceLink } from './types'

/**
 * About page timeline.
 * Dated chapters ("milestone") use only verified public sources.
 * Undated chapters describe the company's approach and current work without inventing dates.
 */

/** Stages of the conceptual drawing that evolves beside the timeline (not a real project). */
export const evolutionStages = [
  { label: 'Site', caption: 'A parcel of land, its slope, trees and street frontage.' },
  { label: 'Analysis', caption: 'Boundaries, setbacks, an overlay, access and aspect.' },
  { label: 'Plan', caption: 'A layout that responds to what the site allows.' },
  { label: 'Structure', caption: 'The proposal takes shape as a set of decisions.' },
  { label: 'Form', caption: 'A resolved building that council can assess.' },
  { label: 'Place', caption: 'Landscape, shade and people once it is in use.' },
  { label: 'Next site', caption: 'Then the next conversation begins next door.' },
]

type ChapterMedia =
  | { kind: 'record'; title: string; lines: { label: string; value: string }[]; source: SourceLink }
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
  /** Index into evolutionStages. */
  stage: number
  media: ChapterMedia
}

export const chapters: Chapter[] = [
  {
    id: 'registered',
    marker: '2021',
    type: 'milestone',
    title: 'Permits Hub on the register',
    eyebrow: 'September 2021',
    body: [
      'The Australian Business Register records Permits Hub Pty Ltd as active from September 2021. It is the first dated point in the public record, and the natural place for this story to begin.',
      'Like a site before any design work, it is a starting point with possibilities rather than answers.',
    ],
    stage: 0,
    media: {
      kind: 'record',
      title: 'Public business record',
      lines: [
        { label: 'Entity', value: 'Permits Hub Pty Ltd' },
        { label: 'ABN', value: '58 653 444 047' },
        { label: 'Active from', value: 'September 2021' },
      ],
      source: sources.abr,
    },
  },
  {
    id: 'melton',
    marker: '2022',
    type: 'milestone',
    title: 'Planning work in the public record',
    eyebrow: '2022 · Melton',
    body: [
      'A town planning report for an 81-place childcare centre at 31 Staughton Street, Melton, carries the Permits Hub name. The City of Melton published it with its July 2022 advertised planning applications, listed as an RFI (further information) town planning report.',
      'Childcare would become a recurring thread in the work that followed.',
    ],
    stage: 1,
    media: {
      kind: 'record',
      title: 'Advertised planning application',
      lines: [
        { label: 'Proposal', value: '81-place childcare centre' },
        { label: 'Location', value: '31 Staughton Street, Melton' },
        { label: 'Document', value: 'Town planning report (RFI response)' },
      ],
      source: sources.melton,
    },
  },
  {
    id: 'approach',
    marker: 'Approach',
    type: 'perspective',
    title: 'Understand the land before drawing on it',
    eyebrow: 'How we read a site',
    body: [
      'A good application starts with an honest reading of the site: what the zone allows, which overlays apply, where the neighbours are and how people will arrive.',
      'Getting that picture early means the design responds to the controls rather than fighting them later.',
    ],
    stage: 2,
    media: {
      kind: 'checklist',
      title: 'What an early site review looks at',
      items: ['Zone and permitted uses', 'Overlays such as heritage, flooding or bushfire', 'Title restrictions and easements', 'Access, parking and traffic', 'Neighbours, overlooking and noise', 'Trees and landscape'],
    },
  },
  {
    id: 'june-2025',
    marker: 'Jun 2025',
    type: 'milestone',
    title: 'Three approvals shared in one week',
    eyebrow: '10–16 June 2025',
    body: [
      'In June 2025 Permits Hub shared three project updates: planning and building permits for a 100-place childcare centre in Winchelsea, approval of a 94-place childcare centre in St Leonards, and a permit for a new swim school in Winter Valley, Ballarat.',
      'The visuals in those updates are architectural renders and announcement artwork, not photographs of completed buildings.',
    ],
    stage: 3,
    media: { kind: 'projects', slugs: ['winchelsea-childcare', 'st-leonards-childcare', 'winter-valley-swim-school'] },
  },
  {
    id: 'community',
    marker: 'Focus',
    type: 'perspective',
    title: 'Community facilities at the centre',
    eyebrow: 'Places people use',
    body: [
      'The projects in the public record share something: they are places for families and neighbourhoods. Early learning centres and a swim school each carry questions about traffic, noise, outdoor space and how a building sits among homes.',
      'Planning is where those questions are worked through before anything is built.',
    ],
    stage: 4,
    media: {
      kind: 'figures',
      items: [
        { value: '100', label: 'places · Winchelsea childcare', href: '/projects/winchelsea-childcare' },
        { value: '94', label: 'places · St Leonards childcare', href: '/projects/st-leonards-childcare' },
        { value: '3', label: 'project approvals shared in June 2025', href: '/projects' },
      ],
    },
  },
  {
    id: 'today',
    marker: 'Today',
    type: 'now',
    title: 'Across Victoria, one site at a time',
    eyebrow: 'The work continues',
    body: [
      'Public work now spans Melton, Ballarat, Greater Geelong and the Surf Coast. The focus remains the same: make each planning decision easier to understand and each next step clearer.',
      'New project updates continue to be shared on the Permits Hub Facebook page.',
    ],
    stage: 5,
    media: { kind: 'regions' },
  },
  {
    id: 'next',
    marker: 'Next',
    type: 'next',
    title: 'The next chapter could be your site',
    eyebrow: 'Not history yet',
    body: ['Every project on this page began with a first conversation about a piece of land. If you have a site, an idea or a letter from council, that conversation is the next step.'],
    stage: 6,
    media: { kind: 'cta' },
  },
]

/** DRAFT principles: client to confirm wording. */
export const principles = [
  { title: 'Start with the site', body: 'Controls, context and constraints are understood before the design is locked in.' },
  { title: 'Explain it plainly', body: 'Planning language is translated into decisions a client can actually make.' },
  { title: 'Prepare it properly', body: 'A complete, well-reasoned application is easier for council to assess.' },
  { title: 'Look one step ahead', body: 'Each approval is connected to what needs to happen next.' },
]
