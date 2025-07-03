from rest_framework import serializers
from .models import ChatRoom, Message, ChatMessage

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ["id", "name", "participants", "created_at"]

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Message
        fields = ["id", "chatroom", "sender", "content", "timestamp"]

class ChatMessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = ChatMessage
        fields = '__all__'
