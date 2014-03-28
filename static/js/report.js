var _GLOBE_DATA = (function() {
    var data = {
        /* 浏览器宽高 */
        clientWidth: $(document.body)[0].clientWidth,
        clientHeight: $(document.body)[0].clientHeight
        ,
        windowOriginalFrame: {
            x: 0,
            y: 0
        },
        browserData: [],
        versionsData: []
    };
    /* 闭包返回 */
    return function(key, val) {
        /* getter */
        if (val === undefined) {
            return data[key];
        }
        /* setter */
        else {
            return data[key] = val;
        }
    }
})();

$(document).ready(function() {
    initDomSize();
    init();
    initDomEvent();
});

$(window).resize(function() {
    /* 设置元素Size */
    initDomSize();

});

/* 初始化DOM事件 */
var initDomEvent = function() {
    $('#submit_report').click(function(event) {
        var ids = [];
        var str = "";
        var num = 0;
        var from_datetime = $('#from_datetime').val() + ":00";
        var end_datetime = $('#end_datetime').val() + ":00";
	    var report_type = $("#selectReportType").val();
        var from_int = parseToDate(from_datetime);
        var end_int = parseToDate(end_datetime);
        if(from_int >= end_int) {
            alert("开始时间不能大于或等于结束时间!");
            return;
        }
        $(".div-Equipment-Object-Status").each(function(index){
            if($(this).html() == '☑') {
                var hostid = $(this).attr("hostid");
                var host = $(this).attr("host");
                ids.push(hostid);
                if(num == 0)
                    str += "<li title=\"" + host + "\" id=\"" + hostid + "\" class=\"tab-active\" style=\"color: rgb(255,255,255);\"><span>" + host + "</span><div class=\"tab-close\"><span class=\"tab-close-icon\">X</span></div></li>";
                else
                    str += "<li title=\"" + host + "\" id=\"" + hostid + "\"><span>" + host + "</span><div class=\"tab-close\"><span class=\"tab-close-icon\">X</span></div></li>";
                num++;
            }
        });

        if(str != "") {
            $("#ulReportContentTab li").each(function(index){
                $(this).unbind("click");
            });
            $(".tab-close-icon").unbind("click");
            $("#ulReportContentTab").html(str);
            $("#divReportContentDetail").html("");
            var iframe_height = _GLOBE_DATA('clientHeight') - 86;
            $("#ulReportContentTab li").each(function(index){
                //http://172.17.11.211/birt-viewer/frameset?__report=Report\CPU.rptdesign&host=&start=&end=
                //http://172.17.11.211/birt-viewer/frameset?__report=Report\cpu.rptdesign&host=10156&start=2014-03-18%2008:58:00&end=2014-03-18%2010:01:00
                //oraclets fenqu cpu
                var id=$(this).attr("id");
                var host=$(this).attr("title");
                var divId = "div-" + id;
                var str_report_div="";

                var report_type_url;
                if(report_type == "AIX_CPU" || report_type == "LINUX_CPU" || report_type == "WINDOWS_CPU")
                    report_type_url = "cpu";
                else if(report_type == "AIX_FENGQU")
                    report_type_url = "fenqu";
                else if(report_type == "ORACLE_TABLESPACE")
                    report_type_url = "oraclets";
                var iframe_url = "http://172.17.11.211/birt-viewer/frameset?__report=Report\\" + report_type_url + ".rptdesign&host=" + id + "&start="+from_datetime+"&end=" + end_datetime;
                if(index == 0) {
                    str_report_div = "<div id=\""+ divId + "\" style=\"display:block;\"><iframe src=\"" + iframe_url + "\" width=\"100%\" height=\""+iframe_height+"px\"></iframe></div>";
                }
                else {
                    str_report_div = "<div id=\""+ divId + "\" style=\"display:none;\"><iframe src=\"" + iframe_url + "\" width=\"100%\" height=\""+iframe_height+"px\"></iframe></div>";
                }
                $("#divReportContentDetail").append(str_report_div);
                $(this).click(function(event){
                    var id=$(this).attr("id");
                    var divId = "div-" + id;
                    $("#ulReportContentTab").children().removeClass("tab-active");
                    $("#ulReportContentTab").children().css("color", "rgb(22,160,133)");
                    $(this).addClass("tab-active").css("color", "rgb(255,255,255)");
                    $("#divReportContentDetail").children().css("display", "none");
                    $("#" + divId).css("display", "block");
                });
            });

            $(".tab-close-icon").click(function(event){
                var li_parent = $(this).parent().parent();
                if($(li_parent).attr("title") != "none") {
                    $(li_parent).unbind("click");
                    var id=$(li_parent).attr("id");
                    var divId = "div-" + id;
                    //判断三种情况 已选中的关闭 普通情况 最后一个
                    if($("#ulReportContentTab li").length == 1) {
                        $("#" + divId).remove();
                        $(li_parent).remove();
                        $("#ulReportContentTab").html("<li title=\"none\" class=\"tab-active\" style=\"color: rgb(255,255,255);\"><span>无</span><div class=\"tab-close\"><span>X</span></div></li>");
                        return;
                    }
                    if($(li_parent).hasClass("tab-active")) {
                        var li_index = $(li_parent).index();
                        var li_other;
                        if(li_index == 0)
                            li_other = $(li_parent).next();
                        else
                            li_other = $(li_parent).prev();
                        $("#ulReportContentTab").children().removeClass("tab-active");
                        $("#ulReportContentTab").children().css("color", "rgb(22,160,133)");
                        $(li_other).addClass("tab-active").css("color", "rgb(255,255,255)");
                        $("#divReportContentDetail").children().css("display", "none");
                        var id_other=$(li_other).attr("id");
                        var divId_other = "div-" + id_other;
                        $("#" + divId_other).css("display", "block");
                    }
                    $("#" + divId).remove();
                    $(li_parent).remove();
                }
            });
        }
        else
            alert("请选择监控主机!");
    });

    //ulReportContentTab
    $("#naviPrev").click(function(event){
        $("#ulReportContentTab").scrollLeft($("#ulReportContentTab").scrollLeft()-165);
    });

    $("#naviNext").click(function(event){
        $("#ulReportContentTab").scrollLeft($("#ulReportContentTab").scrollLeft()+165);
    });

    
};

