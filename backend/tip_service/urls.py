from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import viewsets

router = DefaultRouter()
router.register('places', viewsets.PlaceViewset, 'places')
router.register('workers', viewsets.WorkerViewset, 'workers')

urlpatterns = [
    path('', include(router.urls)),
]
