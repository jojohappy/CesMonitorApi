/* 统一命名空间储存全局变量 */
/*
    爱丽
    CC霜1号色
    爱丽
    水晶散粉1号色
    蜗牛面膜2
    */
    var _GLOBE_DATA = (function () {
        var data = {
            /* 浏览器宽高 */
            clientWidth: $(document.body)[0].clientWidth,
            clientHeight: $(document.body)[0].clientHeight

            /* 主绿色RGB */
            ,
            colorMainGreen: 'rgb(50,180,160)'
            /* 严重告警色RGB */
            ,
            colorAlertLevel4: 'rgb(233,29,32)'
            /* 普通告警色RGB */
            ,
            colorAlertLevel3: 'rgb(255,60,0)'
            /* 警告告警色RGB */
            ,
            colorAlertLevel2: 'rgb(228,108,10)'
            /* 信息告警色RGB */
            ,
            colorAlertLevel1: 'rgb(89,89,89)'
            /* DTSortChar*/
            ,
            baseUrl: '',
            windowOriginalFrame: {
                x: 0,
                y: 0
            },
            alertWindowParam: {
                sort: 'priority',
                limit: 10,
                reverse: 1,
                offset: 0
            },
            sortHostData: [],
            typeData: [],
            eventData: [],
            windowArray: [$('#divWindowAlertList'), $('#divWindowAppMonitor'), $('#divWindowEquipment')],
            currentWindowHostId: '',
            windowHostListDom:null,
            windowAlertListPrama:{
                from_date:'',
                end_date:'',
                event_priority:'',
                event_content:''
            },
            MIAChartObject: {
                chart: {
                    renderTo: 'divMIAChart',
                    backgroundColor: null,
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
                        colors: ['white', 'rgb(110,200,180)'],
                        dataLabels: {
                            enabled: false
                        }
                    }
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: '数量',
                    data: [
                    ['', 10],
                    ['', 8]
                    ]
                }]
            },
            DTTimeChartAreaObject: {
                chart: {
                    renderTo: 'divDTTimeChartArea',
                    backgroundColor: null,
                    marginLeft: 0,
                    marginRight: -1,
                    marginBottom: 4,
                    marginTop: -5
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: '当天每小时告警统计',
                    align: 'right',
                    y: 10,
                    x: 0,
                    style: {
                        color: 'rgb(50,180,160)',
                        fontWeight: 'bold'
                    }
                },
                xAxis: {
                    categories: ['0:00 - 0:59', '1:00 - 1:59', '2:00 - 2:59', '3:00 - 3:59', '4:00 - 4:59', '5:00 - 5:59', '6:00 - 6:59', '7:00 - 7:59', '8:00 - 8:59', '9:00 - 9:59', '10:00 - 10:59', '11:00 - 11:59', '12:00~ - 12:59', '13:00 - 13:59', '14:00 - 14:59', '15:00 - 15:59', '16:00 - 16:59', '17:00~ - 17:59', '18:00 - 18:59', '19:00 - 19:59', '20:00 - 20:59', '21:00 - 21:59', '22:00~ - 22:59', '23:00 - 23:59'],
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
            lineColor: 'rgb(50,180,160)',
            gridLineWidth: 1,
            labels: {
                step: 4,
                staggerLines: 1,
                    //rotation:30,
                    enabled: false,
                    style: {
                        color: 'rgb(50,180,160)'
                    }
                },
            },

            yAxis: {
                allowDecimals: false,
                min: 0,
                title: {
                    text: ''
                },
                maxPadding: 0.5,
                gridLineWidth: 1,
                tickWidth: 0,
                lineWidth: 0,
                tickPixelInterval: 20,
                labels: {
                    enabled: false,
                    step: 2,
                    style: {
                        color: 'rgb(50,180,160)'
                    }
                }
            },

            plotOptions: {
                line: {
                    color: 'rgb(50,180,160)',
                    lineWidth: 2,
                    cursor: 'pointer',
                    dashStyle: 'ShortDot',
                    events: {
                        click: function (event) {
                            //alert(event.point.x);
                            /*
                                windowAlertListPrama:{
            from_date:'',
            end_date:'',
            event_priority:'',
            event_content:''
        },
        */
        $('#divAlertListIcon').trigger('click');
    }
},
dataLabels: {
    enabled: true,
    backgroundColor: 'rgb(50,180,160)',
    borderRadius: 4,
    borderWidth: 0,
    y: -10,
    style: {
        color: 'white'
    }
}
},
series: {
    marker: {
        fillColor: '#fff',
        lineWidth: 2,
                        lineColor: 'rgb(50,180,160)' // inherit from series
                    }
                }
            },

            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: '发生告警数量',
                data: []
            }]
        },
        DTSortMainChartAreaObject: {
            chart: {
                renderTo: 'divDTSortMainChartArea',
                type: 'pie',
                backgroundColor: null,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
                marginTop: 0
            },
            title: {
                text: '',
                align: 'left',
                y: 40,
                x: 20,
                style: {
                    color: 'rgb(89,89,89)',
                    fontSize: '10px'
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
                    borderWidth: 1,
                    borderColor: '#eee',
                    events: {
                        click: function (event) {
                            //alert(event.point.x);
                            console.log(event);
                        }
                    }
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            series: [{
                name: '数量',
                data: [],
                size: '90%',
                borderWidth: 0,
                dashStyle: 'longdash',
                dataLabels: {
                    formatter: function () {
                        return this.y > 0 ? this.point.name + '[' + this.point.y + ']' : null;
                    },
                    color: '#555',
                    distance: -40
                }
            }, {
                name: '数量',
                data: [],
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
                enabled: false
            }
        },
        DTAlertListAreaSubObject: {
            chart: {
                type: 'bar',
                renderTo: 'divDTAlertListAreaSub',
                backgroundColor: null,
                marginLeft: 40,
                marginRight: 10,
                marginBottom: 0,
                marginTop: 30
            },
            title: {
                text: '当前告警分级统计',
                align: 'center',
                y: 10,
                style: {
                    color: 'rgb(89,89,89)',
                    fontSize: '10px'
                }
            },
            xAxis: {
                categories: ['严重', '普通', '警告', '信息'],
                tickWidth: 0,
                lineWidth: 0,
                gridLineWidth: 0

            },
            yAxis: {
                min: 0,
                gridLineWidth: 0,
                maxPadding: 0,
                title: {
                    text: ''
                },
                labels: {
                    enabled: false
                }
            },
            legend: {
                backgroundColor: null,
                reversed: true,
                borderWidth: 0,
                enabled: false
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    colors: ['rgb(233,29,32)', 'rgb(255,60,0)', 'rgb(228,108,10)', 'rgb(89,89,89)'],
                    stacking: 'normal'
                },
                bar: {
                    pointWidth: 12,
                    minPointLength: 15,
                    borderRadius: 2,
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        inside: true,
                        color: '#fff'
                    }
                }
            },
            series: [{
                name: '条数',
                data: [],
                borderWidth: 0,
                marginRight: 10,
                style: {
                    marginRight: 10
                },
                color: 'rgb(89,89,89)'
            }],
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            }
        },
        DTSortSubChartAreaObject: {
            chart: {
                type: 'bar',
                renderTo: 'divDTSortSubChartArea',
                backgroundColor: null,
                marginLeft: 40,
                marginRight: 10,
                marginBottom: 0,
                marginTop: 30
            },
            title: {
                text: '',
                align: 'center',
                y: 10,
                style: {
                    color: 'rgb(89,89,89)',
                    fontSize: '10px'
                }
            },
            xAxis: {
                categories: ['严重', '普通', '警告', '信息'],
                tickWidth: 0,
                lineWidth: 0,
                gridLineWidth: 0

            },
            yAxis: {
                min: 0,
                gridLineWidth: 0,
                maxPadding: 0,
                title: {
                    text: ''
                },
                labels: {
                    enabled: false
                }
            },
            legend: {
                backgroundColor: null,
                reversed: true,
                borderWidth: 0,
                enabled: false
            },
            plotOptions: {
                series: {
                    colorByPoint: true,
                    colors: ['rgb(233,29,32)', 'rgb(255,60,0)', 'rgb(228,108,10)', 'rgb(89,89,89)'],
                    stacking: 'normal'
                },
                bar: {
                    pointWidth: 12,
                    minPointLength: 15,
                    borderRadius: 2,
                    dataLabels: {
                        enabled: true,
                        align: 'center',
                        inside: true,
                        color: '#fff'
                    }
                }
            },
            series: [{
                name: '条数',
                data: [],
                borderWidth: 0,
                marginRight: 10,
                style: {
                    marginRight: 10
                },
                color: 'rgb(89,89,89)'
            }],
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            }
        },
        graphChartObject:{
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            chart: {
                zoomType: 'x',
                resetZoomButton: {
                    position: {
                        // align: 'right', // by default
                        // verticalAlign: 'top', // by default
                        x: 0,
                        y: -3
                    },
                    theme: {
                        fill: 'white',
                        stroke: 'silver',
                        r: 0,
                        states: {
                            hover: {
                                fill: 'rgb(50,180,160)',
                                style: {
                                    color: 'white'
                                }
                            }
                        }
                    }
                },
                renderTo: '',
                backgroundColor: null
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime',
                maxZoom: 0, // fourteen days
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: ''
                },
                min:0
            },
            tooltip: {
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineWidth: 1,
                    marker: {
                        enabled: false
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                },
                line:{
                    marker: {
                        enabled: false
                    },
                    shadow: false
                }
            },

            series: []
        },equipmentAlertChartObject: {
            chart: {
                type: 'column',
                backgroundColor: null,
                renderTo: 'divEquipmentAlertChart',
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 30,
                marginTop: 10
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: '最近一周告警数量统计',
                align: 'left',
                x: -4,
                y: 25,
                style: {
                    fontSize: 14,
                    color: 'rgb(120,120,120)'
                }
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                y: 10,
                x: 100,
                borderWidth: 0
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                tickWidth: 0,
                lineWidth: 1,
                lineColor: 'rgb(220,220,220)',
                categories: [],
                labels:{
                    style:{
                        fontSize:'10px'
                    }
                }
            },
            yAxis: {
                min: 0,
                maxPadding: 0.2,
                title: {
                    text: ''
                },
                gridLineWidth: 0
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,

                    dataLabels: {
                        enabled: true,
                        backgroundColor: null,
                        borderWidth: 0,
                        style: {
                            color: 'rgb(120,120,120)'
                        }
                    }
                }
            },
            series: [{
                name: '严重',
                data: [],
                color: 'rgb(233,29,32)'
            }, {
                name: '普通',
                data: [],
                color: 'rgb(255,60,0)'

            }, {
                name: '警告',
                data: [],
                color: 'rgb(228,108,10)'
            }, {
                name: '消息',
                data: [],
                color:  'rgb(89,89,89)'
            }]
        } ,AppMonitorDetailMainTopAllChartLevel4Object : {
            chart: {
                renderTo: 'divAppMonitorDetailMainTopAllChartLevel4',
                backgroundColor: null,
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
                    colors: ['rgb(233,29,32)', 'rgb(250,210,210)'],
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: '数量',
                data: [
                ['正常', 24],
                ['', 36]
                /*data here*/
                ]
            }]
        },AppMonitorDetailMainTopAllChartLevel3Object : {
            chart: {
                renderTo: 'divAppMonitorDetailMainTopAllChartLevel3',
                backgroundColor: null,
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
                    colors: ['rgb(255,60,0)', 'rgb(250,210,210)'],
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: '数量',
                data: [
                ['正常', 12],
                ['', 36]
                /*data here*/
                ]
            }]
        },AppMonitorDetailMainTopAllChartLevel2Object : {
            chart: {
                renderTo: 'divAppMonitorDetailMainTopAllChartLevel2',
                backgroundColor: null,
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
                    colors: [ 'rgb(228,108,10)', 'rgb(250,210,210)'],
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: '数量',
                data: [
                [],
                []
                ]
            }]
        },AppMonitorDetailMainTopAllChartLevel1Object : {
            chart: {
                renderTo: 'divAppMonitorDetailMainTopAllChartLevel1',
                backgroundColor: null,
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
                    colors: [ 'rgb(89,89,89)', 'rgb(200,200,200)'],
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: '数量',
                data: [
                ['正常', 0],
                ['', 139]
                /*data here*/
                ]
            }]
        },
        AppMonitorDetailAllChartObject : {
    chart: {
        renderTo: 'divAppMonitorDetailMainTopAllChart',
        backgroundColor: null,
        type: 'pie',
        marginLeft: -10,
        marginRight: -10,
        marginBottom: -8,
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
            colors: ['rgb(50,180,160)', 'rgb(200,230,200)'],
            dataLabels: {
                enabled: false
            }
        }
    },
    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: '数量',
        data: [
        ['', 0],
        ['', 0]
        /*data here*/
        ]
    }]
},
AppMonitorDetailMainBottomChartObject : {
    chart: {
        renderTo: 'divAppMonitorDetailMainBottom',
        backgroundColor: null,
        marginLeft: 1,
        marginRight: 0,
        marginBottom: 20,
        marginTop: 1
    },
    legend: {
        enabled: false
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: ['0:00 - 0:59', '1:00 - 1:59', '2:00 - 2:59', '3:00 - 3:59', '4:00 - 4:59', '5:00 - 5:59', '6:00 - 6:59', '7:00 - 7:59', '8:00 - 8:59', '9:00 - 9:59', '10:00 - 10:59', '11:00 - 11:59', '12:00 - 12:59', '13:00 - 13:59', '14:00 - 14:59', '15:00 - 15:59', '16:00 - 16:59', '17:00 - 17:59', '18:00 - 18:59', '19:00 - 19:59', '20:00 - 20:59', '21:00 - 21:59', '22:00 - 22:59', '23:00 - 23:59'],
        tickWidth: 1,
        lineWidth: 1,
        lineColor: 'rgb(50,180,160)',
        gridLineWidth: 1,
        labels: {
            step: 4,
            staggerLines: 1,
            //rotation:30,
            enabled: true,
            style: {
                color:'rgb(50,180,160)'
            }
        },
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: ''
        },
        maxPadding: 0.2,
        gridLineWidth: 1,
        lineColor: 'rgb(50,180,160)',
        tickWidth: 1,
        lineWidth: 1,
        tickPixelInterval: 20,
        labels: {
            enabled: false,
            step: 2,
            style: {
                color: 'rgb(50,180,160)'
            }
        }
    },

    plotOptions: {
        line: {
            color: 'rgb(50,180,160)',
            lineWidth: 2,
            cursor: 'pointer',
            dashStyle: 'ShortDot',
            events: {
                click: function (event) {
                    //alert(event.point.x);
                    $('#divAlertListIcon').trigger('click');
                }
            },
            dataLabels: {
                enabled: true,
                backgroundColor: 'rgb(50,180,160)',
                borderRadius: 4,
                borderWidth: 0,
                y: -10,
                style: {
                    color: 'white'
                }
            }
        },
        series: {
            marker: {
                fillColor: '#fff',
                lineWidth: 2,
                lineColor: 'rgb(50,180,160)' // inherit from series
            }
        }
    },

    credits: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: '发生告警数量',
        data: []
    }]
}

    }
    /* 闭包返回 */
    return function (key, val) {
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

$(document).ready(function () {
    initDomSize();
    init();
    initDomEvent();
});

$(window).resize(function () {
    /* 设置元素Size */
    initDomSize();

});

/* 初始化DOM事件 */
var initDomEvent = function () {
    /* 告警列表Icon点击事件 */
    $('#divAlertListIcon').click(function (event) {
        var tempArray = [];
        $('.div-Window-Title').css('background-color', 'rgb(240,240,240)').css('color', 'rgb(180,180,180)').css('border-color', 'rgb(180,180,180)');
        $('#divWindowAlertListTitle').css('background-color', _GLOBE_DATA('colorMainGreen')).css('color', 'white').css('border-color', 'rgb(30,150,120)');
        for (var tempItem in _GLOBE_DATA('windowArray')) {
            if (_GLOBE_DATA('windowArray')[tempItem].attr('id') !== 'divWindowAlertList') {
                tempArray.push(_GLOBE_DATA('windowArray')[tempItem]);
            } else {
                tempArray.splice(0, 0, _GLOBE_DATA('windowArray')[tempItem]);
            }
        }

        _GLOBE_DATA('windowArray', tempArray);
        var zIndexNumber = 4;
        for (var tempItem in _GLOBE_DATA('windowArray')) {
            _GLOBE_DATA('windowArray')[tempItem].css('z-index', zIndexNumber);
            zIndexNumber--;
        }
        $('#divWindowAlertList').height(50).width(50).css('left', $('#divAlertListIcon').offset().left + 'px').css('top', $('#divAlertListIcon').offset().top + 'px').css('display', 'block').animate({
            height: '490px',
            width: '850px',
            top: '100px',
            left: (_GLOBE_DATA('clientWidth') - 800) / 2 + 'px'
        }, {
            duration: 200,
            easing: 'linear',
            complete: function () {
                coverLoadingDiv($('#divWindowAlertMain'));
                var param = {
                    sort: 'priority',
                    reverse: 1,
                    offset: 0,
                    limit: 10
                }
                _GLOBE_DATA('alertWindowParam', param);
                $('#divWindowAlertToolbarLevel').html('等级 ▼').css('margin-top', '-7px').css('border-top', '7px solid rgb(50,180,160)');
                $('#divWindowAlertFooterUserPage').html(1);
                $('#divWindowAlertToolbarEquipment').html('设备&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
                $('#divWindowAlertToolbarStartTime').html('发生时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
                $('#divWindowAlertToolbarDuration').html('持续时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
                $('#divWindowAlertToolbarInfo').html('详细信息&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
                getWindowAlertList(param);
            }
        });
});

$('#divWindowAlertList').bind('mousedown',
    function (event) {
        $('.div-Window-Title').css('background-color', 'rgb(240,240,240)').css('color', 'rgb(180,180,180)').css('border-color', 'rgb(180,180,180)');
        $('#divWindowAlertListTitle').css('background-color', _GLOBE_DATA('colorMainGreen')).css('color', 'white').css('border-color', 'rgb(30,150,120)');
        var tempArray = [];
        for (var tempItem in _GLOBE_DATA('windowArray')) {
            if (_GLOBE_DATA('windowArray')[tempItem].attr('id') !== 'divWindowAlertList') {
                tempArray.push(_GLOBE_DATA('windowArray')[tempItem]);
            } else {
                tempArray.splice(0, 0, _GLOBE_DATA('windowArray')[tempItem]);
            }
        }
        _GLOBE_DATA('windowArray', tempArray);
        var zIndexNumber = 4;
        for (var tempItem in _GLOBE_DATA('windowArray')) {
            _GLOBE_DATA('windowArray')[tempItem].css('z-index', zIndexNumber);
            zIndexNumber--;
        }
    });

$('#divWindowAlertListTitleClose').click(function (event) {
    $('#divWindowAlertList').height(598).width(798).animate({
        height: '90px',
        width: '90px',
        top: $('#divAlertListIcon').offset().top + 'px',
        left: $('#divAlertListIcon').offset().left + 'px'
    }, {
        duration: 200,
        easing: 'linear',
        complete: function () {
            $('#divWindowAlertList').css('display', 'none');
        }
    });
});

$('#divWindowAlertListTitle').bind('mousedown',
    function (event) {

        event.preventDefault();
        var tempObj = $(this).parent();
        var difWidth = event.clientX - tempObj.css('left').split('px')[0];
        var difHeight = event.clientY - tempObj.css('top').split('px')[0];
        $(document).bind('mousemove',
            function (eventMm) {
                tempObj.css('background-color', 'rgba(255,255,255,0.8)');
                if (eventMm.clientY < _GLOBE_DATA('clientHeight')) {
                    tempObj.css('left', eventMm.clientX - difWidth);
                    tempObj.css('top', eventMm.clientY - difHeight);
                }
            });
    });

$('#divWindowAlertListTitle').bind('mouseup',
    function (event) {
        $(this).parent().css('background-color', 'rgb(255,255,255)');
        $(document).unbind('mousemove');
    });

$('#divFilterTitle').click(function (event) {
    $('#divWindowAlertFooterFilter').animate({
        width: '200px'
    }, {
        duration: 200,
        easing: 'linear',
        complete: function () {
            $('#divFilterClose').css('right', '10px');
            $('#divFilterDetail').animate({
                height: '281px'
            });
            $('#divWindowAlertFooterFilter').animate({
                top: '-281px',
                height: '300px'
            });
        }
    });
});

$('#divFilterClose').click(function (event) {
    $('#divWindowAlertFooterFilter').animate({
        top: '0px',
        height: '19px'
    }, {
        duration: 200,
        easing: 'linear',
        complete: function () {
            $('#divFilterClose').css('right', '-10px');
            $('#divFilterDetail').height(0);
            $('#divWindowAlertFooterFilter').animate({
                width: '50px'
            });
        }
    });
});

/* 应用Icon点击事件 */
$('#divAppMonitorIcon').click(function (event) {
    $('.div-Window-Title').css('background-color', 'rgb(240,240,240)').css('color', 'rgb(180,180,180)').css('border-color', 'rgb(180,180,180)');;
    $('#divWindowAppMonitorTitle').css('background-color', _GLOBE_DATA('colorMainGreen')).css('color', 'white').css('border-color', 'rgb(30,150,120)');;
    var tempArray = [];
    for (var tempItem in _GLOBE_DATA('windowArray')) {
        if (_GLOBE_DATA('windowArray')[tempItem].attr('id') !== 'divWindowAppMonitor') {
            tempArray.push(_GLOBE_DATA('windowArray')[tempItem]);
        } else {
            tempArray.splice(0, 0, _GLOBE_DATA('windowArray')[tempItem]);
        }
    }
    _GLOBE_DATA('windowArray', tempArray);
    var zIndexNumber = 4;
    for (var tempItem in _GLOBE_DATA('windowArray')) {
        _GLOBE_DATA('windowArray')[tempItem].css('z-index', zIndexNumber);
        zIndexNumber--;
    }
    $('#divWindowAppMonitor').height(50).width(50).css('left', $('#divAppMonitorIcon').offset().left + 'px').css('top', $('#divAppMonitorIcon').offset().top + 'px').css('display', 'block').animate({
        height: '490px',
        width: '850px',
        top: '120px',
        left: (_GLOBE_DATA('clientWidth') - 800) / 2 + 20 + 'px'
    }, {
        duration: 200,
        easing: 'linear',
        complete: function () {

            coverLoadingDiv($('#ulWindowAppMonitorDetailSide'));

            coverLoadingDiv($('#divAppMonitorDetailMainTopAllChart'));
            coverLoadingDiv($('#divAppMonitorDetailMainTopAllChartLevel4'));
            coverLoadingDiv($('#divAppMonitorDetailMainTopAllChartLevel3'));
            coverLoadingDiv($('#divAppMonitorDetailMainTopAllChartLevel2'));
            coverLoadingDiv($('#divAppMonitorDetailMainTopAllChartLevel1'));

            coverLoadingDiv($('#divAppMonitorDetailMainBottom'));
            getAjaxAllHostInfo('window');
            getAjaxAppTimeEvent();
            //var AppMonitorDetailAllChart = new Highcharts.Chart(AppMonitorDetailAllChartObject);
            //var AppMonitorDetailMainBottomChart = new Highcharts.Chart(AppMonitorDetailMainBottomChartObject);
            //var AppMonitorDetailMainTopAllChartLevel4 = new Highcharts.Chart(AppMonitorDetailMainTopAllChartLevel4Object);
            //var AppMonitorDetailMainTopAllChartLevel3 = new Highcharts.Chart(AppMonitorDetailMainTopAllChartLevel3Object);
            //var AppMonitorDetailMainTopAllChartLevel2 = new Highcharts.Chart(AppMonitorDetailMainTopAllChartLevel2Object);
            //var AppMonitorDetailMainTopAllChartLevel1 = new Highcharts.Chart(AppMonitorDetailMainTopAllChartLevel1Object);
        }
    });
});

$('#divWindowAppMonitor').bind('mousedown',
    function (event) {
        $('.div-Window-Title').css('background-color', 'rgb(240,240,240)').css('color', 'rgb(180,180,180)').css('border-color', 'rgb(180,180,180)');
        $('#divWindowAppMonitorTitle').css('background-color', _GLOBE_DATA('colorMainGreen')).css('color', 'white').css('border-color', 'rgb(30,150,120)');
        var tempArray = [];
        for (var tempItem in _GLOBE_DATA('windowArray')) {
            if (_GLOBE_DATA('windowArray')[tempItem].attr('id') !== 'divWindowAppMonitor') {
                tempArray.push(_GLOBE_DATA('windowArray')[tempItem]);
            } else {
                tempArray.splice(0, 0, _GLOBE_DATA('windowArray')[tempItem]);
            }
        }
        _GLOBE_DATA('windowArray', tempArray);
        var zIndexNumber = 4;
        for (var tempItem in _GLOBE_DATA('windowArray')) {
            _GLOBE_DATA('windowArray')[tempItem].css('z-index', zIndexNumber);
            zIndexNumber--;
        }
    });

$('#divWindowAppMonitorTitleClose').click(function (event) {
    $('#divWindowAppMonitor').height(598).width(798).animate({
        height: '50px',
        width: '50px',
        top: $('#divAppMonitorIcon').offset().top + 'px',
        left: $('#divAppMonitorIcon').offset().left + 'px'
    }, {
        duration: 200,
        easing: 'linear',
        complete: function () {
            $('#divWindowAppMonitor').css('display', 'none');
        }
    });
});

$('#divWindowAppMonitorTitle').bind('mousedown',
    function (event) {

        event.preventDefault();
        var tempObj = $(this).parent();
        var difWidth = event.clientX - tempObj.css('left').split('px')[0];
        var difHeight = event.clientY - tempObj.css('top').split('px')[0];
        $(document).bind('mousemove',
            function (eventMm) {
                tempObj.css('background-color', 'rgba(255,255,255,0.8)');
                if (eventMm.clientY < _GLOBE_DATA('clientHeight')) {
                    tempObj.css('left', eventMm.clientX - difWidth);
                    tempObj.css('top', eventMm.clientY - difHeight);
                }
            });
    });

$('#divWindowAppMonitorTitle').bind('mouseup',
    function (event) {
        $(this).parent().css('background-color', 'rgb(255,255,255)');
        $(document).unbind('mousemove');
    });

$('#divAppMonitorAllButton').bind('click',
    function (event) {
        $('#divWindowAppMonitorDetailMainAppDetail').fadeOut(200, function () {
            $('#divWindowAppMonitorDetailMainAll').fadeIn(200);
            //var AppMonitorDetailAllChart = new Highcharts.Chart(AppMonitorDetailAllChartObject);
            //var AppMonitorDetailMainBottomChart = new Highcharts.Chart(AppMonitorDetailMainBottomChartObject);
            //var AppMonitorDetailMainTopAllChartLevel4 = new Highcharts.Chart(AppMonitorDetailMainTopAllChartLevel4Object);
            //var AppMonitorDetailMainTopAllChartLevel3 = new Highcharts.Chart(AppMonitorDetailMainTopAllChartLevel3Object);
            //var AppMonitorDetailMainTopAllChartLevel2 = new Highcharts.Chart(AppMonitorDetailMainTopAllChartLevel2Object);
            //var AppMonitorDetailMainTopAllChartLevel1 = new Highcharts.Chart(AppMonitorDetailMainTopAllChartLevel1Object);
        });
    });


/* 设备详细Icon点击事件 */
$('#divEquipmentInfoIcon').click(function (event) {
    $('.div-Window-Title').css('background-color', 'rgb(240,240,240)').css('color', 'rgb(180,180,180)').css('border-color', 'rgb(180,180,180)');
    $('#divWindowEquipmentTitle').css('background-color', _GLOBE_DATA('colorMainGreen')).css('color', 'white').css('border-color', 'rgb(30,150,120)');
    var tempArray = [];
    for (var tempItem in _GLOBE_DATA('windowArray')) {
        if (_GLOBE_DATA('windowArray')[tempItem].attr('id') !== 'divWindowEquipment') {
            tempArray.push(_GLOBE_DATA('windowArray')[tempItem]);
        } else {
            tempArray.splice(0, 0, _GLOBE_DATA('windowArray')[tempItem]);
        }
    }
    _GLOBE_DATA('windowArray', tempArray);
    var zIndexNumber = 4;
    for (var tempItem in _GLOBE_DATA('windowArray')) {
        _GLOBE_DATA('windowArray')[tempItem].css('z-index', zIndexNumber);
        zIndexNumber--;
    }
    $('#divWindowEquipment').height(50).width(50).css('left', $('#divEquipmentInfoIcon').offset().left + 'px').css('top', $('#divEquipmentInfoIcon').offset().top + 'px').css('display', 'block').animate({
        height: '490px',
        width: '850px',
        top: '140px',
        left: (_GLOBE_DATA('clientWidth') - 800) / 2 + 40 + 'px'
    }, {
        duration: 200,
        easing: 'linear',
        complete: function () {
            $('#divWindowEquipmentDisplayAreaCharts').hide();
            $('#divWindowEquipmentDisplayAreaMonitorItem').hide();
            coverLoadingDiv($('#inputWindowEquipmentDetailSideAll'));
            getAjaxAllHostInfo('detailWindow');
        }
    });
});

$('#divWindowEquipment').bind('mousedown',
    function (event) {
        $('.div-Window-Title').css('background-color', 'rgb(240,240,240)').css('color', 'rgb(180,180,180)').css('border-color', 'rgb(180,180,180)');
        $('#divWindowEquipmentTitle').css('background-color', _GLOBE_DATA('colorMainGreen')).css('color', 'white').css('border-color', 'rgb(30,150,120)');
        var tempArray = [];
        for (var tempItem in _GLOBE_DATA('windowArray')) {
            if (_GLOBE_DATA('windowArray')[tempItem].attr('id') !== 'divWindowEquipment') {
                tempArray.push(_GLOBE_DATA('windowArray')[tempItem]);
            } else {
                tempArray.splice(0, 0, _GLOBE_DATA('windowArray')[tempItem]);
            }
        }
        _GLOBE_DATA('windowArray', tempArray);
        var zIndexNumber = 4;
        for (var tempItem in _GLOBE_DATA('windowArray')) {
            _GLOBE_DATA('windowArray')[tempItem].css('z-index', zIndexNumber);
            zIndexNumber--;
        }
    });

$('#divWindowEquipmentTitleClose').click(function (event) {
    $('#divWindowEquipment').height(598).width(798).animate({
        height: '50px',
        width: '50px',
        top: $('#divEquipmentInfoIcon').offset().top + 'px',
        left: $('#divEquipmentInfoIcon').offset().left + 'px'
    }, {
        duration: 200,
        easing: 'linear',
        complete: function () {
            $('#divWindowEquipment').css('display', 'none');
        }
    });
});

$('#divWindowEquipmentTitle').bind('mousedown',
    function (event) {

        event.preventDefault();
        var tempObj = $(this).parent();
        var difWidth = event.clientX - tempObj.css('left').split('px')[0];
        var difHeight = event.clientY - tempObj.css('top').split('px')[0];
        $(document).bind('mousemove',
            function (eventMm) {
                tempObj.css('background-color', 'rgba(255,255,255,0.8)');
                if (eventMm.clientY < _GLOBE_DATA('clientHeight')) {
                    tempObj.css('left', eventMm.clientX - difWidth);
                    tempObj.css('top', eventMm.clientY - difHeight);
                }
            });
    });

$('#divWindowEquipmentTitle').bind('mouseup',
    function (event) {
        $(this).parent().css('background-color', 'rgb(255,255,255)');
        $(document).unbind('mousemove');
    });


$('#divWindowEquipmentBaseInfo').bind('click',
    function (event) {
        $(this).attr('class', 'div-Window-Equipment-Base-Info div-Window-Equipment-Label-High').css('border-bottom-color', 'white');
        $('#divWindowEquipmentCharts').attr('class', 'div-Window-Equipment-Charts div-Window-Equipment-Label-Low').css('border-bottom-color', 'rgb(200,200,200)');
        $('#divWindowEquipmentItem').attr('class', 'div-Window-Equipment-Item div-Window-Equipment-Label-Low').css('border-bottom-color', 'rgb(200,200,200)');
        $('.div-Window-Equipment-Display-Area-Content').fadeOut(200);
        $('#divWindowEquipmentDisplayAreaBaseInfo').fadeIn(200);
    });

$('#divWindowEquipmentCharts').bind('click',
    function (event) {

        $(this).attr('class', 'div-Window-Equipment-Charts div-Window-Equipment-Label-High').css('border-bottom-color', 'white');;
        $('#divWindowEquipmentBaseInfo').attr('class', 'div-Window-Equipment-Base-Info div-Window-Equipment-Label-Low').css('border-bottom-color', 'rgb(200,200,200)');
        $('#divWindowEquipmentItem').attr('class', 'div-Window-Equipment-Item div-Window-Equipment-Label-Low').css('border-bottom-color', 'rgb(200,200,200)');
        $('.div-Window-Equipment-Display-Area-Content').fadeOut(200);
        $('#divWindowEquipmentDisplayAreaCharts').fadeIn(200,function(){
            var tempChild = $('#divWindowEquipmentDisplayAreaChartsListContent').find('.div-Equipment-Chart');
            var totalWidth = 0;
            var tempChildCount = tempChild.length;
            for (var i = 0; i < tempChildCount; i++) {
                totalWidth = totalWidth + $(tempChild[i]).width() + 20;
            }
            $('#divWindowEquipmentDisplayAreaChartsListContent').width(totalWidth);
        });

            //coverLoadingDiv($('#divWindowEquipmentDisplayAreaChartsList'));
            //getAjaxHostCharts();

        });

$('#divWindowEquipmentItem').bind('click',
    function (event) {
        $(this).attr('class', 'div-Window-Equipment-Item div-Window-Equipment-Label-High').css('border-bottom-color', 'white');
        $('#divWindowEquipmentBaseInfo').attr('class', 'div-Window-Equipment-Base-Info div-Window-Equipment-Label-Low').css('border-bottom-color', 'rgb(200,200,200)');
        $('#divWindowEquipmentCharts').attr('class', 'div-Window-Equipment-Charts div-Window-Equipment-Label-Low').css('border-bottom-color', 'rgb(200,200,200)');
        $('.div-Window-Equipment-Display-Area-Content').fadeOut(200);
        $('#divWindowEquipmentDisplayAreaMonitorItem').fadeIn(200);
            //coverLoadingDiv($('#divWindowEquipmentDisplayAreaMonitorItemLabel'));
            //getAjaxHostItemList();
        });

$('#divWindowAlertToolbarLevel').bind('click',
    function (event) {
        var param = {
            sort: 'priority',
            reverse: 0,
            offset: 0,
            limit: 10
        };
        if ($('#divWindowAlertToolbarLevel').html() == '等级&nbsp;&nbsp;&nbsp;' || $('#divWindowAlertToolbarLevel').html() == '等级 ▼') {
            $('#divWindowAlertToolbarLevel').html('等级 ▲');
            param.reverse = 0;
        } else if ($('#divWindowAlertToolbarLevel').html() == '等级 ▲') {
            $('#divWindowAlertToolbarLevel').html('等级 ▼');
            param.reverse = 1;
        }
        $('#divWindowAlertToolbarLevel').css('margin-top', '-7px').css('border-top', '7px solid rgb(50,180,160)');
        $('#divWindowAlertFooterUserPage').html(1);
        $('#divWindowAlertToolbarEquipment').html('设备&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarStartTime').html('发生时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarDuration').html('持续时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarInfo').html('详细信息&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');

        coverLoadingDiv($('#divWindowAlertMain'));
        _GLOBE_DATA('alertWindowParam', param);
        getWindowAlertList(param);

    });

$('#divWindowAlertToolbarEquipment').bind('click',
    function (event) {
        var param = {
            sort: 'host',
            reverse: 0,
            offset: 0,
            limit: 10
        };
        if ($('#divWindowAlertToolbarEquipment').html() == '设备&nbsp;&nbsp;&nbsp;' || $('#divWindowAlertToolbarEquipment').html() == '设备 ▼') {
            $('#divWindowAlertToolbarEquipment').html('设备 ▲');
            param.reverse = 0;
        } else if ($('#divWindowAlertToolbarEquipment').html() == '设备 ▲') {
            $('#divWindowAlertToolbarEquipment').html('设备 ▼');
            param.reverse = 1;
        }
        $('#divWindowAlertToolbarEquipment').css('margin-top', '-7px').css('border-top', '7px solid rgb(50,180,160)');
        $('#divWindowAlertFooterUserPage').html(1);
        $('#divWindowAlertToolbarLevel').html('等级&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarStartTime').html('发生时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarDuration').html('持续时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarInfo').html('详细信息&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');

        coverLoadingDiv($('#divWindowAlertMain'));
        _GLOBE_DATA('alertWindowParam', param);
        getWindowAlertList(param);
    });

$('#divWindowAlertToolbarStartTime').bind('click',
    function (event) {
        var param = {
            sort: 'clock',
            reverse: 0,
            offset: 0,
            limit: 10
        };
        if ($('#divWindowAlertToolbarStartTime').html() == '发生时间&nbsp;&nbsp;&nbsp;' || $('#divWindowAlertToolbarStartTime').html() == '发生时间 ▼') {
            $('#divWindowAlertToolbarStartTime').html('发生时间 ▲');
            param.reverse = 0;
        } else if ($('#divWindowAlertToolbarStartTime').html() == '发生时间 ▲') {
            $('#divWindowAlertToolbarStartTime').html('发生时间 ▼');
            param.reverse = 1;
        }
        $('#divWindowAlertToolbarStartTime').css('margin-top', '-7px').css('border-top', '7px solid rgb(50,180,160)');
        $('#divWindowAlertFooterUserPage').html(1);
        $('#divWindowAlertToolbarLevel').html('等级&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarEquipment').html('设备&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarDuration').html('持续时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarInfo').html('详细信息&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');

        coverLoadingDiv($('#divWindowAlertMain'));
        _GLOBE_DATA('alertWindowParam', param);
        getWindowAlertList(param);
    });

$('#divWindowAlertToolbarDuration').bind('click',
    function (event) {
        var param = {
            sort: 'during_clock',
            reverse: 0,
            offset: 0,
            limit: 10
        };
        if ($('#divWindowAlertToolbarDuration').html() == '持续时间&nbsp;&nbsp;&nbsp;' || $('#divWindowAlertToolbarDuration').html() == '持续时间 ▼') {
            $('#divWindowAlertToolbarDuration').html('持续时间 ▲');
            param.reverse = 0;
        } else if ($('#divWindowAlertToolbarDuration').html() == '持续时间 ▲') {
            $('#divWindowAlertToolbarDuration').html('持续时间 ▼');
            param.reverse = 1;
        }
        $('#divWindowAlertToolbarDuration').css('margin-top', '-7px').css('border-top', '7px solid rgb(50,180,160)');
        $('#divWindowAlertFooterUserPage').html(1);
        $('#divWindowAlertToolbarLevel').html('等级&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarEquipment').html('设备&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarStartTime').html('发生时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarInfo').html('详细信息&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');

        coverLoadingDiv($('#divWindowAlertMain'));
        _GLOBE_DATA('alertWindowParam', param);
        getWindowAlertList(param);
    });

$('#divWindowAlertToolbarInfo').bind('click',
    function (event) {
        var param = {
            sort: 'information',
            reverse: 0,
            offset: 0,
            limit: 10
        };
        if ($('#divWindowAlertToolbarInfo').html() == '详细信息&nbsp;&nbsp;&nbsp;' || $('#divWindowAlertToolbarInfo').html() == '详细信息 ▼') {
            $('#divWindowAlertToolbarInfo').html('详细信息 ▲');
            param.reverse = 0;
        } else if ($('#divWindowAlertToolbarInfo').html() == '详细信息 ▲') {
            $('#divWindowAlertToolbarInfo').html('详细信息 ▼');
            param.reverse = 1;
        }
        $('#divWindowAlertToolbarInfo').css('margin-top', '-7px').css('border-top', '7px solid rgb(50,180,160)');
        $('#divWindowAlertFooterUserPage').html(1);
        $('#divWindowAlertToolbarLevel').html('等级&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarEquipment').html('设备&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarStartTime').html('发生时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');
        $('#divWindowAlertToolbarDuration').html('持续时间&nbsp;&nbsp;&nbsp;').css('margin-top', '0px').css('border-top', '0px solid rgb(50,180,160)');

        coverLoadingDiv($('#divWindowAlertMain'));
        _GLOBE_DATA('alertWindowParam', param);
        getWindowAlertList(param);
    });

$('#divWindowAlertFooterFirstPage').bind('click',
    function (event) {

        var currentPage = parseInt($('#divWindowAlertFooterUserPage').html());
        if (currentPage != 1) {

            $('#divWindowAlertFooterUserPage').html(1);
            coverLoadingDiv($('#divWindowAlertMain'));
            var param = {
                sort: _GLOBE_DATA('alertWindowParam').sort,
                reverse: _GLOBE_DATA('alertWindowParam').reverse,
                offset: 0
            }
            _GLOBE_DATA('alertWindowParam', param);
            getWindowAlertList(param);
        }
    });

$('#divWindowAlertFooterLastPage').bind('click',
    function (event) {
        var currentPage = parseInt($('#divWindowAlertFooterUserPage').html());
        var allPage = parseInt($('#divWindowAlertFooterAllPage').html());
        if (currentPage != allPage) {

            $('#divWindowAlertFooterUserPage').html(allPage);
            coverLoadingDiv($('#divWindowAlertMain'));
            var param = {
                sort: _GLOBE_DATA('alertWindowParam').sort,
                reverse: _GLOBE_DATA('alertWindowParam').reverse,
                offset: (allPage - 1) * 10
            }
            _GLOBE_DATA('alertWindowParam', param);
            getWindowAlertList(param);
        }
    });

$('#divWindowAlertFooterPrevPage').bind('click',
    function (event) {
        var currentPage = parseInt($('#divWindowAlertFooterUserPage').html());
        if (currentPage > 1) {

            $('#divWindowAlertFooterUserPage').html(currentPage - 1);
            coverLoadingDiv($('#divWindowAlertMain'));
            var param = {
                sort: _GLOBE_DATA('alertWindowParam').sort,
                reverse: _GLOBE_DATA('alertWindowParam').reverse,
                offset: (currentPage - 2) * 10
            }
            _GLOBE_DATA('alertWindowParam', param);
            getWindowAlertList(param);
        }
    });

$('#divWindowAlertFooterNextPage').bind('click',
    function (event) {
        var currentPage = parseInt($('#divWindowAlertFooterUserPage').html());
        var allPage = parseInt($('#divWindowAlertFooterAllPage').html());
        if (allPage > currentPage) {

            $('#divWindowAlertFooterUserPage').html(currentPage + 1);
            coverLoadingDiv($('#divWindowAlertMain'));
            var param = {
                sort: _GLOBE_DATA('alertWindowParam').sort,
                reverse: _GLOBE_DATA('alertWindowParam').reverse,
                offset: currentPage * 10
            }
            _GLOBE_DATA('alertWindowParam', param);
            getWindowAlertList(param);
        }
    });

$('#inputWindowEquipmentDetailSideSearch').bind('input',
    function (event) {
        if($(this).val().length>0){
            if($('#inputWindowEquipmentDetailSideAll').find('.div-Equipment-Type-Title-Status').length>0){
                $('#inputWindowEquipmentDetailSideAll').html('').hide();
            }else{
                $('#inputWindowEquipmentDetailSideAll').html('');
            }

            $('#inputWindowEquipmentDetailSideAll').append($(_GLOBE_DATA('windowHostListDom')).find('.div-Equipment-Object-Text:contains("' + $(this).val() + '")').width(130).css('margin-top','10px').css('margin-bottom','0px')).fadeIn(200);
            $('.div-Equipment-Object-Text').bind('click',
                function (event) {
                    var that = this;
                    divEquipmentObjectTextClickEvent(that);
                });
        }else{
            $('#inputWindowEquipmentDetailSideAll').html('').hide();
            $('#inputWindowEquipmentDetailSideAll').append($(_GLOBE_DATA('windowHostListDom'))).fadeIn(200);

            $('.div-Equipment-Type-Title').bind('click',
                function (event) {
                    $($(this).next()).slideToggle(200);
                    $($(this).children('.div-Equipment-Type-Title-Status')).html($($(this).children('.div-Equipment-Type-Title-Status')).html() === '+' ? '-' : '+');
                });

            $('.div-Equipment-Group-Title').bind('click',
                function (event) {
                    $($(this).next()).slideToggle(200);
                    $($(this).children('.div-Equipment-Group-Title-Status')).html($($(this).children('.div-Equipment-Group-Title-Status')).html() === '+' ? '-' : '+');
                });

            $('.div-Equipment-Object-Status').bind('click',
                function (event) {
                    if ($(this).html() == '✩') {
                        $(this).html('<img src="/static/img/loading_s.gif">');
                        favouriteHostAjax($(this).attr('hostId'), $(this));
                    } else if ($(this).html() == '✭') {
                        $(this).html('<img src="/static/img/loading_s.gif">');
                        unFavouriteHostAjax($(this).attr('hostId'), $(this));
                    }
                });

            $('.div-Equipment-Object-Text').bind('click',
                function (event) {
                    var that = this;
                    divEquipmentObjectTextClickEvent(that);
                });
        }
    });

$('#divWindowEquipmentDetailSideChooseAll').bind('click',
    function (event) {
        $('#inputWindowEquipmentDetailSideSearch').prop('disabled', false);
        $(this).css('color','white').css('backgroundColor',_GLOBE_DATA('colorMainGreen'));
        $('#divWindowEquipmentDetailSideChooseFav').css('color',_GLOBE_DATA('colorMainGreen')).css('backgroundColor','transparent');
        $('#inputWindowEquipmentDetailSideAll').html('').hide();
        $('#inputWindowEquipmentDetailSideAll').append($(_GLOBE_DATA('windowHostListDom'))).fadeIn(200);

        $('.div-Equipment-Type-Title').bind('click',
            function (event) {
                $($(this).next()).slideToggle(200);
                $($(this).children('.div-Equipment-Type-Title-Status')).html($($(this).children('.div-Equipment-Type-Title-Status')).html() === '+' ? '-' : '+');
            });

        $('.div-Equipment-Group-Title').bind('click',
            function (event) {
                $($(this).next()).slideToggle(200);
                $($(this).children('.div-Equipment-Group-Title-Status')).html($($(this).children('.div-Equipment-Group-Title-Status')).html() === '+' ? '-' : '+');
            });

        $('.div-Equipment-Object-Status').bind('click',
            function (event) {
                if ($(this).html() == '✩') {
                    $(this).html('<img src="/static/img/loading_s.gif">');
                    favouriteHostAjax($(this).attr('hostId'), $(this));
                } else if ($(this).html() == '✭') {
                    $(this).html('<img src="/static/img/loading_s.gif">');
                    unFavouriteHostAjax($(this).attr('hostId'), $(this));
                }
            });

        $('.div-Equipment-Object-Text').bind('click',
            function (event) {
                var that = this;
                divEquipmentObjectTextClickEvent(that);
            });

    });

$('#divWindowEquipmentDetailSideChooseFav').bind('click',
    function (event) {
        $('#inputWindowEquipmentDetailSideSearch').prop('disabled', true);
        $(this).css('color','white').css('backgroundColor',_GLOBE_DATA('colorMainGreen'));
        $('#divWindowEquipmentDetailSideChooseAll').css('color',_GLOBE_DATA('colorMainGreen')).css('backgroundColor','transparent');

        $('#inputWindowEquipmentDetailSideAll').html('').append($(_GLOBE_DATA('windowHostListDom')).find('.div-Equipment-Object-Status:contains("✭")').next().width(130).css('margin-top','10px').css('margin-bottom','0px')).fadeIn(200);
        $('.div-Equipment-Object-Text').bind('click',
            function (event) {
                var that = this;
                divEquipmentObjectTextClickEvent(that);
            });
    });



};

var initDomSize = function () {
    _GLOBE_DATA('clientWidth', $(document.body)[0].clientWidth);
    _GLOBE_DATA('clientHeight', $(document.body)[0].clientHeight);
    $('#divDTTimeChartArea').width(_GLOBE_DATA('clientWidth') - 555);
    $('#divDTIconArea').height(_GLOBE_DATA('clientHeight') - 290);
    /*
    if (_GLOBE_DATA('clientHeight') < 610) {
        $('#divDTIconArea').width(340);
        $('#divDTIconArea .div-DT-Icon').width(100).height(100);
    } else if (_GLOBE_DATA('clientHeight') < 830) {
        $('#divDTIconArea').width(230);
        $('#divDTIconArea .div-DT-Icon').width(100).height(100);
    } else {
        $('#divDTIconArea .div-DT-Icon').width((_GLOBE_DATA('clientHeight') - 290 - 10) / 5 - 10).height((_GLOBE_DATA('clientHeight') - 290 - 10) / 5 - 10);
        $('#divDTIconArea').width((_GLOBE_DATA('clientHeight') - 290 - 10) / 5 - 10 + 30);
    }
    */
    $('#divDTIconArea .div-DT-Icon').width((_GLOBE_DATA('clientHeight') - 290 - 10) / 5 - 10).height((_GLOBE_DATA('clientHeight') - 290 - 10) / 5 - 10);
    $('#divDTIconArea').width((_GLOBE_DATA('clientHeight') - 290 - 10) / 5 - 10 + 30);
    


    $('#divDTSortChartArea').height(_GLOBE_DATA('clientHeight') - 310).width((_GLOBE_DATA('clientWidth') - $('#divDTIconArea').width()) / 2.5);
    $('#divDTSortMainChartArea').height($('#divDTSortChartArea').height() * 0.7 - 40);
    $('#divDTAlertListArea').height(_GLOBE_DATA('clientHeight') - 310).width(_GLOBE_DATA('clientWidth') - $('#divDTIconArea').width() - $('#divDTSortChartArea').width() - 20);
    $('#divDTAlertListAreaMain').height($('#divDTAlertListArea').height() * 0.7 - 30).width($('#divDTAlertListArea').width());
};

var init = function () {
    fullScren();

    $('input').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
    });
    //_GLOBE_DATA('divMIAChartTextCount', window.setInterval(divMIAChartTextCount, 500 / 78));

    coverLoadingDiv($('#divNDAFunctionalNumber'));
    coverLoadingDiv($('#divDTAlertListAreaMain'));
    coverLoadingDiv($('#divDTTimeChartArea'));
    coverLoadingDiv($('#divDTSortMainChartArea'));
    coverLoadingDiv($('#divDTAlertListAreaSub'));

    getAjaxAllHostInfo('deskTop');
    getAjaxDTAlertList();
    getAjaxTimeEvent();


    /*
        var AppMonitorIconChart = new Highcharts.Chart(AppMonitorIconChartObject);
        var FavoritesIconChart = new Highcharts.Chart(FavoritesIconChartObject);
        */
    };

    var fullScren = function () {
    //var wsh = new ActiveXObject("WScript.Shell"); wsh.sendKeys("{F11}");
};

var coverLoadingDiv = function (loadingDiv) {
    loadingDiv.html('<div class="div-loading" style="margin-top:' + (loadingDiv.height() / 2 - 32) + 'px' + '"><img src="/static/img/loading.gif" class="img-loading"><br>载入中</div>');
}

var unCoverLoadingDiv = function (loadingDiv, fun) {
    loadingDiv.children('.div-loading').fadeOut(300, fun);
}

var coverErrorDiv = function (errorDiv, fun, flag) {
    errorDiv.html('<div class="div-error" style="margin-top:' + (errorDiv.height() / 2 - 32) + 'px' + '"><img src="/static/img/refresh.png" class="img-loading"><br>载入失败</div>');
    $(errorDiv.children('.div-error')).click(function () {
        errorDiv.html('<div class="div-loading" style="margin-top:' + (errorDiv.height() / 2 - 32) + 'px' + '"><img src="/static/img/loading.gif" class="img-loading"><br>载入中</div>');
        fun(flag);
    });

}

var getAjaxAllHostInfo = function (flag) {
    var tempUrl = '';
    if (flag === 'deskTop') {
        tempUrl = _GLOBE_DATA('baseUrl') + '/api/classifications/';
    } else if (flag === 'window') {
        tempUrl = _GLOBE_DATA('baseUrl') + '/api/classifications/services/';
    } else if (flag === 'detailWindow') {
        tempUrl = _GLOBE_DATA('baseUrl') + '/api/classifications/';
    }
    $.ajax({
        type: 'get',
        url: tempUrl,
        dataType: 'json',
        cache: false,
        timeout: 20000,
        success: function (data, textStatus) {
            if (flag === 'deskTop') {
                loadingMainInfo(data);
                loadingSortInfo(data);
            } else if (flag === 'window') {
                loadingAppList(data);
            } else if (flag === 'detailWindow') {
                loadingHostDetailSide(data)
            }
        },
        error: function () {
            if (flag === 'deskTop') {
                coverErrorDiv($('#divNDAFunctionalNumber'), getAjaxAllHostInfo, flag);
                coverErrorDiv($('#divDTSortMainChartArea'), getAjaxAllHostInfo, flag);
            } else {
                coverErrorDiv($('#ulWindowAppMonitorDetailSide'), getAjaxAllHostInfo, flag);
            }
        }
    });
}

var getAjaxDTAlertList = function () {

    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/events/',
        data: {
            sort: 'priority',
            limit: 0,
            reverse: 1
        },
        dataType: 'json',
        cache: false,
        timeout: 6000,
        success: function (data, textStatus) {
            loadingDTAlertListData(data, 'deskTop');
        },
        error: function () {
            coverErrorDiv($('#divDTAlertListAreaMain'), getAjaxDTAlertList);
        }
    });
}

var getWindowAlertList = function (param) {
    $('#divWindowAlertFooterCover').show();
    $('.div-Window-Alert-Toolbar-Cover').show();
    $('#divWindowAlertFooterPageInfo').html('共' + '?' + '条记录，当前页显示第' + '?' + '条 - 第' + '?' + '条');
    $('#divWindowAlertFooterAllPage').html('?');
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/events/history/',
        data: {
            sort: param.sort,
            limit: 10,
            reverse: param.reverse,
            offset: param.offset
        },
        dataType: 'json',
        cache: false,
        timeout: 15000,
        success: function (data, textStatus, jqXHR) {
            loadingDTAlertListData(data, 'window');
        },
        error: function () {
            coverErrorDiv($('#divWindowAlertMain'), getWindowAlertList, param);
        }
    });
}

