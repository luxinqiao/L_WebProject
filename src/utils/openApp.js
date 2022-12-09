/**
 * 文件描述：打开APP js
 * 创建人：赵志银
 * 创建时间：2018-12-25
 */

/**
  判断手机上是否安装了app，如果安装直接打开url，如果没安装，执行callback
  @param {string} url app的url Scheme
  @param {object} callback 回调函数
  @param {string} success 成功后跳转的页面
  @return
*/
function openApp(url,callback,success) {
    let {isAndroid,isIOS,isIOS9} = detectVersion()
    var timeout, t = 2000, hasApp = true;  
    var openScript = setTimeout(function () {  
        if (!hasApp) {
            callback()
        }
        if(isAndroid || isIOS){
            document.body.removeChild(ifr)  
        } 
        clearTimeout(openScript)
    }, 3000)  
    
    var t1 = Date.now()
    if(isAndroid || isIOS){
        var ifr = document.createElement("iframe")  
        ifr.setAttribute('src', url)
        ifr.setAttribute('style', 'display:none')  
        document.body.appendChild(ifr)  
    } else if(isIOS9){
        location.href = url
    }
    timeout = setTimeout(function () {  
        var t2 = Date.now();  
        if (t2 - t1 < t + 100) {  
            hasApp = false;
        }
        clearTimeout(timeout)
    }, t);

    if(success) {
        document.addEventListener("visibilitychange", ()=> {
            if(document.visibilityState=='hidden') {
                clearTimeout(timeout)
                clearTimeout(openScript)
                hasApp = true
                if(window.location.href.indexOf(success)<0) {
                    Router.jump(success)
                }
                if(window.location.href.indexOf(success)>0&&isIOS9) {
                    location.reload()
                }
                return false
            }
        })
    }
}

/**
  判断手机型号
  @param 
  @return
*/
function detectVersion() {
    let isAndroid = false
    let isIOS = false
    let isIOS9 = false
    let version
    let u = navigator.userAgent
    let ua = u.toLowerCase()

    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {   //android终端或者uc浏览器
        //Android系统
        isAndroid = true
    }

    if(ua.indexOf("like mac os x") > 0){
        //ios
        var regStr_saf = /os [\d._]*/gi ;
        var verinfo = ua.match(regStr_saf) ;
        version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
    }
    var version_str = version+"";
    if(version_str != "undefined" && version_str.length >0){
        version = parseInt(version)
        if(version>=8){
            // ios9以上
            isIOS9 = true
        }
        else{
            isIOS = true
        }
    }
    return {isAndroid,isIOS,isIOS9}
}