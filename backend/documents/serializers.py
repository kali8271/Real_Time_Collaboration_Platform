from rest_framework import serializers
from .models import CustomUser, Document, DocumentVersion

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "profile_picture", "bio", "is_online"]

class DocumentSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Document
        fields = ['id', 'title', 'content', 'owner', 'created_at', 'updated_at']

class DocumentVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'content', 'created_at']
