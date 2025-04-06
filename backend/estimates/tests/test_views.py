from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
from django.contrib.auth import get_user_model
from estimates.models import CarbonEstimate
from uuid import uuid4
from datetime import datetime
from django.utils.timezone import make_aware

User = get_user_model()


class EstimatesViewsTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='strongpassword123',
            name='Test',
            cnpj='00.000.000/0000-00',
            phonenumber='+5581999999999'
        )
        self.client.force_authenticate(user=self.user)

        self.valid_payload = {
            "transport_method": "truck",
            "distance_value": 100.0,
            "distance_unit": "km",
            "weight_value": 20.0,
            "weight_unit": "kg"
        }

        self.api_url = reverse("estimate")
        self.list_url = reverse("list_estimate")

    @patch("estimates.views.requests.post")
    def test_shipping_estimate_success(self, mock_post):
        mock_response_data = {
            "data": {
                "id": str(uuid4()),
                "type": "estimate",
                "attributes": {
                    "distance_value": 100.0,
                    "distance_unit": "km",
                    "weight_value": 20.0,
                    "weight_unit": "kg",
                    "transport_method": "truck",
                    "estimated_at": datetime.now().isoformat(),
                    "carbon_g": 2000.0,
                    "carbon_kg": 2.0,
                    "carbon_lb": 4.4,
                    "carbon_mt": 0.002
                }
            }
        }

        mock_post.return_value.status_code = 201
        mock_post.return_value.json.return_value = mock_response_data

        response = self.client.post(
            self.api_url, data=self.valid_payload, format="json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(CarbonEstimate.objects.count(), 1)
        self.assertEqual(response.data["data"]["attributes"]["carbon_kg"], 2.0)

    def test_shipping_estimate_invalid_payload(self):
        invalid_payload = {
            "transport_method": "invalid",
            "distance_value": "a",
        }

        response = self.client.post(
            self.api_url, data=invalid_payload, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_estimates_view(self):
        CarbonEstimate.objects.create(
            user=self.user,
            estimate_id=uuid4(),
            transport_method="truck",
            distance_value=1500.0,
            distance_unit="km",
            weight_value=100.0,
            weight_unit="kg",
            carbon_g=25000.0,
            carbon_kg=25.0,
            carbon_lb=55.1,
            carbon_mt=0.025,
            estimated_at=make_aware(datetime(2025, 4, 3, 12, 0, 0))
        )

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["transport_method"], "truck"
        )
