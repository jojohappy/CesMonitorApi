# Create your views here.
# coding=utf-8

import json
from django.core.context_processors import csrf
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.http import HttpRequest
from django.http import HttpResponseRedirect
from django.template import Template,Context
from django.template.loader import get_template
from django.views.decorators.csrf import csrf_protect, csrf_exempt

# �����������賿��ÿСʱ�澯�������ȼ��б�
def events_statistics(request):
    response_data = {}
    response_data['result'] = 'success'
    print 'dfsg'
    return HttpResponse(json.dumps(response_data), content_type="application/json")