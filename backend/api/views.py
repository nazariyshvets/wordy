from django.db import transaction
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    WordSetSerializer,
    WordSerializer,
    ProfileImageSerializer,
    VoiceSerializer
)
from .models import WordSet, Word, ProfileImage, Voice


class MyTokenObtainPairView(TokenObtainPairView):
  serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
  queryset = User.objects.all()
  permission_classes = (AllowAny, )
  serializer_class = RegisterSerializer


@api_view(["GET"])
def routes(request):
  routes = [
      "/api/token/",
      "/api/token/refresh/",
      "/api/register/",
      "/api/word-sets/",
      "/api/word-sets/create/",
      "/api/word-sets/<int:pk>/",
      "/api/word-sets/<int:pk>/update/",
      "/api/word-sets/<int:pk>/delete/",
      "/api/profile-image/",
      "/api/update-profile-image/",
      "/api/voice",
      "/api/update-voice"
  ]
  return Response(routes)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_word_sets(request):
  word_sets = WordSet.objects.filter(creator=request.user)
  serializer = WordSetSerializer(word_sets, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_word_set(request, pk):
  word_set = get_object_or_404(WordSet, pk=pk, creator=request.user)

  words = word_set.words.all()
  word_set_serializer = WordSetSerializer(word_set)
  words_serializer = WordSerializer(words, many=True)

  response_data = {
      "word_set": word_set_serializer.data,
      "words": words_serializer.data
  }
  return Response(response_data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_word_set(request):
  word_set_data = request.data.get("word_set")
  words_data = request.data.get("words", [])

  word_set_serializer = WordSetSerializer(data=word_set_data)
  word_serializers = [WordSerializer(data=word_data)
                      for word_data in words_data]

  if word_set_serializer.is_valid() and all(ws.is_valid() for ws in word_serializers):
    word_set = word_set_serializer.save(creator=request.user)

    # Prepare word instances to be created
    words_to_create = [
        Word(term=word_serializer.validated_data["term"],
             definition=word_serializer.validated_data["definition"],
             word_set=word_set)
        for word_serializer in word_serializers
    ]

    Word.objects.bulk_create(words_to_create)  # Bulk create words

    return Response(status=status.HTTP_201_CREATED)

  errors = {
      "word_set": word_set_serializer.errors,
      "words": [ws.errors for ws in word_serializers if not ws.is_valid()]
  }
  return Response(errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_word_set(request, pk):
  word_set = get_object_or_404(WordSet, pk=pk, creator=request.user)

  word_set_serializer = WordSetSerializer(
      instance=word_set, data=request.data.get("word_set"), partial=True
  )

  if not word_set_serializer.is_valid():
    return Response(word_set_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  words_data = request.data.get("words", [])

  with transaction.atomic():
    # Update existing words if they exist in words_data
    existing_word_ids = [word['id'] for word in words_data if 'id' in word]
    existing_words = Word.objects.filter(
        id__in=existing_word_ids, word_set=word_set)
    word_updates = []

    for word in existing_words:
      word_data = next(wd for wd in words_data if wd['id'] == word.id)
      word_updates.append(
          Word(id=word.id, term=word_data['term'], definition=word_data['definition']))

    if word_updates:
      Word.objects.bulk_update(word_updates, fields=['term', 'definition'])

    # Delete words that are not in words_data
    words_to_delete = Word.objects.filter(
        word_set=word_set).exclude(id__in=existing_word_ids)
    words_to_delete.delete()

    # Create new words
    new_words = [
        Word(term=word_data['term'],
             definition=word_data['definition'], word_set=word_set)
        for word_data in words_data if 'id' not in word_data
    ]
    Word.objects.bulk_create(new_words)

  return Response(status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_word_set(request, pk):
  word_set = get_object_or_404(WordSet, pk=pk, creator=request.user)
  word_set.delete()
  return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile_image(request):
  profile_image = get_object_or_404(ProfileImage, user=request.user)
  serializer = ProfileImageSerializer(profile_image)
  return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile_image(request):
  image = request.FILES.get("url")

  if not image:
    return Response({"error": "An image is not provided"}, status=status.HTTP_400_BAD_REQUEST)

  if image.size > 1024 * 100:  # 100KB in bytes
    return Response({"error": "Image's size should be up to 100KB"}, status=status.HTTP_400_BAD_REQUEST)

  profile_image = get_object_or_404(ProfileImage, user=request.user)
  serializer = ProfileImageSerializer(profile_image, data=request.data)

  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)

  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_voice(request):
  browser = request.GET.get("browser", "").strip().lower()
  voice = get_object_or_404(Voice, user=request.user, browser=browser)
  serializer = VoiceSerializer(voice)

  return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_voice(request):
  browser = request.data.get("browser", "").strip().lower()

  try:
    voice = Voice.objects.get(user=request.user, browser=browser)
    serializer = VoiceSerializer(voice, data=request.data)
  except Voice.DoesNotExist:
    serializer = VoiceSerializer(data=request.data)

  if serializer.is_valid():
    serializer.save(user=request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
