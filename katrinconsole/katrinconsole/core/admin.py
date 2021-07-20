from katrinconsole.core.models import Bora
from django.contrib import admin


class BoraAdmin(admin.ModelAdmin):
    list_display = ('key', 'title', 'source', )


admin.site.register(Bora, BoraAdmin)
