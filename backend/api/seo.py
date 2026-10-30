"""Everything search engines and answer engines read: page titles/descriptions, JSON-LD, and the
plain-HTML copy of each page that is placed inside the React shell so it is visible without JavaScript."""
import re
from dataclasses import dataclass, field

from django.utils.html import escape

from .models import (
    FAQ, Chapter, ContentItem, PageSEO, Project, Region, Sector, Service, SiteSettings, TextBlock,
)

# key: (label, path, title, description) — used to seed the admin and as a fallback.
PAGE_DEFAULTS = {
    'home': ('Home', '/', 'Town Planning & Planning Permits Victoria | Permits Hub',
             "Melbourne town planning consultants with 16+ years' experience. Planning permits, subdivisions, due diligence and building permit documentation across Victoria."),
    'services': ('Services', '/services', 'Town Planning Services Melbourne & Victoria | Permits Hub',
                 'Due diligence, multi lot subdivisions, use and development permits, building permit documentation and construction-stage project management.'),
    'projects': ('Projects', '/projects', 'Planning Permit Projects: Childcare & Commercial | Permits Hub',
                 'Selected planning approvals across Victoria, including childcare centres in Winchelsea and St Leonards and a swim school in Winter Valley, Ballarat.'),
    'about': ('About', '/about', 'About Permits Hub | Melbourne Town Planning Consultants',
              'All-in-one-stop development solutions from town planning to construction completion, backed by over 16 years of town planning experience.'),
    'faqs': ('FAQs', '/faqs', 'Planning Permit FAQs Victoria | Permits Hub',
             'Answers to common questions about planning permits, council timeframes, subdivisions and building permits in Victoria.'),
    'contact': ('Contact', '/contact', 'Contact a Town Planner | Permits Hub Melbourne',
                'Tell us about your site and project. Contact Permits Hub for planning permit advice in Melbourne, Ballarat, Geelong and across Victoria.'),
}


def plain(value):
    return re.sub(r'\s+', ' ', (value or '').replace('*', ' ')).strip()


def clip(value, limit):
    value = plain(value)
    if len(value) <= limit:
        return value
    return value[: limit - 1].rsplit(' ', 1)[0].rstrip(',.;:–- ') + '…'


def lines(text):
    return [line.strip() for line in (text or '').splitlines() if line.strip()]


@dataclass
class Page:
    path: str
    title: str
    description: str
    image: str = ''
    og_type: str = 'website'
    noindex: bool = False
    status: int = 200
    crumbs: list = field(default_factory=list)  # [(name, path)] after Home
    nodes: list = field(default_factory=list)   # extra JSON-LD nodes
    body: str = ''
    sitemap: bool = True
    published: str = ''


class Content:
    """One snapshot of the website content for the current request."""

    def __init__(self):
        self.site = SiteSettings.load()
        self.text = {block.key: block.value for block in TextBlock.objects.all()}
        self.services = list(Service.objects.filter(is_active=True))
        self.sectors = list(Sector.objects.filter(is_active=True))
        self.projects = list(Project.objects.filter(is_active=True).select_related('sector'))
        self.faqs = list(FAQ.objects.filter(is_active=True))
        self.chapters = list(Chapter.objects.filter(is_active=True))
        self.regions = list(Region.objects.filter(is_active=True))
        self.seo = {row.key: row for row in PageSEO.objects.all()}
        self.lists = {}
        for item in ContentItem.objects.filter(is_active=True):
            self.lists.setdefault(item.group, []).append(item)

    def t(self, key):
        return plain(self.text.get(key, ''))

    @property
    def base(self):
        return self.site.site_url.rstrip('/')

    def url(self, path):
        return self.base + (path if path.startswith('/') else '/' + path)

    def brand(self):
        return f'{self.site.brand_primary} {self.site.brand_secondary}'.strip()

    def media(self, file_field):
        return self.url(file_field.url) if file_field else ''


