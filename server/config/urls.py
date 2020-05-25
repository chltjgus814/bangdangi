from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(('api.urls', 'api'))),
]
