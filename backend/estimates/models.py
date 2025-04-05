from django.db import models
from django.conf import settings


class CarbonEstimate(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # noqa
    estimate_id = models.UUIDField()  # id retornado pela Carbon Interface
    transport_method = models.CharField(max_length=10)
    distance_value = models.FloatField()
    distance_unit = models.CharField(max_length=5)
    weight_value = models.FloatField()
    weight_unit = models.CharField(max_length=5)
    carbon_g = models.FloatField()
    carbon_kg = models.FloatField()
    carbon_lb = models.FloatField()
    carbon_mt = models.FloatField()
    estimated_at = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Estimate {self.estimate_id} by {self.user.email}"
