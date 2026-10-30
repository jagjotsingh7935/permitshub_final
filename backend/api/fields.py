import io
import os

from django.core.files.base import ContentFile
from django.core.validators import FileExtensionValidator
from django.db import models
from PIL import Image, ImageOps

MAX_WIDTH = 1920
ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']


def to_webp(file_obj):
    """Return WebP bytes for an uploaded raster image, or None if it cannot be read."""
    try:
        file_obj.seek(0)
        image = ImageOps.exif_transpose(Image.open(file_obj))
        image.load()
    except Exception:  # noqa: BLE001 - leave unreadable files untouched
        return None
    image = image.convert('RGBA' if image.mode in ('RGBA', 'LA', 'P') else 'RGB')
    if image.width > MAX_WIDTH:
        image = image.resize((MAX_WIDTH, round(image.height * MAX_WIDTH / image.width)), Image.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, 'WEBP', quality=82, method=6)
    return buffer.getvalue()


class WebpImageField(models.ImageField):
    """Accepts jpg/png/gif/webp/svg uploads. Raster images are stored as WebP; SVG is kept as-is."""

    default_validators = [FileExtensionValidator(ALLOWED_EXTENSIONS)]

    def formfield(self, **kwargs):
        # Skip Django's Pillow-only form field so SVG uploads validate.
        return models.FileField.formfield(self, **kwargs)

    def pre_save(self, model_instance, add):
        file = getattr(model_instance, self.attname)
        if file and not file._committed and not file.name.lower().endswith(('.webp', '.svg')):
            data = to_webp(file.file)
            if data:
                base = os.path.splitext(os.path.basename(file.name))[0]
                file.save(f'{base}.webp', ContentFile(data), save=False)
        return super().pre_save(model_instance, add)
