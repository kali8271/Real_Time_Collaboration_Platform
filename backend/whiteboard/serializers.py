from rest_framework import serializers
from .models import Whiteboard, WhiteboardDrawing

class WhiteboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Whiteboard
        fields = ["id", "title", "owner", "participants", "created_at"]

class WhiteboardDrawingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhiteboardDrawing
        fields = ["id", "whiteboard", "user", "data", "timestamp"]
