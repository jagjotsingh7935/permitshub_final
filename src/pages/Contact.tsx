import { useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowUpRight, Clipboard, Facebook, FileText, MapPin, Phone } from 'lucide-react'
import { Accordion } from '../components/ui/Accordion'
import { Checklist } from '../components/ui/Checklist'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { PageHero, SectionIntro } from '../components/ui/Sections'
import {
  afterContactSteps,
  contactEmail,
  contactFaqs,
  contactPhone,
  contactPhoneHref,
  facebookUrl,
  firstConversationChecklist,
  prepareItems,
  projectStages,
  projectTypes,
} from '../content'

/*
 * Frontend-only enquiry flow: validates, then prepares an email for the visitor to send themselves.
 * Nothing is sent or stored. A Django REST Framework endpoint can later replace `prepare()`.
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

function composeEmail(brief: Brief, service: string | null) {
  const lines = [
    'Hello Permits Hub,',
    '',
    `My name is ${brief.name.trim()}. I would like to discuss a ${brief.projectType.toLowerCase()} project${brief.location.trim() ? ` in ${brief.location.trim()}` : ''}.`,
    service ? `I’m interested in: ${service}.` : '',
    brief.stage ? `Where I’m up to: ${brief.stage}.` : '',
    '',
    brief.message.trim(),
    '',
    `You can reach me at ${brief.email.trim()}${brief.phone.trim() ? ` or on ${brief.phone.trim()}` : ''}.`,
  ]
  return lines.join('\n').replace(/\n{3,}/g, '\n\n')
}

const fromList = (list: readonly string[], value: string | null) => (value && list.includes(value) ? value : '')

function EnquiryForm() {
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
  const [prepared, setPrepared] = useState('')
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle')
  const summaryRef = useRef<HTMLDivElement>(null)
  const preparedRef = useRef<HTMLDivElement>(null)

  function update(field: Field, value: string) {
    setBrief(current => ({ ...current, [field]: value }))
    if (errors[field]) setErrors(current => ({ ...current, [field]: undefined }))
    setPrepared('')
    setCopied('idle')
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(brief)
    setErrors(found)
    if (Object.keys(found).length) {
      setPrepared('')
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setPrepared(composeEmail(brief, service))
    setCopied('idle')
    requestAnimationFrame(() => preparedRef.current?.focus())
  }

  async function copyBrief() {
    try { await navigator.clipboard.writeText(prepared); setCopied('copied') } catch { setCopied('failed') }
  }

  const errorList = fieldOrder.filter(field => errors[field])
  const describedBy = (field: Field, hint?: string) => [hint, errors[field] ? `${field}-error` : ''].filter(Boolean).join(' ') || undefined
  const emailHref = `mailto:${contactEmail}?subject=${encodeURIComponent('Project enquiry — Permits Hub')}&body=${encodeURIComponent(prepared)}`

  return (
    <div className="contact-form-wrap" id="enquiry">
      <span className="contact-form-wrap__label">Project brief</span>
      <h3>Tell us what you’re planning.</h3>
      {service && <p className="contact-form-wrap__service">Enquiring about: <strong>{service}</strong></p>}
      {errorList.length > 0 && (
        <div className="form-errors" role="alert" tabIndex={-1} ref={summaryRef}>
          <p>Check {errorList.length === 1 ? 'one field' : `${errorList.length} fields`} before preparing your email:</p>
          <ul>{errorList.map(field => <li key={field}><a href={`#field-${field}`}>{labels[field]}: {errors[field]}</a></li>)}</ul>
        </div>
      )}
      <form onSubmit={prepare} className="contact-form" noValidate>
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
          <p className="field__hint" id="message-hint">A sentence or two is enough. You can attach drawings in your email later.</p>
          {errors.message && <p className="field__error" id="message-error">{errors.message}</p>}
        </div>
        <button type="submit" className="button button--primary">Prepare my email <ArrowUpRight size={18} /></button>
        <p className="form-note">This form prepares an email on your device. It does not send or store your details. You send the email yourself.</p>
      </form>
      {prepared && (
        <div className="prepared-brief" tabIndex={-1} ref={preparedRef} role="status">
          <h4>Your email is ready to send</h4>
          <p>Nothing has been sent yet. Open it in your email app to review and send, or copy it.</p>
          <pre>{prepared}</pre>
          <div>
            <a href={emailHref} className="button button--primary">Open in email app <ArrowUpRight size={17} /></a>
            <button type="button" onClick={copyBrief} className="button button--outline"><Clipboard size={17} />{copied === 'copied' ? 'Copied' : 'Copy message'}</button>
          </div>
          {copied === 'failed' && <p className="field__error">Copying isn’t available in this browser. Select the text above and copy it manually.</p>}
        </div>
      )}
    </div>
  )
}

export default function Contact() {
  const [mapReady, setMapReady] = useState(false)
  return (
    <>
      <PageHero eyebrow="Let’s talk" title={<>Start with a<br /><em>conversation.</em></>} body="Tell us about the site, the idea and where you are in the process. There is no need to have everything worked out before you get in touch." number="04" />

      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-side">
            <Reveal>
              <span className="eyebrow"><span className="eyebrow__line" />Get in touch</span>
              <h2>Every project<br />starts somewhere.</h2>
              <p>Call to talk it through, or prepare a short brief and send it by email. Both reach the same team.</p>
              <a className="contact-social" href={contactPhoneHref}><span><Phone size={22} /></span><span><strong>{contactPhone}</strong><small>Speak with Permits Hub</small></span><ArrowUpRight size={20} /></a>
              <a className="contact-social" href={`mailto:${contactEmail}`}><span><FileText size={22} /></span><span><strong>{contactEmail}</strong><small>Email your project details</small></span><ArrowUpRight size={20} /></a>
              <a className="contact-social" href={facebookUrl} target="_blank" rel="noreferrer"><span><Facebook size={22} /></span><span><strong>Message Permits Hub</strong><small>Connect via Facebook (opens in a new tab)</small></span><ArrowUpRight size={20} /></a>
            </Reveal>
            <Reveal>
              <div className="contact-tip"><FileText size={25} /><div><h3>No drawings yet?</h3><p>That’s fine. An address and a sentence about the idea is enough to begin.</p></div></div>
            </Reveal>
          </div>
          <Reveal><EnquiryForm /></Reveal>
        </div>
      </section>

      <section className="section prepare-section" aria-labelledby="prepare-title">
        <div className="container">
          <Reveal><SectionIntro id="prepare-title" eyebrow="Useful to prepare" title="Four things that make a first enquiry more useful." /></Reveal>
          <RevealGroup as="ul" className="prepare-grid">
            {prepareItems.map(item => <RevealItem as="li" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <section className="section next-section" aria-labelledby="next-title">
        <div className="container next-section__grid">
          <Reveal>
            <Checklist title="Before the first conversation" items={firstConversationChecklist} note="This list stays on your device" />
          </Reveal>
          <div>
            <Reveal><h2 id="next-title">What happens after you get in touch</h2></Reveal>
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
              <span className="eyebrow"><span className="eyebrow__line" />Where we work</span>
              <h2>Local context.<br /><em>Broader perspective.</em></h2>
              <p>Permits Hub has shared work across Victoria, including Melton, Ballarat, Greater Geelong and the Surf Coast region.</p>
              <div className="map-location"><MapPin size={20} /><span>Victoria, Australia</span></div>
            </div>
          </Reveal>
          <div className={`map-frame ${mapReady ? 'map-frame--ready' : ''}`}>
            <div className="map-frame__fallback" aria-hidden="true"><i className="map-frame__ring map-frame__ring--one" /><i className="map-frame__ring map-frame__ring--two" /><i className="map-frame__ring map-frame__ring--three" /><b className="map-frame__region">VICTORIA</b><b className="map-frame__city map-frame__city--ballarat">Ballarat</b><b className="map-frame__city map-frame__city--geelong">Geelong</b><b className="map-frame__city map-frame__city--surf">Surf Coast</b></div>
            <iframe title="Map of Victoria, Australia" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Victoria%2C%20Australia&output=embed" onLoad={event => { try { if (event.currentTarget.contentWindow?.location.href !== 'about:blank') setMapReady(true) } catch { setMapReady(true) } }} />
            <div className="map-frame__card"><MapPin size={22} /><div><strong>Victoria, Australia</strong><a href="https://www.google.com/maps/search/?api=1&query=Victoria%2C%20Australia" target="_blank" rel="noreferrer">Open in Google Maps <ArrowUpRight size={15} /><span className="sr-only"> (opens in a new tab)</span></a></div></div>
            <span>Indicative region map · not an office location</span>
          </div>
        </div>
      </section>

      <section className="section faq-section" aria-labelledby="contact-faq-title">
        <div className="container faq-section__inner">
          <Reveal><SectionIntro id="contact-faq-title" eyebrow="Questions" title={<>About getting<br /><em>in touch.</em></>} /></Reveal>
          <Accordion items={contactFaqs.map((faq, index) => ({ id: `contact-faq-${index}`, title: faq.question, content: <p>{faq.answer}</p> }))} />
        </div>
      </section>
    </>
  )
}
