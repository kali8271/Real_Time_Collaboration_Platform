from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class Whiteboard(models.Model):
    title = models.CharField(max_length=255, unique=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="whiteboards")
    participants = models.ManyToManyField(User, related_name="whiteboard_participations", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class WhiteboardDrawing(models.Model):
    whiteboard = models.ForeignKey(Whiteboard, on_delete=models.CASCADE, related_name="drawings")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    data = models.JSONField()  # Stores drawing actions (lines, shapes, colors)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Drawing by {self.user.username} on {self.whiteboard.title}"

class WhiteboardAction(models.Model):
    whiteboard_id = models.IntegerField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=50)
    data = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.timestamp}] {self.user}: {self.action}"
