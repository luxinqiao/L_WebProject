function Swiper() {
    this.$el = null
    this.imgs = []
    this.autoPlay = true
    this.prev2Index = -2
    this.prevIndex = -1
    this.currIndex = 0
    this.nextIndex = 1
    this.next2Index = 2
    this.touchStartX = 0
    this.transing = false
    this.interval = 3000 //轮播间隔（单位：ms）
    this.animationInterval = 400 //轮播执行动画间隔（单位：ms）
    this.moveDistance = 50 //需触发轮播的手指滑动x轴最小距离（单位：px）
    /**
        添加图片
        @param {Dom} $el 轮播元素
        @param {Dom} imgs 图片集
        @param {Number} defaultNo 默认序号
        @param {Boolean} autoPlay 是否自动播放
        @param {Function} clickCallback 点击回调
        @return {String}
     */
    this.init = function({$el, imgs, defaultNo, autoPlay, clickCallback}) {
        //提示
        if (imgs.length < 3) {
            $el.append('<div class="swiper-tip">请至少添加3张轮播图</div>')
            return
        }
        //初始传参
        this.$el = $el
        this.imgs = imgs
        if (typeof(autoPlay) === 'boolean') {
            this.autoPlay = autoPlay
        }
        //图片
        for (var i=0; i<imgs.length; i++) {
            var $swiperItem = $('<img class="swiper-item" no="'+i+'" src="'+imgs[i]+'">')
            $el.append($swiperItem)
            if (typeof(clickCallback) === 'function') {
                (function(i) {
                    $swiperItem.click(function() {
                        clickCallback(i)
                    })
                })(i)
            }
        }
        //下标圆点
        var $index = $('<div class="swiper-index"></div>').width((imgs.length * 2 - 1) * 0.06 + 'rem')
        for (var i=0; i<imgs.length; i++) {
            $index.append('<span></span>')
        }
        $el.append($index)
        //设置当前页
        this.currIndex = defaultNo ? parseInt(defaultNo) : 0
        this.prevIndex = this.getPrevIndex(this.currIndex)
        this.prev2Index = this.getPrevIndex(this.prevIndex)
        this.nextIndex = this.getNextIndex(this.currIndex)
        this.next2Index = this.getNextIndex(this.nextIndex)
        this.refreshCurrImg()
        //刷新定时器
        this.refreshInterval()
        //绑定手指滑动事件
        $el[0].addEventListener('touchstart', this.touchstart.bind(this), false)
        $el[0].addEventListener('touchmove', this.touchmove.bind(this), false)
        $el[0].addEventListener('touchend', this.touchend.bind(this), false)
    }
    /**
        触摸开始事件
        @param {Object} e 轮播图片
        @return
     */
    this.touchstart = function(e) {
        if (this.transing) {
            return
        }
        this.touchStartX = e.targetTouches[0].pageX
    }
    /**
        触摸移动事件
        @param {Object} e 轮播图片
        @return
     */
    this.touchmove = function(e) {
        if (this.transing) {
            return
        }
        var moveX = e.targetTouches[0].pageX - this.touchStartX
        this.$el.children('.swiper-item.curr').css('transform', 'translateX('+moveX+'px)')
        if (moveX < 0) {
            this.$el.children('.swiper-item.next').css('transform', 'translateX('+moveX+'px)')
            this.$el.children('.swiper-item.next2').css('transform', 'translateX('+moveX+'px)')
        } else if (moveX > 0){
            this.$el.children('.swiper-item.prev').css('transform', 'translateX('+moveX+'px)')
            this.$el.children('.swiper-item.next').css('transform', 'translateX('+moveX+'px)')
        }
        this.autoPlay && clearInterval(this.intervalFun)
    }
    /**
        触摸结束事件
        @param {Dom} e 轮播图片
        @return
     */
    this.touchend = function(e) {
        if (this.transing) {
            return
        }
        const moveX = e.changedTouches[0].pageX - this.touchStartX
        if (moveX > this.moveDistance) {
            this.transPrev()
        } else if (moveX < -this.moveDistance) {
            this.transNext()
        } else if (moveX > 0){
            this.transBack()
        } else if (moveX < 0) {
            this.transBack()
        }
        this.refreshInterval()
    }
    /**
        轮播滑动上一个
        @param
        @return
     */
    this.transPrev = function() {
        this.transing = true
        this.$el.children('.swiper-item.curr').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': 'translateX(3.32rem)'
        })
        this.$el.children('.swiper-item.prev').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': 'translateX(3.32rem)'
        })
        this.$el.children('.swiper-item.next').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': 'translateX(3.32rem)'
        })
        setTimeout(()=> {
            this.transClear()
            this.currIndex = this.prevIndex
            this.prevIndex = this.getPrevIndex(this.currIndex)
            this.prev2Index = this.getPrevIndex(this.prevIndex)
            this.nextIndex = this.getNextIndex(this.currIndex)
            this.next2Index = this.getNextIndex(this.nextIndex)
            this.refreshCurrImg()
        }, this.animationInterval)
    }
    /**
        轮播滑动下一个
        @param
        @return
     */
    this.transNext = function() {
        this.transing = true
        this.$el.children('.swiper-item.curr').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': 'translateX(-3.32rem)'
        })
        this.$el.children('.swiper-item.next').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': 'translateX(-3.32rem)'
        })
        this.$el.children('.swiper-item.next2').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': 'translateX(-3.32rem)'
        })
        setTimeout(()=> {
            this.transClear()
            this.currIndex = this.nextIndex
            this.nextIndex = this.getNextIndex(this.currIndex)
            this.next2Index = this.getNextIndex(this.nextIndex)
            this.prevIndex = this.getPrevIndex(this.currIndex)
            this.prev2Index = this.getPrevIndex(this.prevIndex)
            this.refreshCurrImg()
        }, this.animationInterval)
    }
    /**
        轮播滑动回退
        @param
        @return
     */
    this.transBack = function() {
        this.transing = true
        this.$el.children('.swiper-item.curr').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': ''
        })
        this.$el.children('.swiper-item.prev').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': ''
        })
        this.$el.children('.swiper-item.prev2').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': ''
        })
        this.$el.children('.swiper-item.next').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': ''
        })
        this.$el.children('.swiper-item.next2').css({
            'transition': 'all ' + this.animationInterval/1000 + 's',
            'transform': ''
        })
        setTimeout(()=> {
            this.transClear()
        }, this.animationInterval)
    }
    /**
        轮播滑动清空
        @param
        @return
     */
    this.transClear = function() {
        this.transing = false
        this.$el.children('.swiper-item.curr').css({
            'transition': '',
            'transform': ''
        })
        this.$el.children('.swiper-item.prev').css({
            'transition': '',
            'transform': ''
        })
        this.$el.children('.swiper-item.prev2').css({
            'transition': '',
            'transform': ''
        })
        this.$el.children('.swiper-item.next').css({
            'transition': '',
            'transform': ''
        })
        this.$el.children('.swiper-item.next2').css({
            'transition': '',
            'transform': ''
        })
    }
    /**
        获取上一个序号
        @param {Number} i 序号
        @return {Number} 上一个序号
     */
    this.getPrevIndex = function(i) {
        if (i == 0) {
            return this.imgs.length - 1
        }
        return i - 1
    },
    /**
        获取下一个序号
        @param {Number} i 序号
        @return {Number} 下一个序号
     */
    this.getNextIndex = function(i) {
        if (i == this.imgs.length - 1) {
            return 0
        }
        return i + 1
    }
    /**
        刷新定时器
        @param
        @return
     */
    this.refreshInterval = function() {
        if (!this.autoPlay) {
            return
        }
        clearInterval(this.intervalFun)
        this.intervalFun = setInterval(()=>{
            this.transNext()
        }, this.interval)
    },
    /**
        刷新当前图片
        @param
        @return
     */
    this.refreshCurrImg = function() {
        var _this = this
        this.$el.children('.swiper-item').each(function(i, val) {
            var no = $(val).attr('no')
            if (no == _this.prev2Index) {
                $(val).prop('class', 'swiper-item prev2')
            } else if (no == _this.prevIndex) {
                $(val).prop('class', 'swiper-item prev')
            } else if (no == _this.currIndex) {
                $(val).prop('class', 'swiper-item curr')
            } else if (no == _this.nextIndex) {
                $(val).prop('class', 'swiper-item next')
            } else if (no == _this.next2Index) {
                $(val).prop('class', 'swiper-item next2')
            } else {
                $(val).prop('class', 'swiper-item')
            }
        })
        var $swiperIndex = this.$el.children('.swiper-index')
        $swiperIndex.children('span').removeClass('active')
        $swiperIndex.children('span:eq('+ this.currIndex +')').addClass('active')
    }
}
