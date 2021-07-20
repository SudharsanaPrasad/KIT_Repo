from django.db import models


class Bora(models.Model):
    key = models.CharField(max_length=100, unique=True, null=False)
    title = models.CharField(max_length=100, null=False)
    source = models.CharField(max_length=2048, null=False)

    def __str__(self) -> str:
        return self.key


class AdeiChannel(models.Model):
    db_server = models.CharField(max_length=100,)
    db_name = models.CharField(max_length=100,)
    db_group = models.CharField(max_length=100,)
    chid = models.CharField(max_length=100, null=True)
    uid = models.CharField(max_length=100, null=True,)
    name = models.CharField(max_length=200, null=True,)
    axis = models.CharField(max_length=100, null=True,)


class AdeiGroup(models.Model):
    db_server = models.CharField(max_length=100,)
    db_name = models.CharField(max_length=100,)
    db_group = models.CharField(max_length=100,)
    name = models.CharField(max_length=100,)


class LegacyControlIdMappings(models.Model):
    uuid = models.UUIDField(primary_key=True,)
    adei_path = models.CharField(max_length=100,)
    katrin_id = models.CharField(max_length=50, null=True,)


class LegacyControlBlockInfo(models.Model):
    db_server = models.CharField(max_length=100)
    block_id = models.CharField(max_length=100)
    group_name = models.CharField(max_length=100)


class LegacyControlItem(models.Model):
    server = models.CharField(max_length=100)
    db_server = models.CharField(max_length=100)
    db_name = models.CharField(max_length=100)
    cgroup_db_group = models.CharField(max_length=100)
    cgroup_name = models.CharField(max_length=100)
    uid = models.CharField(max_length=100, null=True)
    block_id = models.CharField(max_length=50, null=True)
    block_name = models.CharField(max_length=200, null=True)
    axis = models.CharField(max_length=100, null=True)
    name = models.CharField(max_length=300, null=True)
    read = models.CharField(max_length=20, null=True)
    write = models.CharField(max_length=20, null=True)
    value = models.CharField(max_length=100)