var getAjaxTimeEvent = function () {
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/events_statistics/',
        dataType: 'json',
        cache: false,
        timeout: 6000,
        success: function (data, textStatus) {
            loadingDTTimeChartData(data);
        },
        error: function () {
            coverErrorDiv($('#divDTTimeChartArea'), getAjaxTimeEvent);
        }
    });
}

var getAjaxAppTimeEvent = function () {
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/events_statistics/',
        dataType: 'json',
        cache: false,
        timeout: 6000,
        success: function (data, textStatus) {
            loadingAppTimeChartData(data);
        },
        error: function () {
            coverErrorDiv($('#divAppMonitorDetailMainBottom'), getAjaxAppTimeEvent);
        }
    });
}


var favouriteHostAjax = function (hostId, jQObject) {
    $.ajax({
        type: 'POST',
        url: _GLOBE_DATA('baseUrl') + '/api/favourites/',
        data: '{"hostid":' + hostId + '}',
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        cache: false,
        timeout: 6000,
        complete: function (jqXHR) {
            if (jqXHR.status == 201) {
                favouriteHostSuccess(jQObject);
            } else {
                favouriteHostError(jQObject);
            }
        }
    });
}

var unFavouriteHostAjax = function (hostId, jQObject) {
    $.ajax({
        type: 'DELETE',
        url: _GLOBE_DATA('baseUrl') + '/api/favourites/',
        data: {
            hostid: hostId
        },
        dataType: 'json',
        cache: false,
        timeout: 6000,
        complete: function (jqXHR) {
            if (jqXHR.status == 204) {
                favouriteHostError(jQObject);
            } else {
                favouriteHostSuccess(jQObject);
            }
        }
    });
}

