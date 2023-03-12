from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = "api"

urlpatterns = [
  path("", views.routes),
  path("token/", views.MyTokenObtainPairView.as_view()),
  path("token/refresh/", TokenRefreshView.as_view()),
  path("register/", views.RegisterView.as_view()),
  path("word-sets/", views.word_sets),
  path("word-sets/create/", views.create_word_set),
  path("word-sets/<int:pk>/", views.word_set),
  path("word-sets/<int:pk>/update/", views.update_word_set),
  path("word-sets/<int:pk>/delete/", views.delete_word_set),
  path("profile-image/", views.profile_image),
  path("update-profile-image/", views.update_profile_image),
  path("voice/", views.voice),
  path("update-voice/", views.update_voice),
]