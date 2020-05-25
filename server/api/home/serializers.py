from django.utils import timezone
from rest_framework import serializers
from apps.rooms.models import Room, RoomImage, Keyword, ContractType
from apps.youtube.models import Youtube


class NewRoomImageSerialzier(serializers.ModelSerializer):
    class Meta:
        model = RoomImage
        fields = ['image']


class NewKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ['name']


class NewRoomSerializer(serializers.ModelSerializer):
    images = NewRoomImageSerialzier(many=True, read_only=True)
    keywords = NewKeywordSerializer(many=True, read_only=True)
    contract = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'deposit',
            'rent',
            'expense',
            'images',
            'keywords',
            'contract',
        ]

    def get_contract(self, obj):
        if obj.contract_type == ContractType.MINIMAL.value:
            contract = ["{}개월 이상".format(obj.contract_period)]
            
            if obj.move_date <= timezone.now().date():
                contract.append("즉시가능")
            elif obj.move_date:
                contract.append("{}부터 가능".format(obj.move_date))
            return contract
        return ["{} - {}".format(
            obj.contract_start,
            obj.contract_end,
        )]


class YoutubeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Youtube
        fields = [
            'video_id'
        ]