var getAjaxHostCharts = function () {
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/graphs/host/' + _GLOBE_DATA('currentWindowHostId') + '/',
        dataType: 'json',
        cache: false,
        timeout: 6000,
        success: function (data, textStatus) {
            loadingHostCharts(data);
        },
        error: function () {
            coverErrorDiv($('#divWindowEquipmentDisplayAreaChartsList'), getAjaxHostCharts);
        }
    });
}

var getAjaxHostEventCount = function(){
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/events_statistics_week/',
        data:{
            hostid:_GLOBE_DATA('currentWindowHostId') 
        },
        dataType: 'json',
        cache: false,
        timeout: 6000,
        success: function (data, textStatus) {
            loadHostEventCount(data);
        },
        error: function () {
            coverErrorDiv($('#getAjaxHostEventCount'), getAjaxHostCharts);
        }
    });
}


var getAjaxHostChartsData = function (graphId) {
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/graphs/' + graphId + '/',
        data:{
            date_type:1
        },
        dataType: 'json',
        cache: false,
        timeout: 6000,
        success: function (data, textStatus) {
            darwHostChart(data);
        },
        error: function () {
            coverErrorDiv($('#divWindowEquipmentDisplayAreaChartsMain'), getAjaxHostCharts,graphId);
        }
    });
}

