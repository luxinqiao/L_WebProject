/*
 * 文件描述：下载澜渟医生和澜渟医生js
 * 创建人：赵志银
 * 创建时间：2019-12-18
*/
$(function(){
    CommonUtils.setHtmlTitle('澜渟平台')
    if (CommonUtils.getBrowserType() == 'wechat' && CommonUtils.getAppType() == 'android') {
        DialogUtils.weichatDl()
    }
    if (CommonUtils.getBrowserType() != 'wechat') {
        $("#head").css("display","block")
        $("#main").css("padding-top", "1.14rem")
    }
})

/**
  下载1代-盆底修复仪
  @param 
  @return
*/
function userDown() {
    if((CommonUtils.getBrowserType()=='wechat')&&(CommonUtils.getAppType()=='android')) {
        if($('#weichat').length<=0) {
            DialogUtils.weichatDl()
        }
    } else {
        Download('user')
    }
}
/**
  下载1代医疗版-盆底生物刺激反馈仪
  @param 
  @return
*/
function userMedicalDown() {
    if((CommonUtils.getBrowserType()=='wechat')&&(CommonUtils.getAppType()=='android')) {
        if($('#weichat').length<=0) {
            DialogUtils.weichatDl()
        }
    } else {
        Download('medUser')
    }
}
/**
  下载澜渟医生
  @param 
  @return
*/
function docDown() {
    if((CommonUtils.getBrowserType()=='wechat')&&(CommonUtils.getAppType()=='android')) {
        if($('#weichat').length<=0) {
            DialogUtils.weichatDl()
        }
    } else {
        Download('doc')
    }
}

/**
  跳转下载1代-盆底修复仪
  @param 
  @return
*/
function goUser() {
    Router.jump('inviteApp/downUser')
}
/**
  跳转下载1代医疗版-盆底生物刺激反馈仪
  @param 
  @return
*/
function goUserMedical() {
    Router.jump('inviteApp/downMedUser')
}
/**
  跳转下载澜渟医生页
  @param 
  @return
*/
function goDoc() {
    Router.jump('inviteApp/downDoc')
}