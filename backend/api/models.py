from django.db import models
from django.contrib.auth.models import User


class WordSet(models.Model):
  title = models.CharField(max_length=200)
  creator = models.ForeignKey(User, on_delete=models.CASCADE)
  created = models.DateTimeField(auto_now_add=True)


class Word(models.Model):
  term = models.CharField(max_length=200)
  definition = models.CharField(max_length=400)
  word_set = models.ForeignKey(
      WordSet, related_name="words", on_delete=models.CASCADE)


class ProfileImage(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
  url = models.ImageField(upload_to="user_images",
                          default="user_images/default_user_profile.svg", blank=True, null=True)


class Voice(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE)
  browser = models.CharField(max_length=100)
  uri = models.CharField(max_length=200)
