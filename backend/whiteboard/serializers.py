from rest_framework import serializers
from .models import Whiteboard, WhiteboardDrawing, WhiteboardAction

class WhiteboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Whiteboard
        fields = ["id", "title", "owner", "participants", "created_at"]

class WhiteboardDrawingSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhiteboardDrawing
        fields = ["id", "whiteboard", "user", "data", "timestamp"]

class WhiteboardActionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = WhiteboardAction
        fields = '__all__'
