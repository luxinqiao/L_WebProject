/*
 * 文件描述：邀请记录 JS
 * 创建人：段素栋
 * 创建时间：2019-12-030
*/
var currPage = 1, totalPage = 0;
var app_uinfo = CommonUtils.getCookie('app_uinfo');
var token = app_uinfo.split('|')[1];
var activity_code = Router.getParameter('activity_code');
/**
 点击左上角返回按钮
 @param
 @return
 */
function goBack() {
    window.history.back(-1)
    return false
}
/**
 页面初始化时间
 @param
 @return
 */
function initData() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.rec + 'posttrial/myinvitation',
        data: {
            token: token,
            activity_code: activity_code,
            page: currPage
        },
        success: function(result, textStatus, jqXHR) {
            var data = result.data;
            $('#peopleNum')[0].innerHTML = data.count_num
            if (data.count_num === '0') {
                $('#record_default').show();
                return;
            }
            if (data.count_num > 0) {
                var list = $('.list_content')[0]
                var item = $('.record_item')[0]
                for (var i=0; i<data.list.length; i++) {
                    var obj = data.list[i];
                    var newItem = item.cloneNode()
                    var remake = document.createElement('span')
                    var phone = document.createElement('span')
                    var time = document.createElement('span')
                    remake.innerHTML = '成功邀请'
                    phone.innerHTML = obj.phone
                    time.innerHTML = obj.time
                    newItem.appendChild(remake)
                    newItem.appendChild(phone)
                    newItem.appendChild(time)
                    newItem.style.display = 'block'
                    list.appendChild(newItem)
                }
            }
            totalPage = Math.ceil(data.count_num, 10);

            if (data.is_last_page === '0') {
                if (currPage < totalPage) {
                    currPage ++;
                    initData();
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });

}
window.onload = initData()