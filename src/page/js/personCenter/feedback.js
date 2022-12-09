$(function() {
    CommonUtils.setHtmlTitle('意见反馈')
    if(CommonUtils.getCookie('appType') == 3) {
        $('#button > span').css('background-color', '#26c2c4')
    }
})

/**
    添加图片
    @param
    @return
 */
function addImg() {
    Upload.addImg('inputFile', function(fullUrl, url){
        var $imgDiv = $('<div></div>')
        .append('<img class="aliImg" src="'+ fullUrl+CommonUtils.getAliOssCompress(600,600) +'" shortSrc="'+ url +'">')
        var $closeImg = $('<img class="close" src="./src/assets/img/personCenter/close.png">').click(function() {
            $(this).parent().remove()
            if ($('#add').find('.aliImg').length < 3) {
                $('#addImg').show()
            }
        })
        $imgDiv.append($closeImg)
        $('#addImg').before($imgDiv)
        if ($('#add').find('.aliImg').length == 3) {
            $('#addImg').hide()
        }
        $('#show3').hide()
    })
}

/**
    提交
    @param
    @return
 */
function submit() {
    var title = $('#title').children('input').val()
    if (CommonUtils.isEmpty(title)) {
        DialogUtils.newTip('请填写标题')
        return
    }
    var desc = $('#desc').children('textarea').val()
    if (CommonUtils.isEmpty(desc)) {
        DialogUtils.newTip('请填写意见描述')
        return
    }
    var imgArr = []
    $('.aliImg').each(function(i, val) {
        imgArr.push($(val).attr('shortSrc'))
    })
    var requestHeader = {
        REQUESTCLIENT: CommonUtils.getRequestClient(),
        REQUESTAPP: 2
    }
    if(!CommonUtils.isEmpty(CommonUtils.getCookie('appType'))) {
        requestHeader.REQUESTAPP = CommonUtils.getCookie('appType')
    }
    if(!CommonUtils.isEmpty(CommonUtils.getCookie('requestClient'))) {
        requestHeader.REQUESTCLIENT = CommonUtils.getCookie('requestClient')
    }
    AjaxUtils.ajax({
        header: requestHeader,
        type: 'POST',
        url: request_path.Rih + 'UserFeedBack/addAUserFeedBack',
        data: {
            ufbUIUID: CommonUtils.getCookie('uuid'),
            ufbTitle: title,
            ufbDesc: desc,
            ufbImages: JSON.stringify(imgArr)
        },
        success: function(result, textStatus, jqXHR) {
            if (result.code == 200) {
                DialogUtils.newTip(result.msg, function() {
                    CommonUtils.appFun(function() {
                        window.jsInterface.closeWindow()
                    }, function() {
                        window.webkit.messageHandlers.closeWindow.postMessage(null)
                    })
                })
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}
