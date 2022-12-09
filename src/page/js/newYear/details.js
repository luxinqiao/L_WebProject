/*
 * 文件描述：新年活动-首页-详情
 * 创建人：赵志银
 * 创建时间：2019-12-30
 */
var leftTime 
var app_uinfo = CommonUtils.getCookie('app_uinfo');
var token = app_uinfo.split('|')[1];
var rec_uuid = app_uinfo.split('|')[2];
var activity_code = Router.getParameter('code');
var inviteHomeData
$(function(){
    CommonUtils.setHtmlTitle('新年活动')
    DialogUtils.loading('content')
    initData()
})

function initData() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.rec + 'posttrial/detail',
        data: {
            token: token,
            activity_code: activity_code
        },
        success: function(result, textStatus, jqXHR) {
            DialogUtils.hideLoading('content')
            inviteHomeData = result.data;
            if(inviteHomeData.status==1) {
                leftTime = inviteHomeData.left_time
                $('.time').css('display','block')
                $('.time').css('display','flex')
                $('.main').css('padding-bottom','1.7rem')
                SecondToDate()
                $('#inviteNum').text(inviteHomeData.my_num)
                $('#rewardNum').text(inviteHomeData.left_have.is_have)
            } else if(inviteHomeData.status==0){
                $('.invitbtn').css('display','block')
                $('.invitbtn').css('display','flex')
                initCountData()
                statisticPv()
                checkStatus()
            } else if(inviteHomeData.status==2){
                $('.get').css('display','block')
                $('.get').css('display','flex')
                $('.main').css('padding-bottom','1.7rem')
                initCountData()
                checkStatus()
            } else if(inviteHomeData.status==4) {
                $('.end').css('display','block')
                $('.end').css('display','flex')
                $('.main').css('padding-bottom','1.7rem')
                initCountData()
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
    
        }
    })
}

/**
    倒计时
    @param 
    @return
*/
function SecondToDate() {
    leftTime = leftTime - 1
    var leftDay = parseInt(leftTime / (24 * 60 * 60)) //剩余天数
    var leftHour = parseInt(leftTime / (60 * 60) % 24) //剩余小时
    var leftMin = parseInt(leftTime / 60 % 60) //剩余分钟
    var leftSec = parseInt(leftTime % 60) //剩余秒
    if(leftDay<10) {
        leftDay = '0'+leftDay
    }
    if(leftHour<10) {
        leftHour = '0'+leftHour
    }
    if(leftMin<10) {
        leftMin = '0'+leftMin
    }
    if(leftSec<10) {
        leftSec = '0'+leftSec
    }
    $('#residueTime').html('<span>活动倒计时</span><i>'+leftDay+'</i><span>天</span><i>'+leftHour+'</i><span>:</span><i>'+leftMin+'</i><span>:</span><i>'+leftSec+'</i>')
    if (leftTime <= 0) {
        $('.time').css('display','none')
    }else{
        setTimeout(SecondToDate, 1000)
    }
}
/**
    校验活动状态
    @param
    @return
*/
function checkStatus() {
    if ((inviteHomeData.status == 2)&&(!CommonUtils.isEmpty(token))) {
        var level = inviteHomeData.left_have.level
        if (level == 1) {
            $('#resultgift').attr('src','./src/assets/img/newYear/details/result1.png')
            $('.result>div>div>div').css('display','block')
            $('.result>div>div>div').css('display','flex')
        } else if (level == 2) {
            $('#resultgift').attr('src','./src/assets/img/newYear/details/result2.png')
            $('.result>div>div>div').css('display','block')
            $('.result>div>div>div').css('display','flex')
        } else if(level == 0){
            $('#resultgift').attr('src','./src/assets/img/newYear/details/result3.png')
            $('.result>div>div>div').css('display','none')
        }
        $('.result').css('display', 'block')
    }
}


/**
    初始化数据
    @param
    @return
*/
function initCountData() {
    $('#inviteNum').text(inviteHomeData.my_num)
    if((Number(inviteHomeData.my_num)<1)&&inviteHomeData.status==0) {
        $('#invite').text('立即邀请')
    } else {
        $('#invite').text('继续邀请')
    }
    if (inviteHomeData.left_have.level == 1) { //已获1等奖
        $('#rewardNum').parent().html('已获得奖品')
        $(".giftImg").attr("src", "./src/assets/img/newYear/details/record2.png")
    } else if(inviteHomeData.left_have.level == 0){ //已获2等奖/没获奖
        $('#rewardNum').text(inviteHomeData.left_have.is_have)
        $(".giftImg").attr("src", "./src/assets/img/newYear/details/record1.png")
    }else if(inviteHomeData.left_have.level == 2){ //已获2等奖/没获奖
        $('#rewardNum').text(inviteHomeData.left_have.is_have)
        $(".giftImg").attr("src", "./src/assets/img/newYear/details/record2.png")
    }
}

/**
    立即邀请
    @param
    @return
*/
function shareActivity() {
    statisticPv()
    var son_source = inviteHomeData.son_source
    var url = window.location.origin+'/#/invite/share?activity_code='+activity_code
    +'&son_source='+son_source+'&rec_uuid='+rec_uuid
    CommonUtils.appFun(function() {
        window.jsInterface.shareActivity(url)
    }, function() {
        window.webkit.messageHandlers.shareActivity.postMessage(url)
    })
}
/**
    查看邀请记录
    @param
    @return
*/
function inviteDetail() {
    if(inviteHomeData.status==1) {
        DialogUtils.tip('活动尚未开始，暂时无法查看邀请记录。')
    } else {
        var url = window.location.origin+'/#/invite/record?activity_code='+activity_code
        CommonUtils.appFun(function() {
            window.jsInterface.inviteRecord(url)
        }, function() {
            window.webkit.messageHandlers.inviteRecord.postMessage(url)
        })
    }
}

/**
    统计立即邀请pv
    @param
    @return
*/
function statisticPv() {
    if (CommonUtils.isEmpty(token)) {
        return
    }
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.rec + 'posttrial/invitenum',
        data: {
            token: token,
            activity_code: activity_code
        },
        success: function(result, textStatus, jqXHR) {
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    })
}

/**
    关闭弹窗
    @param
    @return
*/
$('.result').bind('click',function(){
    $('.result').css('display', 'none')
})
/**
    弹窗常驻
    @param
    @return
*/
$('.result>div>div').bind('click',function(event){
    $('.result').css('display', 'block')
    if($('.result>div>div>div').css('display')!='none'){
        $('.result>div>div>div').css('display','block')
        $('.result>div>div>div').css('display','flex')
    }
    event.stopPropagation()
})

/**
    去领奖
    @param
    @return
*/
function get() {
    if(!CommonUtils.isEmpty(token)) {
        if((inviteHomeData.status == 2)&&(inviteHomeData.left_have.level == 0)) {
            $('.result').css('display', 'block')
        } else {
            CommonUtils.appFun(function() {
                window.jsInterface.goMyPrize();
            }, function() {
                window.webkit.messageHandlers.goMyPrize.postMessage(1);
            })
        }
    } else {
        CommonUtils.appFun(function() {
            window.jsInterface.goMyPrize();
        }, function() {
            window.webkit.messageHandlers.goMyPrize.postMessage(1);
        })
    }
}