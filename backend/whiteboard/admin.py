from django.contrib import admin
from .models import Whiteboard, WhiteboardDrawing

@admin.register(Whiteboard)
class WhiteboardAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "created_at")
    search_fields = ("title", "owner__username")
    filter_horizontal = ("participants",)

@admin.register(WhiteboardDrawing)
class WhiteboardDrawingAdmin(admin.ModelAdmin):
    list_display = ("id", "whiteboard", "user", "timestamp")
    search_fields = ("whiteboard__title", "user__username")
    list_filter = ("timestamp",)
