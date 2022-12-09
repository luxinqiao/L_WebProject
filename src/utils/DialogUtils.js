/*
 * 文件描述：弹框插件
 * 创建人：卢信桥
 * 创建时间：2018-11-13
*/

var DialogUtils = {
    /**
        提示框
        @param {String}str 内容
        @param {Function}callback 回调函数
        @return
    */
    tip: function(str, callback) {
        if ($('#dialog').length === 0) {
            $('body').append('<div id="dialog"></div>');
        }
        var $tipDiv = $('<div class="tip">' + str + '</div>');
        $('#dialog').append($tipDiv).show();
        setTimeout(function() {
            DialogUtils.hide();
            if (typeof(callback) === 'function') {
                callback();
            }
        }, 2000);
    },
    /**
        确认取消框
        @param {String}title 标题
        @param {String}content 内容
        @param {String}cancelText 取消文本
        @param {Function}cancelCallBack 取消回调函数
        @param {String}confirmText 确认文本
        @param {Function}confirmCallBack 确认回调函数
        @return
    */
    confirm: function(title, content, cancelText, cancelCallBack, confirmText, confirmCallBack) {
        if ($('#dialog').length === 0) {
            $('body').append('<div id="dialog"></div>');
        }
        var $confirm = $('<div class="confirm"></div>');
        $confirm.append('<div class="title">'+title+'</div>')
        $confirm.append('<div class="content">'+content+'</div>');
        var $buttons = $('<div class="button"></div>');
        $('<button class="close">'+cancelText+'</button>').click(function(){
            DialogUtils.hide();
            if (typeof(cancelCallBack) === 'function') {
                cancelCallBack();
            }
        }).appendTo($buttons)
        $('<button class="confirm">'+confirmText+'</button>').click(function(){
            DialogUtils.hide();
            if (typeof(confirmCallBack) === 'function') {
                confirmCallBack();
            }
        }).appendTo($buttons)
        $confirm.append($buttons)
        $('#dialog').addClass('shade').append($confirm).show();
    },
    /**
        确认框
        @param {String}title 标题
        @param {String}content 内容
        @param {String}confirmText 确认文本
        @param {Function}confirmCallBack 确认回调函数
        @return
    */
   tipAlert: function(title, content, confirmText, confirmCallBack) {
        if ($('#dialogTip').length === 0) {
            $('body').append('<div id="dialogTip"></div>');
        }
        var $confirm = $('<div class="tipAlert"></div>');
        $confirm.append('<div class="title">'+title+'</div>')
        $confirm.append('<div class="content">'+content+'</div>');
        $('<div class="button">'+confirmText+'</div>').click(function(){
            DialogUtils.hide();
            if (typeof(confirmCallBack) === 'function') {
                confirmCallBack();
            }
        }).appendTo($confirm)
        $('#dialogTip').addClass('shade').append($confirm).show();
    },
    /**
        内容框
        @param {String}content 内容
        @return
    */
    content: function(content) {
        if ($('#dialog').length === 0) {
            $('body').append('<div id="dialog"></div>');
        }
        $('#dialog').addClass('shade').append(content).show();
    },
    /**
        移除弹出框
        @param {String}str 内容
        @return
    */
    hide: function() {
        $('#dialog').html('').hide();
        $('#dialogTip').html('').hide();
        $('#weichat').remove();
        $('#dialogCon').html('').hide();
    },
    /**
        加载中
        @param {String}divId div的id
        @return
    */
    loading: function(divId) {
        $('#'+divId).addClass('pos_relative').append('<div class="loading"></div>');
    },
    /**
        移除加载中
        @param {String}divId div的id
        @return
    */
    hideLoading: function(divId) {
        $('#'+divId).removeClass('pos_relative').children('.loading').remove();
    },
    /**
        微信环境下引导下载的遮罩
        @param 
        @return
    */
    weichatDl: function() {
        var $confirm = $('<div id="weichat"></div>');
        $confirm.append('<span class="wxtip-icon"></span>')
        $confirm.append('<p class="wxtip-txt">点击右上角 <span>...</span><br>选择在<span> 浏览器 </span>中打开</p>')
        $('<p class="know_btn">我知道了</p>').click(function(){
            DialogUtils.hide()
        }).appendTo($confirm)
        $confirm.addClass('shade').show()
        $('body').append($confirm)
        DialogUtils.pageClose()
    },
    /**
     微信环境下引导分享的遮罩
     @param
     @return
     */
    wechatShare: function() {
        $('body').append('<div id="weichat"></div>')
        $('#weichat').append('<span class="wxtip-icon"></span>')
        $('#weichat').append('<p class="wxtip-txt">点击右上角 <span>...</span><span></span><span> 邀请好友</span></p>')
        $('#weichat').addClass('shade').show();
        $('#weichat').click(function () {
            $('#weichat').remove()
        })
    },
    /**
        提示框-黑色底
        @param {String}str 内容
        @param {Function}callback 回调函数
        @return
    */
    newTip: function(str, callback) {
        if ($('#dialogTip').length === 0) {
            $('body').append('<div id="dialogTip"></div>');
        }
        $('#dialogTip').html('').hide()
        var $tipDiv = $('<div class="new_tip"><div><span>' + str + '</span></div></div>');
        $('#dialogTip').append($tipDiv).show();
        setTimeout(function() {
            DialogUtils.hide();
            if (typeof(callback) === 'function') {
                callback();
            }
        }, 2000);
    },
    /**
        确认框-无头
        @param {String}content 内容
        @param {String}confirmText 确认文本
        @param {Function}callback 回调函数
        @return
    */
    newTipAlert: function(content, confirmText,confirmCallBack) {
        if ($('#dialogTip').length === 0) {
            $('body').append('<div id="dialogTip"></div>')
        }
        var $confirm = $('<div class="new_tip_alert"></div>')
        $confirm.append('<div class="new_tip_alert_content"><span>'+content+'</span></div>')
        $('<div class="button">'+confirmText+'</div>').click(function(){
            DialogUtils.hide();
            if (typeof(confirmCallBack) === 'function') {
                confirmCallBack();
            }
        }).appendTo($confirm)
        $('#dialogTip').addClass('shade').append($confirm).show();
    },
    /**
        确认取消框-无头
        @param {String}content 内容
        @param {String}cancelText 取消文本
        @param {Function}cancelCallBack 取消回调函数
        @param {String}confirmText 确认文本
        @param {Function}confirmCallBack 确认回调函数
        @return
    */
   newConfirm: function(content, cancelText, cancelCallBack, confirmText, confirmCallBack) {
        if ($('#dialogCon').length === 0) {
            $('body').append('<div id="dialogCon"></div>');
        }
        var $confirm = $('<div class="new_confirm"></div>');
        $confirm.append('<div class="new_confirm_content"><p>'+content+'</p></div>');
        var $buttons = $('<div class="button"></div>');
        $('<button class="close">'+cancelText+'</button>').click(function(){
            DialogUtils.hide();
            if (typeof(cancelCallBack) === 'function') {
                cancelCallBack();
            }
        }).appendTo($buttons)
        $('<button class="confirm">'+confirmText+'</button>').click(function(){
            DialogUtils.hide();
            if (typeof(confirmCallBack) === 'function') {
                confirmCallBack();
            }
        }).appendTo($buttons)
        $confirm.append($buttons)
        $('#dialogCon').addClass('shade').append($confirm).show();
    },
    /**
        加载框
        @param 
        @return
    */
    newLoading: function() {
        if ($('#dialogTip').length === 0) {
            $('body').append('<div id="dialogTip"></div>')
        }
        var $confirm = $('<div class="new_loading"></div>')
        $('#dialogTip').addClass('shade').append($confirm).show();
    },
    /**
        监听页面关闭
        @param 
        @return
    */
    pageClose() {
        window.addEventListener( "popstate" , function (e) {
            DialogUtils.hide()
        }, false )
    }
};