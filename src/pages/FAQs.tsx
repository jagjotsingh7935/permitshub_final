import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, HelpCircle } from 'lucide-react'
import { Accordion } from '../components/ui/Accordion'
import { Reveal } from '../components/ui/Reveal'
import { CallToAction, PageHero, SectionIntro } from '../components/ui/Sections'
import { useSite } from '../site/SiteProvider'

export default function FAQs() {
  const { t, rt, allFaqs, faqCategories } = useSite()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === 'All') return allFaqs
    return allFaqs.filter((item) => item.category === selectedCategory)
  }, [selectedCategory, allFaqs])

  return (
    <>
      <PageHero
        eyebrow={t('faqs.hero.eyebrow')}
        title={rt('faqs.hero.title')}
        body={t('faqs.hero.body')}
        number="04"
      >
        <div className="about-hero-aside">
          <dl className="hero-facts">
            <div>
              <dt>{t('faqs.hero.f1_label')}</dt>
              <dd>{t('faqs.hero.f1')}</dd>
            </div>
            <div>
              <dt>{t('faqs.hero.f2_label')}</dt>
              <dd>{t('faqs.hero.f2')}</dd>
            </div>
          </dl>
          <Link to="/contact" className="button button--white">
            {t('faqs.hero.button')} <ArrowUpRight size={17} />
          </Link>
        </div>
      </PageHero>

      <section className="section faq-page-content" aria-labelledby="faqs-list-title">
        <div className="container">
          <Reveal>
            <SectionIntro
              id="faqs-list-title"
              eyebrow={t('faqs.list.eyebrow')}
              title={rt('faqs.list.title')}
              body={t('faqs.list.body')}
            />
          </Reveal>

          <Reveal delay={0.05}>
            <div className="faq-filter-bar" role="group" aria-label="Filter FAQs by category">
              <button
                type="button"
                className={`faq-filter-btn ${selectedCategory === 'All' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                {t('faqs.list.all')} ({allFaqs.length})
              </button>
              {faqCategories.map((category) => {
                const count = allFaqs.filter((f) => f.category === category).length
                return (
                  <button
                    key={category}
                    type="button"
                    className={`faq-filter-btn ${selectedCategory === category ? 'is-active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category} ({count})
                  </button>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ maxWidth: 840 }}>
              <Accordion
                items={filteredFaqs.map((faq) => ({
                  id: faq.id,
                  title: faq.question,
                  content: <p>{faq.answer}</p>,
                }))}
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              style={{
                marginTop: 64,
                padding: '28px 32px',
                background: 'var(--paper, #f7f6f2)',
                border: '1px solid var(--line, #e3e9ee)',
                borderRadius: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                maxWidth: 840,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#e3eff7',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--blue, #1f72d8)',
                    flexShrink: 0,
                  }}
                >
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3
                    style={{
                      font: '700 16px Manrope, sans-serif',
                      color: 'var(--navy, #071c38)',
                      margin: 0,
                    }}
                  >
                    {t('faqs.box.title')}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--muted, #647386)' }}>
                    {t('faqs.box.body')}
                  </p>
                </div>
              </div>
              <Link to="/contact" className="button button--primary">
                {t('faqs.box.button')} <ArrowUpRight size={17} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CallToAction compact title={rt('cta.faqs.title')} />
    </>
  )
}
