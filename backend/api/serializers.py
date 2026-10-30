from rest_framework import serializers

from .models import (
    CONTENT_GROUPS, FAQ, Chapter, ContentItem, Enquiry, FAQCategory, FinderOption, ProjectTypeOption, Project,
    Region, Sector, Service, SiteImage, SiteSettings, Stage, StageOption, TextBlock,
)


def media_url(file_field):
    return file_field.url if file_field else ''


def lines(text):
    return [line.strip() for line in (text or '').splitlines() if line.strip()]


def paragraphs(text):
    return [part.strip() for part in (text or '').replace('\r\n', '\n').split('\n\n') if part.strip()]


def source(label, url):
    return {'label': label, 'url': url} if url else None


def settings_data(obj: SiteSettings):
    return {
        'brandPrimary': obj.brand_primary,
        'brandSecondary': obj.brand_secondary,
        'companyName': obj.company_name,
        'logo': media_url(obj.logo),
        'contactEmail': obj.contact_email,
        'contactPhone': obj.contact_phone,
        'contactPhoneHref': 'tel:' + ''.join(ch for ch in obj.contact_phone if ch.isdigit() or ch == '+'),
        'facebookUrl': obj.facebook_url,
        'disclaimer': obj.disclaimer,
    }


def service_data(service: Service, number: int):
    return {
        'id': service.slug,
        'number': f'{number:02d}',
        'title': service.title,
        'description': service.description,
        'icon': service.icon,
        'involves': service.involves,
        'whoFor': lines(service.who_for),
        'situations': lines(service.situations),
        'inputs': lines(service.inputs),
        'deliverables': lines(service.deliverables),
        'conversation': service.conversation,
        'enquiryType': service.enquiry_type,
        'stages': [stage.slug for stage in service.stages.all()],
        'relatedProjects': [project.slug for project in service.related_projects.all()],
    }


def project_data(project: Project):
    cover = None
    if project.cover:
        cover = {
            'src': project.cover.url, 'alt': project.cover_alt, 'caption': project.cover_caption,
            'position': project.cover_focus or None, 'width': project.cover_width, 'height': project.cover_height,
        }
    return {
        'record': project.record,
        'slug': project.slug,
        'title': project.title,
        'place': project.place,
        'region': project.region,
        'category': project.sector.title if project.sector else '',
        'status': project.status,
        'statusNote': project.status_note,
        'updateDate': project.update_date.isoformat() if project.update_date else '',
        'highlight': project.highlight,
        'summary': project.summary,
        'tone': project.tone,
        'outcome': project.outcome,
        'nextSteps': project.next_steps,
        'documentedInvolvement': lines(project.involvement),
        'siteContext': lines(project.site_context),
        'planningConsiderations': lines(project.planning_considerations),
        'illustration': project.illustration,
        'keyFacts': [{'label': f.label, 'value': f.value} for f in project.facts.all()],
        'milestones': [
            {'when': m.when, 'label': m.label, 'detail': m.detail, **({'source': source(m.source_label, m.source_url)} if m.source_url else {})}
            for m in project.milestones.all()
        ],
        'cover': cover,
        'gallery': [
            {'src': g.image.url, 'alt': g.alt, 'caption': g.caption, 'fit': g.fit, 'width': g.image_width, 'height': g.image_height}
            for g in project.gallery.all()
        ],
        'sources': [source(s.label, s.url) for s in project.sources.all()],
        'featured': project.featured,
        'homeOrder': project.home_order,
    }


