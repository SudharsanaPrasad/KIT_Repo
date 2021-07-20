from katrinconsole.core.models import AdeiChannel, AdeiGroup, Bora
from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    groups = serializers.SlugRelatedField(
        many=True, slug_field='name', read_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name',
                  'is_staff', 'is_superuser',
                  'last_name', 'email', 'groups']


class PatchUserSerializer(serializers.Serializer):
    password = serializers.CharField()


class BoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bora
        fields = ['key', 'title', 'source', ]


class AdeiChannelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdeiChannel
        fields = '__all__'


class AdeiGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdeiGroup
        fields = '__all__'


class AdeiDuplicatesSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    unique_channels = serializers.IntegerField()
    duplicates = serializers.ListField(
        allow_empty=True, )


class LegacyControlRequestSerializer(serializers.Serializer):
    server = serializers.CharField()


class LegaceControlServerListSerializer(serializers.Serializer):
    servers = serializers.ListField()
    count = serializers.IntegerField()


class DashboardSerializer(serializers.Serializer):
    active_users = serializers.IntegerField()
    active_channels = serializers.IntegerField()
