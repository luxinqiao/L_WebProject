var canvas_ctx

/**
    开始绘图
    @param {String} question 问题
    @param {String} answer 回答
    @param {Function} callback 回调
    @return
 */
function beginDraw(question, answer, callback) {
    //创建canvas
    if ($('#canvas').length == 0) {
        $('body').append('<canvas id="canvas" width="654" height="1000" style="position:absolute;top:-10rem;left:-10rem;"></canvas>')
    }
    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d")
    canvas_ctx = ctx
    //计算高度
    var height = 560
    var quesHeight = getContentHeight({str: question,line: {w: 556, h: 48}, fontSize: 30})
    height += quesHeight
    height += getContentHeight({str: answer, line: {w: 556, h: 44}, fontSize: 26})
    if (height < 1000) {
        height = 1000
    }
    canvas.height = height
    //绘背景
    fillRect({
        color: '#fff',
        pos: {x: 0, y: 220},
        size: {w: 654, h: height - 354}
    })
    fillRect({
        color: '#fafafa',
        pos: {x: 0, y: height - 134},
        size: {w: 654, h: 134}
    })
    //绘头部banner
    drawImage({
        imgUrl: '/src/assets/img/knowledge/poster/banner.png',
        pos: {x: 0, y: 0},
        size: {w: 654, h: 220}
    })
    //绘问题
    drawImage({
        imgUrl: '/src/assets/img/knowledge/poster/question.png',
        pos: {x: 24, y: 260},
        size: {w: 32, h: 36}
    })
    drawText({
        str: question,
        pos: {x: 72, y: 288},
        line: {w: 556, h: 48},
        font: 'normal normal bold 30px Arial',
        color: '#333'
    })
    //绘分割线
    drawLine({
        start: {x: 72, y: quesHeight + 282},
        end: {x: 630, y: quesHeight + 282},
        line: {width: 2, color: '#f4f4f4'}
    })
    //绘答案
    drawImage({
        imgUrl: '/src/assets/img/knowledge/poster/ask.png',
        pos: {x: 24, y: quesHeight + 315},
        size: {w: 32, h: 36}
    })
    drawText({
        str: answer,
        pos: {x: 72, y: quesHeight + 338},
        line: {w: 556, h: 44},
        font: 'normal normal normal 26px Arial',
        color: '#666'
    })
    //绘logo
    drawText({
        str: '澜渟·盆底百科',
        pos: {x: 20, y: height - 60},
        line: {w: 999, h: 30},
        font: 'normal normal bold 30px Arial',
        color: '#333'
    })
    //生成图片链接
    setTimeout(function() {
        drawQrcode({
            imgUrl: '/src/assets/img/knowledge/detail/logo.png',
            pos: {x: 486, y: height - 204},
            size: {w: 144, h: 144, r: 72},
            borderColor: '#eaeaea',
            callback: function() {
                setTimeout(function() {
                    saveImage(canvas, function(resUrl) {
                        callback({
                            url: resUrl,
                            width: 654,
                            height: height
                        })
                    })
                }, 100)
            }
        })
    }, 300)
}

/**
    绘图片
    @param {
        {String} imgUrl 图片链接
        {Object} pos 位置
        {Object} size 尺寸
        {Function} callback 回调函数
    }
    @return
 */
function drawImage({imgUrl, pos, size, callback}) {
    var img = new Image()
    img.src = imgUrl
	img.onload = function() {
        canvas_ctx.drawImage(img, pos.x, pos.y, size.w, size.h)
        typeof(callback) == 'function' ? callback() : ''
    }
}

/**
    填充矩形
    @param {
        {String} color 图片链接
        {Object} pos 位置
        {Object} size 尺寸
    }
    @return
 */
function fillRect({color, pos, size}) {
    canvas_ctx.fillStyle = color
    canvas_ctx.fillRect(pos.x, pos.y, size.w, size.h)
}

/**
    绘文字
    @param {
        {String} str 文字
        {Object} pos 位置
        {Object} line 行
        {String} font 字体
        {String} color 颜色
    }
    @return
 */
