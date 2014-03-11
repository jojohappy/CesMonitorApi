# Create your views here.
# coding=utf-8

import json
import datetime
import time
from django.core import serializers
from django.core.context_processors import csrf
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpRequest
from django.http import HttpResponseRedirect
from django.template import Template,Context
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from CesMonitorApi.models import Event
from CesMonitorApi.models import Group
from CesMonitorApi.models import Classification
from CesMonitorApi.api import HostsResource
from CesMonitorApi.api import EventsResource
from CesMonitorApi.api import ClassificationsResource

# 到当天早上凌晨的每小时告警数量、等级列表
def events_statistics(request):
    statistics_type = int(request.GET.get('statistics_type', 0))
    response_data = {}
    events_statistics = get_events_statistics(statistics_type = statistics_type)
    response_data['events_statistics'] = events_statistics
    return HttpResponse(json.dumps(response_data), content_type="application/json")

# 轮询请求    
def dashboard(request):
    # 主机分类查询
    # 主机组查询
    # 主机信息查询 用Resource
    # 当前告警
    # 告警统计
    response_data = {}
    first = True
    statistics_type = 0
    groups_queryset_old = Group.objects.exclude(name='Templates')
    groups_old = groups_queryset_old.values_list()
    classifications_queryset_old = Classification.objects.all()
    classifications_old = classifications_queryset_old.values_list()
    events_statistics_old = get_events_statistics(statistics_type = statistics_type)
    hosts_resource = HostsResource()
    hosts_response_old = hosts_resource.get_list(request=request, kwargs=None)
    hosts_old = json.loads(hosts_response_old.content)['hosts']
    events_old = Event.event_objects.current_events().values_list()
    while True:
        change = False
        if first:
            first = False
            time.sleep(30)
            continue
        else:
            # 获取数据
            groups_queryset_new = Group.objects.exclude(name='Templates')
            groups_new = groups_queryset_new.values_list()
            classifications_queryset_new = Classification.objects.all()
            classifications_new = classifications_queryset_new.values_list()
            events_statistics_new = get_events_statistics(statistics_type = statistics_type)
            events_new = Event.event_objects.current_events().values_list()
            hosts_response_new = hosts_resource.get_list(request=request, kwargs=None)
            hosts_new = json.loads(hosts_response_new.content)['hosts']
            # 比较数据
            if not set(groups_new) == set(groups_old):
                change = True
            elif not set(classifications_new) == set(classifications_old):
                change = True
            elif not events_statistics_new == events_statistics_old:
                change = True
            elif not set(events_new) == set(events_old):
                change = True
            elif not hosts_new == hosts_old:
                change = True
        if change:
            break
        else:
            groups_old = groups_new
            classifications_old = classifications_new
            events_statistics_old = events_statistics_new
            events_old = events_new
            hosts_old = hosts_new
        time.sleep(30)
    # 获取最新数据
    classifications_resource = ClassificationsResource()
    events_resource = EventsResource()
    classifications_response = classifications_resource.get_list(request=request, kwargs=None)
    events_response = events_resource.get_list4dashboard(request=request, kwargs=None)
    response_data['events'] = json.loads(events_response.content)['events']
    response_data['groupsclassifications'] = json.loads(classifications_response.content)['groupsclassifications']
    response_data['events_statistics'] = events_statistics_new
    return HttpResponse(json.dumps(response_data), content_type="application/json")
    
def get_events_statistics(statistics_type):
    fromdate=time.strftime('%Y-%m-%d',time.localtime(time.time()))
    enddate=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    time_f = datetime.datetime.strptime(fromdate, '%Y-%m-%d').timetuple()
    fromdate_clock = int(time.mktime(time_f))
    time_e = datetime.datetime.strptime(enddate, '%Y-%m-%d %H:%M:%S').timetuple()
    enddate_clock = int(time.mktime(time_e))
    if statistics_type == 0:
        events_statistics = Event.event_objects.events_statistics_count(int(fromdate_clock), int(enddate_clock))
    else:
        events_statistics = Event.event_objects.events_statistics_priority(int(fromdate_clock), int(enddate_clock))
    return events_statistics