from django.db import models
from django.contrib.auth.models import User

class ProfileImage(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
  url = models.ImageField(upload_to="user_images", default="user_images/default_user_profile.svg", blank=True, null=True)

class Voice(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  browser = models.CharField(max_length=100)
  uri = models.CharField(max_length=200)

class WordSet(models.Model):
  title = models.CharField(max_length=200)
  creator = models.ForeignKey(User, on_delete=models.CASCADE)
  creation = models.DateTimeField(auto_now_add=True)

class Record(models.Model):
  term = models.CharField(max_length=200)
  definition = models.CharField(max_length=400)
  word_set = models.ForeignKey(WordSet, on_delete=models.CASCADE)