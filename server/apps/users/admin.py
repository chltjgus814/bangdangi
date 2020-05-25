from django.contrib import admin

from .models import User, UserType


class BangdangiUser(User):
    class Meta:
        proxy = True
        verbose_name = '관리자'
        verbose_name_plural = '관리자들'


class BangdangiAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'type', 'sign_type', 'is_active')
    fields = ['name',]

    def get_queryset(self, request):
        return super().get_queryset(request).filter(
            type__in=[UserType.ADMIN, UserType.STAFF]
        )



class HostUser(User):
    class Meta:
        proxy = True
        verbose_name = '호스트'
        verbose_name_plural = '호스트들'


class HostAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'sign_type', 'is_active')
    fields = ['name',]

    def get_queryset(self, request):
        return super().get_queryset(request).filter(
            type=UserType.HOST
        )


class GeneralUser(User):
    class Meta:
        proxy = True
        verbose_name = '유저'
        verbose_name_plural = '유저들'


class GeneralAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'sign_type', 'is_active')

    fieldsets = (
        (None, {
            'fields': ('id', 'email')
        }),
        ('로그인 유형', {
            'fields': ('sign_type', 'source_id')
        }),
        ('개인 정보', {
            'fields': ('name', 'phone', 'profile_image')
        }),
        ('보안', {
            'fields': ('is_active',)
        })
    )
    readonly_fields = ('id', 'sign_type', 'source_id', 'email')

    def get_queryset(self, request):
        return super().get_queryset(request).filter(
            type=UserType.USER
        )


admin.site.register(HostUser, HostAdmin)
admin.site.register(BangdangiUser, BangdangiAdmin)
admin.site.register(GeneralUser, GeneralAdmin)