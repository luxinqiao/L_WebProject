/*
    文件描述：百科-详情
    创建人：卢信桥
    创建时间：2020-08-05
 */
var browserType = window.parent.CommonUtils.getBrowserType()
var code  = window.parent.Router.getParameter('code')
var answerObj = {
    code: '',
    pv: 0,
    likeNum: 0,
    isLike: false,
    isCollect: false
}
var imgArr = []
var poster = {
    title: '',
    desc: '',
    imgInfo: {}
}
$(function(){
    window.parent.CommonUtils.setHtmlTitle('盆底百科')
    $(window).scrollTop(sessionStorage.scrollTop)
    sessionStorage.scrollTop = 0
    initPage()
    initData()
})

/**
    初始化页面
    @param
    @return
 */
function initPage() {
    if (browserType == 'wechat') {
        $('#title').css('display','none')
        $('body').css('padding-top','0')
        $('.btn').css('display','none')
        $('.ask_btn').css('display','none')
    } else if(browserType == 'app') {
        if(window.parent.Router.getParameter('source') == 'app') {
            $('#title').css('display','none')
            $('body').css('padding-top','0')
        } else {
            $('#title').css('display','block')
        }
    } else {
        $('.back_btn').css('display','none')
        $('#title').css('display','block')
        $('body').css('padding-top','0.44rem')
        $('.btn').css('display','none')
        $('.ask_btn').css('display','none')
    }
}

/**
    初始化数据
    @param {string} type 调用类型
    @return
 */
