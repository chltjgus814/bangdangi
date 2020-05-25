from django.utils import timezone
from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField

from apps.rooms.models import Room, Keyword, RoomImage, ContractType


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ['id', 'name']


class RoomImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    image = Base64ImageField()
    class Meta:
        model = RoomImage
        fields = [
            'id',
            'user',
            'image',
        ]

    def create(self, validated_data):
        user = validated_data.pop('user')
        image = validated_data.pop('image')
    
        return RoomImage.objects.create(user=user, image=image)


class RoomSerializer(serializers.ModelSerializer):
    contract = serializers.SerializerMethodField()
    keywords = KeywordSerializer(many=True)
    images = RoomImageSerializer(many=True)

    class Meta:
        model = Room
        fields = [
            'id',
            'deposit',
            'rent',
            'expense',
            'contract',
            'keywords',
            'images',
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


class RoomCreateSerializer(serializers.ModelSerializer):
    host = serializers.HiddenField(default=serializers.CurrentUserDefault())
    images = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )
    keywords = serializers.ListField(
        child=serializers.DictField(),
        write_only=True
    )

    class Meta:
        model = Room
        fields = [
            'host',
            'images',
            'keywords',
            'address',
            'address2',
            'zip_code',
            'deposit',
            'rent',
            'expense',
            'contract_type',
            'contract_start',
            'contract_end',
            'contract_period',
            'move_date',
            'description',
        ]

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        keywords = validated_data.pop('keywords', [])

        room = Room.objects.create(**validated_data)

        RoomImage.objects.filter(id__in=images).update(room=room)

        keyword_ids = [
            keyword["value"]
            for keyword in keywords if not keyword.get("__isNew__", False)
        ]
        new_keywords = [
            keyword["label"]
            for keyword in keywords if keyword.get("__isNew__", False)
        ]
        if len(new_keywords) > 0:
            existed_keyword = list(Keyword.objects.filter(name__in=new_keywords).values('id', 'name'))
            result = set(new_keywords) - set([keyword["name"] for keyword in existed_keyword])
            result_list = list(result)

            if len(result_list) > 0:
                Keyword.objects.bulk_create([
                    Keyword(name=keyword) for keyword in result_list
                ])
                result_keyword = Keyword.objects.filter(name__in=result_list).values_list('id', flat=True)
                keyword_ids += list(result_keyword)
        
        room.keywords.add(*keyword_ids)
        return room