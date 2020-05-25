from rest_framework import permissions
from apps.users.models import UserType


class HostPermission(permissions.BasePermission):
    message = ""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        elif request.user.user_type == UserType.ADMIN.value:
            return True
        
        return obj.host == request.user