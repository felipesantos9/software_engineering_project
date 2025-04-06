from django.urls import path
from .views import ShippingEstimateView, ListEstimatesView

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
]
