from django.db import models
from utils.model import GenericModel


class Comment(GenericModel):
    user = models.ForeignKey('users.User', null=True, on_delete=models.SET_NULL)
    room = models.ForeignKey('rooms.Room', on_delete=models.CASCADE)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)

    content = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = '댓글'
        verbose_name_plural = '댓글들'
        db_table = 'comments'
