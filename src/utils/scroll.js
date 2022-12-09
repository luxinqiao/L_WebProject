var callbakFun
var scrollRefresh = {
	init:function(callbak){
		callbakFun = callbak
		this.load()
	},
	load:function(){
		var outerScroller = document.querySelector('html')
		var touchStart = 0
		var scroll_refresh
		var mar_top = -40
		var touchPageY = 0
		outerScroller.addEventListener('touchstart', function(event) {
			var touch = event.targetTouches[0]
			touchStart = touch.clientY
			touchPageY = touchStart
		}, false)
		outerScroller.addEventListener('touchmove', function(event) {
			var touch = event.targetTouches[0]
			touchStart = touch.clientY
			scroll_refresh = $(".scroll_refresh")
			mar_top = parseInt(scroll_refresh.css("margin-top"))
			if(touchStart > touchPageY){
                if($("#main").scrollTop()>0) {
                    return
                }
                mar_top = parseInt(mar_top) + parseInt((touchStart-touchPageY)/2)
                if(mar_top > 0){
                    mar_top = 0
                    $(".scroll_refresh").html("刷新...")
                }
                scroll_refresh.css("margin-top",mar_top)
			}else{
                mar_top = parseInt(mar_top) + parseInt(touchStart) - parseInt(touchPageY)
                if(mar_top < -40){
                    mar_top = -40
				}
                scroll_refresh.css("margin-top",mar_top)
                $('body').scrollTop(0)
			}
			touchPageY = touch.clientY
		}, false)
		outerScroller.addEventListener('touchend', function(event) {
            if($('#main').scrollTop()>=0 && $('#main').offset().top == 0) {
                return
            }
            mar_top = parseInt(scroll_refresh.css("margin-top"))
			if(mar_top > -20){
				callbakFun()
			}
			$(".scroll_refresh").animate({
				"margin-top":"-40px"
			},200)
 
			$(".scroll_refresh").css("animation-name","")
		}, false)
	}
}