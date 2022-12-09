/*
    文件描述：新手大礼包
    创建人：卢信桥
    创建时间：2019-11-04
*/
var dataObj = {}
var app_uinfo = CommonUtils.getCookie("app_uinfo")
var token = app_uinfo.split("|")[1]
var isFirst = true
var isRule = true
$(function(){
    CommonUtils.setHtmlTitle('填问卷领豪礼')
    DialogUtils.loading('content')
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
          REQUESTAPP: 1,
          REQUESTCLIENT: 4
      },
      type: 'POST',
      url: request_path.live+'spree/spree/home',
      data: {
          'token': token
      },
      success: function(data, textStatus, jqXHR) {
        if (data.code == 200){
            dataObj = data.data
            var str = "<p class='item' style='background-image:url(./src/assets/img/gift/prizeBg-first.png)'>"+
                "<img src='"+data.data.present[0].img+"'>"+
                "<span>"+data.data.present[0].name+"</span>"+
                "<span>"+data.data.present[0].amount+"</span>"+
            "</p>"+
            "<p class='item' style='background-image:url(./src/assets/img/gift/prizeBg-second.png)'>"+
                "<img src='"+data.data.present[1].img+"'>"+
                "<span>"+data.data.present[1].name+"</span>"+
                "<span>"+data.data.present[1].amount+"</span>"+
            "</p>"+
            "<p class='item' style='background-image:url(./src/assets/img/gift/prizeBg-third.png)'>"+
            "<img src='"+data.data.present[2].img+"'>"+
                "<span>"+data.data.present[2].name+"</span>"+
                "<span>"+data.data.present[2].amount+"</span>"+
            "</p> "
            $('#main>div:nth-child(1)>.title').after(str)

            for(var i = 0 ; i <data.data.questionnaire.length; i++){
                // 单选题
                if(data.data.questionnaire[i].type==0) {
                    let str = ''
                    let other = 0
                    for(let j = 0;j<data.data.questionnaire[i].answer.length;j++){
                        if(data.data.questionnaire[i].answer[j].is_other==1) {
                            other = 1
                            str += "<div class='radiobox' data-code='"+data.data.questionnaire[i].answer[j].code+"'>"+
                        "<img src='/src/assets/img/gift/uncheckedRadio.png' class='radio"+i+" nohas other'>"+
                        "<span class='radiotitle"+i+" other'>"+data.data.questionnaire[i].answer[j].content+"</span></div>"
                        } else {
                            str += "<div class='radiobox' data-code='"+data.data.questionnaire[i].answer[j].code+"'>"+
                        "<img src='/src/assets/img/gift/uncheckedRadio.png' class='radio"+i+" nohas'>"+
                        "<span class='radiotitle"+i+"'>"+data.data.questionnaire[i].answer[j].content+"</span></div>"
                        }
                    }
                    
                    if(other==1) {
                        $('.question').append("<div class='completion list' data-code='"+data.data.questionnaire[i].question_code+"' data-answer='' data-other='0' data-type='"+data.data.questionnaire[i].type+"' data-text=''>"+
                            "<div class='title'>"+
                                "<span>"+(i+1)+"."+data.data.questionnaire[i].question+"</span><div class='none hid'>未填</div>"+
                            "</div>"+str+
                            "<input placeholder='请填写' type='text' class='hid input' oninput='if(value.length>"+data.data.questionnaire[i].limit+")value=value.slice(0,"+data.data.questionnaire[i].limit+")'>"+
                        "</div>")
                        
                    } else {
                        $('.question').append("<div class='completion list' data-code='"+data.data.questionnaire[i].question_code+"' data-answer='' data-type='"+data.data.questionnaire[i].type+"'>"+
                            "<div class='title'>"+
                                "<span>"+(i+1)+"."+data.data.questionnaire[i].question+"</span><div class='none hid'>未填</div>"+
                            "</div>"+str+
                        "</div>")
                    }
                    let classname = ".radio"+i
                    let classnames = ".radiotitle"+i
                    $(classname).on("click",function(){
                        if(CommonUtils.isEmpty(token)) {
                            CommonUtils.appFun(function() {
                                window.jsInterface.goLogin();
                            }, function() {
                                window.webkit.messageHandlers.goLogin.postMessage(null);
                            });
                            return
                        }
                        $(classname).attr('src','/src/assets/img/gift/uncheckedRadio.png')
                        $(this).attr('src','/src/assets/img/gift/checkedRadio.png')
                        $(classname).removeClass("has").addClass("nohas")
                        $(this).removeClass("nohas").addClass("has")
                        $(this).parent().parent().attr('data-answer',$(this).parent().attr('data-code'))
                        $(this).parent().parent().find(".title").find(".none").text('')
                        $(this).parent().parent().find(".title").find(".none").removeClass('show').addClass("hid")
                        if(!$(this).hasClass('other')) {
                            let par_label = $(this).parent().parent().find('input')
                            par_label.removeClass("show").addClass("hid")
                            par_label.val('')
                            $(this).parent().parent().attr('data-other','0')
                            $(this).parent().parent().attr('data-text','')
                        }
                    })
                    
                    $(classnames).on("click",function(){
                        if(CommonUtils.isEmpty(token)) {
                            CommonUtils.appFun(function() {
                                window.jsInterface.goLogin();
                            }, function() {
                                window.webkit.messageHandlers.goLogin.postMessage(null);
                            });
                            return
                        }
                        let par_label = $(this).prev()
                        $(classname).attr('src','/src/assets/img/gift/uncheckedRadio.png')
                        $(par_label).attr('src','/src/assets/img/gift/checkedRadio.png')
                        $(classname).removeClass("has").addClass("nohas")
                        par_label.removeClass("nohas").addClass("has")
                        $(this).parent().parent().attr('data-answer',$(this).parent().attr('data-code'))
                        $(this).parent().parent().find(".title").find(".none").text('')
                        $(this).parent().parent().find(".title").find(".none").removeClass('show').addClass("hid")
                        if(!$(this).hasClass('other')) {
                            let par_label = $(this).parent().parent().find('input')
                            par_label.removeClass("show").addClass("hid")
                            par_label.val('')
                            $(this).parent().parent().attr('data-other','0')
                            $(this).parent().parent().attr('data-text','')
                        } 
                    })

                    
                    
                } else if(data.data.questionnaire[i].type==1) { // 多选题
                    let str = ''
                    let other = 0
                    for(let j = 0;j<data.data.questionnaire[i].answer.length;j++){
                        if(data.data.questionnaire[i].answer[j].is_other==1) {
                            other = 1
                            str += "<div class='radiobox' data-code='"+data.data.questionnaire[i].answer[j].code+"'>"+
                        "<img src='/src/assets/img/gift/uncheckedBox.png' class='check"+i+" nohas other'>"+
                        "<span class='checktitle"+i+" other'>"+data.data.questionnaire[i].answer[j].content+"</span></div>"
                        } else {
                            str += "<div class='radiobox' data-code='"+data.data.questionnaire[i].answer[j].code+"'>"+
                        "<img src='/src/assets/img/gift/uncheckedBox.png' class='check"+i+" nohas'>"+
                        "<span class='checktitle"+i+"'>"+data.data.questionnaire[i].answer[j].content+"</span></div>"
                        }
                    }
                    if(other==1) {
                        $('.question').append("<div class='multiple list' data-code='"+data.data.questionnaire[i].question_code+"' data-answer='' data-other='0' data-type='"+data.data.questionnaire[i].type+"' data-text='' data-length=1 data-max='"+data.data.questionnaire[i].max_select+"' data-min='"+data.data.questionnaire[i].min_select+"'>"+
                            "<div class='title'>"+
                                "<span>"+(i+1)+"."+data.data.questionnaire[i].question+"</span><span>(可选"+data.data.questionnaire[i].min_select+"-"+data.data.questionnaire[i].max_select+"项)"+"</span><div class='none hid'>未填</div>"+
                            "</div>"+str+
                            "<input placeholder='请填写' type='text' class='hid input"+i+"' oninput='if(value.length>"+data.data.questionnaire[i].limit+")value=value.slice(0,"+data.data.questionnaire[i].limit+")'>"+
                        "</div>")

                    } else {
                        $('.question').append("<div class='multiple list' data-code='"+data.data.questionnaire[i].question_code+"' data-answer='' data-type='"+data.data.questionnaire[i].type+"' data-length=1 data-max='"+data.data.questionnaire[i].max_select+"' data-min='"+data.data.questionnaire[i].min_select+"'>"+
                            "<div class='title'>"+
                                "<span>"+(i+1)+"."+data.data.questionnaire[i].question+"</span><span>(可选"+data.data.questionnaire[i].min_select+"-"+data.data.questionnaire[i].max_select+"项)"+"</span><div class='none hid'>未填</div>"+
                            "</div>"+str+
                        "</div>")
                    }

                    let classname = ".check"+i
                    let classnames = ".checktitle"+i
                    $(classname).on("click",function(){
                        if(CommonUtils.isEmpty(token)) {
                            CommonUtils.appFun(function() {
                                window.jsInterface.goLogin();
                            }, function() {
                                window.webkit.messageHandlers.goLogin.postMessage(null);
                            });
                            return
                        }
                        if($(this).hasClass("nohas")){
                            let length = $(this).parent().parent().find('.has').length 
                            if(length>=$(this).parent().parent().attr('data-max')) {
                                $(this).parent().parent().attr('data-length',1)
                                return
                            } else if(length<$(this).parent().parent().attr('data-min')) {
                                $(this).parent().parent().attr('data-length',0)
                            }  else {
                                $(this).parent().parent().attr('data-length',0)
                            }
                            $(this).attr('src','/src/assets/img/gift/checkedBox.png')
                            $(this).removeClass("nohas").addClass("has")
                            $(this).parent().parent().find(".title").find(".none").text('')
                            $(this).parent().parent().find(".title").find(".none").removeClass('show').addClass("hid")
                            if(CommonUtils.isEmpty($(this).parent().parent().attr('data-answer'))){
                                $(this).parent().parent().attr('data-answer',$(this).parent().attr('data-code'))
                            } else {
                                $(this).parent().parent().attr('data-answer',$(this).parent().parent().attr('data-answer')+','+$(this).parent().attr('data-code'))
                            }
                        } else if($(this).hasClass("has")){
                            let arr = $(this).parent().parent().attr('data-answer')
                            arr = arr.split(',')
                            arr.splice(arr.indexOf($(this).parent().attr('data-code')),1)
                            $(this).parent().parent().attr('data-answer',arr.join(','))
                            $(this).attr('src','/src/assets/img/gift/uncheckedBox.png')
                            $(this).removeClass("has").addClass("nohas")
                        } 
                        
                    })
                    
                    $(classnames).on("click",function(){
                        if(CommonUtils.isEmpty(token)) {
                            CommonUtils.appFun(function() {
                                window.jsInterface.goLogin();
                            }, function() {
                                window.webkit.messageHandlers.goLogin.postMessage(null);
                            });
                            return
                        }
                        let par_label = $(this).prev()
                        if(par_label.hasClass("nohas")){
                            let length = $(this).parent().parent().find('.has').length 
                            if(length>=$(this).parent().parent().attr('data-max')) {
                                $(this).parent().parent().attr('data-length',1)
                                return
                            } else if(length<$(this).parent().parent().attr('data-min')) {
                                $(this).parent().parent().attr('data-length',0)
                            }  else {
                                $(this).parent().parent().attr('data-length',0)
                            }
                            par_label.attr('src','/src/assets/img/gift/checkedBox.png')
                            par_label.removeClass("nohas").addClass("has")
                            $(this).parent().parent().find(".title").find(".none").text('')
                            $(this).parent().parent().find(".title").find(".none").removeClass('show').addClass("hid")
                            if(CommonUtils.isEmpty($(this).parent().parent().attr('data-answer'))){
                                $(this).parent().parent().attr('data-answer',$(this).parent().attr('data-code'))
                            } else {
                                $(this).parent().parent().attr('data-answer',$(this).parent().parent().attr('data-answer')+','+$(this).parent().attr('data-code'))
                            }
                        } else if(par_label.hasClass("has")){
                            let arr = $(this).parent().parent().attr('data-answer')
                            arr = arr.split(',')
                            arr.splice(arr.indexOf($(this).parent().attr('data-code')),1)
                            $(this).parent().parent().attr('data-answer',arr.join(','))
                            par_label.attr('src','/src/assets/img/gift/uncheckedBox.png')
                            par_label.removeClass("has").addClass("nohas")
                        } 
                    })

                } else if(data.data.questionnaire[i].type==3 && data.data.questionnaire[i].is_birth==1) { // 填空题
                    $('.question').append("<div class='multiple list' data-type='"+data.data.questionnaire[i].type+"' data-birth='"+data.data.questionnaire[i].is_birth+"' data-code='"+data.data.questionnaire[i].question_code+"' data-text=''>"+
                            "<div class='title'>"+
                                "<span>"+(i+1)+"."+data.data.questionnaire[i].question.replace(/['###']/g,'')+"</span><div class='none hid'>未填</div>"+
                            "</div>"+
                            "<input placeholder='请选择' type='text' id='start_date"+i+"' readonly='readonly'>"+
                        "</div>")
                        initLCander('#start_date'+i,'',CommonUtils.dateFormat(new Date(),'YYYY-MM-DD'))
                        $('#start_date'+i).click(function (e) { 
                            if(CommonUtils.isEmpty(token)) {
                                CommonUtils.appFun(function() {
                                    window.jsInterface.goLogin();
                                }, function() {
                                    window.webkit.messageHandlers.goLogin.postMessage(null);
                                });
                                return
                            } 
                        });
                } else if(data.data.questionnaire[i].type==3 && data.data.questionnaire[i].is_birth==0) {
                    $('.question').append("<div class='multiple list' data-type='"+data.data.questionnaire[i].type+"' data-code='"+data.data.questionnaire[i].question_code+"' data-text=''>"+
                            "<div class='title'>"+
                                "<span>"+(i+1)+"."+data.data.questionnaire[i].question.replace(/['###']/g,'')+"</span><div class='none hid'>未填</div>"+
                            "</div>"+
                            "<input placeholder='请填写' type='text' oninput='if(value.length>"+data.data.questionnaire[i].limit+")value=value.slice(0,"+data.data.questionnaire[i].limit+")'>"+
                        "</div>")
                }
            }
            $('.list').each(function(index,element){
                $(this).find('input').on('input propertychange',function(){
                    if(CommonUtils.isEmpty(token)) {
                        CommonUtils.appFun(function() {
                            window.jsInterface.goLogin();
                        }, function() {
                            window.webkit.messageHandlers.goLogin.postMessage(null);
                        });
                        return
                    }
                    let val = $(this).val()
                    $(this).parent().attr('data-text',val)
                    $(this).parent().find(".title").find(".none").text('')
                    $(this).parent().find(".title").find(".none").removeClass('show').addClass("hid")
                })
            })
            $('.other').each(function(index,element){
                $(this).on("click",function(){
                    let par_label = $(this).parent().parent().find('input')
                    if(par_label.hasClass('hid')) {
                        if(($(this).parent().parent().hasClass('multiple'))&&($(this).parent().parent().attr('data-length')==1)) {
                            return
                        } else {
                            par_label.removeClass("hid").addClass("show")
                            $(this).parent().parent().attr('data-other','1')
                        }
                    }  else {
                        if($(this).parent().parent().hasClass('multiple')) {
                            par_label.removeClass("show").addClass("hid")
                            par_label.val('')
                            $(this).parent().parent().attr('data-other','0')
                            $(this).parent().parent().attr('data-text','')
                        }
                    }
                })
            })
            DialogUtils.hideLoading('content')
            $('#top').css('display','block')
            $('#main').css('display','block')
        } else {
            DialogUtils.tip(data.note)
        }
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {

      }
    })
  }


