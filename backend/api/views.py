from django.contrib.auth.models import User
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
  RecordSerializer, 
  ProfileImageSerializer, 
  VoiceSerializer
)
from .models import WordSet, Record, ProfileImage, Voice

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
def word_sets(request):
  word_sets = WordSet.objects.filter(creator=request.user)
  serializer = WordSetSerializer(word_sets, many=True)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def word_set(request, pk):
  try:
    word_set = WordSet.objects.get(pk=pk, creator=request.user)
  except WordSet.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)

  records = Record.objects.filter(word_set__pk=pk)
  word_set_serializer = WordSetSerializer(word_set)
  records_serializer = RecordSerializer(records, many=True)
  return Response({"word_set": word_set_serializer.data, "records": records_serializer.data}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_word_set(request):
  record_serializers = []
  records_are_valid = True

  word_set_serializer = WordSetSerializer(data=request.data.get("word_set"))
  
  for record in request.data.get("records"):
    record_serializer = RecordSerializer(data=record)
    if not record_serializer.is_valid():
      records_are_valid = False
      break
    record_serializers.append(record_serializer)

  if word_set_serializer.is_valid() and records_are_valid:
    word_set = word_set_serializer.save(creator=request.user)
    for record_serializer in record_serializers:
        record_serializer.save(word_set=word_set)
    return Response(status=status.HTTP_201_CREATED)
  return Response([word_set_serializer.errors, *[rs.errors for rs in record_serializers]], status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_word_set(request, pk):
  record_serializers = []
  records_are_valid = True
  try:
    word_set = WordSet.objects.get(pk=pk, creator=request.user)
  except WordSet.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND) 

  word_set_serializer = WordSetSerializer(word_set, data=request.data.get("word_set"))
  
  for record_data in request.data.get("records"):
    record_serializer = RecordSerializer(data=record_data)
    if not record_serializer.is_valid():
      records_are_valid = False
      break
    record_serializers.append(record_serializer)

  if word_set_serializer.is_valid() and records_are_valid:
    Record.objects.filter(word_set__id=pk).delete()
    word_set = word_set_serializer.save(creator=request.user)
    for record_serializer in record_serializers:
        record_serializer.save(word_set=word_set)
    return Response(status=status.HTTP_200_OK)
  return Response([word_set_serializer.errors, *[rs.errors for rs in record_serializers]], status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_word_set(request, pk):
  try:
    word_set = WordSet.objects.get(pk=pk, creator=request.user)
  except WordSet.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)

  word_set.delete()
  return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile_image(request):
  profile_image = ProfileImage.objects.get(user=request.user)
  serializer = ProfileImageSerializer(profile_image)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile_image(request):
  profile_image = ProfileImage.objects.get(user=request.user)
  serializer = ProfileImageSerializer(profile_image, data=request.data)
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def voice(request):
  try:
    voice = Voice.objects.get(user=request.user, browser__iexact=request.GET.get("browser"))
  except Voice.DoesNotExist:
    return Response(status=status.HTTP_404_NOT_FOUND)

  serializer = VoiceSerializer(voice)
  return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_voice(request):
  try:
    voice = Voice.objects.get(user=request.user, browser__iexact=request.data.get("browser"))
  except Voice.DoesNotExist:
    serializer = VoiceSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save(user=request.user)
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  serializer = VoiceSerializer(voice, data=request.data)
  if serializer.is_valid():
    serializer.save(user=request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)
  return Response(serializer.errors ,status=status.HTTP_400_BAD_REQUEST)