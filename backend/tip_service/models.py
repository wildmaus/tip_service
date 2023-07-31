from django.db import models
from django.contrib.auth import get_user_model
from sorl.thumbnail import ImageField


class Worker(models.Model):
    user = models.OneToOneField(
        to=get_user_model(), on_delete=models.CASCADE, related_name='worker')
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=30)
    photo = ImageField(upload_to='media/workers/')

    def __str__(self) -> str:
        return f'{self.first_name} {self.last_name}'


class Place(models.Model):
    owner = models.ForeignKey(
        to=get_user_model(), on_delete=models.CASCADE, related_name='places')
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=50)
    photo = ImageField(upload_to='media/places/')
    workers = models.ManyToManyField(
        to=Worker, related_name='workplace', blank=True)

    def __str__(self) -> str:
        return self.name
