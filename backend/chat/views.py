from rest_framework import viewsets, permissions
from .models import ChatRoom, Message, ChatMessage
from .serializers import ChatRoomSerializer, MessageSerializer, ChatMessageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return ChatRoom.objects.all()
        return ChatRoom.objects.filter(participants=user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return Message.objects.all()
        return Message.objects.filter(sender=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class ChatMessageHistory(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        room_name = request.query_params.get('room_name')
        if not room_name:
            return Response({'error': 'room_name required'}, status=400)
        messages = ChatMessage.objects.filter(room_name=room_name).order_by('-timestamp')[:50][::-1]
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
