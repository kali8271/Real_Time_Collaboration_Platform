from django.urls import path
from .consumers import WhiteboardConsumer

websocket_urlpatterns = [
    path("ws/whiteboard/<int:whiteboard_id>/", WhiteboardConsumer.as_asgi()),
]
