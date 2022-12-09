/*
 * 文件描述：VIP（线下扫码）js
 * 创建人：赵志银
 * 创建时间：2019-11-01
*/

var cardNo = Router.getParameter('card_no')
var type = CommonUtils.getBrowserType()
var phone = ''
var dataObj = {}

$(function(){
    CommonUtils.setHtmlTitle('兑换码领取')
    DialogUtils.loading('main')
    if(type=='app' || type=='wechat') {
      $("#head").css("display","none")
    } else {
      $("#head").css("display","block")
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
    url: request_path.lesson+'exchange/card-info',
    data: {
        'card_no':Router.getParameter('card_no')
    },
    success: function(data, textStatus, jqXHR) {
      if (data.code == 200){
        DialogUtils.hideLoading('main')
        $(".foot").css("display","block")
        dataObj = data.data
        if(data.data.product_type==16) { //vip
          $('.vip .days').html(data.data.left)
          $('.titleInput').html('请输入手机号')
          $('.vip').css("display","block")
          $('.foot').append('<div>领取成功后，可免费观看澜渟极致学院部分课程。</div>')
        } else if(data.data.product_type==17) { //svip
          $('.svip .days').html(data.data.left)
          $('.titleInput').html('请输入手机号')
          $(".svip").css("display","block")
          $('.foot').append('<div>领取成功后，可免费观看澜渟极致学院所有课程。</div>')
        } else if(data.data.product_type==2||data.data.product_type==3||data.data.product_type==11) { //兑换码
          if(dataObj.download_app==1) {
            $('.coupon>div:nth-child(1)').addClass('doc')
          }
          $('.coupon .name').html(data.data.title)
          $('.titleInput').html('请输入手机号')
          $('.coupon .num').html('专属码：'+Router.getParameter('card_no'))
          $(".coupon").css("display","block")
        }
      } else {
        DialogUtils.hideLoading('main')
        $("#main").css("display","none")
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
    var myreg = /^(((19[0-9]{1})|(16[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (phone == '') {
        DialogUtils.tip('请输入手机号！')
    }else if (!myreg.test(phone)) {
        DialogUtils.tip('手机号错误！')
    }else {
        AjaxUtils.ajax({
            header: {
                REQUESTAPP: 1
            },
            notPrompt: true,
            type: 'POST',
            url: request_path.lesson + 'exchange/card-get',
            data: {
                'card_no': cardNo,
                'phone': phone
            },
            success: function(data, textStatus, jqXHR) {
                if (data.code == 200) {
                    if(dataObj.download_app==0) {
                        if(dataObj.product_type==16) {
                            DialogUtils.tipAlert('领取成功','恭喜您，VIP领取成功，请前往【澜渟】APP下载学习吧','前往',()=>{
                                open('user')
                            })
                        } else if(dataObj.product_type==17) {
                            DialogUtils.tipAlert('领取成功','恭喜您，SVIP领取成功，请前往【澜渟】APP下载学习吧','前往',()=>{
                                open('user')
                            })
                        } else if(dataObj.product_type==2||data.data.product_type==3||data.data.product_type==11) {
                            DialogUtils.tipAlert('领取成功','恭喜您，兑换券领取成功，请前往【澜渟】APP下载学习吧','前往',()=>{
                                open('user')
                            })
                        }
                    } else if(dataObj.download_app==1) {
                    if(dataObj.product_type==16) {
                        DialogUtils.tipAlert('领取成功','恭喜您，VIP领取成功，请前往【澜渟医生】APP下载学习吧','前往',()=>{
                            open('doc')
                        })
                    } else if(dataObj.product_type==17) {
                        DialogUtils.tipAlert('领取成功','恭喜您，SVIP领取成功，请前往【澜渟医生】APP下载学习吧','前往',()=>{
                            open('doc')
                        })
                    } else if(dataObj.product_type==2||data.data.product_type==3||data.data.product_type==11) {
                        DialogUtils.tipAlert('领取成功','恭喜您，兑换券领取成功，请前往【澜渟医生】APP下载学习吧','前往',()=>{
                            open('doc')
                        })
                    }
                    $('#dialogTip>.tipAlert>.button').css('color',' #26C2C4')
                    }
                } else {
                    DialogUtils.tipAlert('', data.note, '确定')
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

            }
        })
    }
}

/**
  打开APP
  @param {string} app 澜渟/澜渟医生
  @return
*/
function open(app) {
    if(app=='user') {
        if((type=='wechat')){
            Download_wechat('user')
        } else {
            openApp('lanting://',()=>{
                Download('user')
            },'inviteApp/downUser') 
        }
    } else if(app=='doc') {
        if((type=='wechat')){
            Download_wechat('doc')
        } else {
            openApp('lantingdoctor://',()=>{
                Download('doc')
            },'inviteApp/downDoc')
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
  if(phone.length>=11){
    $('.btn').addClass('act')
  } else {
    $('.btn').removeClass('act')
  }
  if((dataObj.product_type==2||dataObj.product_type==3||dataObj.product_type==11)&&dataObj.download_app==1) {
    $('#main .coupon .act').addClass('doc')
  }
})