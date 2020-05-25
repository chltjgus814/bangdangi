from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from utils.model import GenericModel


class UserType(models.IntegerChoices):
    USER = 0
    HOST = 1
    STAFF = 2
    ADMIN = 3


class SignType(models.IntegerChoices):
    EMAIL = 0
    KAKAO = 1
    GOOGLE = 2


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
        email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email=email, password=password)
        user.type = UserType.ADMIN
        user.save(using=self._db)
        return user



def get_user_profile_image_path(instance, filename):
    return "users/{}/{}".format(instance.id, filename) 


class User(AbstractBaseUser, GenericModel):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    type = models.IntegerField(choices=UserType.choices, default=UserType.USER)
    sign_type = models.IntegerField(choices=SignType.choices, default=SignType.EMAIL)

    profile_image = models.ImageField(upload_to=get_user_profile_image_path, null=True, blank=True)

    # 소셜 로그인 파트
    source_id = models.CharField(max_length=255, null=True, blank=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()

    class Meta:
        verbose_name = '사용자'
        verbose_name_plural = '사용자들'
        db_table = 'users'
        unique_together = ['email', 'sign_type']

    @property
    def is_staff(self):
        return self.type in (UserType.STAFF, UserType.ADMIN)

    def has_module_perms(self, obj):
        return True

    def has_perm(self, obj):
        return True

    @property
    def get_profile_url(self):
        if self.profile_image is None or self.profile_image == '':
            return None
        return self.profile_image

    @property
    def has_phone(self) -> bool:
        if self.phone and len(self.phone) > 0:
            return True
        return False

    @property
    def user_type(self) -> str:
        if self.type == UserType.HOST:
            return 'host'
        return 'user'
