from django.db.models import Prefetch
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from apps.rooms.models import Room, Keyword, RoomImage
from apps.youtube.models import Youtube

from . import serializers


class HomeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # 신규 매물
        rooms = Room.objects.prefetch_related(
            Prefetch(
                'keywords',
                queryset=Keyword.objects.filter(is_active=True)
            ),
            Prefetch(
                'roomimage_set',
                queryset=RoomImage.objects.filter(is_active=True),
                to_attr='images'
            )
        ).order_by('-created')[:10]

        youtubes = Youtube.objects.filter(is_active=True).order_by('-created')[:10]

        room_serializer = serializers.NewRoomSerializer(rooms, many=True)
        youtube_serializer = serializers.YoutubeSerializer(youtubes, many=True)

        data ={
            'rooms': room_serializer.data,
            'youtubes': youtube_serializer.data,
        }

        return Response(data)
