from django.db import connection, models

class HostsProfiles(models.Model):
    hostid = models.BigIntegerField(primary_key = True)
    devicetype = models.CharField(max_length = 64)
    name = models.CharField(max_length = 64)
    os = models.CharField(max_length = 64)
    serialno = models.CharField(max_length = 64)
    tag = models.CharField(max_length = 64)
    macaddress = models.CharField(max_length = 64)
    hardware = models.TextField(max_length=50000, blank=True, null=True)
    software = models.TextField(max_length=50000, blank=True, null=True)
    contact = models.TextField(max_length=50000, blank=True, null=True)
    location = models.TextField(max_length=50000, blank=True, null=True)
    notes = models.TextField(max_length=50000, blank=True, null=True)

    class Meta:
        db_table = 'hosts_profiles'

    def __unicode__(self):
        return self.hostid

class HostsProfilesExt(models.Model):
    hostid = models.BigIntegerField(primary_key = True)
    device_alias = models.CharField(max_length = 64)
    device_type = models.CharField(max_length = 64)
    device_chassis = models.CharField(max_length = 64)
    device_os = models.CharField(max_length = 64)
    device_os_short = models.CharField(max_length = 64)
    device_hw_arch = models.CharField(max_length = 64)
    device_serial = models.CharField(max_length = 64)
    device_model = models.CharField(max_length = 64)
    device_tag = models.CharField(max_length = 64)
    device_vendor = models.CharField(max_length = 64)
    device_contract = models.CharField(max_length = 64)
    device_who = models.CharField(max_length = 64)
    device_status = models.CharField(max_length = 64)
    device_app_01 = models.CharField(max_length = 64)
    device_app_02 = models.CharField(max_length = 64)
    device_app_03 = models.CharField(max_length = 64)
    device_app_04 = models.CharField(max_length = 64)
    device_app_05 = models.CharField(max_length = 64)
    device_url_1 = models.CharField(max_length = 255)
    device_url_2 = models.CharField(max_length = 255)
    device_url_3 = models.CharField(max_length = 255)
    device_networks = models.TextField(max_length=50000, blank=True, null=True)
    device_notes = models.TextField(max_length=50000, blank=True, null=True)
    device_hardware = models.TextField(max_length=50000, blank=True, null=True)
    device_software = models.TextField(max_length=50000, blank=True, null=True)
    ip_subnet_mask = models.CharField(max_length = 39)
    ip_router = models.CharField(max_length = 39)
    ip_macaddress = models.CharField(max_length = 64)
    oob_ip = models.CharField(max_length = 39)
    oob_subnet_mask = models.CharField(max_length = 39)
    oob_router = models.CharField(max_length = 39)
    date_hw_buy = models.CharField(max_length = 64)
    date_hw_install = models.CharField(max_length = 64)
    date_hw_expiry = models.CharField(max_length = 64)
    date_hw_decomm = models.CharField(max_length = 64)
    site_street_1 = models.CharField(max_length = 128)
    site_street_2 = models.CharField(max_length = 128)
    site_street_3 = models.CharField(max_length = 128)
    site_city = models.CharField(max_length = 128)
    site_state = models.CharField(max_length = 64)
    site_country = models.CharField(max_length = 64)
    site_zip = models.CharField(max_length = 64)
    site_rack = models.CharField(max_length = 128)
    site_notes = models.TextField(max_length=50000, blank=True, null=True)
    poc_1_name = models.CharField(max_length = 128)
    poc_1_email = models.CharField(max_length = 128)
    poc_1_phone_1 = models.CharField(max_length = 64)
    poc_1_phone_2 = models.CharField(max_length = 64)
    poc_1_cell = models.CharField(max_length = 64)
    poc_1_screen = models.CharField(max_length = 64)
    poc_1_notes = models.TextField(max_length=50000, blank=True, null=True)
    poc_2_name = models.CharField(max_length = 128)
    poc_2_email = models.CharField(max_length = 128)
    poc_2_phone_1 = models.CharField(max_length = 64)
    poc_2_phone_2 = models.CharField(max_length = 64)
    poc_2_cell = models.CharField(max_length = 64)
    poc_2_screen = models.CharField(max_length = 64)
    poc_2_notes = models.TextField(max_length=50000, blank=True, null=True)

    class Meta:
        db_table = 'hosts_profiles_ext'

    def __unicode__(self):
        return self.hostid

