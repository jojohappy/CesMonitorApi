# coding=utf-8
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import datetime
import time
import traceback,math
from tastypie import fields, http
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash, dict_strip_unicode_keys
from tastypie.constants import ALL
from tastypie.authorization import Authorization
from django.conf.urls import url
from django.core.paginator import Paginator, InvalidPage
from django.http import Http404
from django.db.models import Q
from CesMonitorApi.models import *
from CesMonitorApi.utils import *

class GroupsResource(ModelResource):
    hosts = fields.OneToManyField('CesMonitorApi.api.HostsResource', 'hosts', full = True, null = True)
    class Meta:
        queryset = Group.objects.exclude(name='Templates')
        resource_name = 'groups'
        collection_name = 'hostsgroups'
        excludes = ['internal']
        include_resource_uri = False
        max_limit = None

    def determine_format(self, request):
        return "application/json"

    def dehydrate(self, bundle):
        try:
            hosts = bundle.data['hosts']
            e_num = 0
            for host in hosts:
                if len(host.data['events']) > 0:
                    e_num += 1
            bundle.data['e_num'] = e_num
        except :
            traceback.print_exc()
            pass
        return bundle

class HostsResource(ModelResource):
    hostsProfiles = fields.OneToOneField('CesMonitorApi.api.HostsProfilesResource', 'hosts_profiles', full = True, null = True)
    hostsProfilesExt = fields.OneToOneField('CesMonitorApi.api.HostsProfilesExtResource', 'hosts_profiles_ext', full = True, null = True)
    class Meta:
        queryset = Host.objects.filter(status__in = [1, 0])
        resource_name = 'hosts'
        collection_name = 'hosts'
        excludes = []
        include_resource_uri = False
        max_limit = None
        
    def determine_format(self, request):
        return "application/json"
        
    def dehydrate(self, bundle):
        hostid_f = int(bundle.data['hostid'])
        query_filter = Q(hostid=hostid_f)
        query_set = Event.event_objects.current_events().filter(query_filter)
        events = []
        event_resource = EventsResource()
        for event in query_set:
            event.item = None
            event_bundle = event_resource.build_bundle(obj=event, request=bundle.request)
            events.append(event_resource.full_dehydrate(event_bundle, for_list=False))
        bundle.data['events'] = events
        #request.session['userid']
        userid = 1
        query_filter_favourite = Q(userid=userid)
        query_filter_favourite.add(Q(hostid=hostid_f), query_filter_favourite.connector)
        query_favourite_set = Favourite.objects.all().filter(query_filter_favourite)
        if query_favourite_set.count() == 0:
            bundle.data['favourite'] = None
        elif query_favourite_set.first().status == 0:
            bundle.data['favourite'] = None
        else:
            favourite_resource = FavouritesResource()
            favourite_bundle = favourite_resource.build_bundle(obj=query_favourite_set.first(), request=bundle.request)
            favourite_bundle = favourite_resource.full_dehydrate(favourite_bundle)
            favourite_bundle = favourite_resource.alter_detail_data_to_serialize(bundle.request, favourite_bundle)
            bundle.data['favourite'] = favourite_bundle
            
        return bundle

class HostsProfilesResource(ModelResource):
    class Meta:
        queryset = HostsProfiles.objects.all()
        resource_name = 'hosts_profiles'
        collection_name = 'hosts_profiles'
        excludes = []
        include_resource_uri = False

    def determine_format(self, request):
        return "application/json"

class HostsProfilesExtResource(ModelResource):
    class Meta:
        queryset = HostsProfilesExt.objects.all()
        resource_name = 'hosts_profiles_ext'
        collection_name = 'hosts_profiles_ext'
        excludes = []
        include_resource_uri = False

    def determine_format(self, request):
        return "application/json"

