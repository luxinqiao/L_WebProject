var captcha = '',
    isClick = false, isLoginClick = false,
    programTimer = null, programSecond = 60

var systemPage = 1, autoPage = 1, trainPage = 1
var nowObj = {
    type: 'system',  //system-系统方案、auto-自动生成、train-自由训练
    allPage: 0
}
var searchObj = {
    isSearch: false,
    type:'',
    content: '',
    page: 1
}
var deleId = ''

$(function () {
    if(!CommonUtils.isEmpty(CommonUtils.getParameter('token'))) {
        localStorage.setItem('token', CommonUtils.getParameter('token'))
    }
    initPage('system', systemPage)
})

/**
    初始化页面
    @param
    @return
 */
function initPage(type, page) {
    var param = {
        token: localStorage.getItem('token'),
        tcResourceType: convertType(type),
        page: page
    }
    if(!CommonUtils.isEmpty(searchObj.content)) {
        if (searchObj.type == type) {
            param.courseName = searchObj.content
        }
    }
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/course-list',
        data: param,
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if(data.code == '201') {
                $('.programList-login').show()
                $('.programList-login-content').addClass('programList-login-content-show')
                return
            }
            nowObj.allPage = data.totalPage
            createPage(Number(data.totalPage), Number(page))
            $('.page-btn').removeClass('end-btn')
            if(page<=1 || data.totalPage < 1) {
                $('.pre-btn').addClass('end-btn')
            }
            if(page == data.totalPage || data.totalPage < 1) {
                $('.next-btn').addClass('end-btn')
            }
            if (nowObj.type == 'system'){
                $('.system').empty()
                if ($('.system').scrollTop() > 0) {
                    $('.system').scrollTop(0)
                }
            } else if (nowObj.type == 'auto'){
                $('.auto').empty()
                if ($('.auto').scrollTop() > 0) {
                    $('.auto').scrollTop(0)
                }
            } else if (nowObj.type == 'train') {
                $('.train').empty()
                if ($('.train').scrollTop() > 0) {
                    $('.train').scrollTop(0)
                }
            }
            if (data.data.length) {
                $('.page').css('display','block')
                for (var i=0; i<data.data.length; i++) {
                    (function () {
                        var num = i
                        return function () {
                            var $bodyItem = $("<div class='programList-tbody-item'></div>")
                            $bodyItem.append("<div class='programList-tbody-0'>" + (num+1) + "</div>")
                            $bodyItem.append("<div class='programList-tbody-1'>" + data.data[num].CreateTime + "</div>")
                            $bodyItem.append("<div class='programList-tbody-2'>" + data.data[num].classify_level1_name + "</div>")
                            /*
                            $bodyItem.append("<div class='programList-tbody-3'>" + data.data[num].classify_level2_name + "</div>")
                            */
                            $bodyItem.append("<div class='programList-tbody-4'>" + data.data[num].tcCourseName + "</div>")
                            $bodyItem.append("<div class='programList-tbody-5'>" + data.data[num].tcTrainTotalNumber + "</div>")
                            $bodyItem.append("<div class='programList-tbody-6'>" + Math.floor(Number(data.data[num].tcTrainTotalTime)/60) + "</div>")
                            $bodyItem.append("<div class='programList-tbody-7'>" + data.data[num].tcCourseDesc + "</div>")
                            
                            var $goItem = $("<div class='item-go'>查看详情</div>").click(function () {
                                window.open(window.location.protocol+'//'+window.location.host+'/#/programNew/detail?tcUID='+data.data[num].tcUID)
                            })
                            var $copyItem = $("<span class='item-copy'>复制</span>").click(function () {
                                detail(data.data[num].tcUID, function(dataObj){
                                    save(dataObj)
                                })
                            })
                            var $delItem = $("<div class='item-dele'>删除</div>").click(function () {
                                deleId = data.data[num].tcUID
                                $('.dele-con').text('是否删除该方案-'+data.data[num].tcCourseName)
                                deleDialogShow()
                            })
                            var $tbody8 = $("<div class='programList-tbody-8'></div>")
                            $tbody8.append($goItem).append($copyItem).append($delItem)
                            $bodyItem.append($tbody8)

                            if (type == 'system') {
                                $('.system').append($bodyItem)
                            } else if (type == 'auto') {
                                $('.auto').append($bodyItem)
                            } else if (type == 'train') {
                                $('.train').append($bodyItem)
                            }
                        }
                    })()()
                }
            } else {
                $('.page').css('display','none')
                $('.programList-tbody').css('min-height', '300px')
                var $bodyDefault = $("<div class='programList-default'></div>")
                $bodyDefault.text('暂无方案')
                if (type == 'system') {
                    $('.system').append($bodyDefault)
                } else if (type == 'auto') {
                    $('.auto').append($bodyDefault)
                } else if (type == 'train') {
                    $('.train').append($bodyDefault)
                }
            }
            var windowHeight = document.documentElement.clientHeight || window.innerHeight
            $('.programList').show()
            if($('.programList-tbody').innerHeight() > windowHeight - 280) {
                $('.programList-tbody').css('height', windowHeight - 280 + 'px')
                $('.programList-thead').css('padding-right', '17px')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    点解删除
    @param
    @return
 */
function deleDialogShow() {
    $('.dele-dialog').show()
    $('.dele-dialog-box').removeClass('programList-login-content-hide').addClass('programList-login-content-show')
    $('.dele-dialog-box').height(110 + $('.dele-dialog-content').height())
}

/**
    确认删除
    @param
    @return
 */
function deleConfirm() {
    delePlan(deleId)
}

/**
    删除
    @param {string} id 删除的方案id
    @return
 */
function delePlan(id){
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/course-delete',
        data: {
            tcUID: id
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if(data.code == '200') {
                deleId = ''
                showMessage('删除成功', 'success')
                if (nowObj.type == 'system'){
                    initPage('system', systemPage)
                } else if (nowObj.type == 'auto'){
                    initPage('auto', autoPage)
                } else if (nowObj.type == 'train') {
                    initPage('train', trainPage)
                }
                hideSignOut()
            } else {
                showMessage(data.note, 'error')
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
    tab切换
    @param
    @return
 */
$(".programList-tab span").click(function () {
    var index = $(".programList-tab span").index(this)
    $('.programList-tab span').removeClass('act')
    $(this).addClass('act')
    $('.programList-tbody').css('display','none')
    if (index == 0) {
        initPage('system', systemPage)
        nowObj.type = 'system'
        $('.system').css('display','block')
    } else if (index == 1) {
        initPage('auto', autoPage)
        nowObj.type = 'auto'
        $('.auto').css('display','block')
    } else if (index == 2) {
        initPage('train', trainPage)
        nowObj.type = 'train'
        $('.train').css('display','block')
    } 
})

/**
    点解新增
    @param
    @return
 */
function add() {
    $('.add-dialog').show()
    $('.add-dialog-box').removeClass('programList-login-content-hide').addClass('programList-login-content-show')
}

/**
    新增-完成
    @param
    @return
 */
function addPlane() {
    if (CommonUtils.isEmpty($('#select').val()) || $('#select').val()=='default') {
        $('.add-type').css('display','inline-block')
    } else if(CommonUtils.isEmpty(CommonUtils.trimStr($('#name').val()))) {
        $('.add-name').css('display','inline-block')
    } else {
        var param = {
            token: localStorage.getItem('token'),
            tcResourceType: convertType($('#select').val()),
            courseName: $('#name').val()
        }
        if(!CommonUtils.isEmpty($('#des').val())) {
            param.courseDesc = $('#des').val()
        }
        addCom(param, function(data) {
            if (nowObj.type == 'system') {
                systemPage = 1
                initPage('system', systemPage)
            } else if (nowObj.type == 'auto') {
                autoPage = 1
                initPage('auto', autoPage)
            } else if (nowObj.type == 'train') {
                trainPage = 1
                initPage('train', trainPage)
            }
            hideSignOut()
            $('#select').val('default')
            $('#name').val('')
            $('#des').val('')
            window.open(window.location.protocol+'//'+window.location.host+'/#/programNew/detail?tcUID='+data)
        })
    }
}

/**
    新增公共部分
    @param {object} param 请求参数
    @param {function} callback 回调函数
    @return
 */
function addCom(param, callback){
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/add-course',
        data: param,
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if(data.code == '200') {
                callback(data.data.tcUID)
            } else {
                showMessage(data.note, 'error')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}
/**
    方案详情
    @param {string} id 方案id
    @param {function} callback 回调函数
    @return
 */
function detail(id,callback){
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/get-course',
        data: {
            token: localStorage.getItem('token'),
            tcUID: id
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if(data.code == '200') {
                callback(data.data)
            } else {
                showMessage(data.note, 'error')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}
/**
    复制-保存
    @param {object} param 请求参数
    @return
 */
function save(param){
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/upload-course',
        data: param,
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if (data.code == '200') {
                showMessage('复制成功', 'success')
                if (nowObj.type == 'system'){
                    systemPage = 1
                    initPage('system', systemPage)
                } else if (nowObj.type == 'auto'){
                    autoPage = 1
                    initPage('auto', autoPage)
                } else if (nowObj.type == 'train'){
                    trainPage = 1
                    initPage('train', trainPage)
                }
            } else {
                showMessage(data.note, 'error')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    搜索
    @param
    @return
 */
function search() {
    searchObj.isSearch = true
    searchObj.type = $('#searchSel').val()
    searchObj.content = $('#searchName').val()
    initPage(searchObj.type, searchObj.page)
    $('.programList-tab span').removeClass('act')
    $('.programList-tbody').css('display','none')
    if (searchObj.type == 'system') {
        nowObj.type = 'system'
        $('.programList-tab .system-tab').addClass('act')
        $('.system').css('display','block')
    } else if (searchObj.type == 'auto') {
        nowObj.type = 'auto'
        $('.programList-tab .auto-tab').addClass('act')
        $('.auto').css('display','block')
    } else if (searchObj.type == 'train') {
        nowObj.type = 'train'
        $('.programList-tab .train-tab').addClass('act')
        $('.train').css('display','block')
    }
}

/**
    监听输入框聚焦
    @param
    @return
 */
$("#name").on('focus',function(){
    $('.add-name').css('display','none')
})

/**
    监听输入框聚焦
    @param
    @return
 */
$("#select").on('focus',function(){
    $('.add-type').css('display','none')
})

/**
    点击上一页
    @param
    @return
 */
function getPre(){
    if (nowObj.type == 'system'){
        if (systemPage <= 1) {
            showMessage('没有更多内容！', 'success')
            return
        }
        systemPage--
        initPage('system', systemPage)
    } else if (nowObj.type == 'auto'){
        if (autoPage <= 1) {
            showMessage('没有更多内容！', 'success')
            return
        }
        autoPage--
        initPage('auto', autoPage)
    } else if (nowObj.type == 'train'){
        if (trainPage <= 1) {
            showMessage('没有更多内容！', 'success')
            return
        }
        trainPage--
        initPage('train', trainPage)
    }
}

/**
    点击下一页
    @param
    @return
 */
function getnNext(){
    if (nowObj.type == 'system'){
        if (systemPage == nowObj.allPage) {
            showMessage('没有更多内容！', 'success')
            return
        }
        systemPage++
        initPage('system', systemPage)
    } else if (nowObj.type == 'auto'){
        if (autoPage == nowObj.allPage) {
            showMessage('没有更多内容！', 'success')
            return
        } 
        autoPage++
        initPage('auto', autoPage)
    } else if (nowObj.type == 'train'){
        if (trainPage == nowObj.allPage) {
            showMessage('没有更多内容！', 'success')
            return
        } 
        trainPage++
        initPage('train', trainPage)
    }
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

/**
    分页
    @param {Number}} totalPages 分页的总页数
    @param {Number} current 当前页
    @return
 */
function createPage(totalPages , current) {
    $('.page-mid').empty()
    if(totalPages<=5){
        for(var pageIndex= 1 ; pageIndex < totalPages+1; pageIndex++){
            var $pageItem = $('<span class="page-btn-index" data-page="'+pageIndex+'">'+pageIndex+'</span>')
            $pageItem.click(function(){
                $('.page-btn-index').removeClass('page-act')
                $(this).addClass('page-act')
                if (nowObj.type == 'system'){
                    systemPage = $(this).attr('data-page')
                    initPage('system', systemPage)
                } else if (nowObj.type == 'auto'){
                    autoPage = $(this).attr('data-page')
                    initPage('auto', autoPage)
                } else if (nowObj.type == 'train'){
                    trainPage = $(this).attr('data-page')
                    initPage('train', trainPage)
                }
            })
            if(pageIndex == current){
                $pageItem.addClass('page-act')
            }
            $('.page-mid').append($pageItem)
        }
    }else{
        if(current<5){
            for(var pageIndex= 1 ; pageIndex < 6; pageIndex++){
                var $pageItem = $('<span class="page-btn-index" data-page="'+pageIndex+'">'+pageIndex+'</span>')
                $pageItem.click(function(){
                    $('.page-btn-index').removeClass('page-act')
                    $(this).addClass('page-act')
                    if(nowObj.type == 'system'){
                        systemPage = $(this).attr('data-page')
                        initPage('system', systemPage)
                    } else if (nowObj.type == 'auto'){
                        autoPage = $(this).attr('data-page')
                        initPage('auto', autoPage)
                    } else if (nowObj.type == 'train'){
                        trainPage = $(this).attr('data-page')
                        initPage('train', trainPage)
                    }
                })
                if(pageIndex == current){
                    $pageItem.addClass('page-act')
                }
                $('.page-mid').append($pageItem)
            }
            $('.page-mid').append($('<span class="page-more">...</span>'))
        }else if(current> totalPages-4){
            $('.page-mid').append($('<span class="page-more">...</span>'))
            for(var pageIndex= totalPages-4 ; pageIndex <= totalPages; pageIndex++){
                var $pageItem = $('<span class="page-btn-index" data-page="'+pageIndex+'">'+pageIndex+'</span>')
                $pageItem.click(function(){
                    $('.page-btn-index').removeClass('page-act')
                    $(this).addClass('page-act')
                    if (nowObj.type == 'system'){
                        systemPage = $(this).attr('data-page')
                        initPage('system', systemPage)
                    } else if (nowObj.type == 'auto'){
                        autoPage = $(this).attr('data-page')
                        initPage('auto', autoPage)
                    } else if (nowObj.type == 'train'){
                        trainPage = $(this).attr('data-page')
                        initPage('train', trainPage)
                    }
                })
                if(pageIndex == current){
                    $pageItem.addClass('page-act')
                }
                $('.page-mid').append($pageItem)
            }
        }else if(current>=5 && current <= totalPages-4){
            $('.page-mid').append($('<span class="page-more">...</span>'))
            for(var pageIndex= current-2 ; pageIndex <= Number(current)+2; pageIndex++){
                var $pageItem = $('<span class="page-btn-index" data-page="'+pageIndex+'">'+pageIndex+'</span>')
                $pageItem.click(function(){
                    $('.page-btn-index').removeClass('page-act')
                    $(this).addClass('page-act')
                    if (nowObj.type == 'system'){
                        systemPage = $(this).attr('data-page')
                        initPage('system', systemPage)
                    } else if (nowObj.type == 'auto'){
                        autoPage = $(this).attr('data-page')
                        initPage('auto', autoPage)
                    } else if (nowObj.type == 'train'){
                        trainPage = $(this).attr('data-page')
                        initPage('train', trainPage)
                    }
                    if (pageIndex == current){
                        $pageItem.addClass('page-act')
                    }
                })
                $('.page-mid').append($pageItem)
            }
            $('.page-mid').append($('<span class="page-more">...</span>'))
        }
    }
}

function convertType(type) {
    if (type == 'system') {
        return '1'
    } else if (type == 'auto') {
        return '4'
    } else if (type == '') {
        return ''
    }
    return ''
}