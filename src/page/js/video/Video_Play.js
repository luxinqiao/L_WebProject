$(function() {
    CommonUtils.fullHeight();
    setTitle();
    statisticPv();
    var interval = setInterval(function(){
        if (typeof(Aliplayer) === 'function') {
            clearInterval(interval);
            startPlay();
        }
    }, 100);
});

/**
    设置标题
    @param
    @return
*/
function setTitle() {
    var title = decodeURI(Router.getParameter('title'));
    if (title == '') {
        title = '视频播放';
    } else if (title == 'newyear') {
        title = '拜年视频';
    }
    CommonUtils.setHtmlTitle(title);
}

/**
    统计pv
    @param
    @return
*/
function statisticPv() {
    var course_id = Router.getParameter('course_id');
    if (CommonUtils.isEmpty(course_id)) {
        return;
    }
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.Know + 'course/pv',
        data: {
            course_id: course_id
        },
        success: function(result, textStatus, jqXHR) {
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    });
}

/**
    开始播放
    @param
    @return
*/
function startPlay() {
    var playObj = {
        id: 'video_view_main',
        width: '100%',
        height: '100%',
        autoplay: true,
        isLive: false,
        rePlay: false,
        playsinline: true,
        preload: true,
        controlBarVisibility: 'hover',
        useH5Prism: true
    };
    var type = Router.getParameter('type');
    if (type === 'source') {
        playObj.source = Router.getParameter('source');
    } else if (type === 'auth') {
        playObj.vid = Router.getParameter('vid');
        playObj.playauth = Router.getParameter('playauth');
        playObj.cover = Router.getParameter('cover');
    }
    var player = new Aliplayer(playObj, function(player) {});
}