from django.urls import path
from rest_framework import routers

from . import views

router = routers.SimpleRouter()
router.register(r'', views.RoomViewSet)

urlpatterns = [
    path('image/', views.RoomImageCreateView.as_view()),
    path('keyword/', views.KeywordView.as_view()),
]
urlpatterns += router.urls