var getAjaxItemChartsData = function (itemId) {
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/graphs/item/' + itemId + '/',
        data:{
            date_type:1
        },
        dataType: 'json',
        cache: false,
        timeout: 6000,
        success: function (data, textStatus) {
            darwItemChart(data);
        },
        error: function () {
            coverErrorDiv($('#divWindowEquipmentDisplayAreaMonitorItemChart'), getAjaxItemChartsData,itemId);
        }
    });
}

var getAjaxHostItemList = function(){
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/apps/host/' + _GLOBE_DATA('currentWindowHostId') + '/',
        dataType: 'json',
        cache: false,
        timeout: 20000,
        success: function (data, textStatus) {
            loadingHostItemList(data);
        },
        error: function () {
            coverErrorDiv($('#divWindowEquipmentDisplayAreaMonitorItemLabel'), getAjaxHostItemList);
        }
    });
}

var getAjaxAppItemList= function(hostId){
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/items/host/' + hostId+ '/',
        dataType: 'json',
        cache: false,
        timeout: 20000,
        success: function (data, textStatus) {
            loadingAppItemList(data);
        },
        error: function () {
            coverErrorDiv($('#ulAppMonitorInfo'), getAjaxAppItemList);
        }
    });
}

var getAjaxAppStatus= function(hostId){
    $.ajax({
        type: 'get',
        url: _GLOBE_DATA('baseUrl') + '/api/events_statistics_services_host/',
        data:{
            hostid:hostId
        },
        dataType: 'json',
        cache: false,
        timeout: 20000,
        success: function (data, textStatus) {
            loadingAppStatus(data);
        },
        error: function () {
            //coverErrorDiv($('#ulAppMonitorInfo'), getAjaxAppStatus);
        }
    });
}

