/*
 * 文件描述：申请加入H5 JS
 * 创建人：段素栋
 * 创建时间：2019-12-03
*/
var isClick = true
/**
 点击立即加入按钮事件
 @param
 @return
 */
function goJoin() {
    var phoneReg = /^(1+\d{10})$/
    var phone = document.getElementById('ipt').value
    if(phone.length === 0){
        DialogUtils.tip('请输入手机号！')
        return
    }
    if(!phoneReg.test(phone)){
        DialogUtils.tip('请输入正确的手机号！')
        return
    }
    if(!isClick){
        return
    }
    isClick = false
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.rec_V5 + 'apply-h5',
        data: {
            'phone': phone,
            'referral_code': Router.getParameter('referral_code')
          },
        success: function(data, textStatus, jqXHR) {
            if (data.code == 200) {
                DialogUtils.tipAlert(`${data.note.indexOf('重复') !== -1 ? '提示' : '申请成功'}`,`${data.note}`,'确定',()=>{
                    Download('doc')
                })
                $('#dialogTip>.tipAlert>.button').css('color',' #26C2C4')
            }else{
                isClick = true
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            isClick = true
        }
    })
}
/**
 点击申请规则事件
 @param
 @return
 */
function goRule() {
    Router.jump('rec/applyRule')
    return false
}