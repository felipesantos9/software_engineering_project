from djoser import email as djoser_email

from django.conf import settings


class PasswordResetEmail(djoser_email.PasswordResetEmail):
    def get_context_data(self):
        context = super().get_context_data()
        context["domain"] = settings.WEB_APP_DOMAIN
        return context
