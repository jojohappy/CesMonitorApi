from django.conf.urls import url
from tastypie.resources import ModelResource
from tastypie import fields
from tastypie.utils import trailing_slash
from django.core.paginator import Paginator, InvalidPage
from django.http import Http404
from CesMonitorApi.models import Group
from CesMonitorApi.models import Host
from CesMonitorApi.models import HostsProfiles
from CesMonitorApi.models import HostsProfilesExt
from CesMonitorApi.models import Item
from CesMonitorApi.models import Event
from CesMonitorApi.models import Application

class GroupsResource(ModelResource):
    hosts = fields.OneToManyField('CesMonitorApi.api.HostsResource', 'hosts', full = True, null = True)
    class Meta:
        queryset = Group.objects.exclude(name='Templates')
        resource_name = 'groups'
        collection_name = 'hostsgroups'
        excludes = ['internal']
        include_resource_uri = False

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


    def determine_format(self, request):
        return "application/json"

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
    
    def determine_format(self, request):
        return "application/json"

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/host/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_host_items'), name="api_dispatch_detail_host"),
            url(r"^(?P<resource_name>%s)/event/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_event_item'), name="api_dispatch_detail_event"),
            url(r"^(?P<resource_name>%s)/host/(?P<%s>.*?)%s$" % (self._meta.resource_name, self._meta.detail_uri_name, trailing_slash()), self.wrap_view('get_history_item'), name="api_dispatch_detail_history"),
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
        items = self.get_object_list(request).filter(hostid = kwargs['pk']).order_by(sort)
        paginator = Paginator(items, request.GET.get('limit', 50))

        try:
            page = paginator.page(int(request.GET.get('page', 1)))
        except InvalidPage:
            raise Http404("Sorry, no results on that page.")

        objects = []

        for result in page.object_list:
            bundle = self.build_bundle(obj=result, request=request)
            bundle = self.full_dehydrate(bundle)
            objects.append(bundle)

        object_list = {
            'items': objects,
            'count': items.count(),
        }

        self.log_throttled_access(request)
        return self.create_response(request, object_list)

    def get_history_item(self, request, **kwargs):
        self.method_check(request, allowed=['get'])
        self.is_authenticated(request)
        self.throttle_check(request)
        base_bundle = self.build_bundle(request=request)
        item = self.get_object_list(request).filter(itemid = kwargs['pk'])
        limit = request.GET.get('limit', 50)
        cpage = int(request.GET.get('page', 1))
        sort = request.GET.get('sort', 'clock')
        reverse = int(request.GET.get('reverse', 0))
        if reverse == 1:
            sort = "-" + sort
        formdate = request.GET.get('from_date', '')
        enddate = request.GET.get('end_date', '')
        return self.create_response(request, object_list)
    
class EventsResource(ModelResource):
    class Meta:
        queryset = Event.objects.all()
        resource_name = 'events'
        collection_name = 'events'
        excludes = []
        include_resource_uri = False
    
    def determine_format(self, request):
        return "application/json"
        
class ApplicationsResource(ModelResource):
    items = fields.OneToManyField('CesMonitorApi.api.ItemsResource', 'items', full = True, null = True)
    # host = fields.OneToOneField('CesMonitorApi.api.HostsResource', 'host', full = True, null = True)
    class Meta:
        queryset = Application.objects.exclude(templateid = 0)
        resource_name = 'apps'
        collection_name = 'apps'
        excludes = []
        include_resource_uri = False
    
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