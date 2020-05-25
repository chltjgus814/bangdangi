from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import serializers


class LoginView(GenericAPIView):
    serializer_class = serializers.LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.login()

        return Response({
            'token': token
        })


class KakaoLoginView(GenericAPIView):
    serializer_class = serializers.KakaoLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token, user = serializer.login()

        return Response({
            'token': token,
            'has_phone': user.has_phone,
            'type': user.user_type,
        })


class SignupView(GenericAPIView):
    def post(self, request):
        return Response()


class PhoneRequestVerifyView(GenericAPIView):
    serializer_class = serializers.PhoneSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.send_code()
        
        return Response()


class PhoneVerifyView(GenericAPIView):
    serializer_class = serializers.CodeSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data, user=self.request.user)
        serializer.is_valid(raise_exception=True)
        serializer.verify()

        return Response()