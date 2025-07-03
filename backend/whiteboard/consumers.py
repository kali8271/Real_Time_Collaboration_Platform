import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import WhiteboardAction

class WhiteboardConsumer(AsyncWebsocketConsumer):
    # In-memory presence tracking: {room_group_name: set(usernames)}
    online_users = {}

    async def connect(self):
        user = self.scope.get("user")
        if not user or not user.is_authenticated:
            await self.close()
            return
        self.whiteboard_id = self.scope["url_route"]["kwargs"]["whiteboard_id"]
        self.room_group_name = f"whiteboard_{self.whiteboard_id}"

        # Add user to online set
        users = WhiteboardConsumer.online_users.setdefault(self.room_group_name, set())
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
        users = WhiteboardConsumer.online_users.get(self.room_group_name, set())
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
        action = data["action"]  # e.g., "draw", "erase"
        drawing_data = data["drawing_data"]  # JSON data for drawing
        sender = self.scope["user"].username if self.scope["user"] else "anonymous"
        user = self.scope["user"]
        # Save to DB
        if user and user.is_authenticated:
            await self.save_action(self.whiteboard_id, user, action, drawing_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "whiteboard_update",
                "action": action,
                "drawing_data": drawing_data,
                "sender": sender
            }
        )

    @staticmethod
    async def save_action(whiteboard_id, user, action, data):
        from asgiref.sync import sync_to_async
        await sync_to_async(WhiteboardAction.objects.create)(whiteboard_id=whiteboard_id, user=user, action=action, data=data)

    async def whiteboard_update(self, event):
        await self.send(text_data=json.dumps({
            "action": event["action"],
            "drawing_data": event["drawing_data"],
            "sender": event["sender"]
        }))

    async def presence_event(self, event):
        await self.send(text_data=json.dumps({
            "event": event["event"],
            "username": event["username"],
            "users": event["users"]
        }))
