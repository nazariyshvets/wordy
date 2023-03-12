from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import ProfileImage

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
  if created:
    ProfileImage.objects.get_or_create(user=instance)