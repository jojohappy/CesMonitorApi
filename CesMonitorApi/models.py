from django.db import models

class Host(models.Model):
    hostid = models.IntegerField(primary_key = True)
    proxy_hostid = models.IntegerField()
    host = models.CharField(max_length = 64)
    dns = models.CharField(max_length = 64)
    useip = models.IntegerField()
    ip = models.CharField(max_length = 64)
    port = models.IntegerField()
    status = models.IntegerField()
    disable_until = models.IntegerField()
    error = models.CharField(max_length = 64)
    available = models.IntegerField()
    errors_from = models.IntegerField()
    lastaccess = models.IntegerField()
    inbytes = models.IntegerField()
    outbytes = models.IntegerField()
    useipmi = models.IntegerField()
    ipmi_port = models.IntegerField()
    ipmi_authtype = models.IntegerField()
    ipmi_privilege = models.IntegerField()
    ipmi_username = models.CharField(max_length = 64)
    ipmi_password = models.CharField(max_length = 64)
    ipmi_disable_until = models.CharField(max_length = 64)
    ipmi_available = models.IntegerField()
    snmp_disable_until = models.IntegerField()
    snmp_available = models.IntegerField()
    maintenanceid = models.IntegerField()
    maintenance_status = models.IntegerField()
    maintenance_type = models.IntegerField()
    maintenance_from = models.IntegerField()
    ipmi_ip = models.CharField(max_length = 64)
    ipmi_errors_from = models.IntegerField()
    ipmi_error = models.CharField(max_length = 64)
    ssh_available = models.IntegerField()
    ssh_disable_until = models.IntegerField()
    ssh_errors_from = models.IntegerField()
    ssh_error = models.CharField(max_length = 64)
    snmp_errors_from = models.IntegerField()
    snmp_error = models.CharField(max_length = 64)

    class Meta:
        db_table = 'hosts'

    def __unicode__(self):
        return self.name

class Group(models.Model):
    groupid = models.IntegerField(primary_key = True)
    internal = models.IntegerField()
    name = models.CharField(max_length = 64)
    hosts = models.ManyToManyField(Host, through = 'hosts_groups')

    class Meta:
        db_table = 'groups'

    def __unicode__(self):
        return self.name

class hosts_groups(models.Model):
    hostgroupid = models.IntegerField(primary_key = True)
    host = models.ForeignKey(Host, related_name = 'hostid')
    group = models.ForeignKey(Group, related_name = 'groupid')
    class Meta:
		db_table = 'hosts_groups'