class Host(models.Model):
    hostid = models.BigIntegerField(primary_key = True)
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
    hosts_profiles = models.OneToOneField(HostsProfiles, db_column = 'hostid', null = True)
    hosts_profiles_ext = models.OneToOneField(HostsProfilesExt, db_column = 'hostid', null = True)
    class Meta:
        db_table = 'hosts'

    def __unicode__(self):
        return self.host

class Group(models.Model):
    groupid = models.BigIntegerField(primary_key = True)
    internal = models.IntegerField()
    name = models.CharField(max_length = 64)
    hosts = models.ManyToManyField(Host, through = 'HostsGroups')

    class Meta:
        db_table = 'groups'

    def __unicode__(self):
        return self.name

class HostsGroups(models.Model):
    hostgroupid = models.BigIntegerField(primary_key = True)
    host = models.ForeignKey(Host, db_column = 'hostid')
    group = models.ForeignKey(Group, db_column = 'groupid')
    class Meta:
        db_table = 'hosts_groups'
        
class Item(models.Model):
    itemid = models.BigIntegerField(primary_key = True)
    type = models.IntegerField(default = 0)
    snmp_community = models.CharField(max_length = 64)
    snmp_oid = models.CharField(max_length = 255)
    snmp_port = models.IntegerField(default = 161)
    hostid = models.BigIntegerField()
    description = models.CharField(max_length = 255)
    key_ = models.CharField(max_length = 255)
    delay = models.IntegerField(default = 0)
    history = models.IntegerField(default = 90)
    trends = models.IntegerField(default = 356)
    lastvalue = models.CharField(max_length = 255, null = True)
    lastclock = models.CharField(max_length = 16, null = True)
    prevvalue = models.CharField(max_length = 255, null = True)
    status = models.IntegerField(default = 0)
    value_type = models.IntegerField(default = 0)
    trapper_hosts = models.CharField(max_length = 255)
    units = models.CharField(max_length = 10)
    multiplier = models.IntegerField(default = 0)
    delta = models.IntegerField(default = 0)
    prevorgvalue = models.CharField(max_length = 255, null = True)
    snmpv3_securityname = models.CharField(max_length = 64)
    snmpv3_securitylevel = models.IntegerField(default = 0)
    snmpv3_authpassphrase = models.CharField(max_length = 64)
    snmpv3_privpassphrase = models.CharField(max_length = 64)
    formula = models.CharField(max_length = 255, default = '1')
    error = models.CharField(max_length = 128)
    lastlogsize = models.IntegerField(default = 0)
    logtimefmt = models.CharField(max_length = 64)
    templateid = models.BigIntegerField()
    valuemapid = models.BigIntegerField()
    delay_flex = models.CharField(max_length = 255)
    params = models.TextField(max_length=50000, blank=True, null=True)
    ipmi_sensor = models.CharField(max_length = 128)
    data_type = models.IntegerField(default = 0)
    authtype = models.IntegerField(default = 0)
    username = models.CharField(max_length = 64)
    password = models.CharField(max_length = 64)
    publickey = models.CharField(max_length = 64)
    privatekey = models.CharField(max_length = 64)
    mtime = models.IntegerField(default = 0)
    host = models.OneToOneField(Host, db_column = 'hostid', null = True)

    class Meta:
        db_table = 'items'

class ItemHistorytManager(models.Manager):
    def items_history(self, dbname, query_filter, sort):
        ItemHistory._meta.db_table = dbname
        queryset = ItemHistory.objects.filter(query_filter).order_by(sort)
        return queryset
        
class ItemHistory(models.Model):
    itemid = models.BigIntegerField(primary_key = True)
    clock = models.CharField(max_length = 16)
    value = models.CharField(max_length = 255)
    item_history_objects = ItemHistorytManager()
    objects = models.Manager()
    
    class Meta:
        db_table = 'history'
        
class Trigger(models.Model):
    triggerid = models.BigIntegerField(primary_key = True)
    lastchange = models.IntegerField(default = 0)
    class Meta:
        db_table = 'triggers'

class EventManager(models.Manager):
    def current_events(self):
        cursor = connection.cursor()
        cursor.execute("""
            select a.eventid from events_view a, triggers t where a.value=1 and a.tr_status=0 and a.triggerid=t.triggerid and a.clock = t.lastchange;""")
        row = [row[0] for row in cursor.fetchall()]
        queryset = Event.objects.filter(pk__in = row)
        return queryset
    
    def events_statistics_count(self, from_date, end_date):
        cursor = connection.cursor()
        cursor.execute("""
            select HOUR(FROM_UNIXTIME(clock)) AS h, FLOOR(MINUTE(FROM_UNIXTIME(clock)) / 60) AS v, COUNT(*) as count from events_view where clock>%s and clock<%s group by h, v;""", [from_date, end_date])
        events_statistics = []
        
        for row in cursor.fetchall():
            events_statistic = {}
            events_statistic['hour'] = row[0]
            events_statistic['count'] = row[2]
            events_statistics.append(events_statistic)
        return events_statistics
    
    def events_statistics_priority(self, from_date, end_date):
        cursor = connection.cursor()
        cursor.execute("""
            select priority, count(*) as count from events_view where clock>%s and clock<%s group by priority;""", [from_date, end_date])
        events_statistics = []
        
        for row in cursor.fetchall():
            events_statistic = {}
            events_statistic['priority'] = row[0]
            events_statistic['count'] = row[1]
            events_statistics.append(events_statistic)
        return events_statistics
        
class Event(models.Model):
    eventid = models.BigIntegerField(primary_key = True)
    clock = models.CharField(max_length = 16)
    status = models.CharField(max_length = 16)
    priority = models.IntegerField(default = 0)
    information = models.CharField(max_length = 255)
    during_clock = models.IntegerField(default = 0)
    acknowledged = models.IntegerField(default = 0)
    tr_status = models.IntegerField(default = 0)
    value = models.IntegerField(default = 0)
    #trigger = models.ForeignKey(Trigger, db_column = 'triggerid', null = True, blank=True)
    triggerid = models.BigIntegerField()
    hostid = models.BigIntegerField()
    item = models.OneToOneField(Item, db_column = 'itemid', null = True)
    # host = models.OneToOneField(Host, db_column = 'hostid', null = True)
    event_objects = EventManager()
    objects = models.Manager()
    class Meta:
        db_table = 'events_view'

class Application(models.Model):
    applicationid = models.BigIntegerField(primary_key = True)
    name = models.CharField(max_length = 255)
    templateid = models.BigIntegerField()
    hostid = models.BigIntegerField()
    items = models.ManyToManyField(Item, through = 'ItemsApplications')
    # host = models.OneToOneField(Host, db_column = 'hostid', null = True)
    class Meta:
        db_table = 'applications'

class ItemsApplications(models.Model):
    itemappid = models.BigIntegerField(primary_key = True)
    app = models.ForeignKey(Application, db_column = 'applicationid')
    item = models.ForeignKey(Item, db_column = 'itemid')
    class Meta:
        db_table = 'items_applications'
        
class Classification(models.Model):
    classificationid = models.BigIntegerField(primary_key = True)
    name = models.CharField(max_length = 255)
    groups = models.ManyToManyField(Group, through = 'GroupsClassifications')
    class Meta:
        db_table = 'classifications'
        
class GroupsClassifications(models.Model):
    id = models.BigIntegerField(primary_key = True)
    classification = models.ForeignKey(Classification, db_column = 'classificationid')
    group = models.ForeignKey(Group, db_column = 'groupid')
    class Meta:
        db_table = 'groups_classifications'

class Favourite(models.Model):
    id = models.BigIntegerField(primary_key = True)
    userid = models.BigIntegerField()
    hostid = models.BigIntegerField()
    status = models.IntegerField()
    # host = models.ForeignKey(Host, db_column = 'hostid')
    class Meta:
        db_table = 'favourites'