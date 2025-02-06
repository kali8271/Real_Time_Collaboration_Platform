from rest_framework import viewsets, permissions
from .models import Whiteboard, WhiteboardDrawing
from .serializers import WhiteboardSerializer, WhiteboardDrawingSerializer

class WhiteboardViewSet(viewsets.ModelViewSet):
    queryset = Whiteboard.objects.all()
    serializer_class = WhiteboardSerializer
    permission_classes = [permissions.IsAuthenticated]

class WhiteboardDrawingViewSet(viewsets.ModelViewSet):
    queryset = WhiteboardDrawing.objects.all()
    serializer_class = WhiteboardDrawingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
