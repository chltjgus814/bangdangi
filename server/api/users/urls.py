from django.urls import path

from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view()),
    path('login/kakao/', views.KakaoLoginView.as_view()),
    path('signup/', views.SignupView.as_view()),

    path('phone/', views.PhoneRequestVerifyView().as_view()),
    path('phone/verify/', views.PhoneVerifyView().as_view()),
]