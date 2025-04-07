from datetime import datetime
from io import BytesIO
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils.timezone import make_aware

from estimates.models import CarbonEstimate

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
                    "estimated_at": make_aware(datetime.now()).isoformat(),
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


class EmissionsReportPDFViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='strongpassword123',
            name='Test',
            cnpj='00.000.000/0000-00',
            phonenumber='+5581999999999'
        )
        self.client.force_authenticate(user=self.user)

        self.url = reverse("emissions-report")

        # Criação de estimativa de teste
        self.estimate = CarbonEstimate.objects.create(
            user=self.user,
            estimate_id=uuid4(),
            transport_method="truck",
            distance_value=100,
            distance_unit="km",
            weight_value=1000,
            weight_unit="kg",
            carbon_g=25000.0,
            carbon_kg=150.5,
            carbon_lb=55.1,
            carbon_mt=0.025,
            estimated_at=make_aware(datetime(2025, 4, 3, 12, 0, 0))
        )

    @patch("estimates.views.generate_carbon_report_pdf")
    def test_pdf_report_success(self, mock_generate_pdf):
        mock_generate_pdf.return_value = BytesIO(
            b"%PDF-1.4 simulated pdf content"
        )

        start = "2025-04-01"
        end = "2025-04-30"

        response = self.client.get(self.url, {
            "start_date": start,
            "end_date": end
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertTrue(response.content.startswith(b"%PDF"))

        mock_generate_pdf.assert_called_once()

    def test_missing_date_parameters(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("start_date", str(response.data).lower())
        self.assertIn("end_date", str(response.data).lower())

    def test_invalid_date_format(self):
        response = self.client.get(self.url, {
            "start_date": "01-01-2023",
            "end_date": "31-12-2023"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("formato ISO", str(response.data))

    def test_no_estimates_in_period(self):
        start = "2024-04-01"
        end = "2024-04-30"

        response = self.client.get(self.url, {
            "start_date": start,
            "end_date": end
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Nenhuma estimativa encontrada", str(response.data))


class DashboardDataViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='strongpassword123',
            name='Test',
            cnpj='00.000.000/0000-00',
            phonenumber='+5581999999999'
        )
        self.client.force_authenticate(user=self.user)

        self.url = reverse("dashboard")

        self.estimate = CarbonEstimate.objects.create(
            user=self.user,
            estimate_id=uuid4(),
            transport_method="truck",
            distance_value=200,
            distance_unit="km",
            weight_value=2,
            weight_unit="mt",
            carbon_g=200000.0,
            carbon_kg=200.0,
            carbon_lb=440.9,
            carbon_mt=0.2,
            estimated_at=make_aware(datetime(2025, 4, 2, 15, 0, 0))
        )

    def test_dashboard_data_success(self):
        start = "2025-04-01"
        end = "2025-04-30"

        response = self.client.get(self.url, {
            "start_date": start,
            "end_date": end
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data

        self.assertIn("total_emissions_kg", data)
        self.assertEqual(data["total_emissions_kg"], 200.0)

        self.assertIn("avg_carbon_intensity", data)
        self.assertIsInstance(data["avg_carbon_intensity"], float)

        self.assertIn("avg_emission_per_route", data)
        self.assertEqual(data["avg_emission_per_route"], 200.0)

        self.assertIn("emissions_by_transport_method", data)
        self.assertEqual(data["emissions_by_transport_method"]["truck"], 200.0)

        self.assertIn("daily_emissions", data)
        self.assertEqual(len(data["daily_emissions"]), 1)

    def test_missing_date_parameters(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("start_date", str(response.data).lower())
        self.assertIn("end_date", str(response.data).lower())

    def test_invalid_date_format(self):
        response = self.client.get(self.url, {
            "start_date": "01-04-2025",
            "end_date": "30-04-2025"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("formato ISO", str(response.data))

    def test_no_estimates_in_period(self):
        start = "2024-01-01"
        end = "2024-01-31"

        response = self.client.get(self.url, {
            "start_date": start,
            "end_date": end
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Nenhuma estimativa encontrada", str(response.data))
