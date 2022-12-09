var AddressUtils = {
    /**
        初始化省
        @param
        @return
    */
    initProvince: function(callback) {
        AjaxUtils.ajax({
            header: {
                REQUESTAPP: 1
            },
            type: 'POST',
            url: request_path.Common+'cn/province',
            data: {},
            success: function(result, textStatus, jqXHR) {
                if (result.code == 200) {
                    callback(result.data)
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
            }
        })
    },
    /**
        初始化市
        @param
        @return
    */
    initCity: function(pcode, callback) {
        AjaxUtils.ajax({
            header: {
                REQUESTAPP: 1
            },
            type: 'POST',
            url: request_path.Common+'cn/city',
            data: {
                pcode: pcode
            },
            success: function(result, textStatus, jqXHR) {
                if (result.code == 200) {
                    callback(result.data)
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                
            }
        })
    }
}