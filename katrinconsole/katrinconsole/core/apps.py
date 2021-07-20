from django.apps import AppConfig
from .tasks import load_adei_channels, load_adei_groups, load_control_legacy

import sys

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'katrinconsole.core'

    def ready(self) -> None:
        if 'katrinconsole.wsgi' in sys.argv or 'runserver' in sys.argv:
            try:
                with load_control_legacy.app.pool.acquire(block=True) as connection:
                    load_control_legacy.apply_async(connection=connection)
                    load_adei_groups.apply_async(connection=connection)
                    load_adei_channels.apply_async(connection=connection)
            except Exception as e:
                print('no broker', e)
