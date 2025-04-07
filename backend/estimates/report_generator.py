from collections import defaultdict
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from django.db.models import Count


def generate_carbon_report_pdf(
    start_date, end_date, converted_data, estimates, user
):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

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
        sum(item["distance_km"] for item in converted_data) / total_estimates
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

    # Top rotas
    top_routes = sorted(
        converted_data, key=lambda x: x["carbon_kg"], reverse=True
    )[:5]

    # Geração do PDF
    p.setFont("Helvetica-Bold", 16)
    p.drawString(2 * cm, height - 2 * cm, "Relatório de Emissões de Carbono")

    p.setFont("Helvetica", 10)
    p.drawString(
        2 * cm,
        height - 2.6 * cm,
        f"Período: {start_date.date()} a {end_date.date()}"
    )
    company_name = user.name or user.email
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
        f"Total estimado de emissões: {total_emissions_kg:.2f} kg de CO2"
    )
    y -= 0.6 * cm
    modal_name = most_used_modal['transport_method'].capitalize()
    p.drawString(2 * cm, y, f"Modal mais utilizado: {modal_name}")
    y -= 0.6 * cm
    p.drawString(
        2 * cm, y,
        f"Média de km percorridos por viagem: {avg_distance:.0f} km"
    )

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
    return buffer
