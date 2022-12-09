/*
 *  文件描述：大礼包-活动规则
 *  创建人：殷俊
 *  创建时间：2019-11-08
*/

$(function() {
    initPage();
    initData();
})

/**
 * 初始化页面
 * @param
 * @return
 */
function initPage() {
    CommonUtils.setHtmlTitle('活动规则');
}

/**
 * 初始化数据
 * @param
 * @return
 */
function initData() {
    // 获取参数
    let from = Router.getParameter('from');
    let REQUESTCLIENT = 4;
    if(from == 54) {
        REQUESTCLIENT = 54
    }

    AjaxUtils.ajax_new({
        header: {
            REQUESTAPP: 1,
            REQUESTCLIENT: REQUESTCLIENT
        },
        type: 'POST',
        url: request_path.rih + '/spree/spree/home',
        data: {

        },
        success: function(data, textStatus, jqXHR) {
            var record = data.data;
            if(!CommonUtils.isEmpty(record)) {
                initRule(record.rules);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}

/**
 * 初始化数据
 * @param {Object} rules 规则
 * @return
 */
function initRule(rules) {
    let tempArr = foo(rules);
    $div = $('<div></div>');
    for(let i=0; i<tempArr.length; i++) {
        $div.append("<div class='rule'>\n" +
            "                    <div class='num'>"+ (i+1) +"</div>\n" +
            "                    <p class='ruleText'>"+ tempArr[i] +"</p>\n" +
            "                </div>")
    }
    $(".context").append($div)
}

/**
 * 字符串分割（split函数可以传入一个正则表达式作为分隔的字符串）
 * @param {String} str 待分割字符串
 * @return {Array} 分割后的数组
 */
function foo(str){
    var tempArr = str.split(/[\n,]/g);
    for(var i =0;i<tempArr.length;i++){
        if(tempArr[i] == ""){
            tempArr.splice(i, 1);
            //删除数组索引位置应保持不变
            i--;
        }
    }

    return tempArr;
}





