from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from . import models, serializers


class OnlyYourself(IsAuthenticated):

    def has_object_permission(self, request, view, obj):
        return (
            super().has_object_permission(request, view, obj) and
            request.user.id == obj.id
        )


class UserViewset(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = models.User.objects
    serializer_class = serializers.UserSerializer
    permission_classes = [OnlyYourself]

    @action(methods=('GET', 'PUT'), detail=False, url_path='me', url_name='me')
    def me(self, request):
        if request.method == 'PUT':
            instance = request.user
            serializer = serializers.UserSerializer(
                instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                instance._prefetched_objects_cache = {}
            return Response(serializer.data)
        return Response(serializers.ProfileSerializer(request.user).data)
