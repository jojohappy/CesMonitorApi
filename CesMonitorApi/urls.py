from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()
from CesMonitorApi.api import GroupsResource
from CesMonitorApi.api import HostsResource
from CesMonitorApi.api import ItemsResource

hostsgroup_resource = GroupsResource()
hosts_resource = HostsResource()
items_resource = ItemsResource()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'CesMonitorApi.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^api/admin/', include(admin.site.urls)),
    url(r'^api/hosts/', include(hostsgroup_resource.urls)),
    url(r'^api/', include(hosts_resource.urls)),
    url(r'^api/', include(items_resource.urls)),
)
