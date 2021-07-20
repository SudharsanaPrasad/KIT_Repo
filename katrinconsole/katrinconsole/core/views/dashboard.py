from katrinconsole.core.models import LegacyControlItem
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from katrinconsole.core.serializers import DashboardSerializer


class DashboardView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DashboardSerializer
    queryset = User.objects.all()

    def get_object(self):
        return {
            'active_users': User.objects.count(),
            'active_channels': LegacyControlItem.objects.count(),
        }
