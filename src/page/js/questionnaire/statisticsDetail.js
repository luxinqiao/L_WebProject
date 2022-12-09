var user_token = '';
var paper_code = '';
var startTime_index = '';
var endTime_index = '';
$(function(){
    CommonUtils.setHtmlTitle('反馈详情');

    var app_uinfo = CommonUtils.getCookie('app_uinfo');
    user_token = app_uinfo.split('|')[1];
    paper_code = app_uinfo.split('|')[2];

    // 调用题目统计接口
    getStatistics(0);

    // var el = document.body;
    // if (el.addEventListener) {
    //     window.addEventListener("online", function () {
    //         //alert("online");
    //         }, true);
    //     window.addEventListener("offline", function () {
    //         //alert("offline");
    //         DialogUtils.tip('网络连接异常！');
    //         }, true);
    // }
    // else if (el.attachEvent) {
    //     window.attachEvent("ononline", function () {
    //         //alert("online");
    //     });
    //     window.attachEvent("onoffline", function () {
    //         //alert("offline");
    //         DialogUtils.tip('网络连接异常！');
    //     });
    // }
    // else {
    //     window.ononline = function () {
    //         //alert("online");
    //     };
    //     window.onoffline = function () {
    //         //alert("offline");
    //         DialogUtils.tip('网络连接异常！');
    //     };
    // }

});

function getStatistics(searchFlag) {
    if (!navigator.onLine) {
        DialogUtils.tip('网络连接异常！');
    }

    // 清空节点
    $(".searchCondition").nextAll().remove();

    var start_at = $('#start_date').val();
    var end_at = $('#end_date').val();

    if(searchFlag == 1) {
        var oDate1 = new Date(start_at);
        var oDate2 = new Date(end_at);
        if(oDate1.getTime() > oDate2.getTime()){
            DialogUtils.tip("请选择正确的开始时间和结束时间！");
            return;
        }
    }

    AjaxUtils.ajax_new({
        header: {
            REQUESTAPP: '3'
        },
        type: 'POST',
        url: request_path.Common + 'question/statistics',
        // data: {
        //     token: '5KoYL1OwXpqR2UFhMf9trg7QyzJvBbkl',
        //     code: 'Y00028',
        //     is_submit: searchFlag,
        //     start_at: start_at,
        //     end_at: end_at
        // },
        data: {
            token: user_token,
            code: paper_code,
            is_submit: searchFlag,
            start_at: start_at,
            end_at: end_at
        },
        success: function(data, textStatus, jqXHR) {
            var code = data.code;
            var note = data.note;
            if(code == 200) {
                var data = data.data;
                initStatistics(data, searchFlag);
            }else {
                DialogUtils.tip(note);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

// 初始化日期选择
function initLCander(start_at, end_at) {
    $('#start_date').val(start_at);
    $('#end_date').val(end_at);

    var calendar = new LCalendar();
    calendar.init({
        'trigger': '#start_date', //标签id
        'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        'minDate': start_at, //最小日期
        'maxDate': end_at //最大日期
    });
    var calendar = new LCalendar();
    calendar.init({
        'trigger': '#end_date', //标签id
        'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        'minDate': start_at, //最小日期
        'maxDate': end_at //最大日期
    });
}

function initStatistics(data ,searchFlag) {
    var start_at = data.start_at;
    var end_at = data.end_at;
    if(searchFlag == 0) {
        initLCander(start_at, end_at);
    }

    var paperName = data.name; // 试卷名称
    var hos = data.hos; // 医院
    var dep = data.dep; // 科室

    $(".paperName").text(paperName);
    if(!CommonUtils.isEmpty(hos)) {
        $(".hospital").text("医院：" + hos);
    }else {
        $(".hospital").text("医院：");
    }
    if(!CommonUtils.isEmpty(dep)) {
        $(".department").text("科室：" + dep);
    }else {
        $(".department").text("科室：");
    }

    var option = data.option;
    for(var i=0; i<option.length; i++) {
        var number = i + 1; // 题目编号
        var content = option[i].content; // 题目内容
        var type = option[i].type; // 类型
        var answer = option[i].answer;
        if(type == 2) { // 叙述题
            $(".bodyStatistics").append("<div class='contentSub'>\n" +
                "    <div style='display:flex;'>\n" +
                "        <p>"+ number +".</p>\n" +
                "        <p>"+ content +"</p>\n" +
                "    </div>\n" +
                "    <div class='suggest_all'>\n" +
                "    </div>\n" +
                "</div>");
            for(var j=0; j<answer.length; j++) {
                $(".suggest_all").append("<p class='suggestList'>"+ answer[j] +"</p>")
            }
        }else { // 选择题
            $('.bodyStatistics').append("<div class='selectSub'>\n" +
                "    <div style='padding:10px 15px 22px 15px;'>\n" +
                "        <div style='display:flex;'>\n" +
                "            <p>"+ number +".</p>\n" +
                "            <p>"+ content +"</p>\n" +
                "        </div>\n" +
                "        <table class='selectTable'>\n" +
                "        </table>\n" +
                "    </div>\n" +
                "</div>");

            for(var j=0; j<answer.length; j++) {
                var answer_content = answer[j].content;
                var answer_count = answer[j].count; // 选择此答案的人数
                var answer_percent = answer[j].percent; // 百分比
                $('.selectTable:last').append("<tr>\n" +
                    "                <td style='width: 42%;'>\n" +
                    "                    <p>"+ answer_content +"</p>\n" +
                    "                </td>\n" +
                    "                <td style='width:33%;'>\n" +
                    "                    <div class='weui-progress'>\n" +
                    "                        <div class='weui-progress__bar'>\n" +
                    "                            <div class='weui-progress__inner-bar js_progress' style='width: "+ answer_percent +";'></div>\n" +
                    "                        </div>\n" +
                    "                    </div>\n" +
                    "                </td>\n" +
                    "                <td style='width: 15%;text-align: center;'>\n" +
                    "                    <p>"+ answer_percent +"</p>\n" +
                    "                </td>\n" +
                    "                <td style='width: 10%;text-align: right;'>\n" +
                    "                    <p>"+ answer_count +"人</p>\n" +
                    "                </td>\n" +
                    "            </tr>");

            }
        }
    }
}