$(function() {
    initRecord(sessionStorage.train_auid);
    initEmg(sessionStorage.train_fileurl);
});

/**
    初始化报告
    @param {String}auid 报告id
    @return
*/
function initRecord(auid) {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.Common + 'train/report',
        data: {
            code: auid
        },
        success: function(data, textStatus, jqXHR) {
            var record = data.data;
            //前静息阶段
            $('#first_avg').text(convertArrow('up',record.first_avg_is_hight)+record.first_avg);
            $('#first_variability').text(convertArrow('up',record.first_variability_is_hight)+record.first_variability);
            $('#first_score').text(record.first_score);
            //快肌(Ⅱ类纤维)阶段
            $('#second_max').text(convertArrow('down',record.second_max_is_low)+record.second_max);
            $('#second_uptime').text(convertArrow('up',record.second_uptime_is_hight)+record.second_uptime);
            $('#second_downtime').text(convertArrow('up',record.second_downtime_is_hight)+record.second_downtime);
            $('#second_score').text(record.second_score);
            //慢肌(Ⅰ类纤维)阶段
            $('#third_avg').text(convertArrow('down',record.third_avg_is_low)+record.third_avg);
            $('#third_variability').text(convertArrow('up',record.third_variability_is_hight)+record.third_variability);
            $('#third_score').text(record.third_score);
            //后静息阶段
            $('#fifth_avg').text(convertArrow('up',record.fifth_avg_is_hight)+record.fifth_avg);
            $('#fifth_variability').text(convertArrow('up',record.fifth_variability_is_hight)+record.fifth_variability);
            $('#fifth_score').text(record.fifth_score);
            //总得分
            $('#total_score').text(record.total_score);
            $('#scoreDiv').children('p:eq(1)').text(record.total_score);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    });
}

/**
    转换箭头
    @param {String}type 类型(up-是否高于,down-是否低于)
    @param {String}str 值
    @return {String} 箭头
*/
function convertArrow(type, str) {
    if (str === '0') {
        return ''
    } else if (str === '1') {
        if (type === 'up') {
            return '↑ '
        } else if (type === 'down') {
            return '↓ '
        }
    }
}

/**
    初始化肌电图
    @param {String}fileUrl 文件路径
    @return
*/
function initEmg(fileUrl) {
    DialogUtils.loading('emgDiv');
    ProtoUtils.load(
        '/src/page/resource/train/Protobufer_lanting.proto', 
        'lanting.AssessFileData',
        'assessOriginalDataArray',
        fileUrl,
        function(data) {
            initChart(data);
        }
    );
}

/**
    初始化图表
    @param {String}arr 数据集
    @return
*/
function initChart(arr) {
    var oriArr = [], tempArr = [];
    for (var i=0; i<arr.length; i++) {
        var obj = arr[i];
        oriArr.push([i, obj.originalVal]);
        tempArr.push([i, obj.templateVal]);
    }
    var seriesArr = [];
    seriesArr.push({
        data: oriArr,
        lineWidth: 0.5
    });
    seriesArr.push({
        data: tempArr,
        lineWidth: 0.5
    });
    createChart(seriesArr);
}

/**
    创建图表
    @param {String}seriesArr 数据集
    @return
*/
function createChart(seriesArr) {
    Highcharts.chart('emgChart', {
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        title: {
            text: null,
        },
        tooltip: {
            enabled: false
        },
        colors: ['red', '#333'],
        xAxis: {
            labels: {
                enabled: false
            },
            tickLength: 0
        },
        yAxis: {
            title: {
                text: null
            },
            tickInterval: 100
        },
        plotOptions: {
            line: {
                enableMouseTracking: false
            }
        },
        series: seriesArr
    });
    DialogUtils.hideLoading('emgDiv');
}