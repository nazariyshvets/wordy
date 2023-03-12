from django.contrib import admin
from .models import WordSet, Record, ProfileImage, Voice

admin.site.register(WordSet)
admin.site.register(Record)
admin.site.register(ProfileImage)
admin.site.register(Voice)