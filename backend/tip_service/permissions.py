from rest_framework.permissions import IsAuthenticated


class OnlyOwnerPermission(IsAuthenticated):
    owner_field_name = None

    def has_object_permission(self, request, view, obj):
        return request.user == getattr(obj, self.owner_field_name)


def only_owner_permission_factory(owner_field_name):
    class NewOnlyOwnerPermission(OnlyOwnerPermission):

        def __init__(self, *args, **kwargs):
            self.owner_field_name = owner_field_name
            super().__init__(*args, **kwargs)

    return NewOnlyOwnerPermission
