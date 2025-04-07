from django.urls import path
from .views import ShippingEstimateView, ListEstimatesView, EmissionsReportPDFView, DashboardDataView  # noqa

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
        "emissions-report/",
        EmissionsReportPDFView.as_view(),
        name="emissions-report",
    ),
    path(
        "dashboard/",
        DashboardDataView.as_view(),
        name="dashboard",
    ),
]
