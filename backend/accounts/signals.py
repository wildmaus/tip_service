from django.dispatch import receiver
from . import models
from django.db.models.signals import pre_save


@receiver(pre_save, sender=models.User)
def set_addresses_to_lower(instance, **kwargs):
    if instance.username:
        instance.username = instance.username.lower()
    if instance.railgun_address:
        instance.railgun_address = instance.railgun_address.lower()
