# Create your views here.
# coding=utf-8

import json
import datetime
import time
from django.core.context_processors import csrf
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpRequest
from django.http import HttpResponseRedirect
from django.template import Template,Context
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from CesMonitorApi.models import Event

# �����������賿��ÿСʱ�澯�������ȼ��б�
def events_statistics(request):
    statistics_type = int(request.GET.get('statistics_type', 0))
    response_data = {}
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
    response_data['events_statistics'] = events_statistics
    return HttpResponse(json.dumps(response_data), content_type="application/json")

# ��ѯ����    
def dashboard(request):
    response_data = {}
    response_data['result'] = 'success'
    return HttpResponse(json.dumps(response_data), content_type="application/json")