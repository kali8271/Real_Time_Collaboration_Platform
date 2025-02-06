from django.db import models
from django.contrib.auth import get_user_model

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
