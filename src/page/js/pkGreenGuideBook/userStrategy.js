/**
 * 文件描述：盆底肌肉康复器详情页
 * 创建人：殷俊
 * 创建时间：2019-07-14
 */

/**
 * 系统加载事件
 * @param
 * @return
 */
$(function() {
    CommonUtils.setHtmlTitle('盆底肌肉康复器训练使用全攻略')
})

/**
 * 跳转到如何清洗界面
 * @param
 * @param
 * @return
 */
function goHowToClean() {
    var url = window.location.origin+'/#/pkGreenGuideBook/howToClean'
    CommonUtils.appFun(function() {
        window.jsInterface.jumpPage_guidance(url)
    }, function() {
        window.webkit.messageHandlers.jumpPage_guidance.postMessage(url)
    })
}