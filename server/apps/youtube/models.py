from django.db import models
from utils.model import GenericModel


class Youtube(GenericModel):
    video_id = models.CharField(max_length=50)

    class Meta:
        db_table = 'youtube'
        verbose_name = '유투브'
        verbose_name_plural = '유투브들'
