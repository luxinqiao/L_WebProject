/*
    文件描述：百科-主页
    创建人：卢信桥
    创建时间：2020-08-05
 */
var ajaxHeader = {
    REQUESTAPP: CommonUtils.getRequestApp(1),
    REQUESTCLIENT: CommonUtils.getRequestClient(57),
}
var lastTab = 0, lastCategoryCode = ''
var app_uinfo = window.parent.CommonUtils.getCookie('app_uinfo')

$(function(){
    initData()
    scrollRefresh.init(initData)
})

/**
    初始化数据
    @param
    @return
 */
function initData() {
    AjaxUtils.ajax({
        header: ajaxHeader,
        type: 'POST',
        url: request_path.live + 'pdbk/question/index',
        data: {},
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (res.code == 200) {
                //热门搜索
                $('#hotContentLeft').empty()
                $('#hotContentRight').empty()
                for (var i=0; i<res.data.hot_search.length; i++) {
                    (function(i) {
                        var $item = $('<div class="hotContentItem"></div>').click(function() {
                            if (CommonUtils.isEmpty(window.parent.CommonUtils.getToken())) {
                                window.parent.CommonUtils.appFun(function() {
                                    window.parent.jsInterface.goLogin()
                                }, function() {
                                    window.parent.webkit.messageHandlers.goLogin.postMessage(null)
                                })
                            } else {
                                window.parent.Router.jump('knowledge/search','?value=' + encodeURIComponent(res.data.hot_search[i].content))
                            }
                        })
                        $item.append('<span class="before">'+ (i+1) +'</span>')
                        $item.append('<span class="ellipsis">'+ res.data.hot_search[i].content +'</span>')
                        if (i % 2 == 0) {
                            $('#hotContentLeft').append($item)
                        } else {
                            $('#hotContentRight').append($item)
                        }
                    })(i)
                }
                //tab页
                $('#tab').empty()
                for (var i=0; i<res.data.tags.length; i++) {
                    (function(i) {
                        var $tabItem = $('<span>'+ res.data.tags[i].name +'</span>').click(function() {
                            if (i != lastTab) {
                                lastTab = i
                                $('#tab').children('span').removeClass('active').children('.activeLine').remove()
                                $('#tab').children('span:eq('+i+')').addClass('active').append('<span class="activeLine"></span>')
                                initCategory(res.data.tags[i].code, 1)
                            }
                        })
                        if (i == 0) {
                            $tabItem.addClass('active').append('<span class="activeLine"></span>')
                        }
                        $('#tab').append($tabItem)
                    })(i)
                }
                initCategory(res.data.tags[0].code, 1)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    初始化分类
    @param {String} code 编码
    @param {Number} pageNo 页码
    @return
 */
function initCategory(code, pageNo) {
    lastCategoryCode = code
    if (pageNo == 1) {
        $('#tabContent').html(null)
    }
    AjaxUtils.ajax({
        header: ajaxHeader,
        type: 'POST',
        url: request_path.live + 'pdbk/question/category',
        data: {
            tag_code: code,
            page: pageNo
        },
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (res.code == 200) {
                for (var i=0; i<res.data.list.length; i++) {
                    (function(i) {
                        var obj = res.data.list[i]
                        var $item = $('<div class="contentItem"></div>').click(function() {
                            goDetail(obj.question_code)
                        })
                        $item.append('<p class="itemTitle">'+ obj.name +'</p>')
                        if(!CommonUtils.isEmpty(obj.cover)) {
                            $item.append('<p class="itemContentImg"><span class="ellipsis3">'+ obj.text +'</span><img class="itemCover" src='+obj.cover+'></p>')
                        } else {
                            $item.append('<p class="itemContent ellipsis3">'+ obj.text +'</p>')
                        }
                        $item.append('<p class="itemRead">'+ obj.pv + '阅读' + ' · ' + obj.like  + '赞</p>')
                        $('#tabContent').append($item)
                    })(i)
                }
                if (res.data.is_last == '0') {
                    initCategory(code, pageNo+1)
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    页面跳转-搜索
    @param
    @return
 */
function goSearch() {
    if (CommonUtils.isEmpty(window.parent.CommonUtils.getToken())) {
        window.parent.CommonUtils.appFun(function() {
            window.parent.jsInterface.goLogin()
        }, function() {
            window.parent.webkit.messageHandlers.goLogin.postMessage(null)
        })
    } else {
        window.parent.Router.jump('knowledge/search')
    }
}

/**
    页面跳转-详情
    @param {String} code 问题编码
    @return
 */
function goDetail(code) {
    if (CommonUtils.isEmpty(window.parent.CommonUtils.getToken())) {
        window.parent.CommonUtils.appFun(function() {
            window.parent.jsInterface.goLogin()
        }, function() {
            window.parent.webkit.messageHandlers.goLogin.postMessage(null)
        })
    } else {
        window.parent.Router.jump('knowledge/detail', '?code=' + code)
    }
}

/**
    页面跳转-提问
    @param
    @return
 */
function goAsk() {
    if (CommonUtils.isEmpty(window.parent.CommonUtils.getToken())) {
        window.parent.CommonUtils.appFun(function() {
            window.parent.jsInterface.goLogin()
        }, function() {
            window.parent.webkit.messageHandlers.goLogin.postMessage(null)
        })
    } else {
        window.parent.Router.jump('knowledge/ask')
    }
}

/**
    页面跳转-app极致学院
    @param
    @return
 */
function goCollege() {
    window.parent.CommonUtils.appFun(function() {
        window.parent.jsInterface.goCollege()
    }, function() {
        window.parent.webkit.messageHandlers.goCollege.postMessage(null)
    })
}

/**
    返回上一页
    @param 
    @return
 */
function goBack() {
    window.parent.CommonUtils.appFun(function() {
        window.parent.jsInterface.closeWindow()
    }, function() {
        window.parent.webkit.messageHandlers.closeWindow.postMessage(null)
    })
}