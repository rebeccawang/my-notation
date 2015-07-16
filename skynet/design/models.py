import os
import random
import string
from datetime import datetime

from django.db import models
from django.contrib.auth.models import User

from sorl.thumbnail import ImageField


def generate_random_string(digit_length=6, char_length=6):
    digits = "".join([random.choice(string.digits) for i in xrange(6)])
    chars = "".join([random.choice(string.letters) for i in xrange(6)])
    return digits + chars


def item_upload_to(instance, filename):
    file_root, file_ext = os.path.splitext(filename)
    date = datetime.now().strftime("%Y/%m/%d")
    random_name = generate_random_string() + file_ext
    return '/'.join(['user-media', date, random_name])


class DesignGroup(models.Model):
    name = models.CharField(max_length=140)
    user = models.ForeignKey(User)


class Design(models.Model):
    title = models.CharField(max_length=140, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User)
    upload = ImageField(upload_to=item_upload_to)

    def get_absolute_url(self):
        return '/design/%d/' % self.pk


class DesignRevise(models.Model):
    design = models.ForeignKey(Design)
    version = models.IntegerField()
    upload = ImageField(upload_to=item_upload_to)

    class meta:
        unique_together = (('design', 'version'))

    def get_absolute_url(self):
        return '/design/%d' % self.pk


class Pin(models.Model):
    PinCategories = (
        ('color', 'color'), 
        ('rhythm', 'rhythm'),
        ('space','space'),
        ('contrast','contrast'),
        ('font','font'),
        ('texture','texture'),
        ('layers','layers'),
        ('grid','grid'),
        ('pattern','pattern',)
        )
    user = models.ForeignKey(User)
    design = models.ForeignKey(Design)
    x = models.FloatField('x pixel')
    y = models.FloatField('y pixel')
    category = models.CharField(max_length=20, choices=PinCategories)
    msg = models.TextField(default='')
