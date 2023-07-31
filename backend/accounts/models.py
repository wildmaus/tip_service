from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class User(AbstractUser):
    username = models.CharField(
        max_length=66, unique=True,
        validators=[RegexValidator(r"^0x[a-f0-9]{40}$")])
    railgun_address = models.CharField(
        max_length=130, null=True, blank=True)
    railgun_creation_block = models.PositiveBigIntegerField(default=0)
    password = None
    first_name = None
    last_name = None
    email = None
    last_login = None
    date_joined = None

    def __str__(self):
        return self.username
