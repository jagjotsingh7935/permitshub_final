import { ArrowDown, Check, ExternalLink } from 'lucide-react'
import { CompanyTimeline } from '../components/about/CompanyTimeline'
import { WithCoordination, WithoutCoordination } from '../components/about/CoordinationDiagram'
import { PlanningJourney } from '../components/ui/PlanningJourney'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { CallToAction, PageHero, SectionIntro } from '../components/ui/Sections'
import { facebookUrl, principles, publicRegions, verifiedProjects } from '../content'

const coordinationBenefits = [
  'One place to ask “where are we up to?”',
  'Drawings and reports checked against each other before they go to council',
  'Council requests tracked and responded to in a coordinated way',
  'The move from planning approval to building permit managed, not left to chance',
]

export default function About() {
  const winchelsea = verifiedProjects.find(project => project.slug === 'winchelsea-childcare')!
  const stLeonards = verifiedProjects.find(project => project.slug === 'st-leonards-childcare')!
  return (
    <>
      <PageHero eyebrow="About Permits Hub" title={<>A clearer way<br /><em>to get there.</em></>} body="With over 16 years of town planning experience, Permits Hub is based in Melbourne and provides all-in-one-stop development solutions, from town planning to construction completion." number="03">
        <div className="about-hero-aside">
          <dl className="hero-facts">
            <div><dt>Registered</dt><dd>September 2021</dd></div>
            <div><dt>Public work in</dt><dd>Melton, Ballarat, Greater Geelong, Surf Coast</dd></div>
            <div><dt>Focus</dt><dd>Town planning, permits, development guidance</dd></div>
          </dl>
          <a href="#timeline" className="button button--white">Explore the timeline <ArrowDown size={17} /></a>
        </div>
      </PageHero>

      <section className="section about-main">
        <div className="container about-main__grid">
          <Reveal>
            <div className="about-main__quote about-main__projects">
              <span>Selected work & consultation · Victoria</span>
              <div className="about-project-photos" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                <div><img src="https://images.pexels.com/photos/8112160/pexels-photo-8112160.jpeg?auto=compress&cs=tinysrgb&w=900" alt="Planning consultation meeting where professionals discuss a project" loading="lazy" style={{ objectFit: 'cover', height: '100%', width: '100%' }} /></div>
                <div><img src={winchelsea.cover.src} alt="Render of the proposed Winchelsea childcare centre" loading="lazy" /></div>
                <div><img src={stLeonards.cover.src} alt="Render of the proposed St Leonards childcare centre" loading="lazy" style={{ objectPosition: stLeonards.cover.position }} /></div>
              </div>
              <small>Planning consultation & project renders shared by Permits Hub. Proposed designs, not completed buildings.</small>
            </div>
          </Reveal>
          <Reveal>
            <div className="about-main__copy">
              <span className="eyebrow"><span className="eyebrow__line" />Our perspective</span>
              <h2>Good planning makes<br /><em>space for progress.</em></h2>
              <p>With over 16 years of town planning experience, Permits Hub is based in Melbourne. Our multi-disciplinary services provide all-in-one-stop development solutions, from town planning to construction completion.</p>
              <p>Permits Hub provides town planning and project consultation services across the whole journey: due diligence, multi lot subdivisions, use and development permits, building permit design and documentation, and project consultation and management through the construction stage.</p>
              <a href={facebookUrl} target="_blank" rel="noreferrer" className="text-link">See Permits Hub on Facebook <ExternalLink size={17} /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </Reveal>
        </div>
      </section>

      <CompanyTimeline />

      <section className="section principles" id="how-we-work" aria-labelledby="principles-title">
        <div className="container principles__grid">
          <Reveal><SectionIntro id="principles-title" eyebrow="How we work" title={<>Four principles behind<br /><em>every application.</em></>} /></Reveal>
          <RevealGroup as="ul" className="principles__list">
            {principles.map(item => <RevealItem as="li" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      {/* Coordination: Many parties, one clear line */}
      <section className="coordination-section" aria-labelledby="coordination-title">
        <div aria-hidden="true" className="planning-grid-dark pointer-events-none" style={{ position: 'absolute', inset: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <SectionIntro
              id="coordination-title"
              eyebrow="Why coordination matters"
              title={<>Many parties, <em style={{ color: '#6db2fb', fontStyle: 'normal' }}>one clear line</em></>}
              body="A development can involve half a dozen parties before construction starts. Without a coordinator, the owner becomes the switchboard. With one, information flows through a single point that keeps it consistent."
              light
            />
          </Reveal>

          <div className="coordination-grid">
            <Reveal>
              <figure className="coordination-card">
                <figcaption>Without a coordinator</figcaption>
                <div className="coordination-card__visual">
                  <WithoutCoordination />
                </div>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="coordination-card coordination-card--highlight">
                <figcaption>With Permits Hub</figcaption>
                <div className="coordination-card__visual">
                  <WithCoordination />
                </div>
              </figure>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <ul className="coordination-benefits">
              {coordinationBenefits.map((benefit) => (
                <li key={benefit}>
                  <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="regions" aria-labelledby="regions-title">
        <div className="container regions__grid">
          <Reveal>
            <h2 id="regions-title">Where the public record shows our work</h2>
            <p>Each region below links to the source that places Permits Hub there. Enquiries from elsewhere in Victoria are welcome.</p>
          </Reveal>
          <RevealGroup as="ul" className="regions__list">
            {publicRegions.map(region => (
              <RevealItem as="li" key={region.name}>
                <strong>{region.name}</strong>
                <span>{region.note}</span>
                <a href={region.source.url} target="_blank" rel="noreferrer">{region.source.label} <ExternalLink size={13} /><span className="sr-only"> (opens in a new tab)</span></a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section approach-section" aria-labelledby="process-title">
        <div className="container approach-redesign">
          <div>
            <SectionIntro id="process-title" eyebrow="Your process" title={<>From first question<br /><em>to next decision.</em></>} body="The timeline above is company history. This is different: a general view of how a client’s planning project usually develops." />
          </div>
          <PlanningJourney />
        </div>
      </section>

      <CallToAction compact />
    </>
  )
}
