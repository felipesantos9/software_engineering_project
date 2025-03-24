from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(unique=True, verbose_name="e-mail")
    name = models.CharField(max_length=100, blank=True, verbose_name="nome")
    picture = models.ImageField(
        upload_to='users/pictures/',
        null=True, blank=True,
        verbose_name="Avatar"
    )
    is_verified = models.BooleanField(
        default=False,
        verbose_name="verificado?",
        help_text="Designa se um usuário tem acesso ao conteúo premium.",
    )
    is_staff = models.BooleanField(
        default=False,
        verbose_name="staff?",
        help_text=_(
            "Designates whether the user can log into this admin site."
        ),
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="ativo?",
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    created_at = models.DateTimeField(
        default=timezone.now,
        verbose_name="criado em"
    )

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name',]

    class Meta():
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self) -> str:
        return self.name
