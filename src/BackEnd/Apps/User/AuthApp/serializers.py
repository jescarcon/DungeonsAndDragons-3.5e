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
        # Extract the password from validated_data, removing it from the dictionary.
        # If no password is provided, default to None.
        password = validated_data.pop('password', None)

        # Check if the password is provided, raise an error if it’s empty
        if not password:
            raise serializers.ValidationError({"password": "Password cannot be empty."})

        # Create the user without the password (since it can't be stored as plain text)
        user = User(**validated_data)
        
        # If a password was provided, encrypt it using set_password()
        user.set_password(password)
        
        # Save the user in the database
        user.save()
        
        return user