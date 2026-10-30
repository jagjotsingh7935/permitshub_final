import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSite } from '../../site/SiteProvider'

/** Three quick questions that carry into the Contact form as URL parameters. */
export function ProjectStarter() {
  const { t, projectStages, projectTypes } = useSite()
  const [type, setType] = useState('')
  const [location, setLocation] = useState('')
  const [stage, setStage] = useState('')
  const [step, setStep] = useState(1)
  const params = new URLSearchParams({ projectType: type, location: location.trim(), stage })

  return (
    <div className="starter" role="group" aria-label="Project enquiry starter">
      <div className="starter__top"><span>{t('home.starter.top_label')}</span><span aria-live="polite">Step {Math.min(step, 3)} of 3</span></div>
      <div className="starter__progress" aria-hidden="true"><i style={{ width: `${Math.min(step, 3) * 33.333}%` }} /></div>
      {step === 1 && <div className="starter__content"><h3>{t('home.starter.q1')}</h3><div className="starter__choices">{projectTypes.map(item => <button key={item} type="button" onClick={() => { setType(item); setStep(2) }}>{item}<ArrowUpRight size={15} /></button>)}</div></div>}
      {step === 2 && (
        <div className="starter__content">
          <h3>{t('home.starter.q2')}</h3>
          <p>{t('home.starter.q2_hint')}</p>
          <form onSubmit={event => { event.preventDefault(); if (location.trim()) { setLocation(location.trim()); setStep(3) } }}>
            <label htmlFor="starter-location">{t('home.starter.q2_label')}</label>
            <div className="starter__input"><MapPin size={18} /><input id="starter-location" autoFocus value={location} onChange={event => setLocation(event.target.value)} placeholder={t('home.starter.q2_placeholder')} required /><button type="submit" aria-label="Continue to project stage"><ArrowRight size={19} /></button></div>
          </form>
        </div>
      )}
      {step === 3 && <div className="starter__content"><h3>{t('home.starter.q3')}</h3><div className="starter__choices">{projectStages.map(item => <button key={item} type="button" onClick={() => { setStage(item); setStep(4) }}>{item}<ArrowUpRight size={15} /></button>)}</div></div>}
      {step === 4 && <div className="starter__content starter__done"><span className="starter__check"><Check size={19} /></span><h3>{t('home.starter.done_title')}</h3><p>{t('home.starter.done_body')}</p><Link to={`/contact?${params.toString()}#enquiry`} className="button button--primary">{t('home.starter.done_button')} <ArrowUpRight size={17} /></Link></div>}
      <div className="starter__bottom"><span>{type || 'Project type'}</span><span>{step > 2 ? location : 'Location'}</span><span>{stage || 'Stage'}</span></div>
      {step > 1 && <button className="starter__back" type="button" onClick={() => setStep(current => Math.max(1, current - 1))}>{t('home.starter.back')}</button>}
    </div>
  )
}