var loadingMainInfo = function (data) {
    var hostTypeCount = data.groupsclassifications.length;
    var allHostCount = 0;
    var okHostCount = 0;
    for (var i = 0; i < hostTypeCount; i++) {
        var tempTypeObject = data.groupsclassifications[i];
        var hostGroupCount = tempTypeObject.groups.length;

        for (var j = 0; j < hostGroupCount; j++) {
            var tempGroupObject = data.groupsclassifications[i].groups[j];
            var hostHostCount = tempGroupObject.hosts.length;
            allHostCount = allHostCount + hostHostCount;

            for (var k = 0; k < hostHostCount; k++) {
                var tempHostObject = data.groupsclassifications[i].groups[j].hosts[k];
                var hostEventCount = tempHostObject.events[0].count;
                hostEventCount = hostEventCount+tempHostObject.events[1].count;
                hostEventCount = hostEventCount+tempHostObject.events[2].count;
                hostEventCount = hostEventCount+tempHostObject.events[3].count;
                if (hostEventCount == 0) {
                    okHostCount++;
                }
            }
        }
    }

    _GLOBE_DATA('MIAChartObject').series[0].data[0][1] = okHostCount;
    _GLOBE_DATA('MIAChartObject').series[0].data[1][1] = allHostCount - okHostCount;
    unCoverLoadingDiv($('#divNDAFunctionalNumber'), function () {
        $('#divNDAFunctionalNumber').hide().html(okHostCount).fadeIn(300);
        $('#divMIAStaticText').fadeIn(300);
        $('#divMIAChartTextStatic').fadeIn(300);
        $('#divMIAChartText').html((okHostCount / allHostCount * 100).toFixed(2) + '%');
        var MIAChart = new Highcharts.Chart(_GLOBE_DATA('MIAChartObject'));
    });
}

    var loadingAppItemList = function(data){
        var itemCount = data.items.length;
        var tempHtml = '';
        for (var i = 0; i < itemCount; i++) {
            tempHtml = tempHtml+'<li class="li-App-Monitor-Info">'
                                    +'<div class="div-App-Monitor-Info-Status div-App-Monitor-Info-Status-Ok">正常</div>'
                                    +'<div class="div-App-Monitor-Info-type">'+data.items[i].key_.split('[')[0]+'</div>'
                                    +'<div class="div-App-Monitor-Info-Detail">'+data.items[i].key_.split('[')[1]+'</div>'
                                +'</li>';
        }
        unCoverLoadingDiv($('#ulAppMonitorInfo'), function () {
             $('#ulAppMonitorInfo').html(tempHtml);
        });
       
    }

    var loadingAppStatus= function(data){
        var todayStatusCount = data.events_statistics_today.length;
        var tempTodayHtml='';
        var yesterdayStatusCount = data.events_statistics_yesterday.length;
        var tempYesterdayHtml='';
        for(var i=0;i<todayStatusCount;i++){
            var tempClass = (data.events_statistics_today[i].status=='OK')?'green-bg':'level3-bg';
            var tempWidth = (data.events_statistics_today[i].during/(24*60))*100;
            tempTodayHtml = tempTodayHtml +'<div class="div-App-Time-Chart-Data-block '+tempClass+'" style="width:'+tempWidth+'%"></div>'
        }
        $('#divAppTimeChartDataToday').html(tempTodayHtml);
        for(var i=0;i<yesterdayStatusCount;i++){
            var tempClass = (data.events_statistics_yesterday[i].status=='OK')?'green-bg':'level3-bg';
            var tempWidth = (data.events_statistics_yesterday[i].during/(24*60))*100;
            tempYesterdayHtml = tempYesterdayHtml +'<div class="div-App-Time-Chart-Data-block '+tempClass+'" style="width:'+tempWidth+'%"></div>'
        }
        $('#divAppTimeChartDataYesterday').html(tempYesterdayHtml);
    }

