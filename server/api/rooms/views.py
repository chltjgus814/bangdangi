from django.db.models import Prefetch
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView, ListCreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from apps.rooms.models import Room, Keyword, RoomImage
from apps.users.models import UserType
from utils.permission import HostPermission
from . import serializers


class RoomViewSet(ModelViewSet):
    permission_classes = [HostPermission]
    queryset = Room.objects.prefetch_related(
        Prefetch(
            'keywords',
            queryset=Keyword.objects.filter(is_active=True),
        ),
        Prefetch(
            'roomimage_set',
            queryset=RoomImage.objects.filter(is_active=True),
            to_attr='images',
        )
    )

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.request.user.is_authenticated and self.request.user.user_type == UserType.HOST.value:
            queryset = queryset.filter(user=self.request.user)
        
        return queryset
        
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.RoomSerializer
        return serializers.RoomCreateSerializer


class RoomImageCreateView(CreateAPIView):
    serializer_class = serializers.RoomImageSerializer
    queryset = RoomImage.objects.all()
    parser_classes = [FormParser, MultiPartParser]


class KeywordView(ListCreateAPIView):
    serializer_class = serializers.KeywordSerializer
    queryset = Keyword.objects.filter(is_active=True)

    def get_queryset(self):
        queryset = super().get_queryset()

        value = self.request.GET.get('value')
        if value:
            queryset = queryset.filter(name__icontains=value)
        return queryset