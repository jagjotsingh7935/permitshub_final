"""Loads the website's starting content.

Safe to run on every deploy:
* page text, image slots and SEO rows are created if missing; values staff have edited are never overwritten;
* services, projects, FAQs, lists etc. are only loaded on a brand-new install (no SiteSettings row yet),
  so anything staff delete stays deleted.
"""
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand

from api import seed_data as d
from api.models import (
    CONTENT_GROUPS, DEFAULT_DISCLAIMER, FAQ, GROUP_MODELS, Chapter, ChapterLine, FAQCategory, FinderOption, PageSEO,
    Project, ProjectFact, ProjectImage, ProjectMilestone, ProjectSource, ProjectTypeOption, Region, Sector, Service,
    SiteImage, SiteSettings, Stage, StageOption, TextBlock,
)
from api.seed_texts import TEXTS
from api.seo import PAGE_DEFAULTS

SEED_IMAGES = Path(settings.BASE_DIR) / 'seed_images'


def attach(field, filename):
    with open(SEED_IMAGES / filename, 'rb') as handle:
        field.save(filename, File(handle), save=False)


def joined(items):
    return '\n'.join(items)


class Command(BaseCommand):
    help = 'Create missing page text / image slots, and load starter content on a fresh install.'

    def handle(self, *args, **options):
        fresh = not SiteSettings.objects.exists()
        site = SiteSettings.load()
        if fresh:
            site.disclaimer = DEFAULT_DISCLAIMER
            attach(site.logo, 'permits-hub-logo.webp')
            site.save()
            self.load_collections()

        self.sync_texts()
        self.sync_seo()
        self.sync_images(fresh)
        self.stdout.write(self.style.SUCCESS(f'Content ready ({"fresh install" if fresh else "existing install"}).'))

    def sync_texts(self):
        keys = []
        index = 0
        for section, rows in TEXTS:
            for row in rows:
                key, label, value = row[0], row[1], row[2]
                hint = row[3] if len(row) > 3 else ''
                keys.append(key)
                block, created = TextBlock.objects.get_or_create(
                    key=key, defaults={'section': section, 'label': label, 'value': value, 'help_text_note': hint, 'order': index},
                )
                if not created:
                    TextBlock.objects.filter(pk=block.pk).update(section=section, label=label, help_text_note=hint, order=index)
                index += 1
        TextBlock.objects.exclude(key__in=keys).delete()

    def sync_seo(self):
        for index, (key, (label, _path, title, description)) in enumerate(PAGE_DEFAULTS.items()):
            row, created = PageSEO.objects.get_or_create(
                key=key, defaults={'label': label, 'meta_title': title, 'meta_description': description, 'order': index},
            )
            if not created:
                PageSEO.objects.filter(pk=row.pk).update(label=label, order=index)

    def sync_images(self, fresh):
        for index, (key, label, filename, alt, focus) in enumerate(d.SITE_IMAGES):
            image, created = SiteImage.objects.get_or_create(key=key, defaults={'label': label, 'alt': alt, 'focus': focus, 'order': index})
            if created and fresh:
                attach(image.image, filename)
                image.save()
            elif not created:
                SiteImage.objects.filter(pk=image.pk).update(label=label, order=index)

    def load_collections(self):
        stages = {}
        for index, (slug, label, short) in enumerate(d.STAGES, start=1):
            stages[slug] = Stage.objects.create(slug=slug, label=label, short=short, order=index)

        sectors = {}
        for index, (slug, title, summary, considerations, show) in enumerate(d.SECTORS, start=1):
            sectors[slug] = Sector.objects.create(slug=slug, title=title, summary=summary, considerations=joined(considerations),
                                                  show_in_portfolio=show, order=index)

        projects = {}
        for index, data in enumerate(d.PROJECTS, start=1):
            cover_file, cover_alt, cover_caption, cover_focus = data['cover']
            project = Project(
                record=data['record'], slug=data['slug'], title=data['title'], place=data['place'], region=data['region'],
                sector=sectors[data['sector']], status=data['status'], status_note=data['status_note'], update_date=data['update_date'],
                highlight=data['highlight'], summary=data['summary'], tone=data['tone'], outcome=data['outcome'], next_steps=data['next_steps'],
                involvement=joined(data['involvement']), site_context=joined(data.get('site_context', [])),
                planning_considerations=joined(data.get('considerations', [])), illustration=data.get('illustration', ''),
                cover_alt=cover_alt, cover_caption=cover_caption, cover_focus=cover_focus,
                featured=data['featured'], home_order=data['home_order'], order=index,
            )
            attach(project.cover, cover_file)
            project.save()
            projects[data['slug']] = project
            for order, (label, value) in enumerate(data.get('facts', []), start=1):
                ProjectFact.objects.create(project=project, label=label, value=value, order=order)
            for order, (when, label, detail, source_label, source_url) in enumerate(data['milestones'], start=1):
                ProjectMilestone.objects.create(project=project, when=when, label=label, detail=detail,
                                                source_label=source_label, source_url=source_url, order=order)
            for order, (filename, alt, caption, fit) in enumerate(data['gallery'], start=1):
                image = ProjectImage(project=project, alt=alt, caption=caption, fit=fit, order=order)
                attach(image.image, filename)
                image.save()
            for order, (label, url) in enumerate(data['sources'], start=1):
                ProjectSource.objects.create(project=project, label=label, url=url, order=order)

        services = {}
        for index, data in enumerate(d.SERVICES, start=1):
            service = Service.objects.create(
                slug=data['slug'], title=data['title'], description=data['description'], icon=data['icon'], involves=data['involves'],
                who_for=joined(data['who_for']), situations=joined(data['situations']), inputs=joined(data['inputs']),
                deliverables=joined(data['deliverables']), conversation=data['conversation'], enquiry_type=data['enquiry_type'],
                meta_title=data['meta_title'], meta_description=data['meta_description'], order=index,
            )
            service.stages.set([stages[s] for s in data['stages']])
            service.related_projects.set([projects[s] for s in data['related']])
            services[data['slug']] = service

        for index, (stage, prompt, answer, service_slugs) in enumerate(d.FINDER, start=1):
            option = FinderOption.objects.create(stage=stages[stage], prompt=prompt, answer=answer, order=index)
            option.services.set([services[s] for s in service_slugs])

        for index, title in enumerate(d.FAQ_CATEGORIES, start=1):
            FAQCategory.objects.create(title=title, order=index)
        categories = {c.title: c for c in FAQCategory.objects.all()}
        for index, (placement, category, question, answer) in enumerate(d.FAQS, start=1):
            FAQ.objects.create(placement=placement, category=categories.get(category), question=question, answer=answer, order=index)

        for key, rows in d.LISTS.items():
            model = GROUP_MODELS[key]
            fields = list(CONTENT_GROUPS[key][2])
            for order, row in enumerate(rows, start=1):
                model.objects.create(order=order, **dict(zip(fields, row)))
        for key, rows in d.LINES_LISTS.items():
            for order, (title, items) in enumerate(rows, start=1):
                GROUP_MODELS[key].objects.create(order=order, title=title, lines=joined(items))

        for index, (name, note, label, url) in enumerate(d.REGIONS, start=1):
            Region.objects.create(name=name, note=note, source_label=label, source_url=url, order=index)

        for index, data in enumerate(d.CHAPTERS, start=1):
            source_label, source_url = data.get('source', ('', ''))
            chapter = Chapter.objects.create(
                slug=data['slug'], marker=data['marker'], type=data['type'], title=data['title'], eyebrow=data['eyebrow'],
                body='\n\n'.join(data['body']), stage=data['stage'], media_kind=data['media_kind'], media_title=data.get('media_title', ''),
                source_label=source_label, source_url=source_url, checklist=joined(data.get('checklist', [])), order=index,
            )
            chapter.projects.set([projects[s] for s in data.get('projects', [])])
            for order, (label, value, link) in enumerate(data.get('lines', []), start=1):
                ChapterLine.objects.create(chapter=chapter, label=label, value=value, link=link, order=order)

        for index, label in enumerate(d.PROJECT_TYPES, start=1):
            ProjectTypeOption.objects.create(label=label, order=index)
        for index, label in enumerate(d.STAGE_OPTIONS, start=1):
            StageOption.objects.create(label=label, order=index)
