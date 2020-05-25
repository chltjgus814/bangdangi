from django.contrib import admin

from .models import SendNumber, SmsHistory


class SmsHistoryAdmin(admin.ModelAdmin):
    list_display = ['phone', 'code', 'is_active']


admin.site.register(SendNumber)
admin.site.register(SmsHistory, SmsHistoryAdmin)