/**
    初始化日期选择
    @param {string} name dom的id
    @param {string} start_at 开始日期
    @param {string} end_at 结束日期
    @return
  */
function initLCander(name,start_at, end_at) {
    if(CommonUtils.isEmpty(token)) {
        return
    }
    $(name).val(start_at)
    var calendar = new LCalendar()
    calendar.init({
        'trigger': name, //标签id
        'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        'minDate': start_at, //最小日期
        'maxDate': end_at //最大日期
    })
}

/**
    跳转查看链接
    @param 
    @return
  */
function goRule() {
    if(isRule) {
        isRule = false
        CommonUtils.appFun(function() {
            window.jsInterface.goRule(dataObj.rules_link);
        }, function() {
            window.webkit.messageHandlers.goRule.postMessage([dataObj.rules_link]);
        });
        isRule = true
    }
}

/**
    未登录
    @param 
    @return
  */
 function goAppLogin() {
    CommonUtils.appFun(function() {
        window.jsInterface.goLogin();
    }, function() {
        window.webkit.messageHandlers.goLogin.postMessage(null);
    });
}

/**
    跳转查看礼品
    @param 
    @return
  */
 function goGift() {
    CommonUtils.appFun(function() {
        window.jsInterface.goGift();
    }, function() {
        window.webkit.messageHandlers.goGift.postMessage(null);
    });
}

