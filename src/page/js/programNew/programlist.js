var captcha = '',
    isClick = false, isLoginClick = false,
    programTimer = null, programSecond = 60,
    map=['', 'CreateTime', 'tcCourseName', 'tcTrainTotalNumber', 'tcTrainTotalTime', 'tcCourseDesc']

$(function () {
    initPage()
})

/**
    初始化页面
    @param
    @return
 */
function initPage() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.Rih + 'DoctorTrainCourse/getTrainCourseForDoctor',
        data: {
            token: localStorage.getItem('token')
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if(data.code == '201') {
                $('.programList-login').show()
                $('.programList-login-content').addClass('programList-login-content-show')
                return
            }
            if (data.data.length) {
                for(var i=0; i<data.data.length; i++ ) {
                    (function () {
                        var num = i
                        return function () {
                            var $bodyItem = $("<div class='programList-tbody-item'></div>")
                            for (var j=0; j<7; j++) {
                                var $item = $("<div></div>")
                                $item.addClass('programList-tbody-' + j)
                                if (j === 0) {
                                    $item.text(i + 1)
                                } else if(j === 6) {
                                    $item.text('查看详情')
                                    $item.click(function () {
                                        window.parent.Router.jump('programNew/detail', '?tcUID=' + data.data[num].tcUID)
                                    })
                                } else {
                                    $item.text(data.data[i][map[j]])
                                }
                                $bodyItem.append($item)
                            }
                            $('.programList-tbody').append($bodyItem)
                        }
                    })()()
                }
            } else {
                $('.programList-tbody').css('min-height', '300px')
                var $bodyDefault = $("<div class='programList-default'></div>")
                $bodyDefault.text('暂无方案')
                $('.programList-tbody').append($bodyDefault)
            }
            var windowHeight = document.documentElement.clientHeight || window.innerHeight
            $('.programList').show()
            if($('.programList-tbody').innerHeight() > windowHeight - 133) {
                $('.programList-tbody').css('max-height', windowHeight - 133 + 'px')
                $('.programList-thead').css('padding-right', '17px')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    获取验证码
    @param
    @return
 */
function getCaptcha() {
    if (isClick) {
       return
    }
    isClick = true
    var phone = CommonUtils.trimStr($('#phone').val())
    if (!RegUtils.validPhone(phone)) {
        $('.programList-login-prompt').show()
        $('.programList-login-input').addClass('programList-login-input-error')
        isClick = false
        return
    }
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.Common_rih + 'commonservice/alysms',
        data: {
            msg_type: 1,
            phone: phone
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if(data.code == '200') {
                $('.programList-login-getCaptcha').text('60s')
                $('.programList-login-getCaptcha').addClass('programList-login-disabled')
                programTimer = setInterval(function () {
                    $('.programList-login-getCaptcha').text(--programSecond + 's')
                    if(programSecond === 0) {
                        $('.programList-login-getCaptcha').text('获取验证码')
                        $('.programList-login-getCaptcha').removeClass('programList-login-disabled')
                        clearInterval(programTimer)
                        programTimer = null
                        isClick = false
                    }
                }, 1000)
                showMessage('验证码已发送', 'success')
            } else {
                isClick = false
                showMessage(data.note, 'error')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    点击退出登录时触发
    @param
    @return
 */
function showSignOut() {
    $('.programList-dialog').show()
    $('.programList-dialog-box').removeClass('programList-login-content-hide').addClass('programList-login-content-show')
}

/**
    点击取消退出登录时触发
    @param
    @return
 */
function hideSignOut() {
    $('.programList-dialog-box').removeClass('programList-login-content-show').addClass('programList-login-content-hide')
    setTimeout(function () {
        $('.programList-dialog').hide()
    }, 280)
}

/**
    点击确定退出登录时触发
    @param
    @return
 */
function signOut() {
    localStorage.removeItem('token')
    $('.programList-dialog-box').removeClass('programList-login-content-show').addClass('programList-login-content-hide')
    $('.programList-dialog').hide()
    $('.programList-tbody').empty()
    $('.programList-login').show()
    $('.programList-login-content').removeClass('programList-login-content-hide').addClass('programList-login-content-show')
    $('.programList').hide()
}

/**
    手机号输入框获取焦点事件
    @param
    @return
 */
function phoneFocus() {
    $('.programList-login-prompt').hide()
    $('.programList-login-input').removeClass('programList-login-input-error')
}

/**
    验证码输入框获取焦点事件
    @param
    @return
 */
function captchaFocus() {
    $('.programList-login-captcha-prompt').hide()
    $('.programList-login-captcha-input').removeClass('programList-login-input-error')
}

/**
    点击登录按钮
    @param
    @return
 */
function goLogin() {
    if (isLoginClick) {
        return
    }
    isLoginClick = true
    var phone = CommonUtils.trimStr($('#phone').val())
    var password = CommonUtils.trimStr($('#password').val())
    if(!RegUtils.validPhone(phone)) {
        $('.programList-login-prompt').show()
        $('.programList-login-input').addClass('programList-login-input-error')
        isLoginClick = false
        return
    }
    if (password === '') {
        $('.programList-login-captcha-prompt').show()
        $('.programList-login-captcha-input').addClass('programList-login-input-error')
        isLoginClick = false
        return
    }
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.Rih + 'DoctorLoginForToken/doctorValidIdenfifyCodeByTelForLogin',
        data: {
            telNumber: phone,
            identifyCode: password
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if(data.code != '200') {
                showMessage(data.note, 'error')
                isLoginClick = false
            } else {
                localStorage.setItem('token', data.data.Token)
                initPage()
                $('#phone').val('')
                $('#password').val('')
                $('.programList-login-content').removeClass('programList-login-content-show')
                $('.programList-login-content').addClass('programList-login-content-hide')
                setTimeout(function () {
                    $('.programList-login').hide()
                    showMessage('登录成功', 'success')
                }, 300)
                isLoginClick = false
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    弹出框
    @param {String} note 内容
    @param {String} type 类型
    @return
 */
function showMessage(note, type) {
    $('.programList-message').text(note)
    $('.programList-message').addClass('programList-message-slideIn programList-message-' + type)
    $('.programList-message').show()
    setTimeout(function () {
        $('.programList-message').removeClass('programList-message-slideIn')
        $('.programList-message').addClass('programList-message-slideOut programList-message-' + type)
        setTimeout(function () {
            $('.programList-message').removeClass('programList-message-slideOut')
            $('.programList-message').removeClass('programList-message-' + type)
            $('.programList-message').hide()
        }, 300)
    }, 3000)
}