var loadingDTAlertListData = function (data, flag) {

    var eventsCount = 0;
    var tempEventData = [];

    eventsCount = data.events.length;
    tempEventData = data.events;

    if (flag == 'deskTop') {
        var tempHtmlLeft = '<div  class="div-DT-Alert-row">';
        var tempHtmlRight = '<div  class="div-DT-Alert-row">';
    } else {
        var tempHtml = '';
    }

    for (var i = 0; i < eventsCount; i++) {
        var tempLevel = '';
        var tempLevelClass = '';
        switch (tempEventData[i].priority) {
            case 1:
            tempLevel = '消息';
            tempLevelClass = 'level1-bg';
            break;
            case 2:
            tempLevel = '警告';
            tempLevelClass = 'level2-bg';
            break;
            case 3:
            tempLevel = '普通';
            tempLevelClass = 'level3-bg';
            break;
            case 4:
            tempLevel = '严重';
            tempLevelClass = 'level4-bg';
            default:
            break;
        }
        if (flag == 'deskTop') {
            if (i % 2 == 0) {
                tempHtmlLeft = tempHtmlLeft + '<div class="div-DT-Alert-cell">' + '<div class="div-DT-Alert-cell-level ' + tempLevelClass + '">' + tempLevel + '</div>' + '<div class="div-DT-Alert-cell-Equipment">' + tempEventData[i].host + '</div>' + '<div class="div-DT-Alert-cell-Time">' + '<img src="/static/img/time.png" class="img-DT-Alert-cell-Time-Icon">' + tempEventData[i].clock + '</div>' + '<div class="div-DT-Alert-cell-Info">' + tempEventData[i].information + '</div>' + '</div>';
            } else {
                tempHtmlRight = tempHtmlRight + '<div class="div-DT-Alert-cell">' + '<div class="div-DT-Alert-cell-level ' + tempLevelClass + '">' + tempLevel + '</div>' + '<div class="div-DT-Alert-cell-Equipment">' + tempEventData[i].host + '</div>' + '<div class="div-DT-Alert-cell-Time">' + '<img src="/static/img/time.png" class="img-DT-Alert-cell-Time-Icon">' + tempEventData[i].clock + '</div>' + '<div class="div-DT-Alert-cell-Info">' + tempEventData[i].information + '</div>' + '</div>';
            }
        } else {
            tempHtml = tempHtml + '<div class="div-Window-Alert-Cell ' + ((i % 2 == 0) ? '' : 'div-Window-Alert-Cell-bg') + '">' + '<div class="div-Window-Alert-Cell-Level ' + tempLevelClass + '">' + tempLevel + '</div>' + '<div class="div-Window-Alert-Cell-Equipment" title="' + tempEventData[i].host + '">' + tempEventData[i].host + '</div>' + '<div class="div-Window-Alert-Cell-Start-Time">' + tempEventData[i].clock + '</div>' + '<div class="div-Window-Alert-Cell-Duration">' + tempEventData[i].during_clock + '</div>' + '<div class="div-Window-Alert-Cell-Info">' + tempEventData[i].information + '</div>' + '</div>';
        }
    }

    if (flag == 'deskTop') {
        tempHtmlLeft = tempHtmlLeft + '</div>';
        tempHtmlRight = tempHtmlRight + '</div>';
        unCoverLoadingDiv($('#divDTAlertListAreaMain'), function () {
            $('#divDTAlertListAreaMain').html(tempHtmlLeft + tempHtmlRight);
            $('#divDTAlertListAreaMain .div-DT-Alert-cell').fadeIn(300);
            $('.div-DT-Alert-cell').bind('click',function(){
                    $('#divEquipmentInfoIcon').trigger('click');
            });
        });
    } else {
        $('#divWindowAlertFooterAllPage').html(Math.ceil(data.meta.total_count / 10));
        if (data.meta.offset + 10 < data.meta.total_count) {
            $('#divWindowAlertFooterPageInfo').html('共' + data.meta.total_count + '条记录，当前页显示第' + (data.meta.offset + 1) + '条 - 第' + (data.meta.offset + 10) + '条');
        } else {
            $('#divWindowAlertFooterPageInfo').html('共' + data.meta.total_count + '条记录，当前页显示第' + (data.meta.offset + 1) + '条 - 第' + data.meta.total_count + '条');
        }

        unCoverLoadingDiv($('#divWindowAlertMain'), function () {
            $('#divWindowAlertMain').html(tempHtml);
            $('#divWindowAlertMain .div-DT-Alert-cell').fadeIn(300);
            $('#divWindowAlertFooterCover').hide();
            $('#divWindowAlertToolbarCover').hide();
        });
    }

}

var loadingDTTimeChartData = function (data) {
    var tempArray = new Array();

    for (var i in data.events_statistics) {
        tempArray.push(data.events_statistics[i].count);
    }
    //tempArray.reverse();
    while (tempArray.length < 24) {
        tempArray.push(null);
    }

    _GLOBE_DATA('DTTimeChartAreaObject').series[0].data = tempArray;
    var DTTimeChartAreaChart = new Highcharts.Chart(_GLOBE_DATA('DTTimeChartAreaObject'));

    unCoverLoadingDiv($('#divDTTimeChartArea'), function () {

    });
}

var loadingAppTimeChartData = function (data) {
    var tempArray = new Array();

    for (var i in data.events_statistics) {
        tempArray.push(data.events_statistics[i].count);
    }
    //tempArray.reverse();
    while (tempArray.length < 24) {
        tempArray.push(null);
    }

    unCoverLoadingDiv($('#divAppMonitorDetailMainBottom'), function () {
        _GLOBE_DATA('AppMonitorDetailMainBottomChartObject').series[0].data = tempArray;
        var AppTimeChartAreaChart = new Highcharts.Chart(_GLOBE_DATA('AppMonitorDetailMainBottomChartObject'));
    });
}

var loadingSortInfo = function (dataAll) {

    var name = '';
    var colors = ['rgba(120,141,120,.2)', 'rgba(120,141,120,.3)', 'rgba(120,141,120,.1)'];
    var lastColorCount = 0;
    var data = new Array();
    var categories = new Array();
    var hostTypeCount = dataAll.groupsclassifications.length;

    var allLevel1Count = 0;
    var allLevel2Count = 0;
    var allLevel3Count = 0;
    var allLevel4Count = 0;

    for (var i = 0; i < hostTypeCount; i++) {
        var tempTypeObject = dataAll.groupsclassifications[i];
        var hostGroupCount = tempTypeObject.groups.length;
        categories.push(tempTypeObject.name);

        var hostCount = 0
        var hostOkCount = 0;

        var level1Count = 0;
        var level2Count = 0;
        var level3Count = 0;
        var level4Count = 0;

        for (var j = 0; j < hostGroupCount; j++) {
            var tempGroupObject = dataAll.groupsclassifications[i].groups[j];
            var hostHostCount = tempGroupObject.hosts.length;
            hostCount = hostCount + hostHostCount;

            for (var k = 0; k < hostHostCount; k++) {
                var tempHostObject = dataAll.groupsclassifications[i].groups[j].hosts[k];
                var hostEventCount = tempHostObject.events.length;
                var hostEventCountAll = tempHostObject.events[0].count;
                hostEventCountAll = hostEventCountAll+tempHostObject.events[1].count;
                hostEventCountAll = hostEventCountAll+tempHostObject.events[2].count;
                hostEventCountAll = hostEventCountAll+tempHostObject.events[3].count;
                if (hostEventCountAll == 0) {
                    hostOkCount++;
                }

                var hostLevel1Count = 0;
                var hostLevel2Count = 0;
                var hostLevel3Count = 0;
                var hostLevel4Count = 0;

                hostLevel1Count = tempHostObject.events[0].count;
                hostLevel2Count = tempHostObject.events[1].count;
                hostLevel3Count = tempHostObject.events[2].count;
                hostLevel4Count = tempHostObject.events[3].count;

                allLevel1Count = allLevel1Count + hostLevel1Count;
                allLevel2Count = allLevel2Count + hostLevel2Count;
                allLevel3Count = allLevel3Count + hostLevel3Count;
                allLevel4Count = allLevel4Count + hostLevel4Count;

                if (hostLevel4Count > 0) {
                    level4Count++;
                } else if (hostLevel3Count > 0) {
                    level3Count++;
                } else if (hostLevel2Count > 0) {
                    level2Count++;
                } else if (hostLevel1Count > 0) {
                    level1Count++;
                }

            }
        }

        if (lastColorCount > 2) {
            lastColorCount = 0;
        }
        data.push({
            y: hostCount,
            color: colors[lastColorCount],
            drilldown: {
                name: tempTypeObject.name,
                categories: [tempTypeObject.name + '正常', tempTypeObject.name + '严重告警', tempTypeObject.name + '普通告警', tempTypeObject.name + '警告告警', tempTypeObject.name + '消息'],
                data: [hostOkCount, level4Count, level3Count, level2Count, level1Count],
                colors: [_GLOBE_DATA('colorMainGreen'), _GLOBE_DATA('colorAlertLevel4'), _GLOBE_DATA('colorAlertLevel3'), _GLOBE_DATA('colorAlertLevel2'), _GLOBE_DATA('colorAlertLevel1')]
            }
        });



        if (hostCount > 0) {
            lastColorCount++;
        }

    }

    _GLOBE_DATA('sortHostData', data);

    var tempSortHostDataFirst = _GLOBE_DATA('sortHostData')[0];
    _GLOBE_DATA('DTSortSubChartAreaObject').title.text = tempSortHostDataFirst.drilldown.name + ' - ' + tempSortHostDataFirst.y + '台设备';
    _GLOBE_DATA('DTSortSubChartAreaObject').series[0].data[0] = tempSortHostDataFirst.drilldown.data[1];
    _GLOBE_DATA('DTSortSubChartAreaObject').series[0].data[1] = tempSortHostDataFirst.drilldown.data[2];
    _GLOBE_DATA('DTSortSubChartAreaObject').series[0].data[2] = tempSortHostDataFirst.drilldown.data[3];
    _GLOBE_DATA('DTSortSubChartAreaObject').series[0].data[3] = tempSortHostDataFirst.drilldown.data[4];
    var DTSortSubChartAreaChartFirst = new Highcharts.Chart(_GLOBE_DATA('DTSortSubChartAreaObject'));

    _GLOBE_DATA('DTSortMainChartAreaObject').plotOptions.pie.events.click = function (event) {
        var tempSortHostData = _GLOBE_DATA('sortHostData')[event.point.x];
        if (tempSortHostData.drilldown.name == event.point.name) {
            _GLOBE_DATA('DTSortSubChartAreaObject').title.text = tempSortHostData.drilldown.name + ' - ' + tempSortHostData.y + '台设备';
            _GLOBE_DATA('DTSortSubChartAreaObject').series[0].data[0] = tempSortHostData.drilldown.data[1];
            _GLOBE_DATA('DTSortSubChartAreaObject').series[0].data[1] = tempSortHostData.drilldown.data[2];
            _GLOBE_DATA('DTSortSubChartAreaObject').series[0].data[2] = tempSortHostData.drilldown.data[3];
            _GLOBE_DATA('DTSortSubChartAreaObject').series[0].data[3] = tempSortHostData.drilldown.data[4];
            var DTSortSubChartAreaChart = new Highcharts.Chart(_GLOBE_DATA('DTSortSubChartAreaObject'));
        }
    }

    var lastNotZeroTypeNumber = 0;
    for (var i in data) {
        if (data[i].y > 0) {
            lastNotZeroTypeNumber = i;
        }
    }
    if (data[lastNotZeroTypeNumber].color == colors[0]) {
        data[lastNotZeroTypeNumber].color = colors[1];
    }
    // Build the data arrays
    var tempTypeData = [];
    var tempEventData = [];
    for (var i = 0; i < data.length; i++) {

        // add browser data
        tempTypeData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        for (var j = 0; j < data[i].drilldown.data.length; j++) {

            tempEventData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: data[i].drilldown.colors[j]
            });
        }


    }

    _GLOBE_DATA('DTSortMainChartAreaObject').series[0].data = tempTypeData;
    _GLOBE_DATA('DTSortMainChartAreaObject').series[1].data = tempEventData;
    var DTSortMainChartAreaChart = new Highcharts.Chart(_GLOBE_DATA('DTSortMainChartAreaObject'));
    unCoverLoadingDiv($('#divDTSortMainChartArea'), function () {});

    _GLOBE_DATA('DTAlertListAreaSubObject').series[0].data = [allLevel4Count, allLevel3Count, allLevel2Count, allLevel1Count];
    var DTAlertListAreaSub = new Highcharts.Chart(_GLOBE_DATA('DTAlertListAreaSubObject'));
    unCoverLoadingDiv($('#divDTAlertListAreaSub'), function () {

    });
};

