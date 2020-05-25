from django.db import models
from utils.model import GenericModel


class ContractType(models.IntegerChoices):
    MINIMAL = 0
    FIXED = 1


class Room(GenericModel):
    zip_code = models.CharField(max_length=20, null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    address2 = models.CharField(max_length=255, null=True, blank=True)

    deposit = models.IntegerField(null=True, blank=True)
    rent = models.IntegerField(null=True, blank=True)
    expense = models.IntegerField(null=True, blank=True)

    contract_type = models.IntegerField('계약 종류', choices=ContractType.choices, default=ContractType.MINIMAL)
    contract_start = models.DateField('계약 시작일', null=True, blank=True)
    contract_end = models.DateField('계약 종료일', null=True, blank=True)
    contract_period = models.IntegerField('최소 계약기간', null=True, blank=True)
    move_direct = models.BooleanField('입주 즉시 가능 여부', default=False)
    move_date = models.DateField('입주 날짜', null=True, blank=True)

    description = models.TextField(null=True, blank=True)
    keywords = models.ManyToManyField('Keyword', blank=True)

    class Meta:
        db_table = 'rooms'
        ordering = ['-created']


def get_room_image_path(instance, filename):
    return "rooms/{}/{}".format(instance.id, filename)


class RoomImage(GenericModel):
    room = models.ForeignKey('Room', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=get_room_image_path)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'room_images'
        ordering = ['order', '-created']


class Keyword(GenericModel):
    name = models.CharField(max_length=20)

    class Meta:
        db_table = 'room_keywords'

    def __str__(self):
        return self.name
