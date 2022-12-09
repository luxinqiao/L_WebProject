$(function() {
    CommonUtils.setHtmlTitle('问卷详情')
    initData()
})

/**
    初始化数据
    @param
    @return
*/
function initData() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.live + 'common/questionnaire/answer',
        data: {
            code: Router.getParameter('code')
        },
        success: function(result, textStatus, jqXHR) {
            //添加标题
            $('#title').text(result.data.naire.title)
            $('#name').text('姓名：'+result.data.naire.name)
            $('#hospital').text(result.data.naire.hospital)
            //添加题目
            for (var i=0; i<result.data.question.length; i++) {
                var questionObj = result.data.question[i]
                var $question = $('<div></div>')
                if (questionObj.type == '0') {
                    $question.addClass('oneSelect')
                    .append('<div class="question"><font>*</font>'+questionObj.sort+'. '+questionObj.question+'（单选）</div>')
                    $answer = $('<div class="answer"></div>')
                    for (var j=0; j<questionObj.answer.length; j++) {
                        var answerObj = questionObj.answer[j]
                        $answerItem = $('<div class="answerItem"></div>')
                        if (answerObj.checked == '0') {
                            $answerItem.append('<img src="/src/assets/img/questionnairePc/unSelect_circle.png"></img>')
                            $answerItem.append('<span class="gray">'+answerObj.content+'</span>')
                        } else {
                            $answerItem.append('<img src="/src/assets/img/questionnairePc/select_circle.png"></img>')
                            $answerItem.append('<span>'+answerObj.content+'</span>')
                        }
                        if (answerObj.is_other == '1') {
                            $answerItem.append('<div class="answerOther">'+answerObj.answer_other+'</div>')
                        }
                        $answer.append($answerItem)
                    }
                    $question.append($answer)
                } else if (questionObj.type == '1') {
                    $question.addClass('manySelect')
                    .append('<div class="question"><font>*</font>'+questionObj.sort+'. '+questionObj.question+'（多选）</div>')
                    $answer = $('<div class="answer"></div>')
                    for (var j=0; j<questionObj.answer.length; j++) {
                        var answerObj = questionObj.answer[j]
                        $answerItem = $('<div class="answerItem"></div>')
                        if (answerObj.checked == '0') {
                            $answerItem.append('<img src="/src/assets/img/questionnairePc/unSelect_square.png"></img>')
                            $answerItem.append('<span class="gray">'+answerObj.content+'</span>')
                        } else {
                            $answerItem.append('<img src="/src/assets/img/questionnairePc/select_square.png"></img>')
                            $answerItem.append('<span>'+answerObj.content+'</span>')
                        }
                        if (answerObj.is_other == '1') {
                            $answerItem.append('<div class="answerOther">'+answerObj.answer_other+'</div>')
                        }
                        $answer.append($answerItem)
                    }
                    $question.append($answer)
                } else if (questionObj.type == '2') {
                    $question.addClass('short')
                    .append('<div class="question"><font>*</font>'+questionObj.sort+'. '+questionObj.question+'（简述）</div>')
                    $answer = $('<div class="answer"></div>')
                    if (!CommonUtils.isEmpty(questionObj.answer.text)) {
                        $answer.append('<div class="answerText">'+questionObj.answer.text+'</div>')
                    }
                    if (!CommonUtils.isEmpty(questionObj.answer.pic)) {
                        $answer.append('<img class="answerImg" src="'+questionObj.answer.pic+'"></img>')
                    }
                    $question.append($answer)
                } else if (questionObj.type == '3') {
                    $question.addClass('fill')
                    .append('<div class="question"><font>*</font>'+questionObj.sort+'. '+questionObj.question+'（填空）</div>')
                    .append('<div class="answer">'+questionObj.answer+'</div>')
                }  
                $('#detail').append($question)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}
