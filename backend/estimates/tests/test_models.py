from django.test import TestCase
from django.contrib.auth import get_user_model
from estimates.models import CarbonEstimate
from uuid import uuid4
from datetime import datetime
from django.utils.timezone import make_aware

User = get_user_model()

valid_email = 'exemple@exemple.com'
valid_password = '12345678'
valid_name = 'exemple'
valid_cnpj = '99.999.999/9999-99'
valid_phonenumber = '+5581999999999'


def get_object_user(**overrides):
    return {
        "email": valid_email,
        "password": valid_password,
        "name": valid_name,
        "cnpj": valid_cnpj,
        "phonenumber": valid_phonenumber,
        "is_staff": False,
        "is_superuser": False,
        **overrides
    }


class CarbonEstimateModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(**get_object_user())

        self.estimate = CarbonEstimate.objects.create(
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

    def test_carbon_estimate_created(self):
        self.assertEqual(CarbonEstimate.objects.count(), 1)

    def test_fields_are_stored_correctly(self):
        self.assertEqual(self.estimate.transport_method, "truck")
        self.assertEqual(self.estimate.weight_unit, "kg")
        self.assertAlmostEqual(self.estimate.carbon_mt, 0.025)

    def test_estimate_belongs_to_user(self):
        self.assertEqual(self.estimate.user.email, valid_email)

    def test_string_representation(self):
        expected_str = (
            f"Estimate {self.estimate.estimate_id} by {self.user.email}"
        )
        self.assertEqual(str(self.estimate), expected_str)
