from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import CustomUser
from .models import Whiteboard
from rest_framework_simplejwt.tokens import RefreshToken

# Create your tests here.

class WhiteboardTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='wbuser', password='wbpass123')
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_create_whiteboard(self):
        url = '/whiteboard/api/whiteboards/'
        data = {'title': 'Board 1', 'owner': self.user.id}
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])
        self.assertTrue(Whiteboard.objects.filter(title='Board 1').exists())

    def test_list_whiteboards(self):
        Whiteboard.objects.create(title='Board A', owner=self.user)
        url = '/whiteboard/api/whiteboards/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(board['title'] == 'Board A' for board in response.data))
