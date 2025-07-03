from django.contrib import admin
from .models import CustomUser, Activity

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "is_online")
    search_fields = ("username", "email")
    list_filter = ("is_online",)

admin.site.register(Activity)