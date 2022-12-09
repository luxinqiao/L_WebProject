$(function(){
    $(document).scrollTop(0)
    $('#main').css('display', 'block')
    StatisticUtils.biPage({
        event_id: '186'
    })
})

/*
    页面返回
    @param
    @return
 */
function back() {
    $('#main').css('display', 'none')
    history.back()
}