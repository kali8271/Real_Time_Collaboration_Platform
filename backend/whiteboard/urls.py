from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WhiteboardViewSet, WhiteboardDrawingViewSet

router = DefaultRouter()
router.register(r'whiteboards', WhiteboardViewSet)
router.register(r'drawings', WhiteboardDrawingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
