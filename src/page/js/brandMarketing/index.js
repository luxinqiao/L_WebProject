$(function(){
    CommonUtils.resetRem()
    CommonUtils.setHtmlTitle('健康与美皆不负')
    var bannerImg = $('.banner-img')[0]
    bannerImg.src = '/src/assets/img/brandMarketing/index/banner-bg.png'
    bannerImg.onload = function () {
        $('.banner-rule').css('display', 'block')
    }
    $(document).scrollTop(sessionStorage.scrollTop)
    StatisticUtils.biPage({
        event_id: '185'
    })
})

/*
    查看图片
    @param {String} url 图片地址
    @return
 */
function lookImg(url) {
    CommonUtils.lookImg(url, [
        '/src/assets/img/brandMarketing/index/bottom-content-article-left.png',
        '/src/assets/img/brandMarketing/index/bottom-content-article-right.png'
    ])
    sessionStorage.scrollTop = $(document).scrollTop()
}
/*
    查看视频
    @param {String} url 图片地址
    @return
 */
function lookVideo(url) {
    Router.jump('video/play', '?type=source&source=' + url)
    sessionStorage.scrollTop = $(document).scrollTop()
}

/*
    参与活动
    @param
    @return
 */
function join() {
    StatisticUtils.biClick({
        event_id: '183'
    })
    sessionStorage.scrollTop = $(document).scrollTop()

    var browserType = CommonUtils.getBrowserType()
    if (browserType == 'app') {
        CommonUtils.appFun(function() {
            window.jsInterface.jumpCircle()
        }, function() {
            window.webkit.messageHandlers.jumpCircle.postMessage(null)
        })
    } else if (browserType == 'wechat') {
        Download_wechat('user')
    } else {
        openApp('lanting://',()=>{
            Download('user',()=>{})
        },'inviteApp/downUser') 
    }
}

/*
    弹窗显示-规则
    @param
    @return
 */
function showRule() {
    StatisticUtils.biClick({
        event_id: '184'
    })
    sessionStorage.scrollTop = $(document).scrollTop()
    Router.jump('brandMarketing/rule')
}