function drawText({str, pos, line, font, color}) {
    canvas_ctx.font = font
    canvas_ctx.fillStyle = color
    var w = 0, totalHeight = line.h
	for (var i = 0; i < str.length; i++) {
		var letterW = canvas_ctx.measureText(str[i]).width
		w += letterW
		if (w > line.w) { //宽度超出：换行
			w = letterW
			totalHeight += line.h
			pos.y += line.h
		    canvas_ctx.fillText(str[i], pos.x, pos.y)
		} else {
			canvas_ctx.fillText(str[i], pos.x + (w - letterW), pos.y)
		}
    }
}

/**
    绘直线
    @param {
        {Object} start 开始位置
        {Object} end 结束位置
        {Object} line 行
    }
    @return
 */
function drawLine({start, end, line}) {
    canvas_ctx.lineWidth = line.width
	canvas_ctx.strokeStyle = line.color
	canvas_ctx.beginPath()
	canvas_ctx.moveTo(start.x, start.y)
	canvas_ctx.lineTo(end.x, end.y)
	canvas_ctx.stroke()
	canvas_ctx.closePath()
}

/**
    获取文本高度
    @param {
        {String} str 文本
        {Object} line 行
        {String} fontSize 字体大小
    }
    @return
 */
function getContentHeight({str, line, fontSize}) {
	canvas_ctx.font = 'normal normal normal ' + fontSize + 'px Arial'
	let w = 0, totalHeight = line.h
	for (let i = 0; i < str.length; i++) {
		const letterW = canvas_ctx.measureText(str[i]).width
		w += letterW
		if (w > line.w) {
			w = letterW
			totalHeight += line.h
		}
	}
	return totalHeight
}

/**
    获取文本高度
    @param {
        {Object} canvas canvas对象
        {Function} callback 回调
    }
    @return
 */
function saveImage(canvas, callback) {
    canvas.toBlob(function (blob) {
        AjaxUtils.ajax({
            header: {
                REQUESTAPP: CommonUtils.getRequestApp(1),
                REQUESTCLIENT: CommonUtils.getRequestClient(57),
            },
            type: "POST",
            url: request_path.sts_request,
            data: {},
            success: function(data, textStatus, jqXHR) {
                let client = new OSS({
                    accessKeyId: data.AccessKeyId,
                    accessKeySecret: data.AccessKeySecret,
                    stsToken: data.SecurityToken,
                    bucket: 'rightinhome',
                    region: 'oss-cn-hangzhou'
                })
                async function put() {
                    try {
                        const fileName = 'L_WebProject/'+CommonUtils.dateFormat(new Date(), 'YYYY/MM/DD')+'/'+new Date().getTime()+'.jpeg'
                        let result = await client.put(fileName, blob)
                        callback(result.url)
                    } catch (e) {
                        
                    }
                }
                put()
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {

            }
        })
    })
}

/**
    绘二维码
    @param {
        {String} imgUrl 图片链接
        {Object} pos 位置
        {Object} size 尺寸
        {String} borderColor 边线颜色
        {Function} callback 回调函数
    }
    @return
 */
function drawQrcode({imgUrl, pos, size, borderColor, callback}) {
	//二维码裁剪成圆图
	canvas_ctx.beginPath()
    canvas_ctx.arc(pos.x + size.r, pos.y + size.r, size.r, 0, Math.PI * 2, false)
    canvas_ctx.clip()
	drawImage({
        imgUrl: imgUrl,
        pos: {x: pos.x-12, y: pos.y-12},
        size: {w: size.w+24, h: size.h+24},
        callback: function() {
            //圆形边框
            canvas_ctx.arc(pos.x + size.r, pos.y + size.r, size.r, 0, Math.PI * 2, false)
            canvas_ctx.lineWidth = 2
            canvas_ctx.strokeStyle = borderColor
            canvas_ctx.stroke()
            canvas_ctx.closePath()
            typeof(callback) == 'function' ? callback() : ''
        }
    })
}
