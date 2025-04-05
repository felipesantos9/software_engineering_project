from rest_framework import serializers
from .models import CarbonEstimate


class ShippingEstimateSerializer(serializers.Serializer):
    weight_value = serializers.FloatField()
    weight_unit = serializers.ChoiceField(choices=["g", "kg", "lb", "mt"])
    distance_value = serializers.FloatField()
    distance_unit = serializers.ChoiceField(choices=["km", "mi"])
    transport_method = serializers.ChoiceField(
        choices=["ship", "train", "truck", "plane"]
    )


class ListEstimatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarbonEstimate
        exclude = ['user']


class CarbonEstimateAttributesSerializer(serializers.Serializer):
    distance_value = serializers.CharField()
    distance_unit = serializers.CharField()
    weight_value = serializers.CharField()
    weight_unit = serializers.CharField()
    transport_method = serializers.CharField()
    estimated_at = serializers.DateTimeField()
    carbon_g = serializers.FloatField()
    carbon_lb = serializers.FloatField()
    carbon_kg = serializers.FloatField()
    carbon_mt = serializers.FloatField()


class CarbonEstimateResponseSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    type = serializers.CharField()
    attributes = CarbonEstimateAttributesSerializer()


class CarbonEstimateWrapperResponseSerializer(serializers.Serializer):
    data = CarbonEstimateResponseSerializer()
