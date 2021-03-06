
/* 统一命名空间储存全局变量 */

/*
    http://www.laneige.com.cn/product/detail.jsp?prdtCd=414077002&lineCd=3699
    http://www.laneige.com.cn/product/detail.jsp?prdtCd=415048009&lineCd=3710
    http://www.laneige.com.cn/product/detail.jsp?prdtCd=414069011&lineCd=3693
    http://www.laneige.com.cn/product/detail.jsp?prdtCd=414069012&lineCd=3694
    http://item.jd.com/1034193.html
    http://item.jd.com/1034184.html
    气垫21

    爱丽
    CC霜1号色
    爱丽
    水晶散粉1号色
    蜗牛面膜2
    */
    var _GLOBE_DATA = (function() {
        var data = {
            /* 浏览器宽高 */
            clientWidth:$(document.body)[0].clientWidth
            ,clientHeight:$(document.body)[0].clientHeight
            /* 总正常设备百分比计数setInterval对象 */
            ,divMIAChartTextCount:null
            /* 总正常设备计数setInterval对象 */
            ,divNDAFunctionalNumberCount:null
            /* 总正常设备百分比计数 */
            ,divMIAChartTextCountNumber:0
            /* 总正常设备计数 */
            ,divNDAFunctionalNumberCountNumber:0
            /* 主绿色RGB */
            ,colorMainGreen:'rgb(30,150,120)'
            /* 严重告警色RGB */
            ,colorAlertLevel4:'rgb(233,29,32)'
            /* 普通告警色RGB */
            ,colorAlertLevel3:'rgb(255,60,0)'
            /* 警告告警色RGB */
            ,colorAlertLevel2:'rgb(228,108,10)'
            /* 信息告警色RGB */
            ,colorAlertLevel1:'rgb(89,89,89)'
            /* DTSortChar*/
            ,windowOriginalFrame:{
                x:0
                ,y:0
            }
            ,browserData :[]
            ,versionsData :[]
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


    $(document).ready(function(){
        initDomSize();
        init();
        initDomEvent();
    });

    $(window).resize(function () {
        /* 设置元素Size */
        initDomSize();

    }); 

    /* 初始化DOM事件 */
    var initDomEvent = function(){
        /* 告警列表Icon点击事件 */
        $('#divAlertListIcon').click(function(event){
            $('#divWindowAlertList').height(50).width(50).css('left',$('#divAlertListIcon').offset().left+'px')
                .css('top',$('#divAlertListIcon').offset().top+'px').css('display','block').animate({
                height: '500px'
                ,width:'850px'
                ,top:'100px'
                ,left:(_GLOBE_DATA('clientWidth')-800)/2
            }, {
                duration: 200,
                easing:'linear',
                complete: function() {
                 
                }
            });
        });

        $('#divWindowAlertListTitleClose').click(function(event){
            $('#divWindowAlertList').height(598).width(798).animate({
                height: '50px'
                ,width:'50px'
                ,top:$('#divAlertListIcon').offset().top+'px'
                ,left:$('#divAlertListIcon').offset().left+'px'
            }, {
                duration: 200,
                easing:'linear',
                complete: function() {
                    $('#divWindowAlertList').css('display','none');
                }
            });
        });

        $('#divWindowAlertListTitle').bind('mousedown',function(event){
            event.preventDefault();
            var tempObj= $(this).parent();
            var difWidth = event.clientX-tempObj.css('left').split('px')[0];
            var difHeight = event.clientY-tempObj.css('top').split('px')[0];
            $(document).bind('mousemove',function(eventMm){
                tempObj.css('background-color','rgba(255,255,255,0.8)');
                if(eventMm.clientY<$(document.body)[0].clientHeight){
                    tempObj.css('left',eventMm.clientX-difWidth);
                    tempObj.css('top',eventMm.clientY-difHeight);
                }
            });
        });

        $('#divWindowAlertListTitle').bind('mouseup',function(event){
            $(this).parent().css('background-color','rgb(255,255,255)');
            $(document).unbind('mousemove');
        });

        $('#divWindowAlertFooterFilter').click(function(event){
            $(this).animate({
                width:'200px'
            }, {
                duration: 200,
                easing:'linear',
                complete: function() {
                    $(this).animate({
                        top:'-300px'
                    });
                }
            });
        });
    };

    var initDomSize = function(){
        _GLOBE_DATA('clientWidth',$(document.body)[0].clientWidth);
        _GLOBE_DATA('clientHeight',$(document.body)[0].clientHeight);
        $('#divDTTimeChartArea').width(_GLOBE_DATA('clientWidth')-555);
        $('#divDTIconArea').height(_GLOBE_DATA('clientHeight')-290);
        if(_GLOBE_DATA('clientHeight')<610){
            $('#divDTIconArea').width(340);
            $('#divDTIconArea .div-DT-Icon').width(100).height(100);
        }else if(_GLOBE_DATA('clientHeight')<830) {
            $('#divDTIconArea').width(230);
            $('#divDTIconArea .div-DT-Icon').width(100).height(100);
        }else{
            $('#divDTIconArea .div-DT-Icon').width((_GLOBE_DATA('clientHeight')-290-10)/5-10).height((_GLOBE_DATA('clientHeight')-290-10)/5-10);
            $('#divDTIconArea').width((_GLOBE_DATA('clientHeight')-290-10)/5-10+30);
        }
        
        $('#divDTSortChartArea').height(_GLOBE_DATA('clientHeight')-310).width((_GLOBE_DATA('clientWidth')-$('#divDTIconArea').width())/2.5);
        $('#divDTSortMainChartArea').height($('#divDTSortChartArea').height()*0.7-40);
        $('#divDTAlertListArea').height(_GLOBE_DATA('clientHeight')-310).width(_GLOBE_DATA('clientWidth')-$('#divDTIconArea').width()-$('#divDTSortChartArea').width()-20);
        $('#divDTAlertListAreaMain').height($('#divDTAlertListArea').height()*0.7-40).width($('#divDTAlertListArea').width());
    };

    var init = function(){
        fullScren();
        $('input').iCheck({
            checkboxClass: 'icheckbox_flat-green'
            ,radioClass: 'iradio_flat-green'
        });
        _GLOBE_DATA('divMIAChartTextCount',window.setInterval(divMIAChartTextCount, 500/78)); 
        _GLOBE_DATA('divNDAFunctionalNumberCount',window.setInterval(divNDAFunctionalNumberCount, 500/(1567/12))); 
        var MIAChart = new Highcharts.Chart(MIAChartObject);
        var DTTimeChartAreaChart = new Highcharts.Chart(DTTimeChartAreaObject);  
        var DTSortMainChartAreaChart = new Highcharts.Chart(DTSortMainChartAreaObject);
        var DTSortSubChartAreaChart = new Highcharts.Chart(DTSortSubChartAreaObject);
        var DTAlertListAreaSub = new Highcharts.Chart(DTAlertListAreaSubObject);
        /*
        var AppMonitorIconChart = new Highcharts.Chart(AppMonitorIconChartObject);
        var FavoritesIconChart = new Highcharts.Chart(FavoritesIconChartObject);
        */
    };

    var fullScren = function(){
        
        //var wsh = new ActiveXObject("WScript.Shell"); wsh.sendKeys("{F11}");

    };

    var divMIAChartTextCount = function(){
        if(_GLOBE_DATA('divMIAChartTextCountNumber')<78){ /* data here */
            $('#divMIAChartText').html(_GLOBE_DATA('divMIAChartTextCountNumber',_GLOBE_DATA('divMIAChartTextCountNumber')+1)+'%'); 
        }else{
            clearInterval(_GLOBE_DATA('divMIAChartTextCount'));
            _GLOBE_DATA('divMIAChartTextCount',null);
            return false;
        }
    };

    var divNDAFunctionalNumberCount = function(){
        if(_GLOBE_DATA('divNDAFunctionalNumberCountNumber')<1567){
            $('#divNDAFunctionalNumber').html(_GLOBE_DATA('divNDAFunctionalNumberCountNumber',_GLOBE_DATA('divNDAFunctionalNumberCountNumber')+12)); 
        }else{
            $('#divNDAFunctionalNumber').html(1567);
            clearInterval(_GLOBE_DATA('divNDAFunctionalNumberCount'));
            _GLOBE_DATA('divNDAFunctionalNumberCount',null);
            return false;
        }
    };

    var MIAChartObject = {
        chart: {
            renderTo: 'divMIAChart',
            backgroundColor:null,
            type: 'pie',
            marginLeft: -10,
            marginRight: -10,
            marginBottom: -8,
            marginTop: -8
        },
        title: {
            text: ''
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pie: {
                borderWidth: 0,
                innerSize: '100%',
                colors:['#fff'],
                endAngle:280,/*data here*/
                dataLabels: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled : false
        },
        series: [{
            name:'数量',
            data: [
            ['正常', 186]/*data here*/
            ]
        }]
    };

    var DTTimeChartAreaObject = {
        chart: {
            renderTo: 'divDTTimeChartArea',
            backgroundColor:null,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 4,
            marginTop: 50
        },
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        xAxis: {
            categories:['0:00点 - 0:59点', '1:00点 - 1:59点', '2:00点 - 2:59点', '3:00点 - 3:59点', '4:00点 - 4:59点'
            ,'5:00点 - 5:59点', '6:00点 - 6:59点', '7:00点 - 7:59点', '8:00点 - 8:59点', '9:00点 - 9:59点'
            ,'10:00点 - 0:59点', '11:00点 - 1:59点', '12:00~点 - 2:59点', '13:00点 - 3:59点', '14:00点 - 4:59点'
            ,'15:00点 - 5:59点', '16:00点 - 6:59点', '17:00~点 - 7:59点', '18:00点 - 8:59点', '19:00点 - 9:59点'
            ,'20:00点 - 0:59点', '21:00点 - 1:59点', '22:00~点 - 2:59点', '23:00点 - 3:59点'],
            /*
            plotBands: [{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 0.5,
                to: 1.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 2.5,
                to: 3.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 4.5,
                to: 5.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 6.5,
                to: 7.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 8.5,
                to: 9.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 10.5,
                to: 11.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 12.5,
                to: 13.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 14.5,
                to: 15.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 16.5,
                to: 17.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 18.5,
                to: 19.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 20.5,
                to: 21.5
            },{ // mark the weekend
                color: 'rgb(237,242,237)',
                from: 22.5,
                to: 23.5
            }],
            */
            tickWidth: 1,
            lineWidth: 8,
            lineColor:_GLOBE_DATA('colorMainGreen'),
            gridLineWidth: 0,
            labels: { 
                step:4,
                staggerLines: 1,
            //rotation:30,
            enabled: false ,
            style:{
                color:_GLOBE_DATA('colorMainGreen')
            }
        },
    },
    
    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: ''
        },
        maxPadding:0.2,
        gridLineWidth: 0,
        tickWidth: 0,
        lineWidth: 0,
        tickPixelInterval:20,
        labels: { 
            enabled: false ,
            step:2,
            style:{
                color:_GLOBE_DATA('colorMainGreen')
            }
        }
    },

    plotOptions: {
        line: {
            color:_GLOBE_DATA('colorMainGreen'),
            lineWidth:2,
            cursor: 'pointer',
            dashStyle:'ShortDot',
            events:{
                click:function(event){
                    alert(event.point.x);
                }
            },
            dataLabels:{
                enabled: true,
                backgroundColor:_GLOBE_DATA('colorMainGreen'),
                borderRadius:4,
                borderWidth:0,
                y:-10,
                style: {
                    color:'white'
                }
            }
        },
        series: {
            marker: {
                fillColor: '#fff',
                lineWidth: 2,
                    lineColor: _GLOBE_DATA('colorMainGreen') // inherit from series
                }
            }
        },
        
        credits: {
            enabled: false
        },
        exporting: {
            enabled : false
        },
        series: [{
            name: '发生告警数量',
            data: [3, 21, 0, 62, 12, 11,5,0,0,2,0,3,0,0,7,1,1,null,null,null,null,null,null,null]        
        }]
    };

    /*

    var AppMonitorIconChartObject = {
        chart: {
            renderTo: 'divAppMonitorIconChart',
            backgroundColor:null,
            type: 'pie',
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            marginTop: 0
        },
        title: {
            text: ''
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pie: {
                borderWidth: 0,
                innerSize: '100%',
                colors:[_GLOBE_DATA('colorAlertLevel4')],
                endAngle:56, 
                dataLabels: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled : false
        },
        series: [{
            name:'数量',
            data: [
            ['正常', 186]
            ]
        }]
    };

    var FavoritesIconChartObject = {
        chart: {
            renderTo: 'divFavoritesIconChart',
            backgroundColor:null,
            type: 'pie',
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            marginTop: 0
        },
        title: {
            text: ''
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            pie: {
                borderWidth: 0,
                innerSize: '100%',
                colors:[_GLOBE_DATA('colorAlertLevel4')],
                endAngle:24,
                dataLabels: {
                    enabled: false
                }
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled : false
        },
        series: [{
            name:'数量',
            data: [
            ['正常', 186]
            ]
        }]
    };
*/
    var DTSortMainChartAreaFunction = function(){

        var colors=['rgba(120,141,120,.2)','rgba(120,141,120,.3)','rgba(120,141,120,.1)'];
        var categories = ['小型机', '存储', '网络设备','其他','PC server'],
        name = 'Browser brands',
        data = [{
            y: 56,
            color: colors[0],
            drilldown: {
                name: 'Firefox versions',
                categories: ['小型机正常','小型机普通告警','小型机严重告警','小型机灾难告警'],
                data: [41,2,12,1],
                colors:[_GLOBE_DATA('colorMainGreen'),_GLOBE_DATA('colorAlertLevel4'),_GLOBE_DATA('colorAlertLevel3'),_GLOBE_DATA('colorAlertLevel2')]
            }
        }, {
            y: 23,
            color: colors[1],
            drilldown: {
                name: 'Firefox versions',
                categories: ['存储正常','存储普通告警','存储严重告警','存储灾难告警'],
                data: [21,2,0,0],
                colors:[_GLOBE_DATA('colorMainGreen'),_GLOBE_DATA('colorAlertLevel4'),_GLOBE_DATA('colorAlertLevel3'),_GLOBE_DATA('colorAlertLevel2')]
            }
        }, {
            y: 128,
            color:  colors[2],
            drilldown: {
                name: 'Chrome versions',
                categories: ['网络设备正常','网络设备普通告警','网络设备严重告警','网络设备灾难告警'],
                data: [102,20,4,2],
                colors:[_GLOBE_DATA('colorMainGreen'),_GLOBE_DATA('colorAlertLevel4'),_GLOBE_DATA('colorAlertLevel3'),_GLOBE_DATA('colorAlertLevel2')]
            }
        }, {
            y: 19,
            color:  colors[0],
            drilldown: {
                name: 'Chrome versions',
                categories: ['网络设备正常','网络设备普通告警','网络设备严重告警','网络设备灾难告警'],
                data: [10,2,1,6],
                colors:[_GLOBE_DATA('colorMainGreen'),_GLOBE_DATA('colorAlertLevel4'),_GLOBE_DATA('colorAlertLevel3'),_GLOBE_DATA('colorAlertLevel2')]
            }
        }, {
            y: 72,
            color:  colors[1],
            drilldown: {
                name: 'Chrome versions',
                categories: ['网络设备正常','网络设备普通告警','网络设备严重告警','网络设备灾难告警'],
                data: [68,2,1,1],
                colors:[_GLOBE_DATA('colorMainGreen'),_GLOBE_DATA('colorAlertLevel4'),_GLOBE_DATA('colorAlertLevel3'),_GLOBE_DATA('colorAlertLevel2')]
            }
        }];


        // Build the data arrays
        var tempBrowserData = [];
        var tempVersionsData = [];
        for (var i = 0; i < data.length; i++) {

            // add browser data
            tempBrowserData.push({
                name: categories[i],
                y: data[i].y,
                color: data[i].color
            });

            // add version data
            for (var j = 0; j < data[i].drilldown.data.length; j++) {
                var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
                tempVersionsData.push({
                    name: data[i].drilldown.categories[j],
                    y: data[i].drilldown.data[j],
                    color:data[i].drilldown.colors[j]
                });
            }

            _GLOBE_DATA('browserData',tempBrowserData);
            _GLOBE_DATA('versionsData',tempVersionsData);
        }

    }();

    var DTSortMainChartAreaObject = {
        chart: {
            renderTo: 'divDTSortMainChartArea',
            type: 'pie',
            backgroundColor:null,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0,
            marginTop: 0
        },
        title: {
            text: '',
            align:'left',
            y:40,
            x:20,
            style:{
                    color:_GLOBE_DATA('colorAlertLevel1'),
                    fontSize:'10px'
                }
        },
        credits: {
            enabled: false
        },
        yAxis: {
            title: {
                text: 'Total percent market share'
            }
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%'],
                borderWidth: 0,
                borderColor:'#000'
            }
        },
        tooltip: {
            valueSuffix: ''
        },
        series: [{
            name: '数量',
            data:  _GLOBE_DATA('browserData'),
            size: '90%',
            borderWidth: 0,
            dashStyle: 'longdash',
            dataLabels: {
                formatter: function() {
                    return this.y > 5 ? this.point.name+'['+this.point.y+']' : null;
                },
                color: '#555',
                distance: -40
            }
        }, {
            name: '数量',
            data: _GLOBE_DATA('versionsData'),
            size: '100%',
            innerSize: '100%',
            dataLabels: {
               enabled: false
           }
       }],
       credits: {
        enabled: false
    },
    exporting: {
        enabled : false
    }
};

var DTSortSubChartAreaObject = {
    chart: {
                type: 'bar',
                renderTo: 'divDTSortSubChartArea',
                backgroundColor:null,
                marginLeft: 40,
                marginRight: 10,
                marginBottom: 0,
                marginTop: 30
            },
            title: {
                text: '小型机 - 56台设备',
                align:'center',
                y:10,
                style:{
                    color:_GLOBE_DATA('colorAlertLevel1'),
                    fontSize:'10px'
                }
            },
            xAxis: {
                categories: ['严重','普通','警告','信息'],
            tickWidth:0,
            lineWidth: 0,
            gridLineWidth: 0


            },
            yAxis: {
                min: 0,
                gridLineWidth: 0,
                maxPadding:0,
                title: {
                    text: ''
                },
                labels: {
                    enabled:false
                }
            },
            legend: {
                backgroundColor: null,
                reversed: true,
                borderWidth:0,
                enabled:false
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    colors:[_GLOBE_DATA('colorAlertLevel4'),_GLOBE_DATA('colorAlertLevel3'),_GLOBE_DATA('colorAlertLevel2'),_GLOBE_DATA('colorAlertLevel1')],
                    stacking: 'normal'
                },
                bar:{
                    pointWidth:12,
                    minPointLength:15,
                    borderRadius:2,
                    dataLabels: {
                        enabled:true,
                        align:'center',
                        inside:true,
                        color:'#fff'
                    }
                }
            },
                series: [{
                name: '条数',
                data: [1,2,15,0],
                borderWidth: 0,
                marginRight:10,
                style:{
                    marginRight:10
                },
                color:_GLOBE_DATA('colorAlertLevel1')
            }],
            credits: {
        enabled: false
    },
    exporting: {
        enabled : false
    }
};

