from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()
from CesMonitorApi.api import GroupsResource

hostsgroup_resource = GroupsResource()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'CesMonitorApi.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^hosts/', include(hostsgroup_resource.urls)),
)
