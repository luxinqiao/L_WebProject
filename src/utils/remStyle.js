/**
 rem布局
 @param
 @return
 */
function remStyle(){
    var wid = document.documentElement.clientWidth||document.body.innerWidth;
    document.documentElement.style.fontSize = wid/750*100+"px";
}
remStyle();
window.onresize = remStyle;