def build_pages(c: Content):
    """Every public route -> Page."""
    pages = {}
    default_image = c.site.default_og_image.url if c.site.default_og_image else (c.site.logo.url if c.site.logo else '')

    def fixed(key):
        label, path, title, description = PAGE_DEFAULTS[key]
        row = c.seo.get(key)
        return Page(
            path=path,
            title=(row.meta_title if row and row.meta_title else title),
            description=(row.meta_description if row and row.meta_description else description),
            image=(row.og_image.url if row and row.og_image else default_image),
            noindex=bool(row and row.noindex),
            crumbs=[] if path == '/' else [(label, path)],
        )

    home, services_page, projects_page, about, faqs_page, contact = (
        fixed(k) for k in ('home', 'services', 'projects', 'about', 'faqs', 'contact')
    )
    for page in (home, services_page, projects_page, about, faqs_page, contact):
        pages[page.path] = page

    for project in c.projects:
        path = f'/projects/{project.slug}'
        pages[path] = Page(
            path=path,
            title=project.meta_title or f'{plain(project.title)} – {project.place} | {c.brand()}',
            description=project.meta_description or clip(project.summary, 158),
            image=project.cover.url if project.cover else default_image,
            og_type='article',
            crumbs=[('Projects', '/projects'), (plain(project.title), path)],
            nodes=[{'_kind': 'WebPage'}] + ([project_node(c, project, path)] if project.record == 'verified' else []),
            # Demo projects are fictional: hide them from search engines and the sitemap.
            noindex=project.record == 'demo',
            sitemap=project.record == 'verified',
            published=project.update_date.isoformat() if project.update_date else '',
        )

    services_nodes = [{'_kind': 'CollectionPage'}, services_list_node(c)] + [service_node(c, s) for s in c.services]
    services_page.nodes += services_nodes
    projects_page.nodes.append({'_kind': 'CollectionPage'})
    about.nodes.append({'_kind': 'AboutPage'})
    contact.nodes.append({'_kind': 'ContactPage'})
    home.nodes += [{'_kind': 'WebPage'}, services_list_node(c), faq_node([f for f in c.faqs if f.placement in ('home', 'faqs')][:6])]
    faqs_page.nodes += [{'_kind': 'WebPage'}, faq_node([f for f in c.faqs if f.placement == 'faqs'])]

    for page in pages.values():
        page.body = prerender(c, page)
    return pages


def not_found_page(c: Content):
    page = Page(path='/404', title=f'Page not found | {c.brand()}', description='This page could not be found.',
                noindex=True, status=404, sitemap=False)
    page.body = '<main><h1>Page not found</h1><p>The page you are looking for is not here.</p><p><a href="/">Back to home</a></p></main>'
    return page


# ── JSON-LD ───────────────────────────────────────────────────────────────

def org_ref(c):
    return {'@id': c.url('/#organization')}


def organization_node(c: Content):
    s = c.site
    node = {
        '@type': 'ProfessionalService',
        '@id': c.url('/#organization'),
        'name': c.brand(),
        'legalName': s.company_name,
        'url': c.url('/'),
        'description': PAGE_DEFAULTS['home'][3],
        'email': s.contact_email,
        'telephone': s.contact_phone,
        'address': {'@type': 'PostalAddress', 'addressLocality': s.locality, 'addressRegion': s.region, 'addressCountry': 'AU'},
        'areaServed': [{'@type': 'AdministrativeArea', 'name': area.strip()} for area in s.service_areas.split(',') if area.strip()],
        'knowsAbout': [plain(service.title) for service in c.services],
    }
    if s.logo:
        node['logo'] = {'@type': 'ImageObject', 'url': c.media(s.logo)}
        node['image'] = c.media(s.default_og_image or s.logo)
    if s.facebook_url:
        node['sameAs'] = [s.facebook_url]
    return node


def website_node(c: Content):
    return {'@type': 'WebSite', '@id': c.url('/#website'), 'url': c.url('/'), 'name': c.brand(),
            'inLanguage': 'en-AU', 'publisher': org_ref(c)}


def service_node(c, service):
    return {
        '@type': 'Service', '@id': c.url(f'/services#{service.slug}'),
        'name': plain(service.title), 'description': clip(service.description, 300),
        'url': c.url(f'/services#{service.slug}'), 'provider': org_ref(c),
        'areaServed': {'@type': 'AdministrativeArea', 'name': 'Victoria, Australia'},
        'serviceType': plain(service.title).split(' – ')[0],
    }


