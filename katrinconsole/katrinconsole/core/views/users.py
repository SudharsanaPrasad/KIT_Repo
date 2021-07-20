from katrinconsole.core.serializers import UserSerializer, PatchUserSerializer
from rest_framework import response, permissions, viewsets
from drf_yasg.utils import swagger_auto_schema


class MeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated, ]

    @swagger_auto_schema(responses={200: UserSerializer, })
    def me(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        return response.Response(data)

    @swagger_auto_schema(request_body=PatchUserSerializer)
    def change_password(self, request):
        user = request.user
        serializer = PatchUserSerializer(data=request.data)
        if serializer.is_valid():
            user.set_password(serializer.validated_data['password'])
            user.save()
            return response.Response({'status': 'password set'})
        else:
            return response.Response(serializer.errors,
                                     status=response.status.HTTP_400_BAD_REQUEST)
