var browserType = window.parent.CommonUtils.getBrowserType()
var timeOutFun, time
var currUrl = window.parent.Router.getParameter('url'), urls = JSON.parse(sessionStorage.lookImgs)
var prevNo, currNo, nextNo
var touchStartX = 0, transing = false, animationInterval = 400

$(function() {
    initNo()
    initImg()
    initTouch()
    refreshImgPosition()
    refreshTip()
})

/**
    初始化图片序号
    @param
    @return
    */
function initNo() {
    for (var i=0; i<urls.length; i++) {
        if (urls[i] == currUrl) {
            prevNo = getPrevNo(i)
            currNo = i
            nextNo = getNextNo(i)
            break
        }
    }
}

/**
    初始化图片
    @param
    @return
    */
function initImg() {
    for (var i=0; i<urls.length; i++) {
        var $div = $('<div></div>').appendTo($('#look'))
        var $img = $('<img>').appendTo($div)
        $img.attr('src', urls[i])
        if ($img.width() / $img.height() > document.body.offsetWidth / document.body.offsetHeight) {
            $img.width('100%').height('auto')
        } else {
            $img.width('auto').height('100%')
        }
    }
}

/**
    初始化触摸事件
    @param
    @return
    */
function initTouch() {
    var look = document.getElementById('look')
    look.addEventListener('touchstart', touchstart, false)
    look.addEventListener('touchmove', touchmove, false)
    look.addEventListener('touchend', touchend, false)
}
/**
    触摸开始事件
    @param {Object} e 触摸参数
    @return
    */
function touchstart(e) {
    CommonUtils.stopProp()
    time = new Date()
    if (browserType == 'app') {
        timeOutFun = setTimeout(function() {
            showMenu()
        }, 500)
    }
    if (transing) {
        return
    }
    touchStartX = e.targetTouches[0].pageX
}
/**
    触摸移动事件
    @param {Object} e 触摸参数
    @return
    */
function touchmove(e) {
    clearTimeout(timeOutFun)
    if (transing) {
        return
    }
    var moveX = e.targetTouches[0].pageX - touchStartX
    $('#curr>img').css('transform', 'translateX('+moveX+'px)')
    if (moveX < 0) {
        $('#next>img').css('transform', 'translateX('+moveX+'px)')
    } else if (moveX > 0){
        $('#prev>img').css('transform', 'translateX('+moveX+'px)')
    }
}
/**
    触摸结束事件
    @param {Object} e 触摸参数
    @return
    */
function touchend(e) {
    clearTimeout(timeOutFun)
    if (transing) {
        return
    }
    var moveX = e.changedTouches[0].pageX - touchStartX
    if (Math.abs(moveX) < 5 && new Date() - time < 100) {
        back()
    }
    if (moveX > 50) {
        transPrev()
    } else if (moveX < -50) {
        transNext()
    } else if (moveX > 0) {
        transBack()
    } else if (moveX < 0) {
        transBack()
    }
}
/**
    轮播滑动上一个
    @param
    @return
    */
function transPrev() {
    transing = true
    $('#curr>img').css({
        'transition': 'all ' + animationInterval/1000 + 's',
        'transform': 'translateX(100%)'
    })
    $('#prev>img').css({
        'transition': 'all ' + animationInterval/1000 + 's',
        'transform': 'translateX(100%)'
    })
    setTimeout(()=> {
        transClear()
        currNo = prevNo
        prevNo = getPrevNo(currNo)
        nextNo = getNextNo(currNo)
        refreshImgPosition()
        refreshTip()
    }, animationInterval)
}
/**
    轮播滑动下一个
    @param
    @return
    */
function transNext() {
    transing = true
    $('#curr>img').css({
        'transition': 'all ' + animationInterval/1000 + 's',
        'transform': 'translateX(-100%)'
    })
    $('#next>img').css({
        'transition': 'all ' + animationInterval/1000 + 's',
        'transform': 'translateX(-100%)'
    })
    setTimeout(()=> {
        transClear()
        currNo = nextNo
        prevNo = getPrevNo(currNo)
        nextNo = getNextNo(currNo)
        refreshImgPosition()
        refreshTip()
    }, animationInterval)
}
/**
    轮播滑动回退
    @param
    @return
    */
function transBack() {
    transing = true
    $('#curr>img').css({
        'transition': 'all ' + animationInterval/1000 + 's',
        'transform': ''
    })
    $('#prev>img').css({
        'transition': 'all ' + animationInterval/1000 + 's',
        'transform': ''
    })
    $('#next>img').css({
        'transition': 'all ' + animationInterval/1000 + 's',
        'transform': ''
    })
    setTimeout(()=> {
        transClear()
    }, animationInterval)
}
/**
    轮播滑动清空
    @param
    @return
    */
function transClear() {
    transing = false
    $('#curr>img').css({
        'transition': '',
        'transform': ''
    })
    $('#next>img').css({
        'transition': '',
        'transform': ''
    })
    $('#prev>img').css({
        'transition': '',
        'transform': ''
    })
}
/**
    获取上一个序号
    @param {Number} i 序号
    @return {Number} 上一个序号
    */
function getPrevNo(i) {
    if (i == 0) {
        return urls.length - 1
    }
    return i - 1
}
/**
    获取下一个序号
    @param {Number} i 序号
    @return {Number} 下一个序号
    */
function getNextNo(i) {
    if (i == urls.length - 1) {
        return 0
    }
    return i + 1
}

/**
    刷新图片位置顺序
    @param
    @return
 */
function refreshImgPosition() {
    $('#look').children('div').each(function(i, val) {
        if (i == currNo) {
            $(this).prop('id', 'curr')
        } else if (i == prevNo) {
            $(this).prop('id', 'prev')
        } else if (i == nextNo) {
            $(this).prop('id', 'next')
        } else {
            $(this).prop('id', null)
        }
    })
}

/**
    刷新提示（xx/xx）
    @param
    @return
    */
function refreshTip() {
    $('#tip').text((currNo + 1) + '/' + urls.length)
}

/**
    返回上一页
    @param
    @return
    */
function back() {
    setTimeout(function() {
        history.go(-1)
    }, 100)
}

/**
    显示菜单（限app环境）
    @param 
    @return
    */
function showMenu() {
    if (browserType == 'app') {
        $('#menu').css('background-color', 'rgba(0, 0, 0, 0.65)').show()
    }
}
/**
    隐藏菜单（限app环境）
    @param {Boolean} isStop 是否阻止冒泡
    @return
    */
function hideMenu(isStop) {
    if (isStop) {
        CommonUtils.stopProp()
    }
    $('#main').css('background-color', '#000')
    $('#menu').hide()
}

/**
    保存图片（限app环境）
    @param
    @return
    */
function saveImg() {
    CommonUtils.stopProp()
    var url = urls[currNo]
    if (url.indexOf('http') == -1) {
        url = window.location.origin + url
    }
    window.parent.CommonUtils.appFun(function() {
        window.parent.jsInterface.downloadImg(url)
    }, function() {
        window.parent.webkit.messageHandlers.downloadImg.postMessage(url)
    })
    setTimeout(function() {
        hideMenu()
    }, 500)
}
/**
    取消（限app环境）
    @param
    @return
    */
function cancel() {
    CommonUtils.stopProp()
    hideMenu()
}