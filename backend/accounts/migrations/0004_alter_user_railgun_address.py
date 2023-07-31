# Generated by Django 4.2.1 on 2023-06-06 19:29

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_alter_user_railgun_address_alter_user_username'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='railgun_address',
            field=models.CharField(blank=True, max_length=130, null=True, unique=True, validators=[django.core.validators.RegexValidator('^0zk[a-f0-9]{120}')]),
        ),
    ]