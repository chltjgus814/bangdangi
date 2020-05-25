from io import BytesIO
import uuid
import random
from urllib.parse import urlparse
from os.path import splitext
from django.contrib.auth import authenticate
from django.conf import settings
from django.core.files import File
from rest_framework import serializers
import jwt
import requests
from apps.users.models import User, UserType, SignType
from apps.sms.apistore import ApiStore
from apps.sms.models import SmsHistory
from utils.name import generate_random_name
from rest_framework_simplejwt.tokens import RefreshToken


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def login(self):
        user = authenticate(
            username=self.validated_data['email'],
            password=self.validated_data['password']
        )
        if user is None:
            return None
        
        token = str(RefreshToken.for_user(user).access_token)
        return token
        

class KakaoLoginSerializer(serializers.Serializer):
    url = serializers.URLField()
    code = serializers.CharField()
    type = serializers.ChoiceField(choices=['user', 'host'])

    def validate(self, attrs):
        code = attrs.get('code')
        if not code:
            raise serializers.ValidationError('Error')

        return attrs

    def login(self):
        url = self.validated_data['url']
        code = self.validated_data['code']
        type = self.validated_data['type']

        data = {
            'grant_type': 'authorization_code',
            'client_id': '19f82104f98c3e7d83f91faef701ea0c',
            'redirect_uri': url,
            'code': code
        }

        token_res = requests.post('https://kauth.kakao.com/oauth/token', headers={
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }, data=data)
        kakao_token_result = token_res.json()
        access_token = kakao_token_result.get('access_token')

        if not access_token:
            raise serializers.ValidationError('오류A')

        res = requests.get('https://kapi.kakao.com/v2/user/me', headers={
            'Authorization': "Bearer {}".format(access_token)
        })

        data = res.json()
        
        user_id = data.get('id')
        if not user_id:
            raise serializers.ValidationError('오류B')

        user = User.objects.filter(
            source_id=user_id,
            sign_type=SignType.KAKAO
        )
        if not user.exists():
            user = self.create_user(data)
            if not user:
                raise serializers.ValidationError('오류C')
        else:
            user = user.get()

        if user.type == UserType.USER and type == 'host':
            user.type = UserType.HOST
            user.save()

        if user.get_profile_url is None:
            properties = data.get('properties')
            if properties:
                profile_image_url = properties.get('profile_image')
                if profile_image_url:
                    kakao_image_name, kakao_image = self.save_profile_image(profile_image_url)
                    user.profile_image.save(kakao_image_name, File(kakao_image))

        token = str(RefreshToken.for_user(user).access_token)
        return token, user

    def create_user(self, data):
        user_id = data.get('id')
        if not user_id:
            raise serializers.ValidationError('오류D')

        properties = data.get('properties')
        if not properties:
            raise serializers.ValidationError('오류E')

        name = properties.get('nickname')
        profile_image_url = properties.get('profile_image')
        email = None
        
        kakao_account = data.get('kakao_account')
        if kakao_account:
            email = kakao_account.get('email')

        if not email:
            email = 'kakao_{}@bangdangi.com'.format(user_id)

        if not name:
            name = generate_random_name()

        data = {
            'email': email,
            'name': name,
            'type': UserType.USER,
            'source_id': user_id,
            'sign_type': SignType.KAKAO,
        }
        if self.validated_data['type'] == 'host':
            data.update({
                'type': UserType.HOST
            })

        user = User.objects.create(**data)

        return user

    def save_profile_image(self, url):
        res = requests.get(url)
        binary_data = res.content
        temp_file = BytesIO()
        temp_file.write(binary_data)
        temp_file.seek(0)

        parsed = urlparse(url)
        _, ext = splitext(parsed.path)

        file_name = "{}{}".format(uuid.uuid4().hex, ext)

        return file_name, temp_file


class PhoneSerializer(serializers.Serializer):
    phone = serializers.RegexField("(\d{3}(\d{3}|\d{4})\d{4})")

    def send_code(self):
        code = random.randint(1000, 9999)
        phone = self.validated_data['phone']
        
        apistore = ApiStore()
        result = apistore.send(
            phone=self.validated_data['phone'],
            title='방단기 휴대전화 인증',
            body="방단기 인증번호는 [{}]입니다. 위 번호를 인증 창에 입력해주세요.".format(code)
        )
        if result:
            SmsHistory.objects.filter(phone=phone).update(is_active=False)
            SmsHistory.objects.create(phone=phone, code=code)
        return True


class CodeSerializer(serializers.Serializer):
    phone = serializers.RegexField("(\d{3}(\d{3}|\d{4})\d{4})")
    code = serializers.RegexField("(\d{4})")

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user')
        super().__init__(*args, **kwargs)

    def verify(self):
        phone = self.validated_data['phone']
        code = self.validated_data['code']

        history = SmsHistory.objects.filter(
            phone=phone,
            code=code,
            is_active=True
        )

        print(phone, code)

        if history.exists():
            history.update(is_active=False)
            user = self.user
            user.phone = phone
            user.save()

            return

        SmsHistory.objects.filter(phone=phone).update(is_active=False)
        raise serializers.ValidationError('오류F')