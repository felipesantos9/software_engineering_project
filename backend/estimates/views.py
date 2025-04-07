from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiTypes  # noqa
import requests
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from collections import defaultdict

from django.conf import settings
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware
from django.db.models import Sum, Avg, F, ExpressionWrapper, FloatField, Count, Case, When, Value  # noqa
from django.http import HttpResponse

from datetime import datetime
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm

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

        # Conversão de unidades
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

        # Resumo Executivo
        total_estimates = len(converted_data)
        total_emissions_kg = sum(item["carbon_kg"] for item in converted_data)
        most_used_modal = (
            estimates.values("transport_method")
            .annotate(count=Count("id"))
            .order_by("-count")
            .first()
        )
        avg_distance = (
            sum(
                item["distance_km"] for item in converted_data
            ) / total_estimates
        )

        # Métricas agregadas por modal
        modais_dict = defaultdict(lambda: {
            "total_distance": 0, "total_weight": 0, "total_emissions": 0
        })

        for item in converted_data:
            modal = item["estimate"].transport_method
            modais_dict[modal]["total_distance"] += item["distance_km"]
            modais_dict[modal]["total_weight"] += item["weight_kg"]
            modais_dict[modal]["total_emissions"] += item["carbon_kg"]

        modais = [
            {
                "transport_method": modal,
                **valores
            }
            for modal, valores in modais_dict.items()
        ]

        # Top rotas por emissão (ainda usa os objetos originais)
        top_routes = sorted(
            converted_data, key=lambda x: x["carbon_kg"], reverse=True
        )[:5]

        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # Título
        p.setFont("Helvetica-Bold", 16)
        p.drawString(
            2 * cm, height - 2 * cm,
            "Relatório de Emissões de Carbono"
        )
        p.setFont("Helvetica", 10)
        period_text = f"Período: {start_date.date()} a {end_date.date()}"
        p.drawString(2 * cm, height - 2.6 * cm, period_text)
        company_name = request.user.name or request.user.email
        p.drawString(2 * cm, height - 3.1 * cm, f"Empresa: {company_name}")
        generated_at = datetime.now().strftime('%d/%m/%Y %H:%M')
        p.drawString(
            2 * cm, height - 3.6 * cm,
            f"Relatório gerado em: {generated_at}"
        )

        y = height - 5 * cm
        p.setFont("Helvetica-Bold", 12)
        p.drawString(2 * cm, y, "Resumo Executivo")
        p.setFont("Helvetica", 10)
        y -= 1 * cm
        p.drawString(
            2 * cm, y,
            f"Total de estimativas realizadas: {total_estimates}"
        )
        y -= 0.6 * cm
        p.drawString(
            2 * cm, y,
            f"Total estimado de emissões: {total_emissions_kg} kg de CO2"
        )
        y -= 0.6 * cm
        modal_name = most_used_modal['transport_method'].capitalize()
        p.drawString(2 * cm, y, f"Modal mais utilizado: {modal_name}")
        y -= 0.6 * cm
        p.drawString(
            2 * cm, y,
            f"Média de km percorridos por viagem: {avg_distance:.0f} km"
        )

        # Métricas agregadas
        y -= 1.2 * cm
        p.setFont("Helvetica-Bold", 12)
        p.drawString(2 * cm, y, "Métricas Agregadas")
        y -= 0.8 * cm
        p.setFont("Helvetica-Bold", 10)
        p.drawString(2 * cm, y, "Modal")
        p.drawString(6 * cm, y, "Distância Total")
        p.drawString(10 * cm, y, "Peso Total")
        p.drawString(14 * cm, y, "Emissões (kg CO2)")
        p.setFont("Helvetica", 10)

        for modal in modais:
            y -= 0.5 * cm
            p.drawString(2 * cm, y, modal["transport_method"].capitalize())
            p.drawString(6 * cm, y, f"{modal['total_distance']:.0f} km")
            p.drawString(10 * cm, y, f"{modal['total_weight']:.0f} kg")
            p.drawString(14 * cm, y, f"{modal['total_emissions']:.0f}")

        # Top Rotas
        y -= 1.2 * cm
        p.setFont("Helvetica-Bold", 12)
        p.drawString(2 * cm, y, "Top Rotas por Emissão")
        y -= 0.8 * cm
        p.setFont("Helvetica-Bold", 10)
        p.drawString(2 * cm, y, "ID")
        p.drawString(5 * cm, y, "Data")
        p.drawString(9 * cm, y, "Modal")
        p.drawString(14 * cm, y, "Emissão (kg CO2)")
        p.setFont("Helvetica", 10)

        for item in top_routes:
            est = item["estimate"]
            y -= 0.5 * cm
            p.drawString(2 * cm, y, str(est.estimate_id)[:6])
            p.drawString(5 * cm, y, est.estimated_at.strftime("%d/%m/%Y"))
            p.drawString(9 * cm, y, est.transport_method.capitalize())
            p.drawString(14 * cm, y, f"{item['carbon_kg']:.0f}")

        p.showPage()
        p.save()

        buffer.seek(0)
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
            start_date = make_aware(datetime.fromisoformat(request.query_params["start_date"]))
            end_date = make_aware(datetime.fromisoformat(request.query_params["end_date"]))
        except Exception:
            raise ValidationError(
                "Parâmetros 'start_date' e 'end_date' devem estar no formato ISO: yyyy-mm-dd"
            )

        estimates = CarbonEstimate.objects.filter(
            user=request.user,
            estimated_at__range=(start_date, end_date)
        )

        if not estimates.exists():
            raise ValidationError("Nenhuma estimativa encontrada para o período selecionado.")

        total_emissions_kg = estimates.aggregate(total=Sum("carbon_kg"))["total"]

        # Carbon intensity por registro: carbon_kg / (distance_value km * weight_value mt)
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

        # Anotação com conversões aplicadas
        estimates_with_intensity = estimates.annotate(
            converted_weight=Case(
                *[When(weight_unit=unit, then=F("weight_value") * Value(factor)) for unit, factor in WEIGHT_CONVERSIONS.items()],
                output_field=FloatField()
            ),
            converted_distance=Case(
                *[When(distance_unit=unit, then=F("distance_value") * Value(factor)) for unit, factor in DISTANCE_CONVERSIONS.items()],
                output_field=FloatField()
            )
        ).annotate(
            intensity=ExpressionWrapper(
                F("carbon_kg") / (F("converted_weight") * F("converted_distance")),
                output_field=FloatField()
            )
        )

        avg_carbon_intensity = estimates_with_intensity.aggregate(avg=Avg("intensity"))["avg"]

        avg_emission_per_route = estimates.aggregate(avg=Avg("carbon_kg"))["avg"]

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
            "avg_carbon_intensity": round(avg_carbon_intensity, 8) if avg_carbon_intensity else None,
            "avg_emission_per_route": round(avg_emission_per_route, 2) if avg_emission_per_route else None,
            "emissions_by_transport_method": {
                item["transport_method"]: round(item["total"], 2)
                for item in emissions_by_transport_method
            },
            "daily_emissions": daily_emissions
        })