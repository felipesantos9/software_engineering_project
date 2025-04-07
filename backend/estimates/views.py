from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiTypes  # noqa
import requests
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware
from django.db.models import Sum, Avg, F, ExpressionWrapper, FloatField, Case, When, Value  # noqa
from django.http import HttpResponse

from datetime import datetime

from .serializers import ShippingEstimateSerializer, ListEstimatesSerializer, CarbonEstimateWrapperResponseSerializer  # noqa
from .models import CarbonEstimate
from .report_generator import generate_carbon_report_pdf


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
    pagination_class = None  # Disable pagination for this view

    def get_queryset(self):
        return CarbonEstimate.objects.filter(user=self.request.user).order_by('-created_at') # noqa


class EmissionsReportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Gerar relatório PDF de emissões de carbono",
        description=(
            "Gera e retorna um relatório em PDF contendo os dados consolidados"
            " de emissões de carbono da empresa, no período definido pelos "
            "parâmetros "
            "`start_date` e `end_date` (formato: YYYY-MM-DD).\n\n"
            "**O relatório inclui:**\n"
            "- Resumo executivo (total de emissões, estimativas, modal mais "
            "utilizado)\n"
            "- Métricas agregadas por modal de transporte\n"
            "- Top 5 rotas com maior emissão de CO₂\n\n"
            "O conteúdo é retornado como um PDF formatado para leitura e "
            "impressão."
        ),
        tags=["Relatórios"],
        parameters=[
            OpenApiParameter(
                name="start_date",
                required=True,
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description="Data de início do período (formato YYYY-MM-DD)"
            ),
            OpenApiParameter(
                name="end_date",
                required=True,
                type=OpenApiTypes.DATE,
                location=OpenApiParameter.QUERY,
                description="Data de fim do período (formato YYYY-MM-DD)"
            )
        ]
    )
    def get(self, request):
        try:
            start_date = make_aware(
                datetime.fromisoformat(request.query_params["start_date"])
            )
            end_date = make_aware(
                datetime.fromisoformat(request.query_params["end_date"])
            )
        except Exception:
            raise ValidationError(
                "Parâmetros 'start_date' e 'end_date' devem estar no formato "
                "ISO: yyyy-mm-dd"
            )

        estimates = CarbonEstimate.objects.filter(
            user=request.user,
            estimated_at__range=(start_date, end_date)
        )
        if not estimates.exists():
            raise ValidationError(
                "Nenhuma estimativa encontrada para o período selecionado."
            )

        def to_km(value, unit):
            return value * 1.60934 if unit == 'mi' else value

        def to_kg(value, unit):
            conversions = {'g': 0.001, 'kg': 1, 'lb': 0.453592, 'mt': 1000}
            return value * conversions.get(unit, 1)

        converted_data = []
        for est in estimates:
            converted_data.append({
                "estimate": est,
                "distance_km": to_km(est.distance_value, est.distance_unit),
                "weight_kg": to_kg(est.weight_value, est.weight_unit),
                "carbon_kg": est.carbon_kg
            })

        buffer = generate_carbon_report_pdf(
            start_date, end_date, converted_data, estimates, request.user
        )

        return HttpResponse(buffer, content_type="application/pdf", headers={
            "Content-Disposition": (
                f"inline; filename=relatorio_emissoes_"
                f"{start_date.date()}_a_{end_date.date()}.pdf"
            )
        })


class DashboardDataView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="start_date",
                description="Data inicial no formato ISO (yyyy-mm-dd)",
                required=True,
                type=OpenApiTypes.DATE,
            ),
            OpenApiParameter(
                name="end_date",
                description="Data final no formato ISO (yyyy-mm-dd)",
                required=True,
                type=OpenApiTypes.DATE,
            ),
        ],
        responses={
            200: OpenApiTypes.OBJECT,
            400: OpenApiTypes.OBJECT,
        },
        summary="Dados agregados para o dashboard de emissões",
        description=(
            "Retorna métricas de emissões de carbono filtradas por período "
            "para alimentar o dashboard analítico."
        ),
    )
    def get(self, request):
        try:
            start_date = make_aware(
                datetime.fromisoformat(request.query_params["start_date"])
            )
            end_date = make_aware(
                datetime.fromisoformat(request.query_params["end_date"])
            )
        except Exception:
            raise ValidationError(
                (
                    "Parâmetros 'start_date' e 'end_date' devem estar no "
                    "formato ISO: yyyy-mm-dd"
                )
            )

        estimates = CarbonEstimate.objects.filter(
            user=request.user,
            estimated_at__range=(start_date, end_date)
        )

        if not estimates.exists():
            raise ValidationError(
                "Nenhuma estimativa encontrada para o período selecionado."
            )

        total_emissions_kg = estimates.aggregate(
            total=Sum("carbon_kg")
        )["total"]

        WEIGHT_CONVERSIONS = {
            "g": 1 / 1_000_000,
            "kg": 1 / 1000,
            "lb": 0.000453592,
            "mt": 1,
        }

        DISTANCE_CONVERSIONS = {
            "km": 1,
            "mi": 1.60934,
        }

        # Carbon intensity por registro: carbon_kg /
        # (distance_value km * weight_value mt)
        estimates_with_intensity = estimates.annotate(
            converted_weight=Case(
                *[
                    When(
                        weight_unit=unit,
                        then=F("weight_value") * Value(factor)
                    )
                    for unit, factor in WEIGHT_CONVERSIONS.items()
                ],
                output_field=FloatField()
            ),
            converted_distance=Case(
                *[
                    When(
                        distance_unit=unit,
                        then=F("distance_value") * Value(factor)
                    )
                    for unit, factor in DISTANCE_CONVERSIONS.items()
                ],
                output_field=FloatField()
            )
        ).annotate(
            intensity=ExpressionWrapper(
                F("carbon_kg") / (
                    F("converted_weight") * F("converted_distance")
                ),
                output_field=FloatField()
            )
        )

        avg_carbon_intensity = estimates_with_intensity.aggregate(
            avg=Avg("intensity")
        )["avg"]

        avg_emission_per_route = estimates.aggregate(
            avg=Avg("carbon_kg")
        )["avg"]

        emissions_by_transport_method = (
            estimates
            .values("transport_method")
            .annotate(total=Sum("carbon_kg"))
        )

        daily_emissions_raw = (
            estimates
            .values("estimated_at__date")
            .annotate(total=Sum("carbon_kg"))
        )

        daily_emissions = {
            item["estimated_at__date"].isoformat(): item["total"]
            for item in daily_emissions_raw
        }

        return Response({
            "total_emissions_kg": round(total_emissions_kg, 2),
            "avg_carbon_intensity": (
                round(avg_carbon_intensity, 8)
                if avg_carbon_intensity
                else None
            ),
            "avg_emission_per_route": (
                round(avg_emission_per_route, 2)
                if avg_emission_per_route
                else None
            ),
            "emissions_by_transport_method": {
                item["transport_method"]: round(item["total"], 2)
                for item in emissions_by_transport_method
            },
            "daily_emissions": daily_emissions
        })
