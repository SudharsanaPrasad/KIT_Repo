import requests
from xml.etree import ElementTree as ET
from .config import groups_url, items_url_unformatted
skipped_databases = ['katrinpse', 'BakeOut2013', 'mos0']


def get_groups(user, password):
    response = requests.get(groups_url, auth=(user, password))
    return ET.fromstring(response.text)


def get_items(user, password, db_server, db_name, db_group):
    url = get_adei_item_url(db_server, db_name, db_group)
    response = requests.get(url, auth=(user, password))
    if not response.text:
        return []
    text = response.text.replace("&", "&#38;").replace(
        '"GO!"', '&quot;GO!&quot;')
    return ET.fromstring(text)


def get_item_record(db_server, db_name, db_group, chid, uid, name, axis):
    return {'db_group': db_group, 'db_name': db_name, 'db_server': db_server,
            'chid': chid, 'uid': uid, 'name': name, 'axis': axis, }


def get_adei_group_item_records(user, password, db_server, db_name, db_group):
    records = []
    items = get_items(user, password, db_server, db_name, db_group)

    for item in items:
        channel_id = item.attrib.get('value')
        uid = item.attrib.get('uid')
        name = item.attrib.get('name')
        axis = item.attrib.get('axis')
        if db_name not in skipped_databases:
            record = get_item_record(
                db_server, db_name, db_group, channel_id, uid, name, axis,)
            records.append(record)

    return records


def get_adei_channels(user, password, ):
    records = []
    groups = get_groups(user, password)
    for group in groups:
        db_server = group.attrib['db_server']
        db_name = group.attrib['db_name']
        if db_server in skipped_databases:
            continue
        db_group = group.attrib['db_group']
        group_records = get_adei_group_item_records(
            user, password, db_server, db_name, db_group)

        records = records + group_records
    return records


def get_adei_groups(user, password, ):
    records = []
    groups = get_groups(user, password)
    for group in groups:
        db_server = group.attrib['db_server']
        db_name = group.attrib['db_name']
        if db_name in skipped_databases:
            continue
        db_group = group.attrib['db_group']
        name = group.attrib['name']
        record = {'db_group': db_group, 'db_name': db_name,
                  'db_server': db_server, 'name': name, }
        records.append(record)
    return records


def get_adei_item_url(db_server, db_name, db_group):
    return items_url_unformatted % (db_server, db_name, db_group)
