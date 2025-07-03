from rest_framework import viewsets, generics, permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import CustomUser, Activity
from .serializers import UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer, ChangePasswordSerializer, ActivitySerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone
from documents.models import Document
from chat.models import ChatRoom, Message
from whiteboard.models import Whiteboard

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Log activity
            Activity.objects.create(user=request.user, action="Profile Update", description="User updated their profile.", timestamp=timezone.now())
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            # Log activity
            Activity.objects.create(user=user, action="Password Change", description="User changed their password.", timestamp=timezone.now())
            return Response({'detail': 'Password updated successfully.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class AdminUserStatusView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        is_active = request.data.get('is_active')
        if is_active is not None:
            user.is_active = bool(is_active)
            user.save()
            # Log activity
            Activity.objects.create(user=request.user, action="User Activation Toggle", description=f"Admin set user {user.username} active={user.is_active}.", timestamp=timezone.now())
            return Response({'id': user.id, 'is_active': user.is_active})
        return Response({'detail': 'is_active not provided.'}, status=status.HTTP_400_BAD_REQUEST)

class AdminUserEditView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data
        for field in ['username', 'email', 'is_staff', 'is_superuser']:
            if field in data:
                setattr(user, field, data[field])
        user.save()
        # Log activity
        Activity.objects.create(user=request.user, action="User Edit", description=f"Admin edited user {user.username}.", timestamp=timezone.now())
        serializer = UserSerializer(user)
        return Response(serializer.data)

class ActivityFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.is_staff or request.user.is_superuser:
            activities = Activity.objects.all().order_by('-timestamp')[:100]
        else:
            activities = Activity.objects.filter(user=request.user).order_by('-timestamp')[:100]
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)

class DashboardAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_superuser or user.is_staff:
            data = {
                'user_count': CustomUser.objects.count(),
                'active_user_count': CustomUser.objects.filter(is_active=True).count(),
                'document_count': Document.objects.count(),
                'chatroom_count': ChatRoom.objects.count(),
                'message_count': Message.objects.count(),
                'whiteboard_count': Whiteboard.objects.count(),
                'activity_count': Activity.objects.count(),
                'recent_activity': ActivitySerializer(Activity.objects.all().order_by('-timestamp')[:5], many=True).data,
            }
        else:
            data = {
                'my_document_count': Document.objects.filter(owner=user).count(),
                'my_chatroom_count': ChatRoom.objects.filter(participants=user).count(),
                'my_message_count': Message.objects.filter(sender=user).count(),
                'my_whiteboard_count': Whiteboard.objects.filter(owner=user).count(),
                'my_activity_count': Activity.objects.filter(user=user).count(),
                'recent_activity': ActivitySerializer(Activity.objects.filter(user=user).order_by('-timestamp')[:5], many=True).data,
            }
        return Response(data)