/**
    提交
    @param 
    @return
  */
function getGift() {
    let answer = []
    $('.list').each(function(index,element){
        let obj = {
            "question_code": $(this).attr('data-code'), 
            "type": $(this).attr('data-type'),
            'answer': []
        }
        
        if($(this).attr('data-type')==0||$(this).attr('data-type')==1) {
            if($(this).attr('data-type')==0) {
                obj.answer.push($(this).attr('data-answer'))
            } else if($(this).attr('data-type')==1) {
                obj.answer = $(this).attr('data-answer').split(',')
            }
            if(!CommonUtils.isEmpty($(this).attr('data-text'))){
                obj.answer_other = $(this).attr('data-text')
            }
        } else if($(this).attr('data-type')==3) {
            obj.answer.push($(this).attr('data-text'))
        } 
        if($(this).attr('data-type')==3) {
            if(CommonUtils.isEmpty($(this).attr('data-text'))) {
                $(this).find(".title").find(".none").text('本题为必答题，请作答')
                $(this).find(".title").find(".none").removeClass('hid').addClass("show")
            } else {
                $(this).find(".title").find(".none").text('')
                $(this).find(".title").find(".none").removeClass('show').addClass("hid")
            }
        } else {
            if(CommonUtils.isEmpty($(this).attr('data-answer'))){
                $(this).find(".title").find(".none").text('本题为必答题，请作答')
                $(this).find(".title").find(".none").removeClass('hid').addClass("show")
            } else if(($(this).attr('data-other')==1)&&(CommonUtils.isEmpty($(this).attr('data-text')))){
                $(this).find(".title").find(".none").text('内容不能为空，请填写')
                $(this).find(".title").find(".none").removeClass('hid').addClass("show")
            } else if(($(this).attr('data-type')==1)&&((obj.answer.length<$(this).attr('data-min'))||(obj.answer.length>$(this).attr('data-max')))){
                $(this).find(".title").find(".none").text('至少选择'+$(this).attr('data-min')+'项')
                $(this).find(".title").find(".none").removeClass('hid').addClass("show")
            } else {
                $(this).find(".title").find(".none").text('')
                $(this).find(".title").find(".none").removeClass('show').addClass("hid")
            }
        }
        answer.push(obj)
    })
    if($('.question').find('.none.show').length>0) {
        DialogUtils.tip('还未填写完成')
        $('html, body').animate({
            scrollTop: $('.none.show').eq(0).parent().offset().top+(-80)
        }, 500)
        return
    }
    if(isFirst) {
        isFirst = false
        if(navigator.onLine){
            AjaxUtils.ajax({
                header: {
                    REQUESTAPP: 1
                },
                type: 'POST',
                url: request_path.live + 'spree/spree/submit',
                data: {
                    'token': token,
                    'spree_code': dataObj.spree_code,
                    'naire_code': dataObj.naire_code,
                    'answers': answer
                },
                success: function(data, textStatus, jqXHR) {
                    if (data.code == 200) {
                        $('#success').css('display', 'block')
                        CommonUtils.appFun(function() {
                            window.jsInterface.getSuccess();
                        }, function() {
                            window.webkit.messageHandlers.getSuccess.postMessage(null);
                        });
                    } else {
                        DialogUtils.tip(data.note)
                        isFirst = true
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {

                }
            })
        }else{
            isFirst = true
            DialogUtils.tip('网络连接错误，请检查网络连接')
        }
        
    }
}
