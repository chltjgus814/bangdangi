from django.urls import include, path

urlpatterns = [
    path('home/', include(('api.home.urls', 'home'))),
    path('users/', include(('api.users.urls', 'users'))),
    path('rooms/', include(('api.rooms.urls', 'rooms'))),
]
