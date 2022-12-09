var DroploadUtils = {
    /** 滚动条对象 */
    scroll: null,
    /** 下拉元素 */
    pullDownEl: null,
    /** 上拉元素 */
    pullUpEl: null,
    /** 下拉回调方法 */
    pullDownFun: function(){},
    /** 上拉回调方法 */
    pullUpFun: function(){},
    /**
        初始化
        @param {String}divId div的id
        @param {Function}pullDownFun 下拉回调
        @param {Function}pullUpFun 上拉回调
        @return
     */
    init: function(divId, pullDownFun, pullUpFun) {
        this.pullDownFun = pullDownFun;
        this.pullUpFun = pullUpFun;
        var that = this;
        CommonUtils.appendLink('/src/assets/css/third/dropload.css');
        CommonUtils.appendScript('/src/third/iscroll/code/iscroll.js', function() {
            that.initDom(divId);
            that.initScroll(divId);
        });
    },
    /**
        初始化Dom元素
        @param {String}divId div的id
        @return
     */
    initDom: function(divId) {
        var $ul = $('#'+divId).children('.pull-scroller').children('ul');
        var $pullDown = $('<div id="pull-down" style="display:none;"></div>');
        $pullDown.append('<span class="pullDownIcon"></span>');
        $pullDown.append('<span class="pullDownLabel"></span>');
        $ul.before($pullDown);
        var $pullUp = $('<div id="pull-up" style="display:none;"></div>');
        $pullUp.append('<span class="pullUpIcon"></span>');
        $pullUp.append('<span class="pullUpLabel"></span>');
        $ul.after($pullUp);
    },
    /**
        初始化滚动条
        @param {String}divId div的id
        @return
     */
    initScroll: function(divId) {
        var that = this;
        this.pullDownEl = document.getElementById('pull-down');
        this.pullUpEl = document.getElementById('pull-up');
        var pullUpOffset = 10;
        this.scroll = new iScroll(divId, {
            useTransition: true,
            topOffset: that.pullDownEl.offsetHeight,
            /** 移动中 */
            onScrollMove: function () {
                //下拉
                if (this.y > 30) {
                    document.getElementById("pull-down").style.display="block";
                    that.pullDownEl.className = 'flip';
                    that.pullDownEl.querySelector('.pullDownLabel').innerHTML = '↑ 释放立即刷新';
                    this.minScrollY = 0;
                } else if (this.y > 10) {
                    document.getElementById("pull-down").style.display="block";
                    that.pullDownEl.className = '';
                    that.pullDownEl.querySelector('.pullDownLabel').innerHTML = '↓ 下拉刷新';
                    this.minScrollY = -that.pullDownEl.offsetHeight;
                }
                //上拉
                if (this.scrollerH < this.wrapperH && this.y < (this.minScrollY-pullUpOffset) || this.scrollerH > this.wrapperH && this.y < (this.maxScrollY - pullUpOffset) ) {
                    document.getElementById("pull-up").style.display = "block";
                    that.pullUpEl.className = 'flip';
                    that.pullUpEl.querySelector('.pullUpLabel').innerHTML = '↓ 释放立即刷新';
                }
            },
            /** 移动结束 */
            onScrollEnd: function () {
                if (that.pullDownEl.className.match('flip')) {
                    that.pullDownEl.className = 'pull-loading';
                    that.pullDownEl.querySelector('.pullDownLabel').innerHTML = '正在刷新...';
                    that.pullDownFun();
                }
                if (that.pullUpEl.className.match('flip')) {
                    that.pullUpEl.className = 'pull-loading';
                    that.pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在刷新...';
                    that.pullUpFun();
                }
            },
            /** 刷新 */
            onRefresh: function () {
                document.getElementById("pull-down").style.display="none";
                document.getElementById("pull-up").style.display="none";
                if (that.pullDownEl.className.match('pull-loading')) {
                    that.pullDownEl.className = '';
                }
                if (that.pullUpEl.className.match('pull-loading')) {
                    that.pullUpEl.className = '';
                }
                
            }
        });
    },
    /**
        组件刷新
        @param
        @return
     */
    refresh: function() {
        var that = this;
        if (this.pullDownEl.className.match('pull-loading')) {
            this.pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
            this.pullDownEl.querySelector('.pullDownLabel').innerHTML = '√ 刷新成功';
        }
        if (this.pullUpEl.className.match('pull-loading')) {
            this.pullUpEl.querySelector('.pullUpLabel').innerHTML = '√ 刷新成功';
            this.pullDownEl.querySelector('.pullDownLabel').innerHTML = '';
        }
        setTimeout(function() {
            that.scroll.refresh();
        }, 1000);
    }
};