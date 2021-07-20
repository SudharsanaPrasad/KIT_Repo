from katrinconsole.core.serializers import BoraSerializer
from katrinconsole.core.models import Bora
from rest_framework import generics, permissions


class BoraView(generics.ListAPIView):
    queryset = Bora.objects.all()
    serializer_class = BoraSerializer
    permission_classes = [permissions.IsAuthenticated, ]
