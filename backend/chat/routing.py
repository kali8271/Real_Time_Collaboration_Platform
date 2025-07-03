from django.urls import path, re_path
from .consumers import ChatConsumer, PresenceConsumer

websocket_urlpatterns = [
    path("ws/chat/<str:room_name>/", ChatConsumer.as_asgi()),
    re_path(r"ws/chat/presence/$", PresenceConsumer.as_asgi()),
]
