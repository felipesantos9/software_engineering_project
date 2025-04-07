from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email", "name", "is_staff", "is_active", "is_verified", "created_at"
    )
    list_filter = ("is_staff", "is_superuser", "is_active", "is_verified")
    search_fields = ("email", "name")
    ordering = ("email",)
    readonly_fields = ("created_at",)

    fieldsets = (
        (_("Personal Info"), {"fields": ("email", "name", "picture")}),
        (_("Permissions"), {
            "fields": (
                "is_active", "is_verified", "is_staff", "is_superuser",
                "groups", "user_permissions"
            )
        }),
        (_("Important dates"), {"fields": ("last_login", "created_at")}),
    )

    add_fieldsets = (
        (_("Create User"), {
            "classes": ("wide",),
            "fields": (
                "email", "name", "password1", "password2", 
                "is_staff", "is_superuser"
            ),
        }),
    )


admin.site.site_header = "Administração do Sistema"
admin.site.site_title = "Painel Admin"
admin.site.index_title = "Gerenciamento de Usuários"