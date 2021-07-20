import csv
import re
import string
from uuid import uuid4

from drf_yasg.utils import swagger_auto_schema
from katrinconsole.core.models import (LegacyControlBlockInfo,
                                       LegacyControlIdMappings,
                                       LegacyControlItem)
from katrinconsole.core.serializers import LegaceControlServerListSerializer, LegacyControlRequestSerializer
from rest_framework import permissions, response, views
from django import http


class LegacyControlView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(request_body=LegacyControlRequestSerializer)
    def post(self, request, **kwargs):
        server = request.data['server']
        resp = http.HttpResponse(content_type='text/csv',
                                 headers={'Content-disposition':
                                          f'attachment; filename={server}.csv'})
        writer = csv.writer(resp, quoting=csv.QUOTE_NONNUMERIC,)

        writer.writerow(['SensorName', 'WsKATRINName', 'BlockName',
                         'OPCItemName', 'WsUnit', 'WsDeviceName',
                         'WsViewName', 'WsChannel', 'WsDescription',
                         'ADEI-Sensorname (=KatrinNo + Description)',
                         'DataType', 'Access'])

        mappings = LegacyControlIdMappings.objects.all()
        controls = list(LegacyControlItem.objects.filter(server=server))
        for control in controls:
            katrinid = control.uid or ''

            adei_path = f'{control.db_server}__{control.db_name}__{control.cgroup_db_group}__{control.value}'

            record = next(
                filter(lambda m: m.adei_path == adei_path, mappings), None)

            if record:
                uuid = record.uuid
                if katrinid and record.katrin_id is None:
                    record.katrin_id = katrinid
                    record.save()
            else:
                uuid = str(uuid4())
                mapping = LegacyControlIdMappings(
                    uuid=uuid, adei_path=adei_path, katrin_id=katrinid)
                mapping.save()

            blockid = control.block_id

            unit = control.axis

            item_name = control.name

            ws_device_name = control.cgroup_name

            blockinfo = LegacyControlBlockInfo.objects.filter(
                db_server=control.db_server, block_id=blockid).first()
            ws_view_name = blockinfo.group_name

            chars = re.escape(string.punctuation)
            block_name = control.block_name
            block_name = re.sub(r'['+chars+']', '', block_name)
            block_name = re.sub(' +', '_', block_name)
            field_name = ''.join(
                e if e.isalnum() else '_' for e in block_name)

            opcua_nodeid = f'ns=2;s={field_name}.{uuid}'

            access_list = []
            if control.read == '1':
                access_list.append('Read')
            if control.write == '1':
                access_list.append('Write')
            access = '/'.join(access_list)

            writer.writerow([uuid, katrinid, block_name, opcua_nodeid,
                             unit, ws_device_name, ws_view_name,
                             control.value, item_name,
                             katrinid + ' ' + item_name,
                             'double', access])

        return resp

    @swagger_auto_schema(responses={200: LegaceControlServerListSerializer(), })
    def get(self, request, **kwargs):
        servers = list(map(lambda item: item['server'],
                           LegacyControlItem.objects.values(
                               'server').distinct()))
        serializer = LegaceControlServerListSerializer({
            'servers': servers,
            'count': len(servers)
        }, )
        return response.Response(data=serializer.data, content_type='text/json',)
