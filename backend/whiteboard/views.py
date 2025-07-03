from rest_framework import viewsets, permissions
from .models import Whiteboard, WhiteboardDrawing, WhiteboardAction
from .serializers import WhiteboardSerializer, WhiteboardDrawingSerializer, WhiteboardActionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class WhiteboardViewSet(viewsets.ModelViewSet):
    queryset = Whiteboard.objects.all()
    serializer_class = WhiteboardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return Whiteboard.objects.all()
        return Whiteboard.objects.filter(owner=user)

class WhiteboardDrawingViewSet(viewsets.ModelViewSet):
    queryset = WhiteboardDrawing.objects.all()
    serializer_class = WhiteboardDrawingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WhiteboardActionHistory(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        whiteboard_id = request.query_params.get('whiteboard_id')
        if not whiteboard_id:
            return Response({'error': 'whiteboard_id required'}, status=400)
        actions = WhiteboardAction.objects.filter(whiteboard_id=whiteboard_id).order_by('-timestamp')[:100][::-1]
        serializer = WhiteboardActionSerializer(actions, many=True)
        return Response(serializer.data)
