/*
    文件描述：百科-搜索
    创建人：卢信桥
    创建时间：2020-08-05
 */
var ajaxHeader = {
    REQUESTAPP: CommonUtils.getRequestApp(1),
    REQUESTCLIENT: CommonUtils.getRequestClient(57),
}
var isComEnd = true, isEmpty = true

$(function(){
    initPage()
})

/**
    初始化页面
    @param
    @return
 */
function initPage() {
    if(!CommonUtils.isEmpty(decodeURIComponent(window.parent.Router.getParameter('value')))) {
        $('#searchText').val(decodeURIComponent(window.parent.Router.getParameter('value')))
        search(1)
    } 
    $('#searchText').on('compositionstart', function(){
        isComEnd = false
    }).on('compositionend',function(){
        isComEnd = true
        refreshPageStatus(true)
    }).on('input',function(){
        if (isComEnd) {
            refreshPageStatus(true)
        }
    })
    refreshPageStatus(false)
}

/**
    刷新页面状态
    @param {Boolean} isMatch 是否刷新关键字匹配
    @return
 */
function refreshPageStatus(isMatch) {
    if ($('#searchText').val() =='') {
        isEmpty = true
        $('#searchClear').hide()
        $('#searchHistory').show()
        initHistory()
    } else {
        isEmpty = false
        $('#searchClear').show()
        $('#searchHistory').hide()
    }
    if (isMatch) {
        initMatch()
    }
    $('#searchMatch').hide()
    $('#searchResult').hide()
    $('#goAsk').hide()
}

/**
    初始化历史记录
    @param
    @return
 */
function initHistory() {
    AjaxUtils.ajax({
        header: ajaxHeader,
        type: 'POST',
        url: request_path.live + 'pdbk/search/list',
        data: {
            token: window.parent.CommonUtils.getToken()
        },
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (res.code == 200) {
                if (res.data.list.length > 0) {
                    $('#searchHistory').html('<div class="historyHead"><span>历史搜索</span><span id="clearHistoryBtn" onclick="clearHistory(\'\')">清空</span></div>')
                }
                for (var i=0; i<res.data.list.length; i++) {
                    (function(i) {
                        var $item = $('<div class="historyItem" data-code="'+ res.data.list[i].code +'"></div>').appendTo($('#searchHistory'))
                        $('<span class="itemContent ellipsis">'+ res.data.list[i].content +'</span>').appendTo($item).click(function() {
                            $('#searchText').val(res.data.list[i].content)
                            refreshPageStatus(false)
                            search(1)
                        })
                        $('<span class="itemClear"></span>').appendTo($item).click(function() {
                            clearHistory(res.data.list[i].code)
                        })
                    })(i)
                }
            } 
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}
/**
    删除历史记录
    @param {String} code 记录编码
    @return
 */
function clearHistory(code) {
    if (code == '') {
        if ($('#clearHistoryBtn').text() == '清空') {
            $('#clearHistoryBtn').text('清空全部')
            return
        }
    }
    AjaxUtils.ajax({
        header: ajaxHeader,
        type: 'POST',
        url: request_path.live + 'pdbk/search/delete',
        data: {
            token: window.parent.CommonUtils.getToken(),
            code: code
        },
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (res.code == 200) {
                if (code == '') {
                    $('.historyItem').remove()
                } else {
                    $('.historyItem[data-code='+ code +']').remove()
                }
                if ($('.historyItem').length == 0) {
                    $('#searchHistory').remove()
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    初始化关键字匹配
    @param
    @return
 */
function initMatch() {
    AjaxUtils.ajax({
        header: ajaxHeader,
        type: 'POST',
        url: request_path.live + 'pdbk/search/match',
        data: {
            token: window.parent.CommonUtils.getToken(),
            keywords: $('#searchText').val()
        },
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (isEmpty) {
                $('#searchMatch').html(null).hide()
                return
            }
            if (res.code == 200) {
                if (res.data.length > 0) {
                    $('#searchMatch').html(null).hide()
                }
                for (var i=0; i<res.data.length; i++) {
                    (function(i) {
                        var $item = $('<div class="matchItem"></div>').appendTo($('#searchMatch')).click(function() {
                            $('#searchText').val(res.data[i].name)
                            refreshPageStatus(false)
                            search(1)
                        })
                        $item.append('<span class="itemContent ellipsis">'+ res.data[i].light +'</span>')
                        $item.append('<span class="itemImg"></span>')
                        $('#searchMatch').append($item)
                    })(i)
                }
                if ($('#searchMatch').children().length > 0) {
                    $('#searchMatch').show()
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    搜索
    @param {Number} pageNo 页码
    @return
 */
function search(pageNo) {
    if (pageNo == 1) {
        $('#searchResult').html('<div id="searchMore" onclick="goAsk()">没找到想要的答案？<font style="color:#ff2c79;">去提问</font></div>')
    }
    var keyword = $('#searchText').val()
    if (keyword == '') {
        DialogUtils.newTip('请输入搜索内容')
        return
    }
    AjaxUtils.ajax({
        header: ajaxHeader,
        type: 'POST',
        url: request_path.live + 'pdbk/search/for',
        data: {
            token: window.parent.CommonUtils.getToken(),
            keywords: keyword,
            hot_search_code: '',
            page: pageNo
        },
        notPrompt: true,
        success: function(res, textStatus, jqXHR) {
            if (res.code == 200) {
                for (var i=0; i<res.data.list.length; i++) {
                    (function(i) {
                        var obj = res.data.list[i]
                        var $item = $('<div class="resultItem"></div>').click(function() {
                            goDetail(obj.code)
                        })
                        $item.append('<p class="itemTitle">'+ obj.name +'</p>')
                        if(!CommonUtils.isEmpty(obj.cover)) {
                            $item.append('<p class="itemContentImg"><span class="ellipsis3">'+ obj.content +'</span><img class="itemCover" src='+obj.cover+'></p>')
                        } else {
                            $item.append('<p class="itemContent ellipsis3">'+ obj.content +'</p>')
                        }
                        $item.append('<p class="itemRead">'+ obj.read_num + '阅读' + ' · ' + obj.like_num  + '赞</p>')
                        $('#searchMore').before($item)
                    })(i)
                }
                if (pageNo == 1) {
                    $('#searchResult').show()
                    $('#goAsk').show()
                }
                if (res.data.is_last_page == '0') {
                    search(pageNo+1)
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    页面跳转-详情
    @param {String} 问题编码
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
    清空输入框
    @param
    @return
 */
function clearInput() {
    $('#searchText').val('')
    refreshPageStatus(false)
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
        return
    } else {
        window.parent.Router.jump('knowledge/ask')
    }
}
