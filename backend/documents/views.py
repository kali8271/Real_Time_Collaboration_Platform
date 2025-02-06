
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Document, DocumentVersion
from .serializers import UserSerializer, DocumentSerializer, DocumentVersionSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class DocumentViewSet(viewsets.ModelViewSet):import logging

# Create a logger
logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        logger.info('Listing users')
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info('Creating user')
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        logger.info('Retrieving user')
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        logger.info('Updating user')
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        logger.info('Deleting user')
        return super().destroy(request, *args, **kwargs)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        logger.info('Listing documents')
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info('Creating document')
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        logger.info('Retrieving document')
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        logger.info('Updating document')
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        logger.info('Deleting document')
        return super().destroy(request, *args, **kwargs)

class DocumentVersionViewSet(viewsets.ModelViewSet):
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        logger.info('Listing document versions')
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info('Creating document version')
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        logger.info('Retrieving document version')
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        logger.info('Updating document version')
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        logger.info('Deleting document version')
        return super().destroy(request, *args, **kwargs)
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

class DocumentVersionViewSet(viewsets.ModelViewSet):
    queryset = DocumentVersion.objects.all()
    serializer_class = DocumentVersionSerializer
    permission_classes = [IsAuthenticated]




    