var DTAlertListAreaSubObject = {
    chart: {
                type: 'bar',
                renderTo: 'divDTAlertListAreaSub',
                backgroundColor:null,
                marginLeft: 40,
                marginRight: 10,
                marginBottom: 0,
                marginTop: 30
            },
            title: {
                text: '当前告警分级统计',
                align:'center',
                y:10,
                style:{
                    color:_GLOBE_DATA('colorAlertLevel1'),
                    fontSize:'10px'
                }
            },
            xAxis: {
                categories: ['严重','普通','警告','信息'],
            tickWidth:0,
            lineWidth: 0,
            gridLineWidth: 0


            },
            yAxis: {
                min: 0,
                gridLineWidth: 0,
                maxPadding:0,
                title: {
                    text: ''
                },
                labels: {
                    enabled:false
                }
            },
            legend: {
                backgroundColor: null,
                reversed: true,
                borderWidth:0,
                enabled:false
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    colors:[_GLOBE_DATA('colorAlertLevel4'),_GLOBE_DATA('colorAlertLevel3'),_GLOBE_DATA('colorAlertLevel2'),_GLOBE_DATA('colorAlertLevel1')],
                    stacking: 'normal'
                },
                bar:{
                    pointWidth:12,
                    minPointLength:15,
                    borderRadius:2,
                    dataLabels: {
                        enabled:true,
                        align:'center',
                        inside:true,
                        color:'#fff'
                    }
                }
            },
                series: [{
                name: '条数',
                data: [5,2,22,10],
                borderWidth: 0,
                marginRight:10,
                style:{
                    marginRight:10
                },
                color:_GLOBE_DATA('colorAlertLevel1')
            }],
            credits: {
        enabled: false
    },
    exporting: {
        enabled : false
    }
};