var loadingAppList = function (dataAll) {

    var hostTypeCount = dataAll.groupsclassifications.length;
    var tempAppData = {};

    var allLevel1Count = 0;
    var allLevel2Count = 0;
    var allLevel3Count = 0;
    var allLevel4Count = 0;

    for (var i = 0; i < hostTypeCount; i++) {
        var tempTypeObject = dataAll.groupsclassifications[i];
        var hostGroupCount = tempTypeObject.groups.length;

        var hostCount = 0
        var hostOkCount = 0;

        var level1Count = 0;
        var level2Count = 0;
        var level3Count = 0;
        var level4Count = 0;

        var tempTypeObject = dataAll.groupsclassifications[i];
        if (tempTypeObject.name == '应用') {
            tempAppData = tempTypeObject.groups;
        }

        for (var j = 0; j < hostGroupCount; j++) {
            var tempGroupObject = dataAll.groupsclassifications[i].groups[j];
            var hostHostCount = tempGroupObject.hosts.length;
            hostCount = hostCount + hostHostCount;

            for (var k = 0; k < hostHostCount; k++) {
                var tempHostObject = dataAll.groupsclassifications[i].groups[j].hosts[k];
                var hostEventCount = tempHostObject.events.length;
                var hostEventCountAll = tempHostObject.events[0].count;
                hostEventCountAll = hostEventCountAll+tempHostObject.events[1].count;
                hostEventCountAll = hostEventCountAll+tempHostObject.events[2].count;
                hostEventCountAll = hostEventCountAll+tempHostObject.events[3].count;
                if (hostEventCountAll == 0) {
                    hostOkCount++;
                }

                var hostLevel1Count = 0;
                var hostLevel2Count = 0;
                var hostLevel3Count = 0;
                var hostLevel4Count = 0;

                hostLevel1Count = tempHostObject.events[0].count;
                hostLevel2Count = tempHostObject.events[1].count;
                hostLevel3Count = tempHostObject.events[2].count;
                hostLevel4Count = tempHostObject.events[3].count;

                allLevel1Count = allLevel1Count + hostLevel1Count;
                allLevel2Count = allLevel2Count + hostLevel2Count;
                allLevel3Count = allLevel3Count + hostLevel3Count;
                allLevel4Count = allLevel4Count + hostLevel4Count;

                if (hostLevel4Count > 0) {
                    level4Count++;
                } else if (hostLevel3Count > 0) {
                    level3Count++;
                } else if (hostLevel2Count > 0) {
                    level2Count++;
                } else if (hostLevel1Count > 0) {
                    level1Count++;
                }

            }
        }


        var allAppCount = hostOkCount+level4Count+level3Count+level2Count+level1Count;
        _GLOBE_DATA('AppMonitorDetailAllChartObject').series[0].data= [['',hostOkCount],['',allAppCount-hostOkCount]];
        _GLOBE_DATA('AppMonitorDetailMainTopAllChartLevel4Object').series[0].data= [['',level4Count],['',allAppCount-level4Count]];
        _GLOBE_DATA('AppMonitorDetailMainTopAllChartLevel3Object').series[0].data= [['',level3Count],['',allAppCount-level3Count]];
        _GLOBE_DATA('AppMonitorDetailMainTopAllChartLevel2Object').series[0].data= [['',level2Count],['',allAppCount-level2Count]];
        _GLOBE_DATA('AppMonitorDetailMainTopAllChartLevel1Object').series[0].data= [['',level1Count],['',allAppCount-level1Count]];

        $('#divAppMonitorInfoAll').html('共有'+allAppCount+'个应用被监控中');
        $('#divAppMonitorInfoOk').html(((hostOkCount/allAppCount)*100).toFixed(0)+'%应用正常');
        $('#divAppMonitorInfoError').html('有'+(level4Count+level3Count+level2Count+level1Count)+'个应用存在告警');

        $('#divAppMonitorDetailMainTopAllChartText').html('有'+hostOkCount+'个应用<br>正常运行')
        $('#divAppMonitorDetailMainTopAllChartLevel4Label').html('严重('+level4Count+')');
        $('#divAppMonitorDetailMainTopAllChartLevel3Label').html('普通('+level3Count+')');
        $('#divAppMonitorDetailMainTopAllChartLevel2Label').html('警告('+level2Count+')');
        $('#divAppMonitorDetailMainTopAllChartLevel1Label').html('消息('+level1Count+')');

        unCoverLoadingDiv($('#divAppMonitorDetailMainTopAllChart'), function () {
           var AppMonitorDetailAllChart = new Highcharts.Chart(_GLOBE_DATA('AppMonitorDetailAllChartObject'));
        });
        unCoverLoadingDiv($('#divAppMonitorDetailMainTopAllChartLevel4'), function () {
            var AppMonitorDetailMainTopAllChartLevel4 = new Highcharts.Chart(_GLOBE_DATA('AppMonitorDetailMainTopAllChartLevel4Object'));
        });
        unCoverLoadingDiv($('#divAppMonitorDetailMainTopAllChartLevel3'), function () {
            var AppMonitorDetailMainTopAllChartLevel3 = new Highcharts.Chart(_GLOBE_DATA('AppMonitorDetailMainTopAllChartLevel3Object'));
        });
        unCoverLoadingDiv($('#divAppMonitorDetailMainTopAllChartLevel2'), function () {
            var AppMonitorDetailMainTopAllChartLevel2 = new Highcharts.Chart(_GLOBE_DATA('AppMonitorDetailMainTopAllChartLevel2Object'));
        });
        unCoverLoadingDiv($('#divAppMonitorDetailMainTopAllChartLevel1'), function () {
            var AppMonitorDetailMainTopAllChartLevel1 = new Highcharts.Chart(_GLOBE_DATA('AppMonitorDetailMainTopAllChartLevel1Object'));
        });

    }

    var tempAppDataCount = tempAppData.length;
    var tempHtml = '';
    for (var i = 0; i < tempAppDataCount; i++) {
        if(i==0){
                    tempHtml = tempHtml + '<li hostId="'+10156+'" class="li-Window-App-Monitor-Detail-Side-button green-bg">' + tempAppData[i].name + '</li>';
        }else{
            tempHtml = tempHtml + '<li hostId="'+tempAppData[i].hosts[0].hostid+'" class="li-Window-App-Monitor-Detail-Side-button green-bg">' + tempAppData[i].name + '</li>';
        }

    }

    unCoverLoadingDiv($('#ulWindowAppMonitorDetailSide'), function () {

        $('#ulWindowAppMonitorDetailSide').html(tempHtml);
        $('#ulWindowAppMonitorDetailSide .li-Window-App-Monitor-Detail-Side-button').fadeIn(300).bind('click',
            function (event) {
                var that = this;
                $('#divWindowAppMonitorDetailMainAll').fadeOut(200, function () {
                    $('#divAppName').html($(that).html());
                    coverLoadingDiv($('#ulAppMonitorInfo'));
                    getAjaxAppItemList($(that).attr('hostId'));
                    getAjaxAppStatus($(that).attr('hostId'));
                    $('#divWindowAppMonitorDetailMainAppDetail').fadeIn(200);
                });
            });
    });

}


var loadHostEventCount = function(data){

    var dayCount  = data.events_statistics_week.length;
    var level4CountArray = new Array();
    var level3CountArray = new Array();
    var level2CountArray = new Array();
    var level1CountArray = new Array();
    var categoriesArray = new Array();

    for(var i = 0; i< dayCount; i++){
        var tempDay = data.events_statistics_week[i];
        categoriesArray.push(tempDay.date_time);
        level1CountArray.push(tempDay.data[0].count);
        level2CountArray.push(tempDay.data[1].count);
        level3CountArray.push(tempDay.data[2].count);
        level4CountArray.push(tempDay.data[3].count);
    }

    _GLOBE_DATA('equipmentAlertChartObject').xAxis.categories = categoriesArray;
    _GLOBE_DATA('equipmentAlertChartObject').series[0].data = level4CountArray;
    _GLOBE_DATA('equipmentAlertChartObject').series[1].data = level3CountArray;
    _GLOBE_DATA('equipmentAlertChartObject').series[2].data = level2CountArray;
    _GLOBE_DATA('equipmentAlertChartObject').series[3].data = level1CountArray;

    unCoverLoadingDiv($('#divEquipmentAlertChart'), function () {
        console.log(_GLOBE_DATA('equipmentAlertChartObject'));
        var equipmentAlertChart = new Highcharts.Chart(_GLOBE_DATA('equipmentAlertChartObject'));
    });
    

}

var loadingHostDetailSide = function (dataAll) {

    var tempHtml = '';
    var hostTypeCount = dataAll.groupsclassifications.length;

    for (var i = 0; i < hostTypeCount; i++) {
        var tempTypeObject = dataAll.groupsclassifications[i];
        var hostGroupCount = tempTypeObject.groups.length;

        tempHtml = tempHtml + '<div class="div-Equipment-Type">' + '<div class="div-Equipment-Type-Title">' + '<div class="div-Equipment-Type-Title-Status ' + ((tempTypeObject.e_num == 0) ? 'green-color' : 'level3-color') + '">+</div>' + '<div class="div-Equipment-Type-Title-Text">' + tempTypeObject.name + '</div>' + '</div>' + '<div class="div-Equipment-Type-Content">';
        if (hostGroupCount == 0) {
            tempHtml = tempHtml + '&nbsp;&nbsp;&nbsp;该分类下无主机';
        }
        for (var j = 0; j < hostGroupCount; j++) {
            var tempGroupObject = tempTypeObject.groups[j];
            var hostHostCount = tempGroupObject.hosts.length;


            tempHtml = tempHtml + '<div class="div-Equipment-Group">' + '<div class="div-Equipment-Group-Title">' + '<div class="div-Equipment-Group-Title-Status ' + ((tempGroupObject.e_num == 0) ? 'green-color' : 'level3-color') + '">+</div>' + '<div class="div-Equipment-Group-Title-Text">' + tempGroupObject.name + '</div>' + '</div>' + '<div class="div-Equipment-Group-Content">';
            if (hostHostCount == 0) {
                tempHtml = tempHtml + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;该分组下无主机';
            }
            for (var k = 0; k < hostHostCount; k++) {
                var tempHostObject = tempGroupObject.hosts[k];
                var hostEventCount = tempHostObject.events[0].count;
                hostEventCount = hostEventCount+tempHostObject.events[1].count;
                hostEventCount = hostEventCount+tempHostObject.events[2].count;
                hostEventCount = hostEventCount+tempHostObject.events[3].count;
                tempHtml = tempHtml + '<div class="div-Equipment-Object">' + '<div hostId="' + tempHostObject.hostid + '" class="div-Equipment-Object-Status">' + ((tempHostObject.favourite == null) ? '✩' : '✭') + '</div>' + '<div hostId="' + tempHostObject.hostid + '" ip="' + tempHostObject.ip + '"  class="div-Equipment-Object-Text ' + ((hostEventCount == 0) ? 'green-bg' : 'level3-bg') + '">' + tempHostObject.host + '</div>' + '</div>';

                /*
                for (var l = 0; l < hostEventCount; l++) {
                    var tempEventObject = tempHostObject.events[l];

                } 
                */

            }

            tempHtml = tempHtml + '</div>' + '</div>';
        }

        tempHtml = tempHtml + '</div>' + '</div>';
    }


    unCoverLoadingDiv($('#inputWindowEquipmentDetailSideAll'), function () {

        $('#inputWindowEquipmentDetailSideAll').html(tempHtml);
        _GLOBE_DATA('windowHostListDom',tempHtml);
        $('#inputWindowEquipmentDetailSideAll .div-Equipment-Type').fadeIn(300);
        $('#divWindowEquipmentDetailSideSearch').fadeIn(300);
        $('#divWindowEquipmentDetailSideChoose').fadeIn(300);
        $('.div-Equipment-Type-Title').bind('click',
            function (event) {
                $($(this).next()).slideToggle(200);
                $($(this).children('.div-Equipment-Type-Title-Status')).html($($(this).children('.div-Equipment-Type-Title-Status')).html() === '+' ? '-' : '+');
            });

        $('.div-Equipment-Group-Title').bind('click',
            function (event) {
                $($(this).next()).slideToggle(200);
                $($(this).children('.div-Equipment-Group-Title-Status')).html($($(this).children('.div-Equipment-Group-Title-Status')).html() === '+' ? '-' : '+');
            });

        $('.div-Equipment-Object-Status').bind('click',
            function (event) {
                if ($(this).html() == '✩') {
                    $(this).html('<img src="/static/img/loading_s.gif">');
                    favouriteHostAjax($(this).attr('hostId'), $(this));
                } else if ($(this).html() == '✭') {
                    $(this).html('<img src="/static/img/loading_s.gif">');
                    unFavouriteHostAjax($(this).attr('hostId'), $(this));
                }
            });

        $('.div-Equipment-Object-Text').bind('click',
            function (event) {
                var that = this;
                divEquipmentObjectTextClickEvent(that);
            });

        var firtsHostDom = $('#inputWindowEquipmentDetailSideAll .div-Equipment-Object-Text:first');
        firtsHostDom.parent().parent().prev().parent().parent().prev().trigger('click');
        firtsHostDom.parent().parent().prev().trigger('click');
        firtsHostDom.trigger('click');
    });

};