var initTreeDomEvent = function() {
    $('#divWindowEquipmentTitle').bind('mouseup',
    function(event) {
        $(this).parent().css('background-color', 'rgb(255,255,255)');
        $(document).unbind('mousemove');
    });

    $('.div-Equipment-Type-Title').bind('click',
    function(event) {
        $($(this).next()).slideToggle(200);
        $($(this).children('.div-Equipment-Type-Title-Status')).html($($(this).children('.div-Equipment-Type-Title-Status')).html()==='+'?'-':'+');
    });

    $('.div-Equipment-Group-Title').bind('click',
    function(event) {
        $($(this).next()).slideToggle(200);
        $($(this).children('.div-Equipment-Group-Title-Status')).html($($(this).children('.div-Equipment-Group-Title-Status')).html()==='+'?'-':'+');
    });

    $('.div-Equipment-Object-Status').bind('click',
    function(event) {
       $(this).html($(this).html()==='☑'?'口':'☑');
    });

    $('.div-Equipment-Object-Text').click(function(event){
         $(this).prev().html($(this).prev().html()==='☑'?'口':'☑');
    });
};

var initDomSize = function() {
    _GLOBE_DATA('clientWidth', $(document.body)[0].clientWidth);
    _GLOBE_DATA('clientHeight', $(document.body)[0].clientHeight);
    $("#inputWindowEquipmentDetailSideAll").css("height", _GLOBE_DATA('clientHeight') - 44);
    $("#divReportContent").css("width", _GLOBE_DATA('clientWidth') - 210 + 3);
    $("#divReportContentDetail").css("width", _GLOBE_DATA('clientWidth') - 210 + 3);
    $("#ulReportContentTab").css("width", _GLOBE_DATA('clientWidth') - 210 + 3 - 75 - 20);
};

