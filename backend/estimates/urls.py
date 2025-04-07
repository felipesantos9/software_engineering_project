from django.urls import path
from .views import ShippingEstimateView, ListEstimatesView, EmissionsReportPDFView  # noqa

urlpatterns = [
    path(
        'create/',
        ShippingEstimateView.as_view(),
        name='estimate',
    ),
    path(
        'list/',
        ListEstimatesView.as_view(),
        name='list_estimate',
    ),
    path(
        "relatorio-emissoes/",
        EmissionsReportPDFView.as_view(),
        name="relatorio-emissoes",
    ),
]
