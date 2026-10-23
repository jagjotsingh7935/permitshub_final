import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, CircleArrowRight, ExternalLink } from 'lucide-react'
import { ArchitecturalHero } from '../components/home/ArchitecturalHero'
import { PillarsStrip } from '../components/home/PillarsStrip'
import { ProjectStarter } from '../components/home/ProjectStarter'
import { ServicesEditorial } from '../components/home/ServicesEditorial'
import { PortfolioSectors } from '../components/projects/PortfolioSectors'
import { ProjectShowcase } from '../components/projects/ProjectShowcase'
import { SiteEvolution } from '../components/about/SiteEvolution'
import { WithCoordination, WithoutCoordination } from '../components/about/CoordinationDiagram'
import { Accordion } from '../components/ui/Accordion'
import { PlanningJourney } from '../components/ui/PlanningJourney'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { CallToAction, SectionIntro } from '../components/ui/Sections'
import { audiences, challenges, chapters, enquiryGroups, homeFaqs } from '../content'

const coordinationBenefits = [
  'One place to ask “where are we up to?”',
  'Drawings and reports checked against each other before they go to council',
  'Council requests tracked and responded to in a coordinated way',
  'The move from planning approval to building permit managed, not left to chance',
]

export default function Home() {
  const milestones = chapters.filter(chapter => chapter.type === 'milestone')
  return (
    <>
      {/* 1 · Preserved 3D hero */}
      <ArchitecturalHero />

      <PillarsStrip />

      {/* 2 · Introduction and who Permits Hub helps */}
      <section className="home-intro" id="planning-content" aria-labelledby="intro-title">
        <div className="container home-intro__grid">
          <Reveal className="home-intro__lead">
            <span className="eyebrow"><span className="eyebrow__line" />Permits Hub</span>
            <h2 id="intro-title">Town planning guidance for the places communities need, from the first site question to the next approval.</h2>
          </Reveal>
          <div className="home-intro__body">
            <Reveal>
              <p>With over 16 years of town planning experience, Permits Hub is based in Melbourne. Our multi-disciplinary services provide all-in-one-stop development solutions, from town planning to construction completion.</p>
              <p>Public project updates include childcare centres in St Leonards and Winchelsea and a swim school in Ballarat.</p>
            </Reveal>
            <h3 className="home-intro__subhead">Who we help</h3>
            <RevealGroup as="ul" className="audience-rows">
              {audiences.map(audience => (
                <RevealItem as="li" key={audience.title}><strong>{audience.title}</strong><span>{audience.body}</span></RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* 2.5 · Why coordination matters: Many parties, one clear line */}
      <section className="coordination-section" aria-labelledby="home-coordination-title">
        <div aria-hidden="true" className="planning-grid-dark pointer-events-none" style={{ position: 'absolute', inset: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <SectionIntro
              id="home-coordination-title"
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

      {/* 3 · Service overview */}
      <section className="section section--services" aria-labelledby="services-title">
        <div className="container">
          <div className="section-head">
            <Reveal><SectionIntro id="services-title" eyebrow="What we do" title={<>A smarter way through<br /><em>the planning process.</em></>} body="Every development starts with different questions. We bring the planning, approvals and practical next steps into focus." /></Reveal>
            <Reveal className="section-head__action"><Link to="/services" className="text-link">All services <CircleArrowRight size={22} /></Link></Reveal>
          </div>
          <ServicesEditorial />
        </div>
      </section>

      {/* 4 · Types of enquiries */}
      <section className="enquiry-types" aria-labelledby="enquiry-title">
        <div className="container">
          <div className="enquiry-types__head">
            <h2 id="enquiry-title">What people bring to us</h2>
            <p>Common kinds of planning enquiry. Every site is different, so the scope of any work is confirmed after a first conversation.</p>
          </div>
          <RevealGroup className="enquiry-types__grid">
            {enquiryGroups.map(group => (
              <RevealItem key={group.heading} className="enquiry-types__group">
                <h3>{group.heading}</h3>
                <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 5 · Common challenges */}
      <section className="challenges" aria-labelledby="challenges-title">
        <div className="container challenges__grid">
          <div className="challenges__intro">
            <Reveal>
              <span className="eyebrow eyebrow--on-dark"><span className="eyebrow__line" />When planning gets stuck</span>
              <h2 id="challenges-title">Six situations we hear about often.</h2>
              <p>Planning problems are rarely unusual. Most have a sensible first step, even when the full answer depends on the site and the planning scheme.</p>
              <Link to="/contact" className="text-link text-link--light">Talk through your situation <ArrowRight size={18} /></Link>
            </Reveal>
          </div>
          <RevealGroup as="ol" className="challenges__list">
            {challenges.map((item, index) => (
              <RevealItem as="li" key={item.challenge}>
                <span className="challenges__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.challenge}</h3>
                <p><span className="sr-only">A useful first step: </span>{item.response}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 6 · Planning journey */}
      <section className="section journey-section" aria-labelledby="journey-title">
        <div className="container">
          <div className="section-head">
            <Reveal><SectionIntro id="journey-title" eyebrow="The planning journey" title={<>A process you can<br /><em>see your way through.</em></>} body="How a typical project moves from a first idea toward a planning decision. Timing and steps vary with the site and proposal." /></Reveal>
          </div>
          <PlanningJourney variant="diagram" />
        </div>
      </section>

      {/* 7 · Selected real projects */}
      <section className="section projects-section" aria-labelledby="projects-title">
        <div className="container">
          <div className="section-head">
            <Reveal><SectionIntro id="projects-title" eyebrow="Project updates" title={<>Ideas taking shape<br /><em>across Victoria.</em></>} body="Selected updates shared publicly by Permits Hub." /></Reveal>
            <Reveal className="section-head__action"><Link to="/projects" className="text-link">Explore our work <CircleArrowRight size={22} /></Link></Reveal>
          </div>
          <Reveal><PortfolioSectors /></Reveal>
          <Reveal><ProjectShowcase /></Reveal>
          <p className="project-note">Images and details are from Permits Hub’s public Facebook updates. The visuals are architectural renders and announcement artwork, not photographs of completed buildings.</p>
        </div>
      </section>

      {/* 8 · About preview */}
      <section className="about-preview" aria-labelledby="about-preview-title">
        <div className="container about-preview__grid">
          <Reveal className="about-preview__visual">
            <figure>
              <SiteEvolution stage={4} label="Conceptual illustration of a community building on its site" />
              <figcaption>Conceptual illustration from the About timeline. Not a Permits Hub project.</figcaption>
            </figure>
          </Reveal>
          <div className="about-preview__copy">
            <Reveal>
              <h2 id="about-preview-title">A short history, in the public record.</h2>
              <p>The About page follows Permits Hub from its registration to recent approvals, alongside a drawing that grows from bare land to a finished place.</p>
            </Reveal>
            <RevealGroup as="ol" className="about-preview__milestones">
              {milestones.map(chapter => (
                <RevealItem as="li" key={chapter.id}><span>{chapter.marker}</span><strong>{chapter.title}</strong></RevealItem>
              ))}
            </RevealGroup>
            <Link to="/about" className="button button--outline">Read our story <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* 9 · Enquiry starter */}
      <section className="starter-band" aria-labelledby="starter-title">
        <div className="container starter-band__grid">
          <div>
            <span className="eyebrow"><span className="eyebrow__line" />A useful first step</span>
            <h2 id="starter-title">Every site has<br /><em>its own story.</em></h2>
            <p>Tell us the basics. We’ll carry them into a focused enquiry you can send directly to the team.</p>
            <span className="starter-band__aside">No account. No commitment. Just a clearer starting point.</span>
          </div>
          <ProjectStarter />
        </div>
      </section>

      {/* 10 · FAQs */}
      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="container faq-section__inner">
          <Reveal>
            <SectionIntro id="faq-title" eyebrow="Good to know" title={<>Answers for the<br /><em>first steps.</em></>} body="A few useful starting points before we learn about your project." />
            <a href="https://www.planning.vic.gov.au/" target="_blank" rel="noreferrer" className="text-link faq-section__link">Victorian planning information <ExternalLink size={15} /><span className="sr-only"> (opens in a new tab)</span></a>
          </Reveal>
          <Accordion items={homeFaqs.map((faq, index) => ({ id: `home-faq-${index}`, title: faq.question, content: <p>{faq.answer}</p> }))} />
        </div>
      </section>

      {/* 11 · Final call to action */}
      <CallToAction />
    </>
  )
}
