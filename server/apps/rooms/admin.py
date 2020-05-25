from django.contrib import admin

from .models import Room, Keyword, RoomImage


class RoomImageAdmin(admin.StackedInline):
    model = RoomImage
    extra = 0


class RoomAdmin(admin.ModelAdmin):
    list_display = ['id']
    inlines = [
        RoomImageAdmin,
    ]


admin.site.register(Room, RoomAdmin)
admin.site.register(Keyword)
