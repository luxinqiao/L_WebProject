/**
    搜索训练信息
    @param {String}str 字符穿
    @return {Boolean} 是否为空
*/
function searchTrain() {
    var phone = $('#phoneText').val();
    if (CommonUtils.isEmpty(phone)) {
        DialogUtils.tip('请填写手机号');
        return;
    }
    if (!RegUtils.validPhone(phone)) {
        DialogUtils.tip(RegUtils.phoneErr);
        return;
    }
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.Common + 'train/info',
        data: {
            phone: phone
        },
        success: function(data, textStatus, jqXHR) {
            sessionStorage.trainData = JSON.stringify(data.data);
            window.parent.Router.jump('train/list');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    });
}