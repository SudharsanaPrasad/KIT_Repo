import pandas as pd
from django.forms import model_to_dict
from katrinconsole.core.models import AdeiChannel, AdeiGroup
from katrinconsole.core.serializers import (AdeiChannelsSerializer,
                                            AdeiDuplicatesSerializer,
                                            AdeiGroupsSerializer)
from katrinconsole.lib.adei import get_adei_item_url
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class GroupsView(generics.ListAPIView):
    queryset = AdeiGroup.objects.all()
    serializer_class = AdeiGroupsSerializer


class ChannelsView(generics.ListAPIView):
    queryset = AdeiChannel.objects.all()
    serializer_class = AdeiChannelsSerializer


@api_view(['GET'],)
@permission_classes([IsAuthenticated])
def duplicates(req):
    items = list(AdeiChannel.objects.all())
    df = pd.DataFrame([model_to_dict(item) for item in items])
    dup = df[df['uid'].duplicated(keep=False)].groupby('uid')
    total_dup = 0
    unique_dup = 0
    duplicates = []
    for key, items in dup:
        if key:
            length = len(items)
            total_dup += length
            unique_dup += 1
            channel = {
                'total': length,
                'channel_uid': key,
                'duplicates': [{
                    'url': get_adei_item_url(row["db_server"], row["db_name"], row["db_group"]),
                    'uid': row.get('uid', None),
                    'chid': row['chid'],
                    'db_server': row["db_server"],
                    'db_name': row["db_name"],
                    'db_group': row["db_group"],
                } for _, row in items.iterrows()]
            }
        duplicates.append(channel)

    dups = {
        'total': total_dup,
        'unique_channels': unique_dup,
        'duplicates': duplicates
    }
    serializer = AdeiDuplicatesSerializer(dups,)
    return Response(data=serializer.data,)
