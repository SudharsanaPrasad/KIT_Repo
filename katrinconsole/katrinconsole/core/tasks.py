from celery import shared_task
from django.conf import settings
from django.db import transaction
from katrinconsole.lib.adei import get_adei_channels, get_adei_groups
from katrinconsole.lib.adei.hardware import (get_cgroups_of, get_controls, get_adei_source_groups,
                                             get_adei_source_items, get_sources)


@shared_task(name='core.load_adei_groups', ignore_result=True,)
def load_adei_groups():
    from .models import AdeiGroup
    grps = get_adei_groups(settings.ADEI_USERNAME, settings.ADEI_PASSWORD)
    if grps and len(grps) != 0:
        with transaction.atomic():
            AdeiGroup.objects.all().delete()
            AdeiGroup.objects.bulk_create(list(
                map(lambda g: AdeiGroup(**g), grps)))


@shared_task(name='core.load_adei_channels', ignore_result=True,)
def load_adei_channels():
    from .models import AdeiChannel
    chnnls = get_adei_channels(
        settings.ADEI_USERNAME, settings.ADEI_PASSWORD)
    if chnnls and len(chnnls) != 0:
        with transaction.atomic():
            AdeiChannel.objects.all().delete()
            AdeiChannel.objects.bulk_create(list(
                map(lambda c: AdeiChannel(**c), chnnls)))


@shared_task(name='core.load_control_legacy')
def load_control_legacy():
    from .models import LegacyControlBlockInfo, LegacyControlItem
    SPLIT_KEYWORDS = ['main', 'secondary', 'crio', 'epc']

    def _get_adei_groups(user, password, server, db_name,):
        groups = get_adei_source_groups(user, password, server, db_name)
        return {group['db_group']: group for group in groups}

    sources = get_sources(settings.ADEI_USERNAME, settings.ADEI_PASSWORD,)

    for source in sources:
        db_server = source['db_server']
        db_name = source['db_name']
        cgroups = get_cgroups_of(
            settings.ADEI_USERNAME, settings.ADEI_PASSWORD,
            db_server, db_name)
        source_groups = _get_adei_groups(
            settings.ADEI_USERNAME, settings.ADEI_PASSWORD,
            db_server, db_name)

        for db_group, group in source_groups.items():
            group_items = get_adei_source_items(
                settings.ADEI_USERNAME, settings.ADEI_PASSWORD,
                db_server, db_name, db_group)
            if group_items and len(group_items) != 0:
                with transaction.atomic():
                    LegacyControlBlockInfo.objects.filter(
                        group_name=group['name'], ).delete()
                    values = []
                    for item in group_items:
                        blockid = item.get('block_id')
                        if not blockid:
                            continue
                        info = LegacyControlBlockInfo(
                            db_server=db_server, block_id=blockid, group_name=group['name'])
                        values.append(info)

                    LegacyControlBlockInfo.objects.bulk_create(values)

        for cgroup in cgroups:
            name = cgroup['name'].lower() if cgroup['name'] else None

            if not name:
                continue

            if 'ist' not in name and 'soll' not in name:
                continue

            split_keywords_matches = [
                keyword for keyword in SPLIT_KEYWORDS if keyword in name]

            server = db_server + ' - ' + \
                split_keywords_matches[0] if len(
                    split_keywords_matches) != 0 else db_server

            controls = get_controls(settings.ADEI_USERNAME, settings.ADEI_PASSWORD,
                                    db_server, db_name, cgroup['db_group'])

            if controls and len(controls) != 0:
                with transaction.atomic():
                    LegacyControlItem.objects.filter(
                        server=server, cgroup_db_group=cgroup['db_group'],).delete()
                    LegacyControlItem.objects.bulk_create(list(
                        map(lambda c: LegacyControlItem(server=server, db_server=db_server,
                                                        db_name=db_name, cgroup_db_group=cgroup['db_group'],
                                                        cgroup_name=cgroup['name'], uid=c['uid'],
                                                        block_id=c.get('block_id', 'opcua').replace('&amp;', '&'), axis=c['axis'],
                                                        name=c['name'], block_name=c['block_name'],
                                                        read=c['read'], write=c['write'], value=c['value']), controls)))
