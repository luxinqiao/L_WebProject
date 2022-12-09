/*
    文件描述：百科-提问
    创建人：卢信桥
    创建时间：2020-08-05
 */

$(function(){
    window.parent.CommonUtils.setHtmlTitle('提问')
    initPage()
    if(window.parent.Router.getParameter('source') == 'app' ) {
        $('#title').css('display','none')
        $('body').css('padding-top','0')
    } else {
        $('#title').css('display','block')
        $('body').css('padding-top','0.44rem')
    }
})

/**
    初始化页面
    @param
    @return
 */
function initPage() {
    if(!CommonUtils.isEmpty(window.parent.Router.getParameter('code'))) {
        AjaxUtils.ajax({
            header: {
                REQUESTAPP: CommonUtils.getRequestApp(1),
                REQUESTCLIENT: CommonUtils.getRequestClient(57),
            },
            type: 'POST',
            url: request_path.live + 'pdbk/question/detail',
            data: {
                code: window.parent.Router.getParameter('code'),
                token: window.parent.CommonUtils.getToken()
            },
            notPrompt: true,
            success: function(res, textStatus, jqXHR) {
                if (res.code == 200) {
                    $('#question').val(res.data.question_name)
                    $("#question_count").text($('#question').val().length+'/50')
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
    
            }
        })
    }
}

/**
    实时监听输入框
    @param
    @return
 */
$("#question").on("input propertychange", function() {
    if ($(this).val().length > 50) {
        $(this).val($(this).val().substring(0, 50))
    }
    $("#question_count").text($(this).val().length+'/50')
})

/**
    提交
    @param
    @return
 */
function submit() {
    if($('#question').val().length<5) {
        DialogUtils.newTip('请输入5-50个字符')
        return
    }
    var url = ''
    var dataObj = {
        token: window.parent.CommonUtils.getToken(),
        content: $('#question').val()
    }
    if(!CommonUtils.isEmpty(window.parent.Router.getParameter('code'))) {
        url = request_path.live + 'pdbk/user/update-question'
        dataObj.code = window.parent.Router.getParameter('code')
    } else {
        url = request_path.live + 'pdbk/user/create-question'
    }
    updata(url,dataObj)
}

/**
    通用-提交
    @param {string} url 请求接口
    @param {object} param 请求数据
    @return
 */
function updata(url,param) {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: CommonUtils.getRequestApp(1),
            REQUESTCLIENT: CommonUtils.getRequestClient(57),
        },
        type: 'POST',
        url: url,
        data: param,
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (res.code == 200) {
                if(window.parent.Router.getParameter('source') == 'app') {
                    window.parent.CommonUtils.appFun(function() {
                        window.parent.jsInterface.submitQuestion()
                    }, function() {
                        window.parent.webkit.messageHandlers.submitQuestion.postMessage(null)
                    })
                }
                DialogUtils.newTipAlert(res.msg,'确认',function(){
                    if(window.parent.Router.getParameter('source') == 'app') {
                        window.parent.CommonUtils.appFun(function() {
                            window.parent.jsInterface.closeWindow()
                        }, function() {
                            window.parent.webkit.messageHandlers.closeWindow.postMessage(null)
                        })
                    }
                    back()
                })
            }  else if(res.code == 3 || res.code == 102 || res.code == 201) {
                window.parent.CommonUtils.appFun(function() {
                    window.parent.jsInterface.goLogin()
                }, function() {
                    window.parent.webkit.messageHandlers.goLogin.postMessage(null)
                })
            } else {
                DialogUtils.newTip(res.note)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    返回
    @param 
    @return
 */
function back() {
    history.back(-1)
}