def services_list_node(c):
    return {
        '@type': 'ItemList', 'name': 'Services',
        'itemListElement': [
            {'@type': 'ListItem', 'position': i, 'url': c.url(f'/services#{s.slug}'), 'name': plain(s.title)}
            for i, s in enumerate(c.services, start=1)
        ],
    }


def project_node(c, project, path):
    node = {
        '@type': 'Article', '@id': c.url(path + '#article'), 'headline': clip(project.title, 110),
        'description': clip(project.summary, 300), 'author': org_ref(c), 'publisher': org_ref(c),
        'mainEntityOfPage': c.url(path), 'inLanguage': 'en-AU',
    }
    if project.update_date:
        node['datePublished'] = project.update_date.isoformat()
    if project.cover:
        node['image'] = c.media(project.cover)
    return node


def faq_node(faqs):
    return {
        '@type': 'FAQPage',
        'mainEntity': [
            {'@type': 'Question', 'name': plain(f.question), 'acceptedAnswer': {'@type': 'Answer', 'text': plain(f.answer)}}
            for f in faqs
        ],
    }


def json_ld(c: Content, page: Page):
    graph = [organization_node(c), website_node(c)]
    url = c.url(page.path)
    for node in page.nodes:
        if '_kind' in node:
            graph.append({
                '@type': node['_kind'], '@id': url + '#webpage', 'url': url, 'name': page.title,
                'description': page.description, 'inLanguage': 'en-AU', 'isPartOf': {'@id': c.url('/#website')},
                'about': org_ref(c),
                **({'breadcrumb': {'@id': url + '#breadcrumb'}} if page.crumbs else {}),
            })
        else:
            graph.append(node)
    if page.crumbs:
        items = [('Home', '/')] + list(page.crumbs)
        graph.append({
            '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
            'itemListElement': [
                {'@type': 'ListItem', 'position': i, 'name': name, 'item': c.url(path)}
                for i, (name, path) in enumerate(items, start=1)
            ],
        })
    return {'@context': 'https://schema.org', '@graph': graph}


# ── Plain-HTML copy of each page (placed inside #root; React replaces it on load) ─────────────

def a(path, label):
    return f'<a href="{escape(path)}">{escape(label)}</a>'


def faq_html(faqs, level=2):
    return ''.join(f'<h{level}>{escape(f.question)}</h{level}><p>{escape(f.answer)}</p>' for f in faqs)


