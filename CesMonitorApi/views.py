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

common_context_dict={}

ext_js_dir_dict={'static_root':'/static', }

common_context_dict.update(ext_js_dir_dict)

def index(request):
    t=get_template('index.html')
    context_dict={}
    context_dict.update(common_context_dict)
    #context_dict.update(csrf(request))
    c=Context(context_dict)
    html=t.render(c)
    return HttpResponse(html)

def report(request):
    t=get_template('report.html')
    context_dict={}
    context_dict.update(common_context_dict)
    #context_dict.update(csrf(request))
    c=Context(context_dict)
    html=t.render(c)
    return HttpResponse(html)

# 到当天早上凌晨的每小时告警数量、等级列表
def events_statistics(request):
    statistics_type = int(request.GET.get('statistics_type', 0))
    response_data = {}
    events_statistics_all = []
    for x in xrange(0, 24):
        events_statistics_all_data = {}
        events_statistics_all_data['hour'] = x
        events_statistics_all_data['count'] = None
        events_statistics_all.append(events_statistics_all_data)
    #events_statistics_all = events_statistics_all.reverse()
    events_statistics = get_events_statistics(statistics_type=statistics_type, isservices=0)
    for events_statistic in events_statistics:
    	for events_statistics_days in events_statistics_all:
    		if events_statistic['hour'] == events_statistics_days['hour']:
    			events_statistics_days['count'] = events_statistic['count']
    			break
    response_data['events_statistics'] = events_statistics_all
    #response_data['events_statistics_test'] = events_statistics_all
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
    events_statistics_old = get_events_statistics(statistics_type = statistics_type, isservices=0)
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
            events_statistics_new = get_events_statistics(statistics_type = statistics_type, isservices=0)
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
    
def get_events_statistics(statistics_type, isservices):
    fromdate=time.strftime('%Y-%m-%d',time.localtime(time.time()))
    enddate=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    time_f = datetime.datetime.strptime(fromdate, '%Y-%m-%d').timetuple()
    fromdate_clock = int(time.mktime(time_f))
    time_e = datetime.datetime.strptime(enddate, '%Y-%m-%d %H:%M:%S').timetuple()
    enddate_clock = int(time.mktime(time_e))
    if statistics_type == 0:
    	if isservices == 1:
    		hostids = ''
    		classs = Classification.objects.get(classificationid=7)
    		groups = classs.groups.all()
    		for group in groups:
    			hosts = group.hosts.all()
    			for host in hosts:
    				hostids += str(host.hostid) + ','
    		if len(hostids) == 0 or len(hostids) == 1:
    			hostids = '0'
    		else:
    			hostids = hostids[0:len(hostids) - 1]
    		hostids = hostids + ',10156'
        	events_statistics = Event.event_objects.events_statistics_services_count(int(fromdate_clock), int(enddate_clock), hostids)
        else:
        	events_statistics = Event.event_objects.events_statistics_count(int(fromdate_clock), int(enddate_clock))
    else:
        events_statistics = Event.event_objects.events_statistics_priority(int(fromdate_clock), int(enddate_clock))
    return events_statistics

def events_statistics_week(request):
    hostid = int(request.GET.get('hostid', 0))
    response_data = {}
    enddate_clock = int(time.time())
    fromdate_clock = enddate_clock - 86400*6
    days = ((datetime.datetime.fromtimestamp(int(enddate_clock)-86400*6).strftime('%Y-%m-%d')),(datetime.datetime.fromtimestamp(int(enddate_clock-86400*5)).strftime('%Y-%m-%d')),(datetime.datetime.fromtimestamp(int(enddate_clock-86400*4)).strftime('%Y-%m-%d')),(datetime.datetime.fromtimestamp(int(enddate_clock-86400*3)).strftime('%Y-%m-%d')),(datetime.datetime.fromtimestamp(int(enddate_clock-86400*2)).strftime('%Y-%m-%d')),(datetime.datetime.fromtimestamp(int(enddate_clock-86400)).strftime('%Y-%m-%d')),(datetime.datetime.fromtimestamp(int(enddate_clock)).strftime('%Y-%m-%d'))
    )
    events_statistics_all = []
    for x in xrange(0, len(days)):
        events_statistics_all_data = {}
        events_statistics_all_data['date_time'] = days[x]
        events_statistics_all_data['data'] = []
        events_statistics_all_data['data'].append({'priority':1, 'count': 0})
        events_statistics_all_data['data'].append({'priority':2, 'count': 0})
        events_statistics_all_data['data'].append({'priority':3, 'count': 0})
        events_statistics_all_data['data'].append({'priority':4, 'count': 0})
        events_statistics_all.append(events_statistics_all_data)

    events_statistics = Event.event_objects.events_statistics_priority_week(int(fromdate_clock), int(enddate_clock), hostid)
    
    for events_statistic in events_statistics:
    	for events_statistics_days in events_statistics_all:
    		if 'date_time' in events_statistic:
	    		if events_statistic['date_time'] == events_statistics_days['date_time']:
	    			events_statistics_days['data'] = events_statistic['data']
	    			break

    response_data['events_statistics_week'] = events_statistics_all
    #response_data['events_statistics_week_1'] = events_statistics_all
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def events_statistics_services(request):
    statistics_type = int(request.GET.get('statistics_type', 0))
    response_data = {}
    events_statistics_all = []
    for x in xrange(0, 24):
        events_statistics_all_data = {}
        events_statistics_all_data['hour'] = x
        events_statistics_all_data['count'] = 0
        events_statistics_all.append(events_statistics_all_data)

    events_statistics = get_events_statistics(statistics_type=statistics_type, isservices=1)
    for events_statistic in events_statistics:
    	for events_statistics_days in events_statistics_all:
    		if events_statistic['hour'] == events_statistics_days['hour']:
    			events_statistics_days['count'] = events_statistic['count']
    			break
    response_data['events_statistics'] = events_statistics_all
    #response_data['events_statistics_test'] = events_statistics_all
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def events_statistics_service_host(request):
    response_data = {}
    hostid = int(request.GET.get('hostid', 0))
    events_statistics_all = []
    if hostid == 0:
	    response_data['data'] = []
	    response_data['data'].append({'during':1440, 'status':'OK'})
	    response_data['data'].append({'during':1440, 'status':'OK'})
	    return HttpResponse(json.dumps(response_data), content_type="application/json")
    fromdate=time.strftime('%Y-%m-%d',time.localtime(time.time()))
    enddate=time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))
    time_f = datetime.datetime.strptime(fromdate, '%Y-%m-%d').timetuple()
    fromdate_clock = int(time.mktime(time_f))
    time_e = datetime.datetime.strptime(enddate, '%Y-%m-%d %H:%M:%S').timetuple()
    enddate_clock = int(time.mktime(time_e))

    result_today = get_events_statistics_host(fromdate_clock, enddate_clock, hostid)
    result_yesterday = get_events_statistics_host(fromdate_clock-86400, fromdate_clock, hostid)

    response_data['events_statistics_today'] = result_today
    response_data['events_statistics_yesterday'] = result_yesterday
    return HttpResponse(json.dumps(response_data), content_type="application/json")

def get_events_statistics_host(fromdate_clock, enddate_clock, hostid):
	result = []
	if fromdate_clock >= enddate_clock:
		result.append({'during':0, 'status':'OK'})
		return result
	events_current = Event.event_objects.events_statistics_services_host(fromdate_clock, enddate_clock, hostid)
	if len(events_current) == 0:
		result.append({'during':(enddate_clock - fromdate_clock)/60, 'status':'OK'})
		return result
	else:
		if (int(events_current[0]['clock']) + int(events_current[0]['during_clock'])) > enddate_clock:
			result.append({'during':int(enddate_clock - int(events_current[0]['clock'])) / 60, 'status':'Error'})
		else:
			result.append({'during':int(events_current[0]['during_clock']) / 60, 'status':'Error'})
	events_status_prev = get_events_statistics_host(fromdate_clock, int(events_current[0]['clock']), hostid)
	events_status_next = []
	if (int(events_current[0]['clock']) + int(events_current[0]['during_clock'])) <= enddate_clock:
		events_status_next = get_events_statistics_host((int(events_current[0]['clock']) + int(events_current[0]['during_clock'])), enddate_clock, hostid)
	for e in events_status_prev:
		result.insert(0, e)
	result.extend(events_status_next)
	return result