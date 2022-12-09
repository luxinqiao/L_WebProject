/**
 * 文件描述：下载APP js
 * 创建人：殷俊
 * 创建时间：2018-07-16
 */


//market://details?id=包名  应用市场
var user_android = "market://details?id=com.mld.LanTin"
var user_android_wc = "https://a.app.qq.com/o/simple.jsp?pkgname=com.mld.LanTin"
var user_ios = "https://itunes.apple.com/cn/app/id1243415475?mt=8"
var user_pc = "https://rightinhome.oss-cn-hangzhou.aliyuncs.com/apk/Wrightin.apk"

var medUser_android = "market://details?id=com.mld.LanTing"
var medUser_android_wc = "https://a.app.qq.com/o/simple.jsp?pkgname=com.mld.LanTing"
var medUser_ios = 'itms-apps://itunes.apple.com/app/id1021850957'
var medUser_pc = 'https://rightinhome.oss-cn-hangzhou.aliyuncs.com/apk/Wrightin_medical.apk'

var doc_android = "market://details?id=com.medlander.lantindoctor"
var doc_android_wc = "https://a.app.qq.com/o/simple.jsp?pkgname=com.medlander.lantindoctor"
var doc_ios = "https://itunes.apple.com/cn/app/id1235934988?mt=8"
var doc_pc = "https://rightinhome.oss-cn-hangzhou.aliyuncs.com/apk/WrightinDoctor.apk"

/**
 * 判断设备类型
 * @param {String}a 设备类型入参
 * @return
 */
!function (a) {
    var b = /iPhone/i, c = /iPod/i, d = /iPad/i, e = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i, f = /Android/i,
        g = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
        h = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
        i = /IEMobile/i, j = /(?=.*\bWindows\b)(?=.*\bARM\b)/i, k = /BlackBerry/i, l = /BB10/i, m = /Opera Mini/i,
        n = /(CriOS|Chrome)(?=.*\bMobile\b)/i, o = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
        p = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"), q = function (a, b) {
            return a.test(b)
        }, r = function (a) {
            var r = a || navigator.userAgent, s = r.split("[FBAN");
            return "undefined" != typeof s[1] && (r = s[0]), s = r.split("Twitter"), "undefined" != typeof s[1] && (r = s[0]), this.apple = {
                phone: q(b, r),
                ipod: q(c, r),
                tablet: !q(b, r) && q(d, r),
                device: q(b, r) || q(c, r) || q(d, r)
            }, this.amazon = {
                phone: q(g, r),
                tablet: !q(g, r) && q(h, r),
                device: q(g, r) || q(h, r)
            }, this.android = {
                phone: q(g, r) || q(e, r),
                tablet: !q(g, r) && !q(e, r) && (q(h, r) || q(f, r)),
                device: q(g, r) || q(h, r) || q(e, r) || q(f, r)
            }, this.windows = {
                phone: q(i, r),
                tablet: q(j, r),
                device: q(i, r) || q(j, r)
            }, this.other = {
                blackberry: q(k, r),
                blackberry10: q(l, r),
                opera: q(m, r),
                firefox: q(o, r),
                chrome: q(n, r),
                device: q(k, r) || q(l, r) || q(m, r) || q(o, r) || q(n, r)
            }, this.seven_inch = q(p, r), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet, "undefined" == typeof window ? this : void 0
        }, s = function () {
            var a = new r;
            return a.Class = r, a
        };
    "undefined" != typeof module && module.exports && "undefined" == typeof window ? module.exports = r : "undefined" != typeof module && module.exports && "undefined" != typeof window ? module.exports = s() : "function" == typeof define && define.amd ? define("isMobile", [], a.isMobile = s()) : a.isMobile = s()
}(this);

/**
 * 下载
 * @param {string} app APP是澜渟还是澜渟医生
 * @param {function} callback 回调函数
 * @return
 */
function Download(app, callback) {
    var device = 'android';
    if (isMobile.apple.device) {
        device = 'ios';
    }
    if(device == 'android' && getBrowserType()=='wechat') {
        device += '_wc'
    }
    if(!isMobile.apple.device && !isMobile.android.device) {
        device = 'pc'
    }
    var getTimestamp = new Date().getTime()
    if(device.indexOf('android')>-1 ) {
        location.href = window[app + '_' + device] + "&timestamp=" + getTimestamp
    } else {
        location.href = window[app + '_' + device] + "?timestamp=" + getTimestamp
    }
    
    if(typeof(callback)=='function') {
        callback()
    }
}
/**
 * 下载(兼容微信浏览器)
 * @param {string} app APP是澜渟还是澜渟医生
 * @param {function} callback 回调函数
 * @return
 */
function Download_wechat(app, callback) {
    var device = 'android';
    if (isMobile.apple.device) {
        device = 'ios';
    }
    if (device === 'ios' || (device === 'android' && getBrowserType() !== 'wechat')) { //ios浏览器+ios微信：跳appstore，android浏览器：直接下载apk
        var getTimestamp = new Date().getTime()
        location.href = window[app + '_' + device] + "?timestamp=" + getTimestamp
    } else { //android微信：跳下载页
        if (app === 'user') {
            Router.jump('inviteApp/downUser')
        } else if (app === 'doc') {
            Router.jump('inviteApp/downDoc')
        }
    }
    if (typeof(callback) == 'function') {
        callback()
    }
}

/**
    获取浏览器类型
    @param
    @return {String} 浏览器类型
*/
function getBrowserType() {
    const u = window.navigator.userAgent
    if (u.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        return 'wechat'
    }
    if (!CommonUtils.isEmpty(CommonUtils.getCookie('app_uinfo'))) {
        return 'app'
    }
    return 'browser'
}