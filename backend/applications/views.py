from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes as permission_classes_decorator
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.views import APIView

from .models import Application
from .serializers import ApplicationSerializer, RegisterSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully.",
                    "username": user.username
                },
                status=status.HTTP_201_CREATED
            )

        # Extract first validation error message
        first_field = next(iter(serializer.errors))
        first_err = serializer.errors[first_field]
        if isinstance(first_err, list) and len(first_err) > 0:
            error_msg = f"{first_field}: {first_err[0]}" if first_field != "non_field_errors" else str(first_err[0])
        else:
            error_msg = str(first_err)

        return Response(
            {"error": error_msg},
            status=status.HTTP_400_BAD_REQUEST
        )