def chapter_data(chapter: Chapter):
    media = {'kind': chapter.media_kind}
    chapter_lines = list(chapter.lines.all())
    if chapter.media_kind == 'record':
        media.update(title=chapter.media_title, lines=[{'label': l.label, 'value': l.value} for l in chapter_lines],
                     source=source(chapter.source_label, chapter.source_url))
    elif chapter.media_kind == 'checklist':
        media.update(title=chapter.media_title, items=lines(chapter.checklist))
    elif chapter.media_kind == 'projects':
        media.update(slugs=[p.slug for p in chapter.projects.filter(is_active=True)])
    elif chapter.media_kind == 'figures':
        media.update(items=[{'value': l.value, 'label': l.label, 'href': l.link} for l in chapter_lines])
    return {
        'id': chapter.slug, 'marker': chapter.marker, 'type': chapter.type, 'title': chapter.title,
        'eyebrow': chapter.eyebrow, 'body': paragraphs(chapter.body), 'stage': max(chapter.stage - 1, 0), 'media': media,
    }


def site_payload():
    services = Service.objects.filter(is_active=True).prefetch_related('stages', 'related_projects')
    projects = Project.objects.filter(is_active=True).select_related('sector').prefetch_related(
        'facts', 'milestones', 'gallery', 'sources')
    items = {}
    for item in ContentItem.objects.filter(is_active=True, group__in=CONTENT_GROUPS):
        items.setdefault(item.group, []).append(
            {'title': item.title, 'body': item.body, 'detail': item.detail, 'lines': lines(item.lines)})
    return {
        'settings': settings_data(SiteSettings.load()),
        'text': {block.key: block.value for block in TextBlock.objects.all()},
        'images': {
            image.key: {
                'url': media_url(image.image), 'alt': image.alt, 'position': image.focus or None,
                'width': image.image_width, 'height': image.image_height,
            }
            for image in SiteImage.objects.all()
        },
        'services': [service_data(s, i) for i, s in enumerate(services, start=1)],
        'stages': [{'id': s.slug, 'label': s.label, 'short': s.short} for s in Stage.objects.filter(is_active=True)],
        'finder': [
            {'stage': o.stage.slug, 'prompt': o.prompt, 'answer': o.answer, 'services': [s.slug for s in o.services.all()]}
            for o in FinderOption.objects.filter(is_active=True).select_related('stage').prefetch_related('services')
        ],
        'sectors': [
            {'slug': s.slug, 'title': s.title, 'summary': s.summary, 'considerations': lines(s.considerations),
             'showInPortfolio': s.show_in_portfolio}
            for s in Sector.objects.filter(is_active=True)
        ],
        'projects': [project_data(p) for p in projects],
        'faqs': [
            {'id': f'faq-{f.pk}', 'question': f.question, 'answer': f.answer, 'placement': f.placement,
             'category': f.category.title if f.category else ''}
            for f in FAQ.objects.filter(is_active=True).select_related('category')
        ],
        'faqCategories': [c.title for c in FAQCategory.objects.filter(is_active=True)],
        'lists': items,
        'chapters': [chapter_data(c) for c in Chapter.objects.filter(is_active=True).prefetch_related('lines', 'projects')],
        'regions': [
            {'name': r.name, 'note': r.note, 'source': source(r.source_label, r.source_url)}
            for r in Region.objects.filter(is_active=True)
        ],
        'projectTypes': [o.label for o in ProjectTypeOption.objects.filter(is_active=True)],
        'projectStages': [o.label for o in StageOption.objects.filter(is_active=True)],
    }


def full_payload(pages=None):
    """The complete JSON the React app needs, also embedded in the HTML for the first paint."""
    payload = site_payload()
    payload['siteUrl'] = SiteSettings.load().site_url.rstrip('/')
    payload['pages'] = {
        path: {'title': page.title, 'description': page.description, 'noindex': page.noindex}
        for path, page in (pages or {}).items()
    }
    return payload


class EnquirySerializer(serializers.ModelSerializer):
    # Honeypot: real visitors never see or fill this.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Enquiry
        fields = ['name', 'email', 'phone', 'location', 'project_type', 'stage', 'service', 'message', 'website']
        extra_kwargs = {key: {'required': False, 'allow_blank': True} for key in ('phone', 'location', 'project_type', 'stage', 'service')}
