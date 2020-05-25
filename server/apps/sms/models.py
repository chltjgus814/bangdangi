from django.db import models
from utils.model import GenericModel
from .apistore import ApiStore


class PinType(models.Choices):
    SMS = 'sms'
    VMS = 'vms'


class SendNumber(GenericModel):
    phone = models.CharField(max_length=20)
    comment = models.CharField(max_length=200, null=True, blank=True)
    pin_type = models.CharField(max_length=10, choices=PinType.choices, default=PinType.SMS)
    pin_code = models.CharField(max_length=6, null=True, blank=True)

    class Meta:
        db_table = 'sms_send_number'
        verbose_name = '발신번호'
        verbose_name_plural = '발신번호들'

    def save(self, *args, **kwargs):
        apistore = ApiStore()
        api_args = {
            'send_number': self.phone,
            'pin_type': self.pin_type,
        }
        if self.comment is not None and self.comment != '':
            api_args.update({'comment': self.comment})

        if self.pin_code is not None:
            api_args.update({'pin_code': self.pin_code})

        result = apistore.save_send_number(**api_args)

        if self.pin_code is None and not result:
            return
        super().save(*args, **kwargs)

    def __str__(self):
        return self.phone




class SmsHistory(GenericModel):
    phone = models.CharField(max_length=20)
    code = models.CharField(max_length=6, null=True, blank=True)

    class Meta:
        db_table = 'sms_history'
        verbose_name = '발송 이력'
        verbose_name_plural = '발송 이력들'

    def __str__(self):
        return "[{0}]{1}".format(self.code, self.phone)