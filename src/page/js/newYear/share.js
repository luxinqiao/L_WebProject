/*
 * 文件描述：新年活动 分享页 JS
 * 创建人：段素栋
 * 创建时间：2019-12-30
*/
var isSend = true
var isReceive = true
/**
 聚焦phone输入框
 @param
 @return
 */
function phoneFocus() {
    document.getElementById('phone').focus()
}
/**
 点击发送验证码
 @param
 @return
 */
function sendCode() {
    var phoneReg = /^(((19[0-9]{1})|(16[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    var phone = document.getElementById('phone').value
    if(phone.length === 0){
        DialogUtils.tip('请输入手机号！')
        return
    }
    if(!phoneReg.test(phone)){
        DialogUtils.tip('请输入正确的手机号！')
        return
    }
    if(!isSend){
        return
    }
    isSend = false
    // 调用接口
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1,
            REQUESTCLIENT: 4
        },
        type: 'POST',
        url: request_path.Common_rih + 'commonservice/alysms',
        data: {
            "msg_type": 1,
            "phone": phone
        },
        success: function(data, textStatus, jqXHR) {
            var code = data.code;
            var msg = data.note;
            // 成功
            if (code == 200) {
                DialogUtils.tip('请求验证码通过！');
                settime();
            } else { // 失败
                DialogUtils.tip(msg);
                isSend = true
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            isSend = true
        }
    });
}
/**
 验证码倒计时
 @param
 @return
 */
var countdown = 60;
function settime() {
    if(countdown == 0) {
        $("#sendCode").text('重新获取');
        isSend = true
        countdown = 60;
    } else {
        var countdown2 = --countdown;

        $("#sendCode").text('剩余(' + countdown2 + ')秒');
        countdown = countdown2;

        setTimeout(function () {
            settime();
        }, 1000)
    }
};
/**
 点击立即领取
 @param
 @return
 */
function receive() {
    // 获取参数
    var activity_code = Router.getParameter('activity_code');
    var son_source = Router.getParameter('son_source');
    var rec_uuid = Router.getParameter('rec_uuid');
    var phoneReg = /^(((19[0-9]{1})|(16[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    var phone = document.getElementById('phone').value
    var code = document.getElementById('code').value
    if(phone.length === 0){
        DialogUtils.tip('请输入手机号！')
        return
    }
    if(!phoneReg.test(phone)){
        DialogUtils.tip('请输入正确的手机号！')
        return
    }
    if(code == ''){
        DialogUtils.tip('请输入验证码！')
        return
    }
    if(!isReceive){
        return
    }
    isReceive = false
    // 调用接口
    AjaxUtils.ajax_new({
        header: {
            REQUESTAPP: 1,
            REQUESTCLIENT: 4
        },
        type: 'POST',
        url: request_path.rec + 'posttrial/bind',
        data: {
            "activity_code":activity_code,
            "phone":phone,
            "son_source":son_source,
            "rec_uuid":rec_uuid,
            "sms_code": code
        },
        success: function(res, textStatus, jqXHR) {
            var code = res.code;
            var msg = res.note;
            // 成功
            if ((code == 200) || (code == 211)) {
                DialogUtils.tip('领取成功')
                setTimeout(()=>{
                    Download_wechat('user')
                },1000)
                $("#phone").val('');
                $("#code").val('');
                isReceive = true
            } else if(code == 220){ // 老用户弹框提示
                DialogUtils.tipAlert(`提示`,`${msg}`,'好的',()=>{
                    DialogUtils.hide()
                })
                isReceive = true
            }else{
                DialogUtils.tip(msg,function(){
                });
                isReceive = true
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            isReceive = true
        }
    });
}