function initData(type) {
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
                var data = res.data
                $('.question_img').attr('src','/src/assets/img/knowledge/detail/question.png')
                $('.question_img').css('display','block')
                $('.question_dec').text(data.question_name)
                if(browserType == 'app') {
                    if(window.parent.Router.getParameter('from') == 'ask') {
                        $('.question_edit').css('display','flex')
                    } else {
                        $('.ask_btn').css('display','block')
                        $('.question_edit').css('display','none')
                    }
                }
                if (data.answer.length>0) {
                    poster.title = data.question_name
                    poster.desc = data.answer[0].content[0].value
                    beginDraw(data.question_name, data.answer[0].content[0].value, function(res) {
                        console.log(src)
                        poster.imgInfo = res
                    })
                    if(window.parent.Router.getParameter('from') != 'ask' && browserType == 'app') {
                        $('.btn').css('display','flex')
                        if(data.answer[0].is_like == 1) {
                            $('.btn_good img').attr('src','/src/assets/img/knowledge/detail/good.png')
                        } else {
                            $('.btn_good img').attr('src','/src/assets/img/knowledge/detail/nogood.png')
                        }
                        if(data.answer[0].is_collect == 1) {
                            $('.btn_collect img').attr('src','/src/assets/img/knowledge/detail/start.png')
                        } else {
                            $('.btn_collect img').attr('src','/src/assets/img/knowledge/detail/nostart.png')
                        }
                    }
                    answerObj = {
                        code: data.answer[0].code,
                        pv: data.pv,
                        likeNum: data.answer[0].like_num,
                        isLike: data.answer[0].is_like == 1? true:false,
                        isCollect: data.answer[0].is_collect == 1? true:false,
                    }
                    for (var i=0; i<data.answer.length; i++) {
                        (function () {
                            return function () {
                                var $bodyItem = $("<div class='has_answer'></div>")
                                $bodyItem.append("<img src='/src/assets/img/knowledge/detail/answer.png' class='answer_img'>")
                                var $answer = $("<div class='answer_content'></div>") 

                                for(var j=0; j<data.answer[i].content.length;j++){
                                    (function () {
                                        return function () {
                                            if(data.answer[i].content[j].type == 0) {
                                                $answer.append("<p>"+data.answer[i].content[j].value+"</p>")
                                            } else {
                                                imgArr.push(data.answer[i].content[j].value)
                                                $answer.append("<img src='"+data.answer[i].content[j].value+"' onclick='lookImg("+'"'+data.answer[i].content[j].value+'"' +")'>")
                                            }
            
                                        }
                                    })()()
                                }
                                $answer.append("<div class='answer_num'> <span class='read'>"+data.pv+"阅读 · "+data.answer[i].like_num+"赞</span> <span>"+data.answer[i].gmt_create+"</span></div>")
                                $bodyItem.append($answer)
                                $('.answer').append($bodyItem)

                            }
                        })()()
                    }
                } else {
                    $('.no_answer').css('display','block')
                    $('.no_answer').css('height',($(window).height()-$('.no_answer').offset().top)+'px')
                    $('.btn').css('display','none')
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    查看图片
    @param
    @return
*/
function lookImg(src) {
    sessionStorage.scrollTop = $(window).scrollTop()
    sessionStorage.lookImgs = JSON.stringify(imgArr)
    window.parent.Router.jump('knowledge/imgLook', '?url='+src)
}

/**
    跳转下载页
    @param 
    @return
 */
function downloadApp() {
    window.parent.Router.jump('inviteApp/downMedUser')
}

/**
    返回
    @param 
    @return
 */
function back() {
    var preWindow = window.parent.$('iframe:eq(0)')[0].contentWindow
    preWindow.initCategory(preWindow.lastCategoryCode, 1)
    history.back(-1)
}

/**
    跳转提问页
    @param 
    @return
 */
function ask() {
    if(window.parent.Router.getParameter('source') == 'app') {
        if(window.parent.Router.getParameter('from') == 'ask') {
            window.parent.Router.jump('knowledge/ask','?source=app&code='+window.parent.Router.getParameter('code'))
        } else {
            window.parent.Router.jump('knowledge/ask','?source=app')
        }
    } else {
        window.parent.Router.jump('knowledge/ask')
    }
}

/**
    点赞
    @param 
    @return
 */
function setGood() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: CommonUtils.getRequestApp(1),
            REQUESTCLIENT: CommonUtils.getRequestClient(57),
        },
        type: 'POST',
        url: request_path.live + 'pdbk/user/like',
        data: {
            token: window.parent.CommonUtils.getToken(),
            answer_code: answerObj.code
        },
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (res.code == 200) {
                if(answerObj.isLike) {
                    answerObj.isLike = false
                    answerObj.likeNum -- 
                    $('.btn_good img').attr('src','/src/assets/img/knowledge/detail/nogood.png')
                } else {
                    answerObj.isLike = true
                    answerObj.likeNum ++ 
                    $('.btn_good img').attr('src','/src/assets/img/knowledge/detail/good.png')
                }
                $('.read').text(answerObj.pv+"阅读 · "+answerObj.likeNum+"赞")
            } else if(res.code == 3 || res.code == 102 || res.code == 201) {
                window.parent.CommonUtils.appFun(function() {
                    window.parent.jsInterface.goLogin()
                }, function() {
                    window.parent.webkit.messageHandlers.goLogin.postMessage(null)
                })
            } else {
                DialogUtils.newTip(res.msg)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    收藏
    @param 
    @return
 */
function setCollect() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: CommonUtils.getRequestApp(1),
            REQUESTCLIENT: CommonUtils.getRequestClient(57),
        },
        type: 'POST',
        url: request_path.live + 'pdbk/user/collect',
        data: {
            token: window.parent.CommonUtils.getToken(),
            answer_code: answerObj.code
        },
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (res.code == 200) {
                if(answerObj.isCollect) {
                    answerObj.isCollect = false
                    $('.btn_collect img').attr('src','/src/assets/img/knowledge/detail/nostart.png')
                } else {
                    answerObj.isCollect = true
                    $('.btn_collect img').attr('src','/src/assets/img/knowledge/detail/start.png')
                }
            } else if(res.code == 3 || res.code == 102 || res.code == 201) {
                window.parent.CommonUtils.appFun(function() {
                    window.parent.jsInterface.goLogin()
                }, function() {
                    window.parent.webkit.messageHandlers.goLogin.postMessage(null)
                })
            } else {
                DialogUtils.newTip(res.msg)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    分享
    @param 
    @return
 */
function share() {
    var shareData = {
        title: '澜渟盆底百科',
        desc:  $('.question_dec').text().substring(0, 20),
        link: window.location.origin + '/#/knowledge/detail' + '?code=' +code,
        icon: 'http://rightinhome.oss-cn-hangzhou.aliyuncs.com/uploads/2020/08/07/17f15bb550bb44b3b18a742aff835f5f.png',
        poster: poster.imgInfo.url
    }
    if(CommonUtils.isEmpty(poster.imgInfo.url)) {
        window.parent.CommonUtils.appFun(function() {
            window.parent.jsInterface.loading()
        }, function() {
            window.parent.webkit.messageHandlers.loading.postMessage(null)
        })
        beginDraw(poster.title, poster.desc, function(res) {
            window.parent.CommonUtils.appFun(function() {
                window.parent.jsInterface.closeLoading()
            }, function() {
                window.parent.webkit.messageHandlers.closeLoading.postMessage(null)
            })
            window.parent.CommonUtils.appFun(function() {
                window.parent.jsInterface.share(shareData.title, shareData.desc, shareData.link, shareData.icon, res.url)
            }, function() {
                window.parent.webkit.messageHandlers.share.postMessage([shareData.title, shareData.desc, shareData.link, shareData.icon, res.url, res.width, res.height])
            })
        })

    } else {
        window.parent.CommonUtils.appFun(function() {
            window.parent.jsInterface.share(shareData.title, shareData.desc, shareData.link, shareData.icon, shareData.poster)
        }, function() {
            window.parent.webkit.messageHandlers.share.postMessage([shareData.title, shareData.desc, shareData.link, shareData.icon, shareData.poster, poster.imgInfo.width, poster.imgInfo.height])
        })
    }
}