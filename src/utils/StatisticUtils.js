
/*
 * 文件描述：统计埋点工具类
 * 创建人：卢信桥
 * 创建时间：2021-07-20
*/
var StatisticUtils = {
    /**
        统计页面浏览
        @param {String} event_id 事件ID
        @param {Object} params 事件所需要的额外参数
        @param {String} from_page 来源页面
        @return
     */
    biPage: function ({event_id, params, from_page}) {
        AjaxUtils.ajax({
            header: {
                REQUESTAPP: 1
            },
            type: 'POST',
            url: request_path.live + 'log/bi/page',
            data: {
                event_id: event_id,
                params: params ? params : {},
                from_page: from_page ? from_page : ''
            },
            success: function(result, textStatus, jqXHR) {
                
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
            }
        })
    },
    /**
        统计页面点击
        @param {String} event_id 事件ID
        @param {Object} params 事件所需要的额外参数
        @return
     */
    biClick: function ({event_id, params}) {
        AjaxUtils.ajax({
            header: {
                REQUESTAPP: 1
            },
            type: 'POST',
            url: request_path.live + 'log/bi/click',
            data: {
                event_id: event_id,
                params: params ? params : {}
            },
            success: function(result, textStatus, jqXHR) {
                
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
            }
        })
    }
}