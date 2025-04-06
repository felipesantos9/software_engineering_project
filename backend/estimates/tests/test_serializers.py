from django.test import TestCase
from estimates.serializers import (
    ShippingEstimateSerializer,
    ListEstimatesSerializer,
    CarbonEstimateWrapperResponseSerializer
)
from estimates.models import CarbonEstimate
from datetime import datetime
from django.utils.timezone import make_aware
from uuid import uuid4
from django.contrib.auth import get_user_model

User = get_user_model()


class ShippingEstimateSerializerTest(TestCase):
    def test_valid_data(self):
        data = {
            "weight_value": 100.0,
            "weight_unit": "kg",
            "distance_value": 1500.0,
            "distance_unit": "km",
            "transport_method": "truck"
        }
        serializer = ShippingEstimateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_choice(self):
        data = {
            "weight_value": 100.0,
            "weight_unit": "invalid",
            "distance_value": 1500.0,
            "distance_unit": "km",
            "transport_method": "truck"
        }
        serializer = ShippingEstimateSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("weight_unit", serializer.errors)


class ListEstimatesSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="example@example.com", password="testpassword123"
        )
        self.estimate = CarbonEstimate.objects.create(
            user=self.user,
            estimate_id=uuid4(),
            transport_method="ship",
            distance_value=1000,
            distance_unit="km",
            weight_value=200,
            weight_unit="kg",
            carbon_g=25000,
            carbon_kg=25,
            carbon_lb=55.1,
            carbon_mt=0.025,
            estimated_at=make_aware(datetime(2025, 4, 3, 12, 0, 0))
        )

    def test_serialized_data(self):
        serializer = ListEstimatesSerializer(instance=self.estimate)
        data = serializer.data
        self.assertNotIn("user", data)
        self.assertEqual(data["transport_method"], "ship")
        self.assertEqual(data["carbon_kg"], 25)


class CarbonEstimateResponseSerializerTest(TestCase):
    def test_wrapper_serialization(self):
        estimate_id = uuid4()
        attributes = {
            "distance_value": "1000.0",
            "distance_unit": "km",
            "weight_value": "200.0",
            "weight_unit": "kg",
            "transport_method": "plane",
            "estimated_at": "2025-04-03T12:00:00Z",
            "carbon_g": 30000.0,
            "carbon_kg": 30.0,
            "carbon_lb": 66.1,
            "carbon_mt": 0.03
        }

        data = {
            "data": {
                "id": estimate_id,
                "type": "estimate",
                "attributes": attributes
            }
        }

        serializer = CarbonEstimateWrapperResponseSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["data"]["id"], estimate_id)
        self.assertEqual(
            serializer.validated_data["data"]["attributes"]["carbon_kg"],
            30.0
        )
