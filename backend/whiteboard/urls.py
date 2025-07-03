from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WhiteboardViewSet, WhiteboardDrawingViewSet, WhiteboardActionHistory

router = DefaultRouter()
router.register(r'api/whiteboards', WhiteboardViewSet)
router.register(r'api/drawings', WhiteboardDrawingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/history/', WhiteboardActionHistory.as_view()),
]
