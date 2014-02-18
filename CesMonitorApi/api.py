from tastypie.resources import ModelResource
from CesMonitorApi.models import groups

class GroupsResource(ModelResource):
    class Meta:
        queryset = groups.objects.all()
        resource_name = 'groups'
        collection_name = 'hostsgroups'
        excludes = ['internal']
        include_resource_uri = False

    def determine_format(self, request):
        return "application/json"