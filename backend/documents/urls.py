from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DocumentViewSet, DocumentVersionViewSet

router = DefaultRouter()
router.register(r'api/users', UserViewSet)
router.register(r'api/documents', DocumentViewSet)
router.register(r'api/document-versions', DocumentVersionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]