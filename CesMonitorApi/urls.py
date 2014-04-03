from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()
from CesMonitorApi.api import *

hostsgroup_resource = GroupsResource()
hosts_resource = HostsResource()
items_resource = ItemsResource()
events_resource = EventsResource()
apps_resource = ApplicationsResource()
classifications_resource = ClassificationsResource()
favourites_resource = FavouritesResource()
graphs_resource = GraphsResource()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'CesMonitorApi.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^api/admin/', include(admin.site.urls)),
    url(r'^api/hosts/', include(hostsgroup_resource.urls)),
    url(r'^api/', include(hosts_resource.urls)),
    url(r'^api/', include(items_resource.urls)),
    url(r'^api/', include(events_resource.urls)),
    url(r'^api/', include(apps_resource.urls)),
    url(r'^api/', include(classifications_resource.urls)),
    url(r'^api/', include(favourites_resource.urls)),
    url(r'^api/', include(graphs_resource.urls)),
    url(r'^api/events_statistics/$', 'CesMonitorApi.views.events_statistics'),
    url(r'^api/events_statistics_week/$', 'CesMonitorApi.views.events_statistics_week'),
    url(r'^api/dashboard/$', 'CesMonitorApi.views.dashboard'),
    url(r'^$', 'CesMonitorApi.views.index'),
    url(r'^index/$','CesMonitorApi.views.index'),
    url(r'^report/$','CesMonitorApi.views.report'),
)
