from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatRoomViewSet, MessageViewSet, ChatMessageHistory

router = DefaultRouter()
router.register(r'api/chatrooms', ChatRoomViewSet)
router.register(r'api/messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/history/', ChatMessageHistory.as_view()),
]
