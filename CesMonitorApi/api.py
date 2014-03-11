import datetime
import time
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

def convert_int_to_datetime(origin_datetime):
    return datetime.datetime.fromtimestamp(origin_datetime).strftime('%Y-%m-%d %H:%M:%S')

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
    host = fields.OneToOneField('CesMonitorApi.api.HostsResource', 'host', full = True, null = True)
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
        item_obj = event_bundle.data['items']
        to_be_serialized['item'] = item_obj
        event_bundle.data['items'] = None
        to_be_serialized = self.alter_detail_data_to_serialize(request, to_be_serialized)
        return self.create_response(request, to_be_serialized)
    
    def dehydrate(self, bundle):
        try:
            bundle.data['lastclock'] = convert_int_to_datetime(origin_datetime=int(bundle.data['lastclock']))
        except :
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
    items = fields.OneToOneField('CesMonitorApi.api.ItemsResource', 'item', full = True, null = True)
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