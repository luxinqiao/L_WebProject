var page = new Page()

$(function() {
    CommonUtils.setHtmlTitle('问卷调查')
    initPage()
    initData()
})

/**
    初始化分页
    @param
    @return
*/
function initPage() {
    page.initPage({
		divId: "page",
		eachPageNum: 10,
		pageChangeFun: function() {
            initData()
            page.loadPage()
        }
    })
}

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
        url: request_path.live + 'common/questionnaire/hms-record',
        data: {
            page: page.currPage,
            uid: Router.getParameter('uid')
        },
        success: function(result, textStatus, jqXHR) {
            if (result.code == 200) {
                page.setTotalNum(result.data.count)
                page.loadPage()
                $('#tbody').html('')
                for (var i=0; i<result.data.list.length; i++) {
                    var dataObj = result.data.list[i]
                    var $tr = $('<tr></tr>')
                    $tr.append('<td>'+((page.currPage-1)*10+i+1)+'</td>')
                    .append('<td>'+dataObj.title+'</td>')
                    .append('<td>'+dataObj.score+'</td>')
                    .append('<td class="button" onClick="goDetail(\''+dataObj.code+'\')">查看详情</td>')
                    $('#tbody').append($tr)
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}

/**
    跳转-问卷详情页
    @param {String} code 编码
    @return
*/
function goDetail(code) {
    window.location.href = '/#/questionnairePc/detail?code=' + code
}