from xml.etree import ElementTree as ET
import requests

HARDWARE_CGROUPS = 'http://adei-katrin.kaas.kit.edu/adei/services/list.php?target=cgroups&db_server=%s&db_name=%s&list_hardware=1&info=1'
HARDWARE_CONTROLS = 'http://adei-katrin.kaas.kit.edu/adei/services/list.php?target=controls&db_server=%s&db_name=%s&control_group=%s&list_hardware=1&info=1'
SOURCES = 'http://adei-katrin.kaas.kit.edu/adei/services/list.php?target=sources'
ADEI_GROUPS = 'http://adei-katrin.kaas.kit.edu/adei/services/list.php?target=groups&db_server=%s&db_name=%s'
ADEI_ITEMS = 'http://adei-katrin.kaas.kit.edu/adei/services/list.php?target=items&db_server=%s&db_name=%s&db_group=%s&info=1'

skipped_databases = ['katrinpse', 'BakeOut2013', ]
skipped_servers = ['mos0', ]


def _map_cgroup(elm):
    return {
        'value': elm.attrib.get('value', None),
        'db_group': elm.attrib.get('db_group', None),
        'oid': elm.attrib.get('oid', None),
        'hardware': elm.attrib.get('hardware', None),
        'length': elm.attrib.get('length', None),
        'opcurl': elm.attrib.get('opcurl', None),
        'mode': elm.attrib.get('mode', None),
        'must_update': elm.attrib.get('must_update', None),
        'gid': elm.attrib.get('gid', None),
        'first': elm.attrib.get('first', None),
        'last': elm.attrib.get('last', None),
        'db_group_name': elm.attrib.get('db_group_name', None),
        'name': elm.attrib.get('name', None),
    }


def get_cgroups_of(user, password, db_server, db_name):
    cgroups_url = HARDWARE_CGROUPS % (db_server, db_name)
    response = requests.get(cgroups_url, auth=(user, password))
    elms = ET.fromstring(response.text)
    return [_map_cgroup(elm) for elm in elms]


def _map_control(elm):
    return {
        'uid': elm.attrib.get('uid', None),
        'value': elm.attrib.get('value', None),
        'read': elm.attrib.get('read', None),
        'write': elm.attrib.get('write', None),
        'block_id': elm.attrib.get('block_id', None),
        'block_name': elm.attrib.get('block_name', None),
        'chan_name': elm.attrib.get('chan_name', None),
        'opc': elm.attrib.get('opc', None),
        'name': elm.attrib.get('name', None),
        'axis': elm.attrib.get('axis', None),
    }


def get_controls(user, password, db_server, db_name, db_group):
    url = HARDWARE_CONTROLS % (db_server, db_name, db_group)
    response = requests.get(url, auth=(user, password))
    elms = ET.fromstring(response.text.replace(
        "&", "&#38;")) if response.text else []
    return [_map_control(elm) for elm in elms]


def _map_source(elm):
    return {
        'value': elm.attrib.get('value', None),
        'db_server': elm.attrib.get('db_server', None),
        'db_name': elm.attrib.get('db_name', None),
        'name': elm.attrib.get('name', None),
    }


def get_sources(user, password,):
    response = requests.get(SOURCES, auth=(user, password))
    elms = ET.fromstring(response.text.replace(
        "&", "&#38;")) if response.text else []
    return [_map_source(elm) for elm in elms
            if elm.attrib.get('db_name') not in skipped_databases
            and elm.attrib.get('db_server') not in skipped_servers]


def _map_adei_group(elm):
    return {
        'value': elm.attrib.get('value', None),
        'db_group': elm.attrib.get('db_group', None),
        'name': elm.attrib.get('name', None),
    }


def get_adei_source_groups(user, password, db_server, db_name,):
    url = ADEI_GROUPS % (db_server, db_name)
    response = requests.get(url, auth=(user, password))
    elms = ET.fromstring(response.text.replace(
        "&", "&#38;")) if response.text else []
    return [_map_adei_group(elm) for elm in elms]


def _map_adei_item(elm):
    return {
        'value': elm.attrib.get('value', None),
        'uid': elm.attrib.get('uid', None),
        'block_id': elm.attrib.get('block_id', None),
        'block_name': elm.attrib.get('block_name', None),
        'chan_name': elm.attrib.get('chan_name', None),
        'opc': elm.attrib.get('opc', None),
        'axis': elm.attrib.get('axis', None),
        'name': elm.attrib.get('name', None),
    }


def get_adei_source_items(user, password, db_server, db_name, db_group):
    url = ADEI_ITEMS % (db_server, db_name, db_group)
    response = requests.get(url, auth=(user, password))
    elms = ET.fromstring(response.text.replace(
        "&", "&#38;")) if response.text else []
    return [_map_adei_item(elm) for elm in elms]
