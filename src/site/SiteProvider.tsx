import { createContext, Fragment, useCallback, useContext, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { fetchSite, type SiteDto } from '../api/client'
import type { Chapter, ChapterMedia, FaqItem, Project, Service } from '../content'
import { iconFor } from '../lib/icons'

type ListItem = { title: string; body: string; detail: string; lines: string[] }

function makeSite(data: SiteDto) {
  const text = (key: string) => data.text[key] ?? ''
  const list = (key: string) => data.lists[key] ?? []
  const image = (key: string) => data.images[key]

  const services: Service[] = data.services.map(item => ({ ...item, icon: iconFor(item.icon) }))
  const projects = data.projects as Project[]
  const faqs = (placement: string) => data.faqs.filter(item => item.placement === placement)
  const allFaqs: FaqItem[] = faqs('faqs').map(({ id, question, answer, category }) => ({ id, question, answer, category }))

  return {
    ...data,
    t: text,
    image,
    services,
    projects,
    verifiedProjects: projects.filter(project => project.record === 'verified'),
    demoProjects: projects.filter(project => project.record === 'demo'),
    homeFaqs: faqs('home'),
    servicesFaqs: faqs('services'),
    contactFaqs: faqs('contact'),
    allFaqs,
    pillars: list('home_pillars').map(item => ({ title: item.title, text: item.body })),
    audiences: list('home_audiences').map(item => ({ title: item.title, body: item.body })),
    enquiryGroups: list('home_enquiry_groups').map(item => ({ heading: item.title, items: item.lines })),
    challenges: list('home_challenges').map(item => ({ challenge: item.title, response: item.body })),
    coordinationBenefits: list('coordination_benefits').map(item => item.title),
    planningJourney: list('journey').map((item: ListItem, index) => ({ number: String(index + 1).padStart(2, '0'), title: item.title, body: item.body, bring: item.detail })),
    coordinationRoles: list('service_roles').map(item => ({ role: item.title, input: item.body })),
    engagementFormats: list('service_engagement').map(item => ({ title: item.title, body: item.body, suits: item.detail })),
    consultationPrep: list('service_prep').map(item => ({ item: item.title, why: item.body })),
    prepareItems: list('contact_prepare').map(item => ({ title: item.title, body: item.body })),
    firstConversationChecklist: list('contact_checklist').map(item => item.title),
    afterContactSteps: list('contact_after').map(item => ({ title: item.title, body: item.body })),
    principles: list('about_principles').map(item => ({ title: item.title, body: item.body })),
    evolutionStages: list('about_evolution').map(item => ({ label: item.title, caption: item.body })),
    chapters: data.chapters.map(chapter => ({ ...chapter, media: chapter.media as unknown as ChapterMedia })) as Chapter[],
    journeyStages: data.stages,
    serviceFinder: data.finder,
    publicRegions: data.regions,
  }
}

export type Site = ReturnType<typeof makeSite> & {
  /** Heading copy: line breaks become <br/> and *words* become <em>. */
  rt: (key: string, emStyle?: CSSProperties) => ReactNode
}

const SiteContext = createContext<Site | null>(null)

export function richText(value: string, emStyle?: CSSProperties): ReactNode {
  const lines = value.split('\n')
  return lines.map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {line.split(/\*([^*]+)\*/g).map((part, index) => (index % 2 === 1 ? <em key={index} style={emStyle}>{part}</em> : part))}
      {lineIndex < lines.length - 1 && <br />}
    </Fragment>
  ))
}

export function SiteProvider({ children }: { children: ReactNode }) {
  // The server embeds the data in the page, so the first render needs no request.
  const [data, setData] = useState<SiteDto | null>(() => window.__SITE__ ?? null)
  const [failed, setFailed] = useState(false)

  const load = useCallback(() => {
    setFailed(false)
    fetchSite().then(setData).catch(() => setFailed(true))
  }, [])

  useEffect(() => { if (!window.__SITE__) load() }, [load])

  const value = useMemo<Site | null>(() => {
    if (!data) return null
    const site = makeSite(data)
    return { ...site, rt: (key, emStyle) => richText(site.t(key), emStyle) }
  }, [data])

  if (!value) {
    return failed
      ? <div className="not-found" role="alert"><div className="container"><h1>We’re having trouble loading this page.</h1><p>Please check your connection and try again.</p><button type="button" className="button button--primary" onClick={load}>Try again</button></div></div>
      : <div className="page-loading" aria-busy="true" aria-label="Loading" style={{ minHeight: '100vh' }} />
  }
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const value = useContext(SiteContext)
  if (!value) throw new Error('useSite must be used inside SiteProvider')
  return value
}
