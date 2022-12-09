$(function() {
    CommonUtils.setHtmlTitle('服务协议')
    initData()
})

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
        url: request_path.Rih + 'Agreement/LantingUser',
        data: {},
        success: function(result, textStatus, jqXHR) {
            if (result.code == 200) {
                $('#main').html(result.data.content)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}