class ItemsResource(ModelResource):
    # host = fields.OneToOneField('CesMonitorApi.api.HostsResource', 'host', full = True, null = True)
    class Meta:
        queryset = Item.objects.all()
        resource_name = 'items'
        collection_name = 'items'
        excludes = []
        include_resource_uri = False
        max_limit = None
    
    def determine_format(self, request):
        return "application/json"

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/host/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_host_items'), name="api_dispatch_detail_host"),
            url(r"^(?P<resource_name>%s)/event/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_event_item'), name="api_dispatch_detail_event"),
            url(r"^(?P<resource_name>%s)/history/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_history_item'), name="api_dispatch_detail_history"),
        ]
        
    def get_host_items(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)
        base_bundle = self.build_bundle(request=request)
        reverse = int(request.GET.get('reverse', 0))
        sort = request.GET.get('sort', 'itemid')
        if reverse == 1:
            sort = "-" + sort
        
        objects = self.get_object_list(request).filter(hostid = kwargs['pk']).order_by(sort)
        sorted_objects = self.apply_sorting(objects, options=request.GET)
        paginator = self._meta.paginator_class(request.GET, sorted_objects, resource_uri=self.get_resource_uri(), limit=request.GET.get('limit', 50), max_limit=self._meta.max_limit, collection_name=self._meta.collection_name)
        to_be_serialized = paginator.page()

        bundles = []

        for obj in to_be_serialized[self._meta.collection_name]:
            bundle = self.build_bundle(obj=obj, request=request)
            bundles.append(self.full_dehydrate(bundle, for_list=True))

        to_be_serialized[self._meta.collection_name] = bundles
        to_be_serialized = self.alter_list_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)

    def get_history_item(self, request, **kwargs):
        limit = request.GET.get('limit', 50)
        sort = request.GET.get('sort', '-clock')
        reverse = int(request.GET.get('reverse', 0))
        if reverse == 1:
            sort = "-" + sort
        fromdate = request.GET.get('from_date', '')
        enddate = request.GET.get('end_date', '')

        basic_bundle = self.build_bundle(request=request)
        try:
            obj = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(kwargs))
        except ObjectDoesNotExist:
            return http.HttpNotFound()
        except MultipleObjectsReturned:
            return http.HttpMultipleChoices("More than one resource is found at this URI.")
        bundle = self.build_bundle(obj=obj, request=request)
        bundle = self.full_dehydrate(bundle)
        bundle = self.alter_detail_data_to_serialize(request, bundle)
        
        value_type = int(bundle.data['value_type'])
        if value_type == 0:
            dbname = 'history'
        elif value_type == 1:
            dbname = 'history_str'
        else:
            dbname = 'history_uint'
        fromdate_clock = 0
        enddate_clock = 0
        try:
            if fromdate != '':
                time_f = datetime.datetime.strptime(fromdate, '%Y-%m-%d %H:%M:%S').timetuple()
                fromdate_clock = int(time.mktime(time_f))
            if enddate != '':
                time_e = datetime.datetime.strptime(enddate, '%Y-%m-%d %H:%M:%S').timetuple()
                enddate_clock = int(time.mktime(time_e))
        except :
            raise BadRequest("Could not convert string to date.")
        
        query_filter = Q(itemid=bundle.data['itemid'])
        
        if fromdate_clock != 0:
            query_filter.add(Q(clock__gte=fromdate_clock), query_filter.connector)
        if enddate_clock != 0:
            query_filter.add(Q(clock__lte=enddate_clock), query_filter.connector)
        
        
        query_item_history_set = ItemHistory.item_history_objects.items_history(dbname, query_filter, sort)
        item_history_resource = ItemHistoryResource()
        paginator = item_history_resource._meta.paginator_class(request.GET, query_item_history_set, resource_uri=item_history_resource.get_resource_uri(), limit=limit, max_limit=item_history_resource._meta.max_limit, collection_name=item_history_resource._meta.collection_name)
        to_be_serialized = paginator.page()
        history_bundles = []

        for obj in to_be_serialized[item_history_resource._meta.collection_name]:
            history_bundle = item_history_resource.build_bundle(obj=obj, request=request)
            history_bundles.append(item_history_resource.full_dehydrate(history_bundle, for_list=True))

        to_be_serialized[item_history_resource._meta.collection_name] = history_bundles
        to_be_serialized['item'] = bundle  
        to_be_serialized = self.alter_detail_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)
        
    def get_event_item(self, request, **kwargs):
        event_resource = EventsResource()
        basic_event_bundle = event_resource.build_bundle(request=request)
        try:
            event_obj = event_resource.cached_obj_get(bundle=basic_event_bundle, **event_resource.remove_api_resource_names(kwargs))
        except ObjectDoesNotExist:
            return http.HttpNotFound()
        except MultipleObjectsReturned:
            return http.HttpMultipleChoices("More than one resource is found at this URI.")

        event_bundle = event_resource.build_bundle(obj=event_obj, request=request)
        event_bundle = event_resource.full_dehydrate(event_bundle)
        event_bundle = event_resource.alter_detail_data_to_serialize(request, event_bundle)
    
        to_be_serialized = {
            'event': event_bundle
        }
        itemid = event_bundle.data['itemid']
        item_obj = Item.objects.get(itemid=itemid)
        item_resource = ItemsResource()
        item_bundle = item_resource.build_bundle(obj=item_obj, request=request)
        item = item_resource.full_dehydrate(item_bundle, for_list=False)
        #item_obj = event_bundle.data['items']
        to_be_serialized['item'] = item
        #event_bundle.data['items'] = None
        to_be_serialized = self.alter_detail_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)
    
    def dehydrate(self, bundle):
        try:
            lastvalue = bundle.data['lastvalue']
            prevvalue = bundle.data['prevvalue']
            if (int(bundle.data['value_type']) == 0 or int(bundle.data['value_type']) == 3) and lastvalue != "" and prevvalue != "" and lastvalue != None and prevvalue != None:
                change_value = float(lastvalue)-float(prevvalue)
                if change_value >= 0:
                    change_value_str = '▲'
                else:
                    change_value_str = '▼'
                bundle.data['change_value'] = "%s%s" % (change_value_str, format_lastvalue(lastvalue=abs(change_value), itemunits=bundle.data['units'],value_type=bundle.data['value_type'], valuemapid=bundle.data['valuemapid']))
            else:
                bundle.data['change_value'] = '-'
            bundle.data['lastclock'] = convert_int_to_datetime(origin_datetime=int(bundle.data['lastclock']))
            bundle.data['lastvalue'] = format_lastvalue(lastvalue=bundle.data['lastvalue'], itemunits=bundle.data['units'],value_type=bundle.data['value_type'], valuemapid=bundle.data['valuemapid'])
            if bundle.data['lastvalue'] == None:
                bundle.data['lastvalue'] = '-'
            if bundle.data['lastclock'] == None:
                bundle.data['lastclock'] = '-'
        except:
            bundle.data['lastvalue'] = '-'
            if bundle.data['lastclock'] == None:
                bundle.data['lastclock'] = '-'
            else:
                bundle.data['lastclock'] = convert_int_to_datetime(origin_datetime=int(bundle.data['lastclock']))
            pass
        return bundle
        
class ItemHistoryResource(ModelResource):
    class Meta:
        queryset = ItemHistory.objects.all()
        resource_name = 'item_historys'
        collection_name = 'item_historys'
        excludes = []
        include_resource_uri = False
        max_limit = None
    
    def dehydrate(self, bundle):
        bundle.data['clock'] = convert_int_to_datetime(origin_datetime=int(bundle.data['clock']))
        return bundle
    
    def determine_format(self, request):
        return "application/json"
        
class EventsResource(ModelResource):
    # host = fields.OneToOneField('CesMonitorApi.api.HostsResource', 'host', full = True, null = True)
    # items = fields.OneToOneField('CesMonitorApi.api.ItemsResource', 'item', full = True, null = True)
    class Meta:
        queryset = Event.objects.all()
        resource_name = 'events'
        collection_name = 'events'
        excludes = []
        include_resource_uri = False
        max_limit = None
        filtering = {
            "acknowledged": ALL,
            "hostid": ALL
        }
    
    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/history%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('get_list'), name="api_dispatch_list_history_event"),
        ]
    
    def get_list(self, request, **kwargs):
        hostid_f = int(request.GET.get('hostid', -1))
        reverse = int(request.GET.get('reverse', 0))
        sort = request.GET.get('sort', 'eventid')
        fromdate = request.GET.get('from_date', '')
        enddate = request.GET.get('end_date', '')
        event_content = request.GET.get('event_content', '')
        event_priority = int(request.GET.get('event_priority', -1))
        acknowledged_f = int(request.GET.get('acknowledged', -1))
        
        if reverse == 1:
            sort = "-" + sort
        
        fromdate_clock = 0
        enddate_clock = 0
        try:
            if fromdate != '':
                time_f = datetime.datetime.strptime(fromdate, '%Y-%m-%d %H:%M:%S').timetuple()
                fromdate_clock = int(time.mktime(time_f))
            if enddate != '':
                time_e = datetime.datetime.strptime(enddate, '%Y-%m-%d %H:%M:%S').timetuple()
                enddate_clock = int(time.mktime(time_e))
        except :
            raise BadRequest("Could not convert string to date.")
        
        query_filter = Q(information__contains=event_content)
        
        if fromdate_clock != 0:
            query_filter.add(Q(clock__gte=fromdate_clock), query_filter.connector)
        if enddate_clock != 0:
            query_filter.add(Q(clock__lte=enddate_clock), query_filter.connector)
        if hostid_f != -1:
            query_filter.add(Q(hostid=hostid_f), query_filter.connector)
        if event_priority != -1:
            query_filter.add(Q(priority=event_priority), query_filter.connector)
        if acknowledged_f != -1:
            query_filter.add(Q(acknowledged=acknowledged_f), query_filter.connector)
        
        base_bundle = self.build_bundle(request=request)
        objects = self.obj_get_list(bundle=base_bundle, **self.remove_api_resource_names(kwargs)).filter(query_filter).order_by(sort)
        sorted_objects = self.apply_sorting(objects, options=request.GET)
        
        paginator = self._meta.paginator_class(request.GET, sorted_objects, resource_uri=self.get_resource_uri(), limit=request.GET.get('limit', 50), max_limit=self._meta.max_limit, collection_name=self._meta.collection_name)
        to_be_serialized = paginator.page()

        bundles = []

        for obj in to_be_serialized[self._meta.collection_name]:
            bundle = self.build_bundle(obj=obj, request=request)
            bundles.append(self.full_dehydrate(bundle, for_list=True))
        
        to_be_serialized[self._meta.collection_name] = bundles
        to_be_serialized = self.alter_list_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)
    
    def get_object_list(self, request):
        full_path = request.get_full_path()
        if 0 < full_path.find('history'):
            return self._meta.queryset._clone()
        return Event.event_objects.current_events()._clone()
        
    def dehydrate(self, bundle):
        try:
            bundle.data['clock'] = convert_int_to_datetime(origin_datetime=int(bundle.data['clock']))
            #event_hostid = bundle.data['hostid']
            #event_host = Host.objects.get(hostid=event_hostid)
            #bundle.data['host'] = event_host.host
            during_clock = int(bundle.data['during_clock'])
            during_day = int(during_clock / 86400)
            during_clock = during_clock % 86400
            during_hour = int(during_clock / 3600)
            during_clock = during_clock % 3600
            during_min = int(during_clock / 60)
            during_clock = during_clock % 60
            unicode_string_day = unicode("天",'utf-8')
            unicode_string_hour = unicode("小时",'utf-8')
            unicode_string_minute = unicode("分",'utf-8')
            unicode_string_second = unicode("秒",'utf-8')
            during_clock_str = str(during_day) + unicode_string_day + str(during_hour) + unicode_string_hour + str(during_min) + unicode_string_minute + str(during_clock) + unicode_string_second
            unicode_string = during_clock_str.encode('utf-8')
            bundle.data['during_clock'] = unicode_string
        except :
            pass
        return bundle
        
    def determine_format(self, request):
        return "application/json"
        
    def get_list4dashboard(self, request, **kwargs):
        reverse = int(request.GET.get('reverse', 0))
        sort = request.GET.get('sort', 'eventid')
        
        if reverse == 1:
            sort = "-" + sort
        
        base_bundle = self.build_bundle(request=request)
        objects = self.obj_get_list(bundle=base_bundle, **self.remove_api_resource_names(kwargs)).order_by(sort)
        sorted_objects = self.apply_sorting(objects, options=request.GET)
        
        paginator = self._meta.paginator_class(request.GET, sorted_objects, resource_uri=self.get_resource_uri(), limit=None, max_limit=self._meta.max_limit, collection_name=self._meta.collection_name)
        to_be_serialized = paginator.page()

        bundles = []

        for obj in to_be_serialized[self._meta.collection_name]:
            bundle = self.build_bundle(obj=obj, request=request)
            bundles.append(self.full_dehydrate(bundle, for_list=True))

        to_be_serialized[self._meta.collection_name] = bundles
        to_be_serialized = self.alter_list_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)
        
class ApplicationsResource(ModelResource):
    items = fields.OneToManyField('CesMonitorApi.api.ItemsResource', 'items', full = True, null = True)
    # host = fields.OneToOneField('CesMonitorApi.api.HostsResource', 'host', full = True, null = True)
    class Meta:
        queryset = Application.objects.exclude(templateid = 0)
        resource_name = 'apps'
        collection_name = 'apps'
        excludes = []
        include_resource_uri = False
        max_limit = None
    
    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/host/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_host_apps'), name="api_dispatch_detail_host"),
        ]
    
    def get_host_apps(self, request, **kwargs):
        base_bundle = self.build_bundle(request=request)
        objects = self.obj_get_list(bundle=base_bundle, **self.remove_api_resource_names(kwargs)).filter(hostid = kwargs['pk'])
        sorted_objects = self.apply_sorting(objects, options=request.GET)
        
        to_be_serialized = {
            self._meta.collection_name: sorted_objects
        }
        
        bundles = []

        for obj in to_be_serialized[self._meta.collection_name]:
            bundle = self.build_bundle(obj=obj, request=request)
            bundles.append(self.full_dehydrate(bundle, for_list=True))

        to_be_serialized[self._meta.collection_name] = bundles
        to_be_serialized = self.alter_list_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)
    
    def determine_format(self, request):
        return "application/json"
        
class ClassificationsResource(ModelResource):
    groups = fields.OneToManyField('CesMonitorApi.api.GroupsResource', 'groups', full = True, null = True)
    class Meta:
        queryset = Classification.objects.all()
        resource_name = 'classifications'
        collection_name = 'groupsclassifications'
        excludes = []
        include_resource_uri = False
        max_limit = None

    def determine_format(self, request):
        return "application/json"

    def dehydrate(self, bundle):
        try:
            groups = bundle.data['groups']
            e_num = 0
            for group in groups:
                e_num += group.data['e_num']
            bundle.data['e_num'] = e_num
        except :
            pass
        return bundle

class FavouritesResource(ModelResource):
    # host = fields.OneToOneField('CesMonitorApi.api.HostsResource', 'hosts', full = True, null = True)
    class Meta:
        queryset = Favourite.objects.all()
        resource_name = 'favourites'
        collection_name = 'favourites'
        excludes = []
        include_resource_uri = False
        max_limit = None
        authorization= Authorization()
        filtering = {
            "hostid": ALL,
            "userid": ALL
        }
        # always_return_data = True
        
    def determine_format(self, request):
        return "application/json"
        
    def post_list(self, request, **kwargs):
        deserialized = self.deserialize(request, request.body, format=request.META.get('CONTENT_TYPE', 'application/json'))
        deserialized = self.alter_deserialized_detail_data(request, deserialized)
        bundle = self.build_bundle(data=dict_strip_unicode_keys(deserialized), request=request)
        # bundle.data['userid'] = request.session['userid'];
        bundle.data['userid'] = 1;
        bundle.data['status'] = 1;
        updated_bundle = self.obj_create(bundle, **self.remove_api_resource_names(kwargs))
        location = self.get_resource_uri(updated_bundle)

        if not self._meta.always_return_data:
            return http.HttpCreated(location=location)
        else:
            updated_bundle = self.full_dehydrate(updated_bundle)
            updated_bundle = self.alter_detail_data_to_serialize(request, updated_bundle)
            return self.create_response(request, updated_bundle, response_class=http.HttpCreated, location=location)
    
    def obj_delete_list(self, bundle, **kwargs):
        # userid = request.session['userid'];
        userid = 1
        objects_to_delete = self.obj_get_list(bundle=bundle, **kwargs).filter(userid=userid)
        deletable_objects = self.authorized_delete_list(objects_to_delete, bundle)

        if hasattr(deletable_objects, 'delete'):
            # It's likely a ``QuerySet``. Call ``.delete()`` for efficiency.
            deletable_objects.delete()
        else:
            for authed_obj in deletable_objects:
                authed_obj.delete()

