$(function(){
    initData()
})
/**
    初始化页面
    @param 
    @return
*/
function initData() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: "POST",
        url: request_path.Common+"warranty/list",
        data: {
            token: CommonUtils.getToken(),
            serialnumber: Router.getParameter("serialnumber"),
            model: Router.getParameter("model"),
            device_type: Router.getParameter("device_type")
        },
        success: function(data, textStatus, jqXHR) {
            var res = data.data;
            $(".firstTime").text(res.begin_date.split(" ")[0]);
            $(".nextTime").text(res.end_date.split(" ")[0]);
            if (res.list.length > 0) {
                $(".yearHalf .titles").text(res.list[0].name);
                $(".yearHalf .price").text("￥"+(Number(res.list[0].price)/100).toFixed(2));
                $(".yearHalf .dates span").text(res.list[0].warranty_date.split(" ")[0]);
                $(".yearHalf").attr("code",res.list[0].code);
                $(".yearAll .titles").text(res.list[1].name);
                $(".yearAll .price").text("￥"+(Number(res.list[1].price)/100).toFixed(2));
                $(".yearAll .dates span").text(res.list[1].warranty_date.split(" ")[0]);
                $(".yearAll").attr("code",res.list[1].code);
            }
            $(".numFirst").text(getDeviceName(Router.getParameter('model')) +Router.getParameter('serialnumber'));
            $(".total span").text($(".shop .price").text().substring(1)+"元");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}
/**
    延保1年
    @param 
    @return
*/
function checkFull(){
    $(".year").removeClass("shop");
    $(".yearAll").addClass("shop");
    $(".total span").text($(".yearAll .price").text().substring(1)+"元");
}
/**
    延保半年
    @param 
    @return
*/
function checkHalf(){
    $(".year").removeClass("shop");
    $(".yearHalf").addClass("shop");
    $(".total span").text($(".yearHalf .price").text().substring(1)+"元");
}
/**
    取消订单
    @param
    @return
*/
function cancelOrder(){
    DialogUtils.hide();
}
/**
    立即延保
    @param 
    @return
*/
function checkbuy(){
    var $content = $('<div></div>');
    var $confirmDialog = $("<div class='confirmDialog' style='display:block;'></div>");
    $confirmDialog.append("<div class='title'>提示</div>")
    .append("<div class='content' style='left:0;top:50px;height:100px;padding:20px 20px;'>请确认设备号："+$(".numFirst").text()+"</div>")
    .append("<div class='button'><button class='close' onclick='cancelOrder()'>取消</button><button class='confirm' onclick='extension()'>确认</button></div>");
    $content.append($confirmDialog);
    DialogUtils.content($content);
}
function extension(){
    if($(".yearHalf").hasClass("shop")){
        app($(".yearHalf").attr("code"))
    }else if($(".yearAll").hasClass("shop")){
        app($(".yearAll").attr("code"))
    }
    DialogUtils.hide();
}
/**
    立即延保补充
    @param 
    @return
*/
function app(codes){
    CommonUtils.appFun(function() {
        window.jsInterface.extensionCode(codes);
    }, function() {
        window.webkit.messageHandlers.extensionCode.postMessage(codes);
    });
}
/**
    澜渟设备版本
    @param {String}model 版本号
    @return
*/
function getDeviceName(model) {
    var strName = ""
    if (Router.getParameter("device_type") == "1") { //澜渟一代
        switch (model) {
            case "0":
                strName = "无";
                break;
            case "1":
                strName = "全功能版";
                break;
            case "2":
                strName = "A0";
                break;
            case "3":
                strName = "H1S";
                break;
            case "4":
                strName = "H1T";
                break;
            case "5":
                strName = "H2S";
                break;
            case "6":
                strName = "H2T";
                break;
            case "7":
                strName = "H3S";
                break;
            case "8":
                strName = "H3T";
                break;
            case "9":
                strName = "HC";
                break;
            case "10":
                strName = "HT";
                break;
            case "11":
                strName = "HL";
                break;
            case "12":
                strName = "NZFA";
                break;
            default:
                strName = "";
                break;
        }
        strName += '-';
    } else if (Router.getParameter("device_type") == '5') { //澜渟二代
        strName = "";
    }
    return strName;
}
