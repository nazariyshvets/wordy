from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import ProfileImage, Voice, WordSet, Record

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
  @classmethod
  def get_token(cls, user):
    token = super().get_token(user)
    token["username"] = user.username
    return token

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True, validators=[validate_password])

  class Meta:
    model = User
    fields = ("username", "email", "password", "password2")

  def validate(self, attrs):
    if User.objects.filter(email=attrs["email"]).exists():
      raise serializers.ValidationError({"email": "Email is already used."})
    if attrs["password"] != attrs["password2"]:
      raise serializers.ValidationError({"password": "Password fields didn't match."})
    return attrs
  
  def create(self, validated_data):
    user = User.objects.create(username=validated_data["username"], email=validated_data["email"])

    user.set_password(validated_data["password"])
    user.save()

    return user

class WordSetSerializer(serializers.ModelSerializer):
  creator = serializers.ReadOnlyField(source="creator.username")

  class Meta:
    model = WordSet
    fields = ("id", "title", "creation", "creator")

class RecordSerializer(serializers.ModelSerializer):
  word_set = serializers.ReadOnlyField(source="word_set.id")

  class Meta:
    model = Record
    fields = ("id", "term", "definition", "word_set")

class ProfileImageSerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source="user.username")
  url = serializers.ImageField(required=True)

  class Meta:
    model = ProfileImage
    fields = ("user", "url")

class VoiceSerializer(serializers.ModelSerializer):
  user = serializers.ReadOnlyField(source="user.username")
  
  class Meta:
    model = Voice
    fields = ("user", "browser", "uri")