# coding=utf-8
import sys
reload(sys)
sys.setdefaultencoding("utf-8")
import datetime
import time
import traceback,math
from CesMonitorApi.models import *

pow_unit = (-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8)
units = ('', 'n', 'l', 'm', '', 'K', 'M', 'G', 'T', 'P','E', 'Z', 'Y')
map = {'B': 0,'KB': 1,'MB': 2,'GB': 3,'TB': 4,'PB': 5,'EB': 6,'ZB': 7,'YB': 8,'Bps': 0,'KBps': 1,'MBps': 2,'GBps': 3,'TBps': 4,'PBps': 5,'EBps': 6,'ZBps': 7,'YBps': 8,'qps': 0,'Kqps': 1,'Mqps': 2,'Gqps': 3,'Tqps': 4,'Pqps': 5,'Eqps': 6,'Zqps': 7,'Yqps': 8}
mapUnit = {'': 0,'K': 1,'M': 2,'G': 3,'T': 4,'P': 5,'E': 6,'Z': 7,'Y': 8}

# 时间转换 从秒转为YYYY-MM-DD HH:mm:SS
def convert_int_to_datetime(origin_datetime):
    return datetime.datetime.fromtimestamp(origin_datetime).strftime('%Y-%m-%d %H:%M:%S')

# 监控数据格式转换
def convert_units(value, itemunits):
    convert = 0
    if itemunits == "unixtime":
        try:
            convert_int_to_datetime(origin_datetime=long(value))
        except:
            return ""
    if itemunits == "uptime":
        return convertUnitsUptime(value=value)
        

    if itemunits == "s":
        return convertUnitsS(value=value)
    blackList = []
    blackList.append("%")
    blackList.append("ms")
    blackList.append("rpm")
    blackList.append("RPM")
    if itemunits in blackList or len(itemunits) == 0:
        if abs(float(value)) >= 0.01:
            value = "%.2f" % (round(float(value) * 100) / 100.00)
        else:
            value = "%.6f" % float(value)

        if float(value) == 0:
            value = "0"
        if value.endswith(".00"):
            value = value[0 : len(value) - 3]
        
        if len(itemunits) == 0:
            return value
        else:
            return value + itemunits

    step = 0
    if itemunits == "Bps" or itemunits == "B" or itemunits == "qps" or itemunits == "ips" or itemunits == "sps":
        step = 1024
        convert = 1
    else:
        convert = 1
        step = 1000
        
    valueTmp = []
    for p in pow_unit:
        valueTmp.append(step ** p)

    abs_v = 0;
    if float(value) < 0:
        abs_v = float(value) * -1
    else:
        abs_v = float(value)

    valUnit = float(value)
    index = 0
    index_v = 0
    if abs_v > 999 or abs_v < 0.001 :
        for v in valueTmp:
            if abs_v >= v :
                index = index_v + 1
                valUnit = v
            else:
                break
            index_v += 1

	    if round(valUnit * 1000000) / 1000000.00000000 > 0 :
	        valUnit = float("%.6f" % (float(value) / valUnit))
	    else:
	        valUnit = 0

    desc = ""
    if convert == 0:
        itemunits = itemunits.strip()
    if convert == 1:
        desc = units[index]

    valUnit = round(valUnit * 100) / 100.00
    return "%.2f%s%s" % (valUnit, desc, itemunits)

def convertUnitsUptime(value):
    secs = round(float(value))
    if secs < 0:
        value = "-"
        secs = secs * -1
    else:
        value = ""
    days = math.floor(secs / 86400.0)
    secs -= days * 86400.0

    hours = math.floor(secs / 3600.0)
    secs -= hours * 3600.0

    mins = math.floor(secs / 60.0)
    secs -= mins * 60.0

    finalValue = ""
    if int(days) != 0:
        finalValue = "%d%s" % (int(days), "天,")
    finalValue = "%s%02d:%02d:%02d" % (finalValue,int(hours), int(mins), secs)
    return finalValue

def convertUnitsS(value):
    finalValue = ""
    if math.floor(abs(float(value)) * 1000) == 0:
        finalValue = "0秒" if float(value) == 0 else "< 1毫秒"
        return finalValue;

    secs = round(float(value) * 1000) / 1000
    if secs < 0:
        value = "-"
        secs = secs * -1
    else:
        value = ""

    n_unit = 0
    n = math.floor(secs / 31536000.0)
    if n != 0:
        value += int(n) + "年 "
        secs -= int(n) * 31536000
        if 0 == n_unit:
            n_unit = 4

    n = math.floor(secs / 2592000.0)
    if n != 0:
        value += int(n) + "月 "
        secs -= int(n) * 2592000
        if 0 == n_unit:
            n_unit = 3

    n = math.floor(secs / 86400.0)
    if n != 0:
        value += int(n) + "天 "
        secs -= int(n) * 86400
        if 0 == n_unit:
            n_unit = 2

    n = math.floor(secs / 3600.0)
    if n_unit < 4 and n != 0:
        value += int(n) + "小时 "
        secs -= int(n) * 3600
        if 0 == n_unit:
            n_unit = 1

    n = math.floor(secs / 60.0)
    if n_unit < 3 and n != 0:
        value += int(n) + "分 "
        secs -= int(n) * 60

    n = math.floor(secs / 1.0)
    if n_unit < 2 and n != 0:
        value += int(n) + "秒 "
        secs -= int(n)
    
    n = math.floor(secs * 1000.0)
    if n_unit < 1 and n != 0:
        value += int(n) + "毫秒"

    finalValue = value
    return finalValue

def format_lastvalue(lastvalue, itemunits,value_type, valuemapid):
    finalValue = ""
    if lastvalue != "" and lastvalue != None:
        if int(valuemapid) > 0:
            finalValue = replace_value_by_map(value=lastvalue, valuemapid=valuemapid)
        elif value_type == 0 :
            finalValue = convert_units(value=lastvalue, itemunits=itemunits)
        elif value_type == 3:
            finalValue = convert_units(value=lastvalue, itemunits=itemunits)
        elif value_type == 1 or value_type == 4 or value_type == 2:
            finalValue = lastvalue
        else:
            finalValue = lastvalue
        
    else:
        finalValue = "-"
    
    return finalValue

def replace_value_by_map(value, valuemapid):
    if int(valuemapid) < 1:
        return value
    try:
        mappings = Mappings.objects.get(valuemapid=int(valuemapid),value=value)
        return mappings.newvalue + "(" + value + ")"
    except:
        pass

    return value

def calculateMinY(graphs, historyValue, itemsunits):
    minY = 0
    minYMiddle = 0
    units = ""
    if graphs.ymin_type == 1:
        minResult = []
        minResult.append(graphs.yaxismin)
        minResult.append("noitemunits")
        return minResult
    elif graphs.ymin_type == 2:
        itemsId = graphs.ymin_itemid
        items = Item.objects.get(itemid=itemsId)
        if None != items and None != items.lastvalue:
            result = convert_units4Graphs(items.lastvalue, items.units)
            return result

    if len(historyValue) != 0:
        resultTmp = convert_units4Graphs(historyValue[0][0], itemsunits[0])
        minY = float(resultTmp[0])
        units = resultTmp[1]

        minYMiddle = float(historyValue[0][0])
        for i in xrange(0, len(historyValue)):
            for j in xrange(0, len(historyValue[i])):
                minYTmp = float(historyValue[i][j])
                if minYTmp < minYMiddle:
                    minYMiddle = minYTmp
                    result = convert_units4Graphs(historyValue[i][j],itemsunits[i])
                    minY = float(result[0])
                    units = result[1]
                    continue

    maxResult = []
    maxResult.append(str(minY))
    if None == units or len(units) == 0:
        maxResult.append("noitemunits")
    else:
        maxResult.append(units)
    return maxResult

def calculateMaxY(graphs, historyValue, itemsunits):
    maxY = 0
    maxYMiddle = 0
    units = ""
    if graphs.ymax_type == 1:
        maxResult = []
        maxResult.append(graphs.yaxismax)
        maxResult.append("noitemunits")
        return maxResult
    elif graphs.ymax_type == 2:
        itemsId = graphs.ymax_itemid
        items = Item.objects.get(itemid=itemsId)
        if None != items and None != items.lastvalue:
            result = convert_units4Graphs(items.lastvalue, items.units)
            return result

    if len(historyValue) != 0:
        resultTmp = convert_units4Graphs(historyValue[0][0], itemsunits[0])
        maxY = float(resultTmp[0])
        units = resultTmp[1]

        maxYMiddle = float(historyValue[0][0])
        for i in xrange(0, len(historyValue)):
            for j in xrange(0, len(historyValue[i])):
                maxYTmp = float(historyValue[i][j])
                if maxYTmp > maxYMiddle:
                    maxYMiddle = maxYTmp
                    result = convert_units4Graphs(historyValue[i][j],itemsunits[i])
                    maxY = float(result[0])
                    units = result[1]
                    continue

    maxResult = []
    maxResult.append(str(maxY))
    if None == units or len(units) == 0:
        maxResult.append("noitemunits")
    else:
        maxResult.append(units)
    return maxResult

def convert_units4Graphs(value, itemunits):
    convert = 0;
    result = []
    if itemunits == "unixtime":
    	try:
	        result.append(convert_int_to_datetime(origin_datetime=long(value)))
	        result.append("noitemunits")
        	return result;
    	except:
	        result.append("")
	        result.append("noitemunits")
        	return result


    if itemunits == "uptime":
    	result.append(convertUnitsUptime(int(value)))
    	result.append("noitemunits")
    	return result

    if itemunits == "s":
    	result.append(convertUnitsS(int(value)))
    	result.append("noitemunits")
    	return result

    blackList = []
    blackList.append("%")
    blackList.append("ms")
    blackList.append("rpm")
    blackList.append("RPM")

    if itemunits in blackList or len(itemunits) == 0:
    	if abs(float(value)) >= 0.01 :
        	value = "%.2f" % (round(float(value) * 100) / 100.00)
    	else:
        	value = "%.6f" % float(value)
    	if float(value) == 0:
        	value = "0"
    	if value.endswith(".00"):
        	value = value[0:len(value) - 3]
    	if len(itemunits) == 0:
	        result.append(value)
	        result.append("noitemunits")
	        return result
    	else:
	        result.append(value)
	        result.append(itemunits)
	        return result

    step = 0
    if itemunits == "Bps" or itemunits == "B" or itemunits == "qps" or itemunits == "ips" or itemunits == "sps":
        step = 1024
        convert = 1
    else:
        convert = 1
        step = 1000

    valueTmp = []
    for p in pow_unit:
        valueTmp.append(step ** p)

    abs_v = 0
    if float(value) < 0:
        abs_v = float(value) * -1
    else:
        abs_v = float(value)

    valUnit = float(value)
    index = 0
    index_v = 0
    if abs_v > 999 or abs_v < 0.001 :
        for v in valueTmp:
            if abs_v >= v :
                index = index_v + 1
                valUnit = v
            else:
                break
            index_v += 1

	    if round(valUnit * 1000000) / 1000000.00000000 > 0 :
	        valUnit = float("%.6f" % (float(value) / valUnit))
	    else:
	        valUnit = 0

    desc = ""
    if convert == 0:
        itemunits = itemunits.strip()
    if convert == 1:
        desc = units[index]

    valUnit = round(valUnit * 100) / 100.00
    result.append("%.2f" % valUnit)
    result.append("%s%s" % (desc, itemunits))
    return result

def convert_graphsValue(maxUnits, itemsUnits, historyValue):
    firstMaxU = ""
    firstItemU = ""
    if None != maxUnits and "" != maxUnits:
    	firstMaxU = maxUnits[0:1]
    if None != itemsUnits and "" != itemsUnits:
    	firstItemU = itemsUnits[0:1]

    num = 0
    itemsUnitsNum = 0
    if firstMaxU in mapUnit:
    	num = mapUnit[firstMaxU]
    if firstItemU in mapUnit:
    	itemsUnitsNum = mapUnit[firstItemU]
    
    historyNewValue = historyValue
    historyDValue = 0
    try:
    	historyDValue = float(historyValue)
    except:
    	return historyValue

    if None != num and None != itemsUnitsNum:
    	powTmp = historyDValue * (1024 ** itemsUnitsNum)
    	powNew = powTmp * (1024 ** (num * -1))
    	historyNewValue = "%.2f" % powNew

    return historyNewValue


def full_historyData(historyValue, count, index, timeLimit, timeGap, clockValue):
    first_idx = 0
    dx = 0
    ci = 0
    cj = 0
    tmp = 0
    while ci < timeLimit:
    	if int(count[index][ci]) == 0:
	        count[index][ci] = 0
	        cj += 1
	        ci += 1
	        continue

    	if cj == 0:
    		ci += 1
        	continue
    	dx = cj + 1
    	first_idx = ci - dx

    	if first_idx < 0:
        	first_idx = ci
    	cjTmp = cj
    	while cjTmp > 0:
	        if first_idx == ci:
	        	clockValue[index][ci - (dx - cj)] = clockValue[index][first_idx] - ((int(timeGap) / timeLimit) * (dx - cj))
	        	cjTmp -= 1
	        	continue
	        cjTmp -= 1

    	while cj > 0:
	        tmp = 1000
	        if dx < (tmp / 20):
	        	count[index][ci - (dx - cj)] = 1
        	dy = float(historyValue[index][ci]) - float((historyValue[index][first_idx]))
        	historyValue[index][ci - dx + cj] = str(float(historyValue[index][first_idx]) + ((cj * dy) / dx))
        	cj -= 1

    if cj > 0 and ci > cj:
    	dx = cj + 1
    	first_idx = ci - dx
    	cjTmp = cj
    	while cjTmp > 0:
	        clockValue[index][first_idx + (dx - cj)] = clockValue[index][first_idx] + ((timeGap / timeLimit) * (dx - cj))
	        cjTmp -= 1
	        continue
    	while cj > 0:
        	historyValue[index][first_idx + (dx - cj)] = historyValue[index][first_idx]
        	cj -= 1

    return historyValue

