from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import CustomUser
from .models import Message, ChatRoom
from rest_framework_simplejwt.tokens import RefreshToken

# Create your tests here.

class ChatMessageTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='chatuser', password='chatpass123')
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.chatroom = ChatRoom.objects.create(name='Test Room')
        self.chatroom.participants.add(self.user)

    def test_create_message(self):
        url = '/chat/api/messages/'
        data = {'content': 'Hello, world!', 'chatroom': self.chatroom.id}
        response = self.client.post(url, data, format='json')
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])
        self.assertTrue(Message.objects.filter(content='Hello, world!').exists())

    def test_list_messages(self):
        Message.objects.create(content='Test message', sender=self.user, chatroom=self.chatroom)
        url = '/chat/api/messages/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(msg['content'] == 'Test message' for msg in response.data))
