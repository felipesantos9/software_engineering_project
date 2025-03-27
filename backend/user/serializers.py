from djoser.conf import settings
from djoser import serializers as djoser_serializers
from rest_framework import exceptions


class UserSerializer(djoser_serializers.UserSerializer):

    class Meta(djoser_serializers.UserSerializer.Meta):
        fields = djoser_serializers.UserSerializer.Meta.fields + (
            'picture',
            'is_verified',
            'cnpj',
            'phonenumber',
        )


class UserVerifySerializer(djoser_serializers.UidAndTokenSerializer):
    default_error_messages = {
        "stale_token": settings.CONSTANTS.messages.STALE_TOKEN_ERROR
    }

    def validate(self, attrs):
        attrs = super().validate(attrs)
        if not self.user.is_verified:
            return attrs
        raise exceptions.PermissionDenied(self.error_messages["stale_token"])