def prerender(c: Content, page: Page):
    t = c.t
    s = c.site
    out = []
    path = page.path

    if path == '/':
        out.append(f'<h1>{escape(t("home.hero.1.title"))}</h1><p>{escape(t("home.hero.1.body"))}</p>')
        out.append(f'<h2>{escape(t("home.intro.title"))}</h2><p>{escape(t("home.intro.p1"))}</p><p>{escape(t("home.intro.p2"))}</p>')
        out.append(f'<h2>{escape(t("home.services.title"))}</h2><p>{escape(t("home.services.body"))}</p><ul>')
        out += [f'<li>{a("/services#" + sv.slug, plain(sv.title))} — {escape(sv.description)}</li>' for sv in c.services]
        out.append('</ul>')
        out.append(f'<h2>{escape(t("home.projects.title"))}</h2><ul>')
        out += [f'<li>{a("/projects/" + p.slug, plain(p.title))} — {escape(p.place)}. {escape(p.summary)}</li>'
                for p in c.projects if p.record == 'verified']
        out.append('</ul>')
        out.append(f'<h2>{escape(t("home.faq.title"))}</h2>')
        out.append(faq_html([f for f in c.faqs if f.placement == 'home'], 3))
        out.append(f'<p>{a("/faqs", "More planning questions")}</p>')
    elif path == '/services':
        out.append(f'<h1>{escape(t("services.hero.title"))}</h1><p>{escape(t("services.hero.body"))}</p>')
        for sv in c.services:
            out.append(f'<h2 id="{escape(sv.slug)}">{escape(plain(sv.title))}</h2><p>{escape(sv.description)}</p><p>{escape(sv.involves)}</p>')
            out.append('<h3>Who it is for</h3><ul>' + ''.join(f'<li>{escape(i)}</li>' for i in lines(sv.who_for)) + '</ul>')
            out.append('<h3>Example deliverables</h3><ul>' + ''.join(f'<li>{escape(i)}</li>' for i in lines(sv.deliverables)) + '</ul>')
        out.append(f'<h2>{escape(t("services.faq.title"))}</h2>')
        out.append(faq_html([f for f in c.faqs if f.placement == 'services'], 3))
        out.append(f'<p>{escape(s.disclaimer)}</p>')
    elif path == '/projects':
        out.append(f'<h1>{escape(t("projects.hero.title"))}</h1><p>{escape(t("projects.hero.body"))}</p><h2>Categories</h2><ul>')
        out += [f'<li>{escape(x.title)} — {escape(x.summary)}</li>' for x in c.sectors if x.show_in_portfolio]
        out.append('</ul><h2>Projects</h2><ul>')
        out += [f'<li>{a("/projects/" + p.slug, plain(p.title))} — {escape(p.place)}</li>' for p in c.projects]
        out.append('</ul>')
    elif path.startswith('/projects/'):
        p = next(x for x in c.projects if path == f'/projects/{x.slug}')
        img = ''
        if p.cover:
            img = f'<img src="{escape(p.cover.url)}" alt="{escape(p.cover_alt)}" width="{p.cover_width or ""}" height="{p.cover_height or ""}">'
        label = 'Public update' if p.record == 'verified' else 'Demo project (fictional)'
        out.append(f'<h1>{escape(plain(p.title))}</h1><p>{label} — {escape(p.sector.title if p.sector else "")} — {escape(p.place)}</p>{img}')
        out.append(f'<h2>{escape(p.highlight)}</h2><p>{escape(p.summary)}</p><h2>Outcome</h2><p>{escape(p.outcome)}</p>')
        out.append('<ul>' + ''.join(f'<li>{escape(i)}</li>' for i in lines(p.involvement)) + '</ul>')
    elif path == '/about':
        out.append(f'<h1>{escape(t("about.hero.title"))}</h1><p>{escape(t("about.hero.body"))}</p><h2>{escape(t("about.copy.title"))}</h2>')
        out.append(f'<p>{escape(t("about.copy.p1"))}</p><p>{escape(t("about.copy.p2"))}</p><h2>{escape(t("about.timeline.title"))}</h2><ol>')
        for ch in c.chapters:
            body = ' '.join(escape(plain(part)) for part in ch.body.split('\n\n'))
            out.append(f'<li><strong>{escape(ch.marker)} — {escape(ch.title)}.</strong> {body}</li>')
        out.append('</ol><h2>Where the public record shows our work</h2><ul>')
        out += [f'<li><strong>{escape(r.name)}</strong> — {escape(r.note)}</li>' for r in c.regions]
        out.append('</ul>')
    elif path == '/faqs':
        out.append(f'<h1>{escape(t("faqs.hero.title"))}</h1><p>{escape(t("faqs.hero.body"))}</p>')
        out.append(faq_html([f for f in c.faqs if f.placement == 'faqs']))
    elif path == '/contact':
        out.append(f'<h1>{escape(t("contact.hero.title"))}</h1><p>{escape(t("contact.hero.body"))}</p><ul>')
        out.append(f'<li>Phone: <a href="tel:{escape("".join(ch for ch in s.contact_phone if ch.isdigit()))}">{escape(s.contact_phone)}</a></li>')
        out.append(f'<li>Email: <a href="mailto:{escape(s.contact_email)}">{escape(s.contact_email)}</a></li>')
        out.append(f'<li>Area: {escape(s.service_areas)}</li></ul>')
        out.append(faq_html([f for f in c.faqs if f.placement == 'contact'], 3))

    nav = ''.join(f'<li>{a(p, label)}</li>' for label, p in
                  [('Services', '/services'), ('Projects', '/projects'), ('About', '/about'), ('FAQs', '/faqs'), ('Contact', '/contact')])
    return (f'<header><a href="/">{escape(c.brand())}</a><nav><ul>{nav}</ul></nav></header>'
            f'<main>{"".join(out)}</main>'
            f'<footer><p>{escape(c.brand())} — {escape(s.contact_email)} — {escape(s.contact_phone)}</p></footer>')
