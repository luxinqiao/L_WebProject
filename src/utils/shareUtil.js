/**
 分享主函数
 @param {Str} browserType 浏览器类型
 @param {Obj} shareData 分享信息
 @return
 */
var shareFunc = function(browserType, shareData) {
    if (browserType == 'app') {
        appShare(shareData);
    } else if (browserType == 'browser') {
        h5Share('', shareData);
    }else if(browserType == 'wechat'){
        DialogUtils.wechatShare()
    }
};

/**
 微信分享
 @param {Obj} shareData 分享信息
 @param {String} urlShare 分享链接#前的（需encodeURIComponent）
 @return
 */
var wechatShare = function (shareData,urlShare) {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.c_request + 'wechat/jssdk',
        data: {
            url: urlShare
        },
        success: function(data, textStatus, jqXHR) {
            if (data.code == 200) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.data.appid, // 必填，公众号的唯一标识
                    timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.data.noncestr, // 必填，生成签名的随机串
                    signature: data.data.signature, // 必填，签名
                    jsApiList:[  //必填，需要使用的JS接口列表
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'hideMenuItems'
                    ]
                })
                wx.ready(function () {
                    // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    wx.hideMenuItems({
                        menuList: [
                            'menuItem:share:qq',
                            'menuItem:share:weiboApp',
                            'menuItem:share:facebook',
                            'menuItem:share:QZone'
                        ]
                    })
                    //分享给微信朋友
                    wx.onMenuShareAppMessage({
                        title: shareData.title,
                        desc: shareData.desc,
                        link: shareData.link,
                        imgUrl: shareData.icon,
                        success: function success(res) {

                        },
                        cancel: function cancel(res) {

                        },
                        fail: function fail(res) {

                        }
                    })
                    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
                    wx.onMenuShareTimeline({
                        title: shareData.title,
                        link: shareData.link,
                        imgUrl: shareData.icon,
                        success: function success(res) {

                        },
                        cancel: function cancel(res) {

                        },
                        fail: function fail(res) {

                        }
                    })
                })
                wx.error(function (res) {
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}

/**
 app分享
 @param {Obj} shareData 分享信息
 @return
 */
var appShare = function(shareData) {
    // shareActivity为app分享方法
    appFun(function() {
        window.jsInterface.shareActivity(shareData.title, shareData.desc, shareData.link, shareData.icon);
    }, function() {
        window.webkit.messageHandlers.shareActivity.postMessage([shareData.title, shareData.desc, shareData.link, shareData.icon]);
    });
};

/**
 h5分享
 @param {Obj} shareData 分享信息
 @return
 */
var h5Share = function (shareData) {

}

/**
 调用app方法
 @param {Function}androidFun android方法
 @param {Function}iosFun ios方法
 @return
 */
var appFun = function(androidFun, iosFun) {
    var appType = CommonUtils.getAppType()
    if (appType == 'android') {
        androidFun()
    } else if (appType == 'ios') {
        iosFun()
    }
}