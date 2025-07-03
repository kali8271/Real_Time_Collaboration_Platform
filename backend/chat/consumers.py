import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatMessage
import asyncio

class ChatConsumer(AsyncWebsocketConsumer):
    # In-memory presence tracking: {room_group_name: set(usernames)}
    online_users = {}
    typing_users = {}  # {room_group_name: set(usernames)}
    reactions = {}  # {room_group_name: {message_id: {emoji: [usernames]}}}

    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close()
            return
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Add user to online set
        users = ChatConsumer.online_users.setdefault(self.room_group_name, set())
        users.add(user.username)

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Broadcast join event and user list
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "presence_event",
                "event": "user_joined",
                "username": user.username,
                "users": list(users),
            }
        )

    async def disconnect(self, close_code):
        user = self.scope.get("user")
        users = ChatConsumer.online_users.get(self.room_group_name, set())
        if user and user.username in users:
            users.remove(user.username)
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        # Broadcast leave event and user list
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "presence_event",
                "event": "user_left",
                "username": user.username if user else "anonymous",
                "users": list(users),
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        if "typing" in data:
            # Typing event
            sender = self.scope["user"].username if self.scope["user"] else "anonymous"
            await self.handle_typing(sender, data["typing"])
            return
        if "reaction" in data:
            await self.handle_reaction(data["reaction"])
            return
        message = data["message"]
        sender = self.scope["user"].username if self.scope["user"] else "anonymous"
        user = self.scope["user"]
        # Save to DB
        if user and user.is_authenticated:
            msg_obj = await self.save_message(self.room_name, user, message)
            message_id = msg_obj.id if msg_obj else None
        else:
            message_id = None
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender,
                "message_id": message_id,
                "reactions": self.reactions.get(self.room_group_name, {}).get(message_id, {}) if message_id else {}
            }
        )

    async def handle_typing(self, username, is_typing):
        users = ChatConsumer.typing_users.setdefault(self.room_group_name, set())
        if is_typing:
            users.add(username)
        else:
            users.discard(username)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "typing_event",
                "users": list(users)
            }
        )
        # Remove after 3 seconds if still present
        if is_typing:
            await asyncio.sleep(3)
            if username in users:
                users.discard(username)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "typing_event",
                        "users": list(users)
                    }
                )

    async def typing_event(self, event):
        await self.send(text_data=json.dumps({
            "event": "typing",
            "users": event["users"]
        }))

    async def handle_reaction(self, data):
        # data: {message_id, emoji, username}
        room_reactions = ChatConsumer.reactions.setdefault(self.room_group_name, {})
        msg_reactions = room_reactions.setdefault(data["message_id"], {})
        users = msg_reactions.setdefault(data["emoji"], [])
        if data["username"] in users:
            users.remove(data["username"])
        else:
            users.append(data["username"])
        # Broadcast updated reactions for this message
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "reaction_event",
                "message_id": data["message_id"],
                "reactions": msg_reactions
            }
        )

    @staticmethod
    async def save_message(room_name, user, message):
        from asgiref.sync import sync_to_async
        obj = await sync_to_async(ChatMessage.objects.create)(room_name=room_name, user=user, message=message)
        return obj

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "message_id": event.get("message_id"),
            "reactions": event.get("reactions", {})
        }))

    async def reaction_event(self, event):
        await self.send(text_data=json.dumps({
            "event": "reaction",
            "message_id": event["message_id"],
            "reactions": event["reactions"]
        }))

    async def presence_event(self, event):
        await self.send(text_data=json.dumps({
            "event": event["event"],
            "username": event["username"],
            "users": event["users"]
        }))