var favouriteHostSuccess = function (jQObject) {
    jQObject.html('✭');
    _GLOBE_DATA('windowHostListDom',$('#inputWindowEquipmentDetailSideAll').html());
};

var favouriteHostError = function (jQObject) {
    jQObject.html('✩');
    _GLOBE_DATA('windowHostListDom',$('#inputWindowEquipmentDetailSideAll').html());
};


var loadingHostCharts = function (data) {
    var graphsCount = data.graphs.length;
    var tempHtml = '<div id="divWindowEquipmentDisplayAreaChartsListContent" class="div-Window-Equipment-Display-Area-Charts-List-Content">';
    for (var i = 0; i < graphsCount; i++) {
        var tempGraph = data.graphs[i];
        var tempGraphType = '';
        switch (tempGraph.graphtype) {
            case 0:
            tempGraphType = 'line';
            break;
            case 1:
            tempGraphType = 'area';
            break;
            default:
            break;
        }
        tempHtml = tempHtml + '<div chartType ="' + tempGraphType + '" chartId="'+tempGraph.graphid+'" class="div-Equipment-Chart">' + '<img class="img-Equipment-Chart" src="/static/img/chart_' + tempGraphType + '.png">' + '<div class="div-Equipment-Chart-Label">' + tempGraph.name + '</div>' + '</div>';
    }
    tempHtml = tempHtml + '</div>';

    unCoverLoadingDiv($('#divWindowEquipmentDisplayAreaChartsList'), function () {
        if (graphsCount > 0) {
            $('#divWindowEquipmentDisplayAreaChartsMain').html('');
            $('#divWindowEquipmentDisplayAreaChartsList').html(tempHtml);
            $('#divWindowEquipmentDisplayAreaChartsListContent').fadeIn(300);

            var tempChild = $('#divWindowEquipmentDisplayAreaChartsListContent').find('.div-Equipment-Chart');
            var totalWidth = 0;
            var tempChildCount = tempChild.length;
            for (var i = 0; i < tempChildCount; i++) {
                totalWidth = totalWidth + $(tempChild[i]).width() + 20;
            }
            $('#divWindowEquipmentDisplayAreaChartsListContent').width(totalWidth);

            $('.div-Equipment-Chart').bind('click',
                function (event) {
                    _GLOBE_DATA('graphChartObject').title.text=$(this).children('.div-Equipment-Chart-Label').html();
                    coverLoadingDiv($('#divWindowEquipmentDisplayAreaChartsMain'));
                    getAjaxHostChartsData($(this).attr('chartId'));

                });

            $('#divWindowEquipmentDisplayAreaChartsListContent .div-Equipment-Chart:first').trigger('click');

        } else {
            $('#divWindowEquipmentDisplayAreaChartsMain').html('该主机没有自定义图表');
        }


    });
}

var loadingHostItemList  = function(data){
    var itemGroupCount = data.apps.length;
    
    var tempHtml = '';
    for (var i = 0; i < itemGroupCount; i++) {
        var tempItemGroup = data.apps[i];
        tempHtml = tempHtml +'<div class="div-Item-Group">'
        +'<div class="div-Item-Group-Title">'
        +'<div class="div-Item-Group-Title-Status">+</div>'
        +'<div class="div-Item-Group-Title-Name">'+ tempItemGroup.name+'</div>'
        +'</div>'
        +'<div class="div-Item-Group-Content">';
        var itemCount = data.apps[i].items.length;
        for(var j = 0; j < itemCount; j++){
            var tempItem = tempItemGroup.items[j];
            tempHtml = tempHtml + '<div itemid="'+ tempItem.itemid+'" class="div-Item-Object ' + ((j % 2 == 0) ? '' : 'div-Window-Alert-Cell-bg') + '">'
            +'<div class="div-Item-Object-Name">'+ tempItem.description+'</div>'
            +'<div class="div-Item-Object-Clock">'+ tempItem.lastclock+'</div>'
            +'<div class="div-Item-Object-Last-Data">'+ tempItem.lastvalue+'</div>'
            +'<div class="div-Item-Object-Change '+ ((tempItem.change_value.indexOf('▲')==-1)?'green-color':'level3-color')+'">'+ tempItem.change_value+'</div>'
            +'</div>';
        }
        tempHtml = tempHtml + '</div></div>';
    }

    unCoverLoadingDiv($('#divWindowEquipmentDisplayAreaMonitorItemLabel'), function () {
        $('#divWindowEquipmentDisplayAreaMonitorItemLabel').html(tempHtml);

        $('.div-Item-Group-Title').bind('click',
            function (event) {
                $($(this).next()).slideToggle(200);
                $($(this).children('.div-Item-Group-Title-Status')).html($($(this).children('.div-Item-Group-Title-Status')).html() === '+' ? '-' : '+');
            });

        $('.div-Item-Object').bind('click',
            function (event) {

                var that = this;

                $('#divWindowEquipmentDisplayAreaMonitorItemLabel').fadeOut({
                    duration:500,
                    queue:false
                }).animate({
                    height: 76+'px',
                    width: 131+'px',
                    marginTop: 153+'px',
                    marginLeft: 263+'px',
                }, {
                    duration: 500,
                    easing: 'swing',
                    complete: function () {

                    }
                });



                $('#divWindowEquipmentDisplayAreaMonitorItemChart').fadeIn({
                    duration:500,
                    queue:false
                }).animate({
                    height: 384+'px',
                    width: 658+'px',
                    marginLeft: 0+'px'
                },{
                    duration: 500,
                    easing: 'swing',
                    complete:function(){
                        $('#divWindowEquipmentDisplayAreaMonitorItemChart').css('margin-top','0px');
                        coverLoadingDiv($('#divWindowEquipmentDisplayAreaMonitorItemChart'));
                        getAjaxItemChartsData($(that).attr('itemid'));
                    }
                });


            });

$('#divWindowEquipmentDisplayAreaMonitorItemChart').bind('click',
    function (event) {
        $('#divWindowEquipmentDisplayAreaMonitorItemChart').css('margin-top',' -230px').fadeOut({
            duration:500,
            queue:false
        }).animate({
            height: 76+'px',
            width: 131+'px',
            marginLeft: 263+'px'
        }, {
            duration: 500,
            easing: 'swing',
            complete: function () {

            }
        });

        $('#divWindowEquipmentDisplayAreaMonitorItemLabel').fadeIn({
            duration:500,
            queue:false
        }).animate({
            height: 384+'px',
            width: 658+'px',
            marginTop: 0+'px',
            marginLeft: 0+'px'
        },{
            duration: 500,
            easing: 'swing',
            complete:function(){
            }
        });
    });
});

}

var divEquipmentObjectTextClickEvent = function(that){
    _GLOBE_DATA('currentWindowHostId', $(that).attr('hostId'));
    $('#divWindowEquipmentDetailMainTop').hide();
    if($('#divWindowEquipmentDetailMain').css('display')=='none'){
        $('#divWindowEquipmentDetailMain').fadeIn(200);
    }
    $('#divWindowEquipmentDisplayAreaChartsMain').html('');
    $('#divWindowEquipmentDetailMainTopName').html($(that).html());
    $('#divWindowEquipmentDetailMainTopIP').html(' IP:' + $(that).attr('ip'));
    $('#divWindowEquipmentDetailMainTop').fadeIn(200);
    coverLoadingDiv($('#divWindowEquipmentDisplayAreaChartsList'));
    getAjaxHostCharts();
    coverLoadingDiv($('#divWindowEquipmentDisplayAreaMonitorItemLabel'));
    getAjaxHostItemList();
    coverLoadingDiv($('#divEquipmentAlertChart'));
    getAjaxHostEventCount();
    $('#divWindowEquipmentDisplayAreaMonitorItemChart').trigger('click');
}

var darwHostChart = function(data){
    _GLOBE_DATA('graphChartObject').xAxis.maxZoom = data.delay*1000*6;
    _GLOBE_DATA('graphChartObject').chart.renderTo = 'divWindowEquipmentDisplayAreaChartsMain';
    var chartType = (data.graphtype==0)?'line':'area';
    var startTime = '';
    var date = null;
    var valueCount = data.value.length;
    var chartCount = 0;
    if(data.value[0]){
        chartCount = data.value[0].length;
        startTime = data.data[0].clock;
        date = new Date(startTime*1000);
    };
    var tempDataCollection = new Array();
    var tempSeriesCollection = new Array();
    for(var i=0;i<chartCount;i++){
        var tempDataArray = new Array();
        var tempSeriesArray = {
            type:null,
            name:null,
            pointInterval:null,
            pointStart:null,
            color:null,
            data:null
        }
        tempDataCollection.push(tempDataArray);
        tempSeriesCollection.push(tempSeriesArray);
    }
    

    for(var i=0;i<valueCount;i++){
        for(var j=0;j<chartCount;j++){
            tempDataCollection[j].push(data.value[i][j]);
        }
    }

    for(var i=0;i<chartCount;i++){
        tempSeriesCollection[i].type = chartType;
        tempSeriesCollection[i].name = data.itemname[i];
        tempSeriesCollection[i].pointInterval = data.delay*1000;
        tempSeriesCollection[i].pointStart = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
        tempSeriesCollection[i].color = '#'+data.color[i];
        tempSeriesCollection[i].data = tempDataCollection[i];
    }
    _GLOBE_DATA('graphChartObject').series = tempSeriesCollection;
    $('#divWindowEquipmentDisplayAreaChartsMain').html('');
    console.log(_GLOBE_DATA('graphChartObject'));
    try
    {
       var graphChart = new Highcharts.Chart(_GLOBE_DATA('graphChartObject'));
   }
   catch(err)
   {   
       alert('运行错误：'+err);
   }   
}       

var darwItemChart = function(data){
    _GLOBE_DATA('graphChartObject').xAxis.maxZoom = data.delay*1000*6;
    _GLOBE_DATA('graphChartObject').chart.renderTo = 'divWindowEquipmentDisplayAreaMonitorItemChart';
    var chartType = 'line';
    var startTime = '';
    var date = null;
    var valueCount = data.value.length;
    if(data.data[0]){
        startTime = data.data[0].clock;
        date = new Date(startTime*1000);
    };
    var tempValue = new Array();
    for(var i=0;i<valueCount;i++){
        tempValue.push(data.value[i]);
        tempValue.reverse();
    }
    
    var tempSeries = {
        type :chartType,
        name : data.itemname,
        pointInterval : data.delay*1000,
        pointStart : Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()),
        color : 'rgb(50,180,160)',
        data : tempValue
    }

    var tempSeriesArray = new Array();
    tempSeriesArray.push(tempSeries);

    _GLOBE_DATA('graphChartObject').series = tempSeriesArray;
    $('#divWindowEquipmentDisplayAreaMonitorItemChart').html('');
    try
    {
       var graphChart = new Highcharts.Chart(_GLOBE_DATA('graphChartObject'));
   }
   catch(err)
   {
    alert('运行错误：'+err);
}

}                 

jQuery.extend( jQuery.easing,  {  

});  