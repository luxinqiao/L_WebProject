$(function(){
    initData()
})

/**
    初始化数据
    @param
    @return
*/
function initData() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 3
        },
        type: 'POST',
        url: request_path.Rih+'TrainCourse/getDetail',
        data: {
            tcUID: Router.getParameter('tcUID')
        },
        success: function(data, textStatus, jqXHR) {
            var res = data.data;
            var $div = $('<div class="box"></div>');
            var str = '';
            for(var i = 0;i<res.list.length;i++){
                if(res.list[i].type == '1'){
                    if(i==0){
                        str +='<div class="imgsboxtop"><img src="'+res.list[i].value+'" alt="" class="imgs"></div>';
                    }else{
                        str +='<div class="imgsbox"><img src="'+res.list[i].value+'" alt="" class="imgs"></div>';
                    }
                }else if (res.list[i].type == '0'){
                    if(i==0){
                        str +='<p class="title">'+res.list[i].value+'</p>';
                    }else{
                        str +='<p class="txt">'+res.list[i].value+'</p>';
                    }
                }
            }
            $div.html(str);
            $("#details").append($div);
            $(".imgs").height($(".imgs").width()/2);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            
        }
    });
}
