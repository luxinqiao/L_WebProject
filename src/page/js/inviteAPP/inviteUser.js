/*
 * 文件描述：邀请注册（澜渟）js
 * 创建人：赵志银
 * 创建时间：2019-11-01
*/

var couponCode = Router.getParameter('coupon_code')
var type = CommonUtils.getBrowserType()
var phone = ''
var dataObj = {}
var isFirst = true

$(function(){
    DialogUtils.loading('content')
    CommonUtils.setHtmlTitle('邀您加入澜渟')
    DialogUtils.loading('main')
    if(type!='wechat') {
        if(type=='app') {
            $("#head").css("display","none")
            $("#content").css("padding-top","0")
        } else {
            $("#open").css("display","block")
            $("#head").css("display","block")
        }
    } else {
        $("#open").css("display","block")
        $("#open").css("top","0")
        $("#content").css("padding-top","1.04rem")
    }
    initData()
})

/**
  初始化数据
  @param 
  @return
*/
function initData() {
    AjaxUtils.ajax_new({
        header: {
            REQUESTAPP: 1,
            REQUESTCLIENT: 4
        },
        type: 'POST',
        url: request_path.rih+'/v2/invite/get-coupon',
        data: {
            'coupon_code':Router.getParameter('coupon_code')
        },
        success: function(data, textStatus, jqXHR) {
            DialogUtils.hideLoading('content')
            if (data.code == 200){
                DialogUtils.hideLoading('main')
                $(".foot").css("display","block")
                dataObj = data.data
                $('.price').html(dataObj.coupon_amount)
                $('.title').html(dataObj.coupon_name)
                $("#content").css("display","block")
            } else {
                DialogUtils.hideLoading('main')
                $("#content").css("display","none")
                $(".none").css("display","block")
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
  领取
  @param 
  @return
*/
function get() {
    if(isFirst) {
        isFirst = false
        var myreg = /^(((19[0-9]{1})|(16[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
        if (phone == '') {
            DialogUtils.newTip('请输入手机号')
            isFirst = true
        }else if (!myreg.test(phone)) {
            DialogUtils.newTip('请输入正确的手机号')
            isFirst = true
        }else {
            AjaxUtils.ajax_new({
                header: {
                    REQUESTAPP: 1
                },
                type: 'POST',
                url: request_path.rih+'/v2/invite/receive-coupon',
                data: {
                    'coupon_code': couponCode,
                    'phone': phone,
                    'r': Router.getParameter('r'),
                    's': Router.getParameter('s'),
                    'e': Router.getParameter('e')
                },
                success: function(data, textStatus, jqXHR) {
                    if (data.code == 200) {
                        DialogUtils.newTipAlert('优惠券已放入您的账户，打开澜渟APP，立即使用！','确定',()=>{
                            if((type=='wechat')){
                                Download_wechat('user')
                                isFirst = true
                            } else {
                                openApp('lanting://',()=>{
                                    Download('user',()=>{
                                        isFirst = true
                                    })
                                },'inviteApp/downUser') 
                                isFirst = true
                            }
                        })
                    } else {
                        DialogUtils.newConfirm('<span style="display:block;text-align:center;">'+data.msg+'</span><span style="display:block;text-align:center;">是否前往澜渟APP？</span>','否',function(){
                            isFirst = true
                        },'是',function(){
                            if((type=='wechat')){
                                Download_wechat('user')
                                isFirst = true
                            } else {
                                openApp('lanting://',()=>{
                                    Download('user',()=>{
                                        isFirst = true
                                    })
                                },'inviteApp/downUser') 
                                isFirst = true
                            }
                        })
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
    
                }
            })
        }
    }
}

/**
  实时监听input输入
  @param 
  @return
*/
$('.phone').on('input propertychange',function(){
    phone = $(this).val()
})

/**
  实时监听input失去焦点
  @param 
  @return
*/
$('.phone').blur(function(){ 
    window.scrollTo(0, document.body.scrollTop + 1);
    document.body.scrollTop >= 1 && window.scrollTo(0, document.body.scrollTop - 1); 
})

/**
  下载app
  @param 
  @return
*/
function downloadApp() {
    if((type=='wechat')){
        Download_wechat('user')
    } else {
        Download('user')
    }
}