from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from .models import CustomUser
from .serializers import CustomUserSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action == 'create':  # Allow unauthenticated users to register
            return [AllowAny()]
        return [IsAuthenticated()]  # Require authentication for all other actions

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'admin':
                return CustomUser.objects.all()
            return CustomUser.objects.filter(id=user.id)
        return CustomUser.objects.none()

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=401)
        serializer = self.get_serializer(user)
        return Response(serializer.data)
