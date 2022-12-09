/*
 * 文件描述：申请规则H5 JS
 * 创建人：段素栋
 * 创建时间：2019-12-03
*/
/**
 点击左上角返回按钮
 @param
 @return
 */
function goBack() {
    window.history.back(-1)
    return false
}
/**
 页面初始化
 @param
 @return
 */
function onload() {
    var width = document.documentElement.clientWidth || window.innerWidth
    var height = document.documentElement.clientHeight || window.innerHeight
    var mag = width / 375
    var dom = $('.applicationRule')[0]
    var type = CommonUtils.getBrowserType()
    if(type == 'app'){
        $('.applicationRule_header')[0].style.display = 'none'
        $('.head_replace')[0].style.display = 'none'
        dom.style.minHeight = height + 'px'
        return
    }
    dom.style.minHeight = height - (mag * 44) + 'px'

}
window.onload = onload()