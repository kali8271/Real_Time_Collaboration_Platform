from django.contrib import admin
from .models import CustomUser, Document, DocumentVersion



@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "owner", "created_at", "updated_at")
    search_fields = ("title", "owner__username")
    list_filter = ("created_at", "updated_at")

@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ("id", "document", "created_at")
    search_fields = ("document__title",)
    list_filter = ("created_at",)