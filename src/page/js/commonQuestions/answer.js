$(function(){
    var faq_id = Router.getParameter("faq_id");
    getAnswer(faq_id);

});

// 初始化问题答案详情
function getAnswer(faq_id) {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.Know + 'faq/detail',
        data: {
            faq_id: faq_id
        },
        success: function(data, textStatus, jqXHR) {
            var record = data.data;
            if(!CommonUtils.isEmpty(record)) {
                initAnswerDetail(record);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

// 填充数据
function initAnswerDetail(record) {
    var title = record.title;
    var content = record.content;
    $('.answerTitle').text(title);
    // 清空之前内容
    $('.answerContent').empty();
    for(var i=0; i<content.length; i++) {
        var type = content[i].type;
        if(type == 0) { // 文本内容
            $('.answerContent').append("<p class='answerText'>" +
                content[i].value +
                "</p>");
        }else if(type == 1) { // 图片
            var remark = content[i].remark;
            if(!CommonUtils.isEmpty(remark)) {
                $('.answerContent').append("<p class='answerImg'>\n" +
                    "                    <img src='" +
                    content[i].value +
                    "'>\n" +
                    "                    <p class='imgRemark'>" +
                    content[i].remark +
                    "</p>\n" +
                    "                </p>");
            }else {
                $('.answerContent').append("<p class='answerImg' style='margin-bottom: 1.25rem;'>\n" +
                    "                    <img src='" +
                    content[i].value +
                    "'></p>");
            }
        }
    }
}