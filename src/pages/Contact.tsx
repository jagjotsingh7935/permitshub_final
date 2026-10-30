import { useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Facebook, FileText, MapPin, Phone } from 'lucide-react'
import { submitEnquiry } from '../api/client'
import { Accordion } from '../components/ui/Accordion'
import { Checklist } from '../components/ui/Checklist'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { PageHero, SectionIntro } from '../components/ui/Sections'
import { useSite } from '../site/SiteProvider'

/*
 * Enquiry flow: validates, then sends the enquiry to the backend, which stores it for the team,
 * emails them an alert and emails the visitor a confirmation.
 */
type Brief = { name: string; email: string; phone: string; projectType: string; location: string; stage: string; message: string }
type Field = keyof Brief
const fieldOrder: Field[] = ['name', 'email', 'phone', 'projectType', 'location', 'stage', 'message']
const labels: Record<Field, string> = { name: 'Your name', email: 'Email address', phone: 'Phone', projectType: 'Project type', location: 'Project location', stage: 'Where you are up to', message: 'About your project' }

function validate(brief: Brief) {
  const errors: Partial<Record<Field, string>> = {}
  if (!brief.name.trim()) errors.name = 'Enter your name so the team knows who to reply to.'
  if (!brief.email.trim()) errors.email = 'Enter an email address for the reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email.trim())) errors.email = 'Enter an email address in the format name@example.com.'
  if (brief.phone.trim() && !/^[+()\d\s-]{8,}$/.test(brief.phone.trim())) errors.phone = 'Enter a phone number using digits and spaces, or leave it blank.'
  if (!brief.projectType) errors.projectType = 'Choose the option closest to your project.'
  if (brief.message.trim().length < 10) errors.message = 'Add a sentence or two about what you are planning.'
  return errors
}

const fromList = (list: readonly string[], value: string | null) => (value && list.includes(value) ? value : '')

function EnquiryForm() {
  const { t, projectTypes, projectStages } = useSite()
  const [searchParams] = useSearchParams()
  const service = searchParams.get('service')
  const [brief, setBrief] = useState<Brief>(() => ({
    name: '',
    email: '',
    phone: '',
    projectType: fromList(projectTypes, searchParams.get('projectType')),
    location: searchParams.get('location') ?? '',
    stage: fromList(projectStages, searchParams.get('stage')),
    message: '',
  }))
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [sentTo, setSentTo] = useState({ email: '', confirmed: false })
  const [trap, setTrap] = useState('')
  const summaryRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  function update(field: Field, value: string) {
    setBrief(current => ({ ...current, [field]: value }))
    if (errors[field]) setErrors(current => ({ ...current, [field]: undefined }))
    if (status !== 'sending') setStatus('idle')
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(brief)
    setErrors(found)
    if (Object.keys(found).length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setStatus('sending')
    try {
      const result = await submitEnquiry({
        name: brief.name.trim(),
        email: brief.email.trim(),
        phone: brief.phone.trim(),
        location: brief.location.trim(),
        project_type: brief.projectType,
        stage: brief.stage,
        service: service ?? '',
        message: brief.message.trim(),
        website: trap,
      })
      setSentTo({ email: brief.email.trim(), confirmed: result.confirmationSent })
      setBrief(current => ({ ...current, name: '', email: '', phone: '', message: '' }))
      setStatus('sent')
      requestAnimationFrame(() => resultRef.current?.focus())
    } catch {
      setStatus('error')
    }
  }

  const errorList = fieldOrder.filter(field => errors[field])
  const describedBy = (field: Field, hint?: string) => [hint, errors[field] ? `${field}-error` : ''].filter(Boolean).join(' ') || undefined

  return (
    <div className="contact-form-wrap" id="enquiry">
      <span className="contact-form-wrap__label">{t('contact.form.label')}</span>
      <h3>{t('contact.form.title')}</h3>
      {service && <p className="contact-form-wrap__service">{t('contact.form.service')} <strong>{service}</strong></p>}
      {errorList.length > 0 && (
        <div className="form-errors" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>Check {errorList.length === 1 ? 'one field' : `${errorList.length} fields`} before sending your enquiry:</p>
          <ul>{errorList.map(field => <li key={field}><a href={`#field-${field}`}>{labels[field]}: {errors[field]}</a></li>)}</ul>
        </div>
      )}
      <form onSubmit={send} className="contact-form" noValidate>
        <div className="form-row">
          <div className="field">
            <label htmlFor="field-name">Your name <span className="field__req">required</span></label>
            <input id="field-name" name="name" autoComplete="name" value={brief.name} onChange={event => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} />
            {errors.name && <p className="field__error" id="name-error">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="field-email">Email address <span className="field__req">required</span></label>
            <input id="field-email" name="email" type="email" autoComplete="email" value={brief.email} onChange={event => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} />
            {errors.email && <p className="field__error" id="email-error">{errors.email}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="field-phone">Phone <span className="field__opt">optional</span></label>
            <input id="field-phone" name="phone" type="tel" autoComplete="tel" value={brief.phone} onChange={event => update('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy('phone')} />
            {errors.phone && <p className="field__error" id="phone-error">{errors.phone}</p>}
          </div>
          <div className="field">
            <label htmlFor="field-projectType">Project type <span className="field__req">required</span></label>
            <select id="field-projectType" name="projectType" value={brief.projectType} onChange={event => update('projectType', event.target.value)} aria-invalid={Boolean(errors.projectType)} aria-describedby={describedBy('projectType')}>
              <option value="">Select a category</option>
              {projectTypes.map(type => <option key={type}>{type}</option>)}
            </select>
            {errors.projectType && <p className="field__error" id="projectType-error">{errors.projectType}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="field-location">Project location <span className="field__opt">optional</span></label>
            <input id="field-location" name="location" autoComplete="address-level2" placeholder="Suburb or site address" value={brief.location} onChange={event => update('location', event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="field-stage">Where you are up to <span className="field__opt">optional</span></label>
            <select id="field-stage" name="stage" value={brief.stage} onChange={event => update('stage', event.target.value)}>
              <option value="">Select a stage</option>
              {projectStages.map(stage => <option key={stage}>{stage}</option>)}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="field-message">About your project <span className="field__req">required</span></label>
          <textarea id="field-message" name="message" rows={5} placeholder="What are you hoping to do? Is there a date that matters?" value={brief.message} onChange={event => update('message', event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={describedBy('message', 'message-hint')} />
          <p className="field__hint" id="message-hint">{t('contact.form.message_hint')}</p>
          {errors.message && <p className="field__error" id="message-error">{errors.message}</p>}
        </div>
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
          <label>Leave this field empty<input tabIndex={-1} autoComplete="off" name="website" value={trap} onChange={event => setTrap(event.target.value)} /></label>
        </div>
        <button type="submit" className="button button--primary" disabled={status === 'sending'}>{status === 'sending' ? t('contact.form.sending') : t('contact.form.submit')} <ArrowUpRight size={18} /></button>
        <p className="form-note">{t('contact.form.note')}</p>
        {status === 'error' && <p className="field__error" role="alert">{t('contact.form.error')}</p>}
      </form>
      {status === 'sent' && (
        <div className="prepared-brief" tabIndex={-1} ref={resultRef} role="status">
          <h4>{t('contact.form.success_title')}</h4>
          <p>{sentTo.confirmed ? t('contact.form.success_body').replace('{email}', sentTo.email) : t('contact.form.success_body_no_email')}</p>
        </div>
      )}
    </div>
  )
}

export default function Contact() {
  const { t, rt, settings, prepareItems, firstConversationChecklist, afterContactSteps, contactFaqs } = useSite()
  const [mapReady, setMapReady] = useState(false)
  const mapQuery = encodeURIComponent(t('contact.map.query'))
  return (
    <>
      <PageHero eyebrow={t('contact.hero.eyebrow')} title={rt('contact.hero.title')} body={t('contact.hero.body')} number="04" />

      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-side">
            <Reveal>
              <span className="eyebrow"><span className="eyebrow__line" />{t('contact.side.eyebrow')}</span>
              <h2>{rt('contact.side.title')}</h2>
              <p>{t('contact.side.body')}</p>
              <a className="contact-social" href={settings.contactPhoneHref}><span><Phone size={22} /></span><span><strong>{settings.contactPhone}</strong><small>{t('contact.side.phone_note')}</small></span><ArrowUpRight size={20} /></a>
              <a className="contact-social" href={`mailto:${settings.contactEmail}`}><span><FileText size={22} /></span><span><strong>{settings.contactEmail}</strong><small>{t('contact.side.email_note')}</small></span><ArrowUpRight size={20} /></a>
              {settings.facebookUrl && <a className="contact-social" href={settings.facebookUrl} target="_blank" rel="noreferrer"><span><Facebook size={22} /></span><span><strong>{t('contact.side.facebook_title')}</strong><small>{t('contact.side.facebook_note')}</small></span><ArrowUpRight size={20} /></a>}
            </Reveal>
            <Reveal>
              <div className="contact-tip"><FileText size={25} /><div><h3>{t('contact.tip.title')}</h3><p>{t('contact.tip.body')}</p></div></div>
            </Reveal>
          </div>
          <Reveal><EnquiryForm /></Reveal>
        </div>
      </section>

      <section className="section prepare-section" aria-labelledby="prepare-title">
        <div className="container">
          <Reveal><SectionIntro id="prepare-title" eyebrow={t('contact.prepare.eyebrow')} title={t('contact.prepare.title')} /></Reveal>
          <RevealGroup as="ul" className="prepare-grid">
            {prepareItems.map(item => <RevealItem as="li" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <section className="section next-section" aria-labelledby="next-title">
        <div className="container next-section__grid">
          <Reveal>
            <Checklist title={t('contact.next.checklist_title')} items={firstConversationChecklist} note={t('contact.next.checklist_note')} />
          </Reveal>
          <div>
            <Reveal><h2 id="next-title">{t('contact.next.title')}</h2></Reveal>
            <RevealGroup as="ol" className="after-steps">
              {afterContactSteps.map((step, index) => <RevealItem as="li" key={step.title}><span aria-hidden="true">{index + 1}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></RevealItem>)}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section className="map-section">
        <div className="container map-section__grid">
          <Reveal>
            <div>
              <span className="eyebrow"><span className="eyebrow__line" />{t('contact.map.eyebrow')}</span>
              <h2>{rt('contact.map.title')}</h2>
              <p>{t('contact.map.body')}</p>
              <div className="map-location"><MapPin size={20} /><span>{t('contact.map.location')}</span></div>
            </div>
          </Reveal>
          <div className={`map-frame ${mapReady ? 'map-frame--ready' : ''}`}>
            <div className="map-frame__fallback" aria-hidden="true"><i className="map-frame__ring map-frame__ring--one" /><i className="map-frame__ring map-frame__ring--two" /><i className="map-frame__ring map-frame__ring--three" /><b className="map-frame__region">{t('contact.map.location').split(',')[0].toUpperCase()}</b><b className="map-frame__city map-frame__city--ballarat">{t('contact.map.city_1')}</b><b className="map-frame__city map-frame__city--geelong">{t('contact.map.city_2')}</b><b className="map-frame__city map-frame__city--surf">{t('contact.map.city_3')}</b></div>
            <iframe title={`Map of ${t('contact.map.location')}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} onLoad={event => { try { if (event.currentTarget.contentWindow?.location.href !== 'about:blank') setMapReady(true) } catch { setMapReady(true) } }} />
            <div className="map-frame__card"><MapPin size={22} /><div><strong>{t('contact.map.location')}</strong><a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">{t('contact.map.link')} <ArrowUpRight size={15} /><span className="sr-only"> (opens in a new tab)</span></a></div></div>
            <span>{t('contact.map.caption')}</span>
          </div>
        </div>
      </section>

      <section className="section faq-section" aria-labelledby="contact-faq-title">
        <div className="container faq-section__inner">
          <Reveal><SectionIntro id="contact-faq-title" eyebrow={t('contact.faq.eyebrow')} title={rt('contact.faq.title')} /></Reveal>
          <Accordion items={contactFaqs.map(faq => ({ id: faq.id, title: faq.question, content: <p>{faq.answer}</p> }))} />
        </div>
      </section>
    </>
  )
}
