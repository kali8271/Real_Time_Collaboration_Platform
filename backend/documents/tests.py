from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import CustomUser
from .models import Document
from rest_framework_simplejwt.tokens import RefreshToken

# Create your tests here.

class DocumentTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='docuser', password='docpass123')
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_document(self):
        url = '/documents/api/documents/'
        data = {'title': 'Test Doc', 'content': 'Some content'}
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])
        self.assertTrue(Document.objects.filter(title='Test Doc').exists())

    def test_list_documents(self):
        Document.objects.create(title='Doc1', content='...', owner=self.user)
        url = '/documents/api/documents/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(doc['title'] == 'Doc1' for doc in response.data))