var init = function() {
    var dateNow = new Date();
    var date_prev = new Date(dateNow-60*60*1000);
    var hours;
    var month;
    var date_day;
    var minute;
    var second;
    var hours_prev;
    var month_prev;
    var date_day_prev;
    var minute_prev;
    var second_prev;

    if(dateNow.getHours() <= 9)
    	hours = "0" + dateNow.getHours();
    else
    	hours = dateNow.getHours();
    if(dateNow.getMonth() <= 9)
    	month = "0" + (dateNow.getMonth() + 1);
    else
    	month = (dateNow.getMonth() + 1);
    if(dateNow.getDate() <= 9)
    	date_day = "0" + dateNow.getDate();
    else
    	date_day = dateNow.getDate();
    if(dateNow.getMinutes() <= 9)
    	minute = "0" + dateNow.getMinutes();
    else
    	minute = dateNow.getMinutes();
    if(dateNow.getSeconds() <= 9)
    	second = "0" + dateNow.getSeconds();
    else
    	second = dateNow.getSeconds();
    var end_date_value = dateNow.getFullYear() + "-" + month + "-" + date_day + " " + hours + ":" + minute;

    if(date_prev.getHours() <= 9)
    	hours_prev = "0" + date_prev.getHours();
    else
    	hours_prev = date_prev.getHours();
    if(date_prev.getMonth() <= 9)
    	month_prev = "0" + (date_prev.getMonth() + 1);
    else
    	month_prev = (date_prev.getMonth() + 1);
    if(date_prev.getDate() <= 9)
    	date_day_prev = "0" + date_prev.getDate();
    else
    	date_day_prev = date_prev.getDate();
    if(date_prev.getMinutes() <= 9)
    	minute_prev = "0" + date_prev.getMinutes();
    else
    	minute_prev = date_prev.getMinutes();
    if(date_prev.getSeconds() <= 9)
    	second_prev = "0" + date_prev.getSeconds();
    else
    	second_prev = date_prev.getSeconds();
    var from_date_value = date_prev.getFullYear() + "-" + month_prev + "-" + date_day_prev + " " + hours_prev+ ":" + minute_prev;
    $('#from_datetime').val(from_date_value);
    $('#end_datetime').val(end_date_value);
    $('.datetime_picking').datetimepicker({
    	language: 'zh-CN',
        todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
        format: "yyyy-mm-dd hh:ii"
    });
     $(".div-Equipment-Object-Status").css('color','rgb(22,160,133)');

     $.ajax({
     	type: 'get',
		url: "/api/classifications/",
		dataType: 'json',
		cache: false,
		success: function(data, textStatus) {
            var str = "";
			for(var i=0; i<data.groupsclassifications.length; i++) {
                var groupsclassification = data.groupsclassifications[i];
                str +="<div class=\"div-Equipment-Type\" style=\"width:180px;\"><div class=\"div-Equipment-Type-Title\"><div class=\"div-Equipment-Type-Title-Status div-Equipment-Type-Title-Status-Ok\">+</div><div class=\"div-Equipment-Type-Title-Text\" style=\"width:153px;\">" + groupsclassification.name + "</div></div><div class=\"div-Equipment-Type-Content\">";
                if(null != groupsclassification.groups && groupsclassification.groups.length != 0) {
                    for(var j=0; j<groupsclassification.groups.length; j++) {
                        var group = groupsclassification.groups[j];
                        str += "<div class=\"div-Equipment-Group\"><div class=\"div-Equipment-Group-Title\"><div class=\"div-Equipment-Group-Title-Status div-Equipment-Group-Title-Status-Ok\">+</div><div class=\"div-Equipment-Group-Title-Text\" style=\"width:133px;\">" + group.name + "</div></div><div class=\"div-Equipment-Group-Content\">";
                        if(null != group.hosts && group.hosts.length != 0) {
                            for(var m=0; m<group.hosts.length; m++) {
                                var host = group.hosts[m];
                                str += "<div class=\"div-Equipment-Object\"><div class=\"div-Equipment-Object-Status\" host=\"" + host.host + "\" hostid=\"" + host.hostid + "\" style=\"color:rgb(22,160,133);\">口</div><div class=\"div-Equipment-Object-Text div-Equipment-Object-Text-Ok\" style=\"width:113px;\">" + host.host + "</div></div>";
                            }
                            str += "</div>";
                        }
                        else
                            str += "</div>";
                        str += "</div>";
                    }
                    str += "</div>";
                }
                else
                    str += "</div>";
                str += "</div>";
            }
            $("#inputWindowEquipmentDetailSideAll").html(str);
            initTreeDomEvent();
		},
		error: function() {
            
		}
    });
};

var parseToDate = function(strTime) 
{ 
    var arr=strTime.split(" "); 
    if(arr.length>=2) 
    { 
        var arr1=arr[0].split("-"); 
        var arr2=arr[1].split(":"); 
    } 
    else 
        return null; 
    if(arr1.length>=3 && arr2.length>=3) 
    { 
        var b=new Date(arr1[0],arr1[1],arr1[2],arr2[0],arr2[1],arr2[2]); 
        return b; 
    } 
    else 
        return null; 
}
