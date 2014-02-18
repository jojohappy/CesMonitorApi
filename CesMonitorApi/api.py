from tastypie.resources import ModelResource
from CesMonitorApi.models import Group
from CesMonitorApi.models import Host

class GroupsResource(ModelResource):
    class Meta:
        queryset = Group.objects.exclude(name='Templates')
        resource_name = 'groups'
        collection_name = 'hostsgroups'
        excludes = ['internal']
        include_resource_uri = False

    def get_detail(self, request, **kwargs):
        basic_bundle = self.build_bundle(request=request)
        try:
            obj = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(kwargs))
        except ObjectDoesNotExist:
            return http.HttpNotFound()
        except MultipleObjectsReturned:
            return http.HttpMultipleChoices("More than one resource is found at this URI.")
        ho = obj.hosts.all()
        for h in ho:
            print h.host
        bundle = self.build_bundle(obj=obj, request=request)
        bundle = self.full_dehydrate(bundle)

        bundle = self.alter_detail_data_to_serialize(request, bundle)
        return self.create_response(request, bundle)

    def determine_format(self, request):
        return "application/json"

class HostsResource(ModelResource):
    class Meta:
        queryset = Host.objects.filter(status__in = [1, 0])
        resource_name = 'hosts'
        collection_name = 'hosts'
        excludes = []
        include_resource_uri = False


    def determine_format(self, request):
        return "application/json"