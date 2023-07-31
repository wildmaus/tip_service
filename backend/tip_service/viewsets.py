from rest_framework.viewsets import ModelViewSet
from .permissions import only_owner_permission_factory
from . import models, serializers


class PlaceViewset(ModelViewSet):
    queryset = models.Place.objects.all()
    serializer_class = serializers.PlaceSerializer
    permission_classes = [only_owner_permission_factory('owner')]


class WorkerViewset(ModelViewSet):
    queryset = models.Worker.objects.all()
    serializer_class = serializers.WorkerSerializer
    permission_classes = [only_owner_permission_factory('user')]
