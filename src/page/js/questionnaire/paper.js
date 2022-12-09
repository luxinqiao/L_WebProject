var user_token = '';
var paper_code = '';

$(function(){
    CommonUtils.setHtmlTitle('调查问卷');

    var app_uinfo = CommonUtils.getCookie('app_uinfo');
    user_token = app_uinfo.split('|')[1];
    paper_code = app_uinfo.split('|')[2];

    // 调用接口获取试卷题目
    getQuestionList();

    if (!navigator.onLine) {
        DialogUtils.tip('网络连接异常！');
    }

});

function radioClick(obj) {
    $(obj).find('i').attr('class', 'radio_checked');
    $(obj).parent().siblings().find('i').attr('class', 'radio_uncheck');

    $("button").attr("disabled",false);
    $("button").removeClass("button_gray");
}

function checkboxClick(obj) {
    var cb_class = $(obj).find('i').attr('class');
    if(cb_class == 'box_checked') {
        $(obj).find('i').attr('class', 'box_uncheck');
    }else if(cb_class == 'box_uncheck'){
        $(obj).find('i').attr('class', 'box_checked');
    }

    var checkboxChecked_arr = $('.box_checked');
    //console.log(checkboxChecked_arr.length);
    if(checkboxChecked_arr.length != 0) {
        $("button").attr("disabled",false);
        $("button").removeClass("button_gray");
    }else {
        isWrite();
    }
}

function textareaChange(obj) {
    var text = $(obj).val();
    if(!CommonUtils.isEmpty(text)) {
        $("button").attr("disabled",false);
        $("button").removeClass("button_gray");
    }else {
        isWrite();
    }
}

// 判断用户是否有填写
function isWrite() {
    var radioChecked_arr = $('.radio_checked');
    // radio
    if(radioChecked_arr.length != 0){
        $("button").attr("disabled",false);
        $("button").removeClass("button_gray");
        return true;
    }
    // checkbox
    var checkboxChecked_arr = $('.box_checked');
    if(checkboxChecked_arr.length != 0){
        $("button").attr("disabled",false);
        $("button").removeClass("button_gray");
        return true;
    }
    // textarea
    var textarea_arr = $('.suggest');
    for(var i=0; i<textarea_arr.length; i++) {
        var text = $(textarea_arr[i]).val();
        if(!CommonUtils.isEmpty(text)) {
            $("button").attr("disabled",false);
            $("button").removeClass("button_gray");
            return true;
        }
    }

    $("button").attr("disabled",true);
    $("button").addClass("button_gray");
    return false;
}

// 初始化问题答案详情
function getQuestionList() {

    AjaxUtils.ajax_new({
        header: {
            REQUESTAPP: '0'
        },
        type: 'POST',
        url: request_path.Common + 'question/apply',
        // data: {
        //     token: 'OKPWV7jBTemqHwFQhDZJXn6yCL4rbu0f',
        //     code: 'Y00054'
        // },
        data: {
            token: user_token,
            code: paper_code
        },
        success: function(data, textStatus, jqXHR) {
            var record = data.data;
            if(!CommonUtils.isEmpty(record)) {
                // 初始化考题
                initPaper(record);

                $(".paper_content").after("<div style='background-color: #ffffff;height:70px;'>\n" +
                    "    <button class='weui-btn submmitPaper button_gray' disabled='true' onclick='submmitPaper()'>提交</button>\n" +
                    "</div>");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

function initPaper(record) {
    var paper = record.paper;
    var paper_name = paper.name; // 试卷名称
    var paper_remark = paper.remark; // 试卷描述
    $(".answerTitle").text(paper_name);
    $(".paperRemark").text(paper_remark);

    var question = record.question;
    var total = question.length;
    for(var i=0;i<question.length; i++) {
        var code = question[i].code;
        var content = question[i].content; // 题目描述
        var type = question[i].type;
        var is_required = question[i].is_required; // 必填项
        var number = i + 1; // 题目编号
        if(type == 0) {
            if(is_required == 1) {
                $('.paper_content').append("<div class='weui-cells weui-cells_radio'>\n" +
                    "        <div class='codeHiden'>"+ code +"</div>\n" +
                    "        <div class='questionContent'>\n" +
                    "            <p>"+ number +".</p>\n" +
                    "            <p>"+ content +"<label class='required'>*</label>（"+ number +"/"+ total +"）</p>\n" +
                    "        </div>\n" +
                    "    </div>");
            }else {
                $('.paper_content').append("<div class='weui-cells weui-cells_radio'>\n" +
                    "        <div class='codeHiden'>"+ code +"</div>\n" +
                    "        <div class='questionContent'>\n" +
                    "            <p>"+ number +".</p>\n" +
                    "            <p>"+ content +"（"+ number +"/"+ total +"）</p>\n" +
                    "        </div>\n" +
                    "    </div>");
            }

            var option = question[i].option;
            for(var j=0;j<option.length;j++) {
                var code_radio = option[j].code;
                var content_radio = option[j].content;
                //var score = option[j].score;
                $(".weui-cells_radio:last").append("<label class='weui-cell weui-check__label'>\n" +
                    "            <div class='codeHiden'>"+ code_radio +"</div>\n" +
                    "            <div class='weui-check_div' onclick='radioClick(this)'>\n" +
                    "                <div class='weui-cell__ft'>\n" +
                    "                    <input type='radio' class='weui-check'>\n" +
                    "                    <i class='radio_uncheck'></i>\n" +
                    "                </div>\n" +
                    "                <div class='weui-cell__bd'>\n" +
                    "                    <p>"+ content_radio +"</p>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </label>");
            }
        }else if(type == 1) {
            if(is_required == 1) {
                $('.paper_content').append("<div class='weui-cells weui-cells_checkbox'>\n" +
                    "        <div class='codeHiden'>"+ code +"</div>\n" +
                    "        <div class='questionContent'>\n" +
                    "            <p>"+ number +".</p>\n" +
                    "            <p>"+ content +"<label class='required'>*</label>（"+ number +"/"+ total +"）</p>\n" +
                    "        </div>\n" +
                    "    </div>");
            }else {
                $('.paper_content').append("<div class='weui-cells weui-cells_checkbox'>\n" +
                    "        <div class='codeHiden'>"+ code +"</div>\n" +
                    "        <div class='questionContent'>\n" +
                    "            <p>"+ number +".</p>\n" +
                    "            <p>"+ content +"（"+ number +"/"+ total +"）</p>\n" +
                    "        </div>\n" +
                    "    </div>");
            }

            var option = question[i].option;
            for(var j=0;j<option.length;j++) {
                var code_checkbox = option[j].code;
                var content_checkbox = option[j].content;
                //var score = option[j].score;
                $(".weui-cells_checkbox:last").append("<label class='weui-cell weui-check__label'>\n" +
                    "            <div class='codeHiden'>"+ code_checkbox +"</div>\n" +
                    "            <div class='weui-check_div' onclick='checkboxClick(this)'>\n" +
                    "                <div class='weui-cell__hd'>\n" +
                    "                    <input type='checkbox' class='weui-check'>\n" +
                    "                    <i class='box_uncheck'></i>\n" +
                    "                </div>\n" +
                    "                <div class='weui-cell__bd'>\n" +
                    "                    <p>"+ content_checkbox +"</p>\n" +
                    "                </div>\n" +
                    "            </div>\n" +
                    "        </label>");
            }
        }else if(type == 2) {
            if(is_required == 1) {
                $('.paper_content').append("<div class='weui-cells weui-cells_textarea'>\n" +
                    "        <div class='codeHiden'>"+ code +"</div>\n" +
                    "        <div class='questionContent'>\n" +
                    "            <p>"+ number +".</p>\n" +
                    "            <p>"+ content +"<label class='required'>*</label>（"+ number +"/"+ total +"）</p>\n" +
                    "        </div>\n" +
                    "        <textarea class='suggest' oninput='textareaChange(this)'></textarea>\n" +
                    "    </div>");
            }else {
                $('.paper_content').append("<div class='weui-cells weui-cells_textarea'>\n" +
                    "        <div class='codeHiden'>"+ code +"</div>\n" +
                    "        <div class='questionContent'>\n" +
                    "            <p>"+ number +".</p>\n" +
                    "            <p>"+ content +"（"+ number +"/"+ total +"）</p>\n" +
                    "        </div>\n" +
                    "        <textarea class='suggest' oninput='textareaChange(this)'></textarea>\n" +
                    "    </div>");
            }

        }

    }
}

// 交卷
function submmitPaper() {
    if (!navigator.onLine) {
        DialogUtils.tip('网络连接异常！');
    }

    var answers = [];

    var cells_arr = $('.weui-cells');
    for(var i=0; i<cells_arr.length; i++) {
        var cells_class = $(cells_arr[i]).attr('class');
        var separate=cells_class.split(' ');
        var obj_type = separate[1];
        if(obj_type == 'weui-cells_radio') {
            var radio_code = $(cells_arr[i]).children(".codeHiden").text();
            var radioChecked_code = $(cells_arr[i]).find('.radio_checked').parents(".weui-check__label").children(".codeHiden").text();

            if(!CommonUtils.isEmpty(radioChecked_code)) {
                $(cells_arr[i]).find('.questionContent').next('.hint').remove();
                var radio_answer = {
                    question_code : radio_code,
                    answer : radioChecked_code,
                    type : 0
                };
                answers.push(radio_answer);
            }else {
                var required_arr = $(cells_arr[i]).find('.required');
                for(var j=0;j<required_arr.length;j++) {
                    var required_text = $(required_arr[j]).text();
                    $($(required_arr[j]).parent().parent()).next('.hint').remove();
                    if(!CommonUtils.isEmpty(required_text)) {
                        $($(required_arr[j]).parent().parent()).after("<label class='hint'>请选择</label>");
                        var X = $(cells_arr[i]).offset().top;
                        $(window).scrollTop(X);
                        return;
                    }
                }
            }
        }else if(obj_type == 'weui-cells_checkbox') {
            var checkbox_code = $(cells_arr[i]).children(".codeHiden").text();
            var checkboxChecked_arr = $(cells_arr[i]).find('.box_checked').parents(".weui-check__label").children(".codeHiden");
            if(checkboxChecked_arr.length != 0) {
                var answer_sel = [];
                for(var j=0;j<checkboxChecked_arr.length;j++) {
                    var cbc_code = $(checkboxChecked_arr[j]).text();
                    answer_sel.push(cbc_code);
                }

                $(cells_arr[i]).find('.questionContent').next('.hint').remove();

                var checkbox_answer = {
                    question_code : checkbox_code,
                    answer : answer_sel,
                    type : 1
                };
                answers.push(checkbox_answer);
            }else {
                var required_arr = $(cells_arr[i]).find('.required');
                for(var j=0;j<required_arr.length;j++) {
                    var required_text = $(required_arr[j]).text();
                    $($(required_arr[j]).parent().parent()).next('.hint').remove();
                    if(!CommonUtils.isEmpty(required_text)) {
                        $($(required_arr[j]).parent().parent()).after("<label class='hint'>请选择</label>");
                        var X = $(cells_arr[i]).offset().top;
                        $(window).scrollTop(X);

                        // window.scrollTo({
                        //     top: X,
                        //     behavior: "smooth"
                        // });
                        return;
                    }
                }
            }
        }else if(obj_type == 'weui-cells_textarea') {
            var textarea_code = $(cells_arr[i]).children(".codeHiden").text();
            var textareaWrite_val = $(cells_arr[i]).find('.suggest').val();
            if(!CommonUtils.isEmpty(textareaWrite_val)) {
                $(cells_arr[i]).find('.questionContent').next('.hint').remove();
                var textarea_answer = {
                    question_code : textarea_code,
                    answer : textareaWrite_val,
                    type : 2
                };
                answers.push(textarea_answer);
            }else {
                var required_arr = $(cells_arr[i]).find('.required');
                for(var j=0;j<required_arr.length;j++) {
                    var required_text = $(required_arr[j]).text();
                    $($(required_arr[j]).parent().parent()).next('.hint').remove();
                    if(!CommonUtils.isEmpty(required_text)) {
                        $($(required_arr[j]).parent().parent()).after("<label class='hint'>请填写</label>");
                        var X = $(cells_arr[i]).offset().top;
                        $(window).scrollTop(X);
                        return;
                    }
                }
            }
        }
    }

    // // 单选题
    // var radio_arr = $('.weui-cells_radio');
    // for(var i=0; i<radio_arr.length;i++) {
    //     var radio_code = $(radio_arr[i]).children(".codeHiden").text();
    //     var radioChecked_code = $(radio_arr[i]).find('.radio_checked').parents(".weui-check__label").children(".codeHiden").text();
    //
    //     if(!CommonUtils.isEmpty(radioChecked_code)) {
    //         $(radio_arr[i]).find('.questionContent').next('.hint').remove();
    //         var radio_answer = {
    //             question_code : radio_code,
    //             answer : radioChecked_code,
    //             type : 0
    //         };
    //         answers.push(radio_answer);
    //     }else {
    //         var required_arr = $(radio_arr[i]).find('.required');
    //         for(var j=0;j<required_arr.length;j++) {
    //             var required_text = $(required_arr[j]).text();
    //             //$($(required_arr[j]).parent().parent().next('.hint').remove());
    //             $($(required_arr[j]).parent().parent()).next('.hint').remove();
    //             if(!CommonUtils.isEmpty(required_text)) {
    //                 //DialogUtils.tip("请填写完整！");
    //                 //console.log(radio_code+"radio");
    //                 $($(required_arr[j]).parent().parent()).after("<label class='hint'>请选择</label>");
    //                 var X = $(radio_arr[i]).offset().top;
    //                 $(window).scrollTop(X);
    //                 return;
    //             }
    //         }
    //     }
    // }
    //
    // // 多选题
    // var checkbox_arr = $('.weui-cells_checkbox');
    // for(var i=0; i<checkbox_arr.length;i++) {
    //     var checkbox_code = $(checkbox_arr[i]).children(".codeHiden").text();
    //     var checkboxChecked_arr = $(checkbox_arr[i]).find('.box_checked').parents(".weui-check__label").children(".codeHiden");
    //     if(checkboxChecked_arr.length != 0) {
    //         var answer_sel = [];
    //         for(var j=0;j<checkboxChecked_arr.length;j++) {
    //             var cbc_code = $(checkboxChecked_arr[j]).text();
    //             answer_sel.push(cbc_code);
    //         }
    //
    //         $(checkbox_arr[i]).find('.questionContent').next('.hint').remove();
    //
    //         var checkbox_answer = {
    //             question_code : checkbox_code,
    //             answer : answer_sel,
    //             type : 1
    //         };
    //         answers.push(checkbox_answer);
    //     }else {
    //         var required_arr = $(checkbox_arr[i]).find('.required');
    //         for(var j=0;j<required_arr.length;j++) {
    //             var required_text = $(required_arr[j]).text();
    //             //$($(required_arr[j]).parent().parent()).next().remove();
    //             $($(required_arr[j]).parent().parent()).next('.hint').remove();
    //             if(!CommonUtils.isEmpty(required_text)) {
    //                 //DialogUtils.tip("请填写完整！");
    //                 //console.log(checkbox_code+"checkbox");
    //                 // window.location.hash=radio_code;
    //                 $($(required_arr[j]).parent().parent()).after("<label class='hint'>请选择</label>");
    //                 var X = $(checkbox_arr[i]).offset().top;
    //                 $(window).scrollTop(X);
    //
    //                 // window.scrollTo({
    //                 //     top: X,
    //                 //     behavior: "smooth"
    //                 // });
    //                 return;
    //             }
    //         }
    //     }
    // }
    //
    // // 叙述题
    // var textarea_arr = $('.weui-cells_textarea');
    // for(var i=0; i<textarea_arr.length;i++) {
    //     var textarea_code = $(textarea_arr[i]).children(".codeHiden").text();
    //     var textareaWrite_val = $(textarea_arr[i]).find('.suggest').val();
    //     if(!CommonUtils.isEmpty(textareaWrite_val)) {
    //         $(textarea_arr[i]).find('.questionContent').next('.hint').remove();
    //         var textarea_answer = {
    //             question_code : textarea_code,
    //             answer : textareaWrite_val,
    //             type : 2
    //         };
    //         answers.push(textarea_answer);
    //     }else {
    //         var required_arr = $(textarea_arr[i]).find('.required');
    //         for(var j=0;j<required_arr.length;j++) {
    //             var required_text = $(required_arr[j]).text();
    //             //$($(required_arr[j]).parent().parent()).next().remove();
    //             $($(required_arr[j]).parent().parent()).next('.hint').remove();
    //             if(!CommonUtils.isEmpty(required_text)) {
    //                 //DialogUtils.tip("请填写完整！");
    //                 //console.log(textarea_code+"textarea");
    //                 // window.location.hash=radio_code;
    //                 $($(required_arr[j]).parent().parent()).after("<label class='hint'>请填写</label>");
    //                 var X = $(textarea_arr[i]).offset().top;
    //                 $(window).scrollTop(X);
    //                 // window.scrollTo({
    //                 //     top: X,
    //                 //     behavior: "smooth"
    //                 // });
    //                 return;
    //             }
    //         }
    //     }
    // }

    AjaxUtils.ajax_new({
        header: {
            REQUESTAPP: '0'
        },
        type: 'POST',
        url: request_path.Common + 'question/submit',
        // data: {
        //     token: 'OKPWV7jBTemqHwFQhDZJXn6yCL4rbu0f',
        //     naire: 'Y00043',
        //     answers: answers
        // },
        data: {
            token: user_token,
            naire: paper_code,
            answers: answers
        },
        success: function(data, textStatus, jqXHR) {
            var code = data.code;
            if(code == 200) {
                var note = "感谢您的参与，我们会根据您提出的宝贵意见，不断提升盆底医护服务!";
                // 调用app方法
                CommonUtils.appFun(function() {
                    window.jsInterface.submmitPaper_pop(note);
                }, function() {
                    window.webkit.messageHandlers.submmitPaper_pop.postMessage(note);
                });
            }else {
                var note = data.note;
                DialogUtils.tip(note);
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}









