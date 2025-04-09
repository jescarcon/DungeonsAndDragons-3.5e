from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({"password": "Password cannot be empty."})
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        # Aplica solo los campos normales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Solo si el usuario escribió una nueva contraseña
        if password:
            instance.set_password(password)

        instance.save()
        return instance
