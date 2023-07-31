from rest_framework import serializers
from tip_service.serializers import (
    NestedPlaceSerializer, NestedWorkerSerializer)
from . import models


class UserSerializer(serializers.ModelSerializer):

    class Meta():
        model = models.User
        fields = ('railgun_address', 'railgun_creation_block')


class ProfileSerializer(serializers.ModelSerializer):
    worker = NestedWorkerSerializer()
    places = NestedPlaceSerializer(many=True)

    class Meta():
        model = models.User
        fields = (
            'railgun_address',
            'railgun_creation_block',
            'worker',
            'places',
        )
