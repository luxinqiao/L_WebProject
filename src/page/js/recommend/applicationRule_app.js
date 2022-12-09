/*
 * 文件描述：申请规则(内嵌app) js
 * 创建人：段素栋
 * 创建时间：2019-12-03
*/
/**
 页面初始化
 @param
 @return
 */
function onload() {
    let width = document.documentElement.clientWidth || window.innerWidth
    let height = document.documentElement.clientHeight || window.innerHeight
    let mag = width / 375
    let dom = $('.applicationRule')[0]
    dom.style.minHeight = height - (mag * 44) + 'px'
}
window.onload = onload()