from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser

# Create your tests here.

class UserAuthTests(APITestCase):
    def test_user_registration(self):
        url = reverse('user-register')
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(CustomUser.objects.filter(username='testuser').exists())

    def test_jwt_login(self):
        # First, register a user
        CustomUser.objects.create_user(username='jwtuser', email='jwt@example.com', password='jwtpass123')
        url = reverse('token_obtain_pair')
        data = {
            'username': 'jwtuser',
            'password': 'jwtpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
