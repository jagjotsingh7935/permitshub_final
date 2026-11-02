"""Re-compress stored images that are over 100 kB (idempotent: smaller files are left alone)."""
import io

from django.apps import apps
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image

LIMIT = 100 * 1024
MAX_WIDTH = 1400


class Command(BaseCommand):
    help = 'Shrink stored WebP/JPEG/PNG images above 100 kB.'

    def handle(self, *args, **options):
        done = 0
        for model in apps.get_app_config('api').get_models():
            if model._meta.proxy:
                continue
            for field in model._meta.get_fields():
                if getattr(field, 'upload_to', None) is None or not hasattr(field, 'attname'):
                    continue
                for obj in model.objects.exclude(**{field.name: ''}):
                    file = getattr(obj, field.name)
                    if not file or file.name.lower().endswith('.svg'):
                        continue
                    try:
                        if file.size <= LIMIT:
                            continue
                        file.open('rb')
                        image = Image.open(file)
                        image.load()
                        file.close()
                    except Exception:  # noqa: BLE001 - missing or unreadable file: skip
                        continue
                    image = image.convert('RGBA' if image.mode in ('RGBA', 'LA', 'P') else 'RGB')
                    if image.width > MAX_WIDTH:
                        image = image.resize((MAX_WIDTH, round(image.height * MAX_WIDTH / image.width)), Image.LANCZOS)
                    for quality in (74, 68, 62, 56):
                        buffer = io.BytesIO()
                        image.save(buffer, 'WEBP', quality=quality, method=6)
                        if buffer.tell() <= LIMIT:
                            break
                    if buffer.tell() >= file.size:
                        continue
                    name = file.name
                    storage = file.storage
                    storage.delete(name)
                    storage.save(name, ContentFile(buffer.getvalue()))
                    model.objects.filter(pk=obj.pk).update(**{
                        key: value for key, value in (
                            (getattr(field, 'width_field', None), image.width), (getattr(field, 'height_field', None), image.height),
                        ) if key
                    })
                    done += 1
        self.stdout.write(self.style.SUCCESS(f'Optimised {done} image(s).'))
