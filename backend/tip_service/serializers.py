from rest_framework import serializers
from sorl_thumbnail_serializer.fields import HyperlinkedSorlImageField
from . import models


class WorkerSerializer(serializers.ModelSerializer):
    worker_photo = HyperlinkedSorlImageField(
        '300x420', source='photo', read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    railgun_address = serializers.SerializerMethodField(read_only=True)

    class Meta():
        model = models.Worker
        exclude = ('photo',)

    def get_railgun_address(self, obj):
        return obj.user.railgun_address

    def validate(self, attrs):
        valid_data = super().validate(attrs)
        user = valid_data.get('user', None)
        if user and models.Worker.objects.filter(user=user).exists():
            raise serializers.ValidationError(
                {'user': 'This user has already registred as worker'})
        return valid_data


class PlaceSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())
    place_photo = HyperlinkedSorlImageField(
        '300x200', source='photo', read_only=True)

    class Meta():
        model = models.Place
        exclude = ('photo',)

    def get_fields(self):
        fields = super().get_fields()
        if self.context['view'].action in ('list', 'retrieve'):
            fields['workers'] = WorkerSerializer(many=True)
        return fields


class NestedWorkerSerializer(serializers.ModelSerializer):
    worker_photo = HyperlinkedSorlImageField(
        '300x420', source='photo', read_only=True)

    class Meta():
        model = models.Worker
        fields = ('id', 'first_name', 'last_name', 'worker_photo')


class NestedPlaceSerializer(serializers.ModelSerializer):
    place_photo = HyperlinkedSorlImageField(
        '300x200', source='photo', read_only=True)
    workers = WorkerSerializer(many=True)

    class Meta():
        model = models.Place
        fields = ('id', 'name', 'place_photo', 'address', 'workers')
