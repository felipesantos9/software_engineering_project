from drf_spectacular.utils import extend_schema, extend_schema_view
import requests
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from django.utils.dateparse import parse_datetime

from .serializers import ShippingEstimateSerializer, ListEstimatesSerializer, CarbonEstimateWrapperResponseSerializer  # noqa
from .models import CarbonEstimate


CARBON_API_URL = 'https://www.carboninterface.com/api/v1/estimates'


class ShippingEstimateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ShippingEstimateSerializer,
        responses={
            201: CarbonEstimateWrapperResponseSerializer,
        },
        summary="Criar estimativa de emissão de carbono (shipping)",
        description=(
            "Recebe dados de envio e retorna estimativa de emissão de "
            "carbono da Carbon Interface."
            " Para weight_unit escolha entre: g, kg, lb, mt."
            " Para distance_unit escolha entre: km, mi."
            " Para transport_method escolha entre: ship, train, truck, plane."

        ),
        tags=["Estimates"],
    )
    def post(self, request):
        serializer = ShippingEstimateSerializer(data=request.data)
        if serializer.is_valid():
            data = {
                "type": "shipping",
                **serializer.validated_data
            }
            headers = {
                "Authorization": f"Bearer {settings.CARBON_API_KEY}",
                "Content-Type": "application/json"
            }

            response = requests.post(
                CARBON_API_URL, headers=headers, json=data
            )

            if response.status_code == 201:
                response_data = response.json()["data"]
                attributes = response_data["attributes"]

                CarbonEstimate.objects.create(
                    user=request.user,
                    estimate_id=response_data["id"],
                    transport_method=attributes["transport_method"],
                    distance_value=attributes["distance_value"],
                    distance_unit=attributes["distance_unit"],
                    weight_value=attributes["weight_value"],
                    weight_unit=attributes["weight_unit"],
                    carbon_g=attributes["carbon_g"],
                    carbon_kg=attributes["carbon_kg"],
                    carbon_lb=attributes["carbon_lb"],
                    carbon_mt=attributes["carbon_mt"],
                    estimated_at=parse_datetime(attributes["estimated_at"])
                )

            return Response(response.json(), status=response.status_code)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema_view(
    get=extend_schema(
        summary="Listar estimativas de emissão de carbono",
        description=(
            "Retorna uma lista de todas as estimativas de emissão de "
            "carbono feitas pelo usuário autenticado."
        ),
        tags=["Estimates"],
    )
)
class ListEstimatesView(ListAPIView):
    serializer_class = ListEstimatesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CarbonEstimate.objects.filter(user=self.request.user).order_by('-created_at') # noqa