class GraphsResource(ModelResource):
    class Meta:
        queryset = Graphs.objects.all()
        resource_name = 'graphs'
        collection_name = 'graphs'
        excludes = []
        include_resource_uri = False
        max_limit = None
        filtering = {
            "hostid": ALL
        }

    def determine_format(self, request):
        return "application/json"

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/host/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_host_graphs'), name="api_dispatch_detail_graphs_host"),
            url(r"^(?P<resource_name>%s)/item/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_item_graphs'), name="api_dispatch_detail_graphs_item"),
        ]

    def get_host_graphs(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)
        base_bundle = self.build_bundle(request=request)
        
        # objects = self.get_object_list(request).filter(hostid = kwargs['pk']).order_by(sort)
        objects = Graphs.graphs_objects.list_graphs(kwargs['pk'])._clone()
        sorted_objects = self.apply_sorting(objects, options=request.GET)
        paginator = self._meta.paginator_class(request.GET, sorted_objects, resource_uri=self.get_resource_uri(), limit=request.GET.get('limit', 0), max_limit=self._meta.max_limit, collection_name=self._meta.collection_name)
        to_be_serialized = paginator.page()

        bundles = []

        for obj in to_be_serialized[self._meta.collection_name]:
            bundle = self.build_bundle(obj=obj, request=request)
            bundles.append(self.full_dehydrate(bundle, for_list=True))

        to_be_serialized[self._meta.collection_name] = bundles
        to_be_serialized = self.alter_list_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)

    def get_detail(self, request, **kwargs):
        list_graphs_data = []
        list_graphs_value = []
        graphid = kwargs['pk']
        graphs = Graphs.objects.get(graphid=graphid)
        date_type = request.GET.get('date_type', 0)
        if date_type == 0:
            timeLimit = 60
            timeGap = 3600
        elif date_type == 1:
            timeLimit = 60
            timeGap = 86400
        elif date_type == 2:
            timeLimit = 200
            timeGap = 604800
        elif date_type == 3:
            timeLimit = 200
            timeGap = 2592000
        multipTime = timeGap / timeLimit
        enddate_clock = int(time.time())
        fromdate_clock = enddate_clock - timeGap
        g_type = timeGap - (fromdate_clock % timeGap)
        graphs_items = Graphs.graphs_objects.list_graphs_items(graphid)
        drawType = []
        itemsunits = []
        itemsName = []
        graphColor = []
        count =  [[0 for col in range(int(timeLimit))] for row in range(len(graphs_items))]
        historyValue =  [[0 for col in range(int(timeLimit))] for row in range(len(graphs_items))]
        unitsValue =  [[0 for col in range(int(timeLimit))] for row in range(len(graphs_items))]
        clockValue =  [[0 for col in range(int(timeLimit))] for row in range(len(graphs_items))]
        graphs_item_index = 0
        for graphs_item in graphs_items:
            itemid = graphs_item['itemid']
            item = Item.objects.get(itemid=itemid)
            graphColor.append(graphs_item['color'])
            drawType.append(graphs_item['drawtype'])
            itemsName.append(item.description)
            itemsunits.append(item.units)
            sort = '-clock'
            value_type = item.value_type
            if value_type == 0:
                dbname = 'history'
            elif value_type == 1:
                dbname = 'history_str'
            else:
                dbname = 'history_uint'
            try:
                lastclock_temp = int(item.lastclock)
                if lastclock_temp < enddate_clock and lastclock_temp > fromdate_clock:
                    if (lastclock_temp - fromdate_clock) < 3600:
                        enddate_clock = fromdate_clock + 3600
                    else:
                        enddate_clock = lastclock_temp
            except:
                pass

            query_items_history = ItemHistory.item_history_objects.items_history4graphs(dbname, fromdate_clock, enddate_clock, timeLimit, g_type, timeGap, itemid)

            history_index = 0
            for items_history in query_items_history:
                if history_index >= timeLimit:
                    break
                index = items_history["i"]
                if index >= timeLimit:
                    index = timeLimit - 1
                count[graphs_item_index][int(index)] = int(index)
                clockValue[graphs_item_index][int(index)] = int(items_history["clock"])
                calc_fnc = graphs_item['calc_fnc']
                if calc_fnc == 7 or calc_fnc == 2:
                    historyValue[graphs_item_index][int(index)] = items_history["min"]
                elif calc_fnc == 4:
                    historyValue[graphs_item_index][int(index)] = items_history["max"]
                else:
                    historyValue[graphs_item_index][int(index)] = items_history["value"]
                history_index += 1

            if len(query_items_history) == 0:
                for j in xrange(timeLimit):
                    historyValue[graphs_item_index][j] = "0"
                    if item.lastvalue == None:
                        count[graphs_item_index][j] = 0
                    else:
                        count[graphs_item_index][j] = j

            historyValue = full_historyData(historyValue, count, graphs_item_index, timeLimit, timeGap, clockValue)
            draw = True
            prevDraw = True
            index1 = 0
            for j in xrange(1, len(historyValue[graphs_item_index])):
                diff = abs(clockValue[graphs_item_index][j] - clockValue[graphs_item_index][index1])
                cell = timeGap / timeLimit
                delay = max(item.delay, 3600)
                if cell > delay:
                    draw = diff < (16 * cell)
                else:
                    draw = diff < (4 * delay)

                if draw == False and graphs_item['calc_fnc'] == 1:
                    draw = (index1 - j) < 5

                if int(graphs_item['type']) == 2:
                    draw = True

                if draw == False and prevDraw == False:
                    draw = True
                else:
                    prevDraw = draw

                if index1 == 0:
                    if None == historyValue[graphs_item_index][index1] or "0" == historyValue[graphs_item_index][index1]:
                        historyValue[graphs_item_index][index1] = "0"
                if draw:
                    if historyValue[graphs_item_index][j] == None or "0" == historyValue[graphs_item_index][j]:
                        if timeLimit == 60 and (j + 1) == len(historyValue[graphs_item_index]):
                            historyValue[graphs_item_index][j] = historyValue[graphs_item_index][j - 1]
                        else:
                            historyValue[graphs_item_index][j] = "0"
                else:
                    if None == historyValue[graphs_item_index][j] or "0" == historyValue[graphs_item_index][j]:
                        historyValue[graphs_item_index][j] = "0"
                index1 = j
            graphs_item_index += 1
        # 补全数据 + 数据格式化
        for i in xrange(0, len(historyValue)):
            for j in xrange(0, len(historyValue[i])):
                if None == historyValue[i][j] or "0" == historyValue[i][j]:
                    if timeLimit == 60 and (j + 1) == len(historyValue[i]):
                        historyValue[i][j] = historyValue[i][j - 1]
                    else:
                        historyValue[i][j] = "0"
                unitsValue[i][j] = itemsunits[i]

        if graphs.graphtype == 1:
            for i in xrange(0, len(historyValue)):
                for j in xrange(0, len(historyValue[i])):
                    if None == historyValue[i][j]:
                        if (j + 1) == len(historyValue[i]) or (j + 2) == len(historyValue[i]) or (j + 3) == len(historyValue[i]):
                            historyValue[i][j] = historyValue[i][j - 1]
                        else:
                            historyValue[i][j] = "0"
                        continue
                    if "0" == historyValue[i][j]:
                        if (j + 1) == len(historyValue[i]) or (j + 2) == len(historyValue[i]) or (j + 3) == len(historyValue[i]):
                            historyValue[i][j] = historyValue[i][j - 1]
                        else:
                            historyValue[i][j] = "0"
        # 计算y轴最小值
        minResult = []
        minResult = calculateMinY(graphs, historyValue, itemsunits)
        minY = float(minResult[0])

        # 计算y轴最大值
        maxResult = []
        maxResult = calculateMaxY(graphs, historyValue, itemsunits)
        maxY = float(maxResult[0])
        units = maxResult[1]

        if minY >= maxY:
            minY = 0

        if maxY == 0 and minY == 0:
            maxY = 1

        for i in xrange(0, len(historyValue)):
            for j in xrange(0, len(historyValue[i])):
                unitsTmp = unitsValue[i][j]
                valueTmp = convert_graphsValue(units, unitsTmp, historyValue[i][j])
                historyValue[i][j] = valueTmp
        
        for i in xrange(0, timeLimit):
            graphs_data = {}
            value = []
            for j in xrange(0, len(graphs_items)):
                graph_value = ""
                if count[j][i] != 0 and None != historyValue[j][i]:
                    graphValue = historyValue[j][i]
                else:
                    graphValue = ""
                try:
                    value.append(float(graphValue))
                except:
                    value.append(None)
            clock_temp = int(fromdate_clock) + int(multipTime) * i
            #graphs_data['units'] = units
            #graphs_data['yaxismin'] = minY
            #graphs_data['yaxismax'] = maxY
            #graphs_data['name'] = graphs.name
            #graphs_data['color'] = graphColor
            #graphs_data['drawtype'] = drawType
            #graphs_data['itemname'] = itemsName
            graphs_data['value'] = value
            #graphs_data['graphtype'] = graphs.graphtype
            graphs_data['clock'] = clock_temp
            #graphs_data['delay'] = multipTime
            list_graphs_data.append(graphs_data)
            list_graphs_value.append(value)

        bundle = {
            'data': list_graphs_data,
            'length': len(list_graphs_data),
            'value': list_graphs_value,
            'color':graphColor,
            'delay': multipTime,
            'drawtype': drawType,
            'graphtype': graphs.graphtype,
            'itemname': itemsName,
            'name': graphs.name,
            'units': units,
            'yaxismax': maxY,
            'yaxismin': minY,
        }
        return self.create_response(request, bundle)

    def get_item_graphs(self, request, **kwargs):
        list_graphs_data = []
        list_graphs_value = []
        itemid = kwargs['pk']

        date_type = request.GET.get('date_type', 0)
        if date_type == 0:
            timeLimit = 60
            timeGap = 3600
        elif date_type == 1:
            timeLimit = 60
            timeGap = 86400
        elif date_type == 2:
            timeLimit = 200
            timeGap = 604800
        elif date_type == 3:
            timeLimit = 200
            timeGap = 2592000
        multipTime = timeGap / timeLimit
        enddate_clock = int(time.time())
        fromdate_clock = enddate_clock - timeGap
        g_type = timeGap - (fromdate_clock % timeGap)

        itemsunits = []

        count =  [[0 for col in range(int(timeLimit))] for row in range(1)]
        historyValue =  [[0 for col in range(int(timeLimit))] for row in range(1)]
        unitsValue =  [[0 for col in range(int(timeLimit))] for row in range(1)]
        clockValue =  [[0 for col in range(int(timeLimit))] for row in range(1)]

        item = Item.objects.get(itemid=itemid)
        itemsName = item.description
        itemsunits.append(item.units)
        sort = '-clock'
        value_type = item.value_type
        if value_type == 0:
            dbname = 'history'
        elif value_type == 1:
            dbname = 'history_str'
        else:
            dbname = 'history_uint'

        lastclock_temp = int(item.lastclock)
        if lastclock_temp < enddate_clock and lastclock_temp > fromdate_clock:
            if (lastclock_temp - fromdate_clock) < 3600:
                enddate_clock = fromdate_clock + 3600
            else:
                enddate_clock = lastclock_temp

        query_items_history = ItemHistory.item_history_objects.items_history4graphs(dbname, fromdate_clock, enddate_clock, timeLimit, g_type, timeGap, itemid)

        history_index = 0
        graphs_item_index = 0
        for items_history in query_items_history:
            if history_index >= timeLimit:
                break
            index = items_history["i"]
            if index >= timeLimit:
                index = timeLimit - 1
            count[graphs_item_index][int(index)] = int(index)
            clockValue[graphs_item_index][int(index)] = int(items_history["clock"])
            historyValue[graphs_item_index][int(index)] = items_history["value"]
            history_index += 1

        if len(query_items_history) == 0:
            for j in xrange(timeLimit):
                historyValue[graphs_item_index][j] = "0"
                if item.lastvalue == None:
                    count[graphs_item_index][j] = 0
                else:
                    count[graphs_item_index][j] = j

        historyValue = full_historyData(historyValue, count, graphs_item_index, timeLimit, timeGap, clockValue)
        draw = True
        prevDraw = True
        index1 = 0
        for j in xrange(1, len(historyValue[graphs_item_index])):
            diff = abs(clockValue[graphs_item_index][j] - clockValue[graphs_item_index][index1])
            cell = timeGap / timeLimit
            delay = max(item.delay, 3600)
            if cell > delay:
                draw = diff < (16 * cell)
            else:
                draw = diff < (4 * delay)

            if draw == False and prevDraw == False:
                    draw = True
            else:
                prevDraw = draw

            if index1 == 0:
                if None == historyValue[graphs_item_index][index1] or "0" == historyValue[graphs_item_index][index1]:
                        historyValue[graphs_item_index][index1] = "0"
            if draw:
                if historyValue[graphs_item_index][j] == None or "0" == historyValue[graphs_item_index][j]:
                    if timeLimit == 60 and (j + 1) == len(historyValue[graphs_item_index]):
                        historyValue[graphs_item_index][j] = historyValue[graphs_item_index][j - 1]
                    else:
                        historyValue[graphs_item_index][j] = "0"
            else:
                if None == historyValue[graphs_item_index][j] or "0" == historyValue[graphs_item_index][j]:
                    historyValue[graphs_item_index][j] = "0"
            index1 = j

        # 补全数据 + 数据格式化
        for i in xrange(0, len(historyValue)):
            for j in xrange(0, len(historyValue[i])):
                if None == historyValue[i][j] or "0" == historyValue[i][j]:
                    if timeLimit == 60 and (j + 1) == len(historyValue[i]):
                        historyValue[i][j] = historyValue[i][j - 1]
                    else:
                        historyValue[i][j] = "0"
                unitsValue[i][j] = itemsunits[i]


        #补全数据 +计算最大值
        maxYMiddle = -1
        if None != historyValue[0][0]:
            if item.value_type == 0 or item.value_type == 3:
                maxYMiddle = float(historyValue[0][0])

        for i in xrange(0, len(historyValue)):
            for j in xrange(0, len(historyValue[i])):
                if None == historyValue[i][j]:
                    if timeLimit == 60 and (j + 1) == len(historyValue[i]):
                        historyValue[i][j] = historyValue[i][j - 1]
                    else:
                        historyValue[i][j] = "0"
                if item.value_type == 0 or item.value_type == 3:
                    if maxYMiddle < float(historyValue[i][j]):
                        maxYMiddle = float(historyValue[i][j])

        #数据格式化
        result = convert_units4Graphs(str(maxYMiddle), item.units)
        maxYMiddle = float(result[0])
        unitsMax = result[1]
        for i in xrange(0, len(historyValue)):
            for j in xrange(0, len(historyValue[i])):
                valueTmp = convert_graphsValue(unitsMax,item.units, historyValue[i][j])
                historyValue[i][j] = valueTmp
        
        for i in xrange(0, timeLimit):
            graphs_data = {}
            value = []
            for j in xrange(0, 1):
                graph_value = ""
                if count[j][i] != 0 and None != historyValue[j][i]:
                    graphValue = historyValue[j][i]
                else:
                    graphValue = ""
                value.append(graphValue)
            clock_temp = int(fromdate_clock) + int(multipTime) * i
            #graphs_data['units'] = unitsMax
            #graphs_data['yaxismin'] = 0
            #graphs_data['yaxismax'] = maxYMiddle
            #graphs_data['itemname'] = itemsName
            graphs_data['value'] = float(graphValue)
            graphs_data['clock'] = clock_temp
            #graphs_data['delay'] = multipTime
            list_graphs_data.append(graphs_data)
            list_graphs_value.append(float(graphValue))

        bundle = {
            'data': list_graphs_data,
            'length': len(list_graphs_data),
            'value': list_graphs_value,
            'units': unitsMax,
            'delay': multipTime,
            'itemname': itemsName,
            'yaxismax': maxYMiddle,
            'yaxismin': 0,
        }
        return self.create_response(request, bundle)
