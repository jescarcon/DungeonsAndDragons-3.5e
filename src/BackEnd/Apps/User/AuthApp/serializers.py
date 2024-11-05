# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True} #Not included in the request bodies
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None) #Deletes original password for security reasons 

        if not password:
            raise serializers.ValidationError({"password": "Password cannot be empty."})

        # Crear el usuario sin la contraseña
        user = User(**validated_data)
        
        # Usar set_password() para cifrar la contraseña
        user.set_password(password)
        
        # Guardar el usuario en la base de datos
        user.save()
        
        return user