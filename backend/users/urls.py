from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserRegistrationView, UserProfileView, ChangePasswordView, AdminUserListView, AdminUserStatusView, AdminUserEditView, ActivityFeedView, DashboardAnalyticsView

router = DefaultRouter()
router.register(r'api/users', UserViewSet)

urlpatterns = [
    path('api/register/', UserRegistrationView.as_view(), name='user-register'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/change-password/', ChangePasswordView.as_view(), name='user-change-password'),
    path('api/admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('api/admin/users/<int:user_id>/status/', AdminUserStatusView.as_view(), name='admin-user-status'),
    path('api/admin/users/<int:user_id>/edit/', AdminUserEditView.as_view(), name='admin-user-edit'),
    path('api/activity/', ActivityFeedView.as_view(), name='activity-feed'),
    path('api/dashboard-analytics/', DashboardAnalyticsView.as_view(), name='dashboard-analytics'),
    path('', include(router.urls)),
]