var programType = {
    STIM: 1, //电刺激
    ETS: 2, //触发电刺激(Electric_Trigger_Stim)
    KEGEL: 3, //凯格尔
    MEDIA: 4, //多媒体
}
var componentArr = [], kegelObj = {}, gameObj = {}
var currBtn
var programData = {}, subTypeArr = []

/*
    http://192.168.17.41/#/programNew/list
    18351928060/666666
*/
$(function () {
    if (!window.Highcharts) {
        $.getScript('/src/third/highcharts-6.2.0/code/Highcharts.js', function() {
            initData()
        })
    } else {
        initData()
    }
})

/**
    初始化数据
    @param
    @return
 */
function initData() {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/get-course',
        data: {
            token: getToken(),
            tcUID: window.parent.Router.getParameter('tcUID')
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if (data.code == 200) {
                if (!data.data.course.sessionArray) {
                    data.data.course.courseTotalNumber = 0
                    data.data.course.courseTotalTime_S = 0
                    data.data.course.courseFileName = ''
                    data.data.course.courseType = 0
                    data.data.course.hospitalName = ''
                    data.data.course.dataStructVersion = ''
                    data.data.course.softVersion = ''
                    data.data.course.softName = ''
                    data.data.course.createTime = CommonUtils.dateFormat(new Date(), 'YYYY-MM-DD hh:mm:ss')
                    data.data.course.updateTime = ''
                    data.data.course.sessionArray = [{
                        itemsetArray: [],
                        itemsetTotalNumberInt: 0,
                        sessionDurationFloat_S: 0
                    }]
                }
                var maxLength = getArrMaxLength(data.data.course.sessionArray)
                initTableHead(maxLength)
                initTableBody(data.data.course, maxLength)
                initTitle(data.data)
                initTypes(data.data.group_code, data.data.scheme_type_code)
                resizeWindow()
                $('.program-loading').hide()
                programData = data.data
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    初始化标题
    @param {Object} obj 方案数据
    @return
 */
function initTitle(obj) {
    $('.programDetail-title-programName-span').text(obj.course.courseName ? obj.course.courseName : '无')
    $('.programDetail-title-programName-input').val(obj.course.courseName)
    $('.programDetail-title-remake-span').text(obj.course.courseDesc ? obj.course.courseDesc : '无')
    $('.programDetail-title-remake-input').val(obj.course.courseDesc)
    $('.programDetail-title-clinic-span').text(obj.tcCourseClinic ? obj.tcCourseClinic : '无')
    $('.programDetail-title-clinic-input').val(obj.tcCourseClinic)
    $('.programDetail-title-medicalName-span').text(obj.tcCourseNameMedical ? obj.tcCourseNameMedical : '无')
    $('.programDetail-title-medicalName-input').val(obj.tcCourseNameMedical)
    $('.programDetail-title-medicalRemake-span').text(obj.tcCourseDescMedical ? obj.tcCourseDescMedical : '无')
    $('.programDetail-title-medicalRemake-input').val(obj.tcCourseDescMedical)
    $('.programDetail-title-medicalClinic-span').text(obj.tcCourseClinicMedical ? obj.tcCourseClinicMedical : '无')
    $('.programDetail-title-medicalClinic-input').val(obj.tcCourseClinicMedical)
    if (obj.ContentType == 3 || obj.ContentType == 4) {
        $('#programDetail-train').css('display', 'inline-block')
    }
    $('.programDetail-title-fileName').text(window.parent.Router.getParameter('tcUID')+'.LIBCOURSE')
    $('.programDetail-title-train-span').text(obj.ContentType ? convertContentType(obj.ContentType) : '无')
    $('.programDetail-title-train-select').val(obj.ContentType)
    $('.programDetail-title-total').text(obj.course.courseTotalNumber)
    $('.programDetail-title-time').text(obj.course.courseTotalTime_S / 60 + '分')
}

/**
    初始化分类
    @param
    @return
 */
function initTypes(typeCode, subTypeCode) {
    $('.programDetail-title-type-select').html(null)
    $('.programDetail-title-subtype-select').html(null)
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/get-group-types',
        data: {
            token: getToken()
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if (data.code == 200) {
                var groupArr = data.data.group, typeArr = data.data.types
                for (var i=0; i<groupArr.length; i++) {
                    if (groupArr[i].code == typeCode) {
                        $('.programDetail-title-type-select').append('<option value="'+groupArr[i].code+'" selected>'+groupArr[i].name+'</option>')
                        $('.programDetail-title-type-span').text(groupArr[i].name)
                    } else {
                        $('.programDetail-title-type-select').append('<option value="'+groupArr[i].code+'">'+groupArr[i].name+'</option>')
                    }
                }
                subTypeArr = data.data.types
                changeType()
                for (var i=0; i<typeArr.length; i++) {
                    if (typeArr[i].code == subTypeCode) {
                        $('.programDetail-title-subtype-select').val(typeArr[i].code)
                        $('.programDetail-title-subtype-span').text(typeArr[i].name)
                    }
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    切换类型
    @param
    @return
 */
function changeType() {
    var typeCode = $('.programDetail-title-type-select').val()
    var $subTypeSelect = $('.programDetail-title-subtype-select')
    $subTypeSelect.html(null)
    for (var i=0; i<subTypeArr.length; i++) {
        if (subTypeArr[i].group_code == typeCode) {
            $subTypeSelect.append('<option value="'+subTypeArr[i].code+'">'+subTypeArr[i].name+'</option>')
        }
    }
}

/**
    初始化表格头
    @param {Number} maxLength 最大长度
    @return
 */
function initTableHead(maxLength) {
    var $tr = $('.programDetail-thead').children('tr')
    $tr.html(null)
    $tr.append($("<th class='no' width='50'>序号</th>"))
    $tr.append($("<th class='desc' width='80'>描述</th>"))
    for (var h=1; h<=maxLength; h++) {
        $tr.append("<th class='step' width='150'>步骤"+ h +"</th>")
    }
    $tr.append($("<th class='actionTh' width='150' style='display:none;'>操作</th>"))
}

/**
    初始化表格体
    @param {Object} obj 方案数据
    @param {Number} maxLength 最大长度
    @return
 */
function initTableBody(obj, maxLength) {
    $(".programDetail-tbody").html(null)
    for (var i=0; i<obj.sessionArray.length; i++) {
        var sessionObj = obj.sessionArray[i]
        //序号
        var $tr = $("<tr></tr>").appendTo($(".programDetail-tbody"))
        $tr.append("<td class='no'>"+ (i + 1) +"</td>")
        //描述
        var $tdDesc = $("<td class='desc'></td>").attr('score', sessionObj.sessionDurationFloat_S/60)
        $tdDesc.append("<p>共" + sessionObj.itemsetTotalNumberInt + "项</p>")
        $tdDesc.append("<p>"+ sessionObj.sessionDurationFloat_S/60 +"分</p>")
        $tr.append($tdDesc)
        //多个步骤
        for (var j=0; j<maxLength; j++) {
            var $td = $("<td class='step'></td>").appendTo($tr)
            $td.attr('row', i+1).attr('step', (j+1))
            appendItemData($td, sessionObj.itemsetArray[j])
            if (sessionObj.itemsetArray[j + 1]) {
                $td.append($("<img class='arrowRight'>").attr('src', '/src/assets/img/programNew/next.png'))
                $td.css('padding-right', '25px')
            }
        }
        //操作
        $actionTd = $("<td class='actionTd' style='display:none;'></td>")
        appendSessionBtn($actionTd)
        $tr.append($actionTd)
    }
}

/**
    添加session操作按钮
    @param {$} $actionTd 操作单元格
    @return
 */
function appendSessionBtn($actionTd) {
    $actionTd.html(null)
    var $group1 = $("<div></div").appendTo($actionTd)
    $('<span class="sessionAddUp">新增</span>').appendTo($group1).click(function() {
        addSessionUp(this)
    })
    $('<span class="sessionAddDown">新增</span>').appendTo($group1).click(function() {
        addSessionDown(this)
    })
    var $group2 = $("<div></div").appendTo($actionTd)
    $('<span class="sessionDelete">删除</span>').appendTo($group2).click(function() {
        removeSession(this)
    })
    var $group3 = $("<div></div").appendTo($actionTd)
    $('<span class="sessionMoveUp">上移</span>').appendTo($group3).click(function() {
        moveSessionUp(this)
    })
    $('<span class="sessionMoveDown">下移</span>').appendTo($group3).click(function() {
        moveSessionDown(this)
    })
}

/**
    向上新增方案session
    @param {Dom} btn 上移按钮
    @return
 */
function addSessionUp(btn) {
    var $tr = $(btn).parent().parent().parent()
    var $preTr = $tr.clone()
    $preTr.children('td.step').attr('itemdata', '').children('.programDetail-tbody-card').remove()
    appendSessionBtn($preTr.children('td.actionTd'))
    var $shade = $('<div class="shade"></div>')
    var $addBtn = $('<span class="add">新增</span>').click(function() {
        goAddItem(this)
    })
    $shade.append($addBtn)
    $preTr.children('.step').html($shade)
    $tr.before($preTr)
    refreshSessionNo()
}
/**
    向下新增方案session
    @param {Dom} btn 上移按钮
    @return
 */
function addSessionDown(btn) {
    var $tr = $(btn).parent().parent().parent()
    var $nextTr = $tr.clone()
    $nextTr.children('td.step').attr('itemdata', '').children('.programDetail-tbody-card').remove()
    appendSessionBtn($nextTr.children('td.actionTd'))
    var $shade = $('<div class="shade"></div>')
    var $addBtn = $('<span class="add">新增</span>').click(function() {
        goAddItem(this)
    })
    $shade.append($addBtn)
    $nextTr.children('.step').html($shade)
    $tr.after($nextTr)
    refreshSessionNo()
}
/**
    删除方案session
    @param {Dom} btn 删除按钮
    @return
 */
function removeSession(btn) {
    var $tr = $(btn).parent().parent().parent()
    $tr.remove()
    refreshTitle()
    refreshSessionNo()
}
/**
    向上移动方案session
    @param {Dom} btn 上移按钮
    @return
 */
function moveSessionUp(btn) {
    var $tr = $(btn).parent().parent().parent()
    var $prevTr = $tr.prev()
    $prevTr.before($tr)
    refreshSessionNo()
}
/**
    向下移动方案session
    @param {Dom} btn 下移按钮
    @return
 */
function moveSessionDown(btn) {
    var $tr = $(btn).parent().parent().parent()
    var $nextTr = $tr.next()
    $nextTr.after($tr)
    refreshSessionNo()
}

/**
    刷新标题
    @param
    @return
 */
function refreshTitle() {
    $('.programDetail-title-total').text($('.programDetail-tbody').children('tr').length)
    var totalScore = 0
    $('.programDetail-tbody').find('td.desc').each(function() {
        totalScore += parseInt($(this).attr('score'))
    })
    $('.programDetail-title-time').text(totalScore + '分')
}

/**
    刷新session序号
    @param
    @return
 */
function refreshSessionNo() {
    $('.programDetail-tbody').children('tr').each(function(i, tr) {
        var count = 0, totalScore = 0
        $(tr).children('.no').text(i+1)
        $(tr).children('.step').each(function(j, td) {
            $(td).attr('row', i+1).attr('step', (j+1))
            $(td).find('.programDetail-tbody-header-item').children('span:eq(0)').text((i+1)+'.'+(j+1))
            var score = parseInt($(this).find('.programDetail-tbody-header-item').attr('score'))
            if (!isNaN(score)) {
                count++
                totalScore += score
            }
            var $desc = $(tr).children('.desc').attr('score', totalScore)
            $desc.children('p:eq(0)').text('共'+count+'项')
            $desc.children('p:eq(1)').text(totalScore+'分')
        })
    })
}

/**
    获取方案项标题
    @param {Object} itemObj 方案项
    @return
 */
function getItemTitle(itemObj) {
    var resStr = getProgramType(itemObj.itemType)+'('
    resStr += itemObj.itemName != '' ? itemObj.itemName : itemObj.gameName
    if (itemObj.itemDurationFloat_S % 60 > 0) {
        resStr += '-' + (itemObj.itemDurationFloat_S/60).toFixed(3) + '分' + ')'
    } else {
        resStr += '-' + itemObj.itemDurationFloat_S/60 + '分' + ')'
    }
    return resStr
}

/**
    添加方案项数据
    @param {$} $stepTd 步骤单元格
    @param {Object} itemsetObj itemset数据
    @return
 */
function appendItemData($stepTd, itemsetObj) {
    if (itemsetObj) {
        var itemObj = itemsetObj.itemArray[0]
        $stepTd.html(null).attr('itemData', JSON.stringify(itemObj))
        //标题、得分
        var $cardHead = $("<div class='programDetail-tbody-header'></div>")
        var $cardHeadImg = $("<img class='programDetail-tbody-header-img'>").attr('src', getProgramImgSrc(itemObj.itemType))
        $cardHead.append($cardHeadImg)
        var $cardHeadTxt = $("<div class='programDetail-tbody-header-item'></div>")
        $cardHeadTxt.append("<span>"+$stepTd.attr('row')+'.'+$stepTd.attr('step')+"</span>")
        $cardHeadTxt.append("<span> "+getItemTitle(itemObj)+"</span>")
        $cardHeadTxt.attr('score', itemsetObj.itemsetDurationFloat_S / 60)
        $cardHead.append($cardHeadTxt)
        var $bodyCard = $("<div class='programDetail-tbody-card'></div>")
        $bodyCard.append($cardHead)
        //项数据：数据参数、图表、图片
        var $cardBody = $("<div class='programDetail-tbody-cardBody'></div>")
        if (itemObj.itemType == programType.STIM) { //类型1：电刺激
            $cardBody.append(createDataPara('刺激时间(s)：', itemObj.stimWorkTimeFloat_S))
            $cardBody.append(createDataPara('休息时间(s)：', itemObj.stimRestTimeFloat_S))
            $cardBody.append(createDataPara('刺激频率(Hz)：', itemObj.stimFreq1Int_Hz))
            $cardBody.append(createDataPara('脉冲宽度(μs)：', itemObj.stimPulseWidth1Int_mS))
            if (itemObj.stimInverterFreqBool) { //变频
                $cardBody.append(createDataPara('刺激频率2(Hz)：', itemObj.stimFreq2Int_Hz))
                $cardBody.append(createDataPara('脉冲宽度2(μs)：', itemObj.stimPulseWidth2Int_mS))
                $cardBody.append(createDataPara('刺激频率3(Hz)：', itemObj.stimFreq3Int_Hz))
                $cardBody.append(createDataPara('脉冲宽度3(μs)：', itemObj.stimPulseWidth3Int_mS))
            }
            $cardBody.append(createDataPara('上升时间(s)：', itemObj.stimRampUpFloat_S))
            $cardBody.append(createDataPara('下降时间(s)：', itemObj.stimRampDnFloat_S))
        } else if (itemObj.itemType == programType.ETS) { //类型2：触发电刺激
            $cardBody.append(createDataPara('刺激时间(s)：', itemObj.stimWorkTimeFloat_S))
            $cardBody.append(createDataPara('休息时间(s)：', itemObj.stimRestTimeFloat_S))
            $cardBody.append(createDataPara('刺激频率(Hz)：', itemObj.stimFreq1Int_Hz))
            $cardBody.append(createDataPara('脉冲宽度(μs)：', itemObj.stimPulseWidth1Int_mS))
            if (itemObj.stimInverterFreqBool) { //变频
                $cardBody.append(createDataPara('刺激频率2(Hz)：', itemObj.stimFreq2Int_Hz))
                $cardBody.append(createDataPara('脉冲宽度2(μs)：', itemObj.stimPulseWidth2Int_mS))
                $cardBody.append(createDataPara('刺激频率3(Hz)：', itemObj.stimFreq3Int_Hz))
                $cardBody.append(createDataPara('脉冲宽度3(μs)：', itemObj.stimPulseWidth3Int_mS))
            }
            $cardBody.append(createDataPara('上升时间(s)：', itemObj.stimRampUpFloat_S))
            $cardBody.append(createDataPara('下降时间(s)：', itemObj.stimRampDnFloat_S))
            $cardBody.append(createDataPara('触发方式：', itemObj.etsStimBelowBool ? '低于阈值触发' : '高于阈值触发'))
            $cardBody.append(createDataPara('阈值控制方式：', itemObj.etsManualThresholdBool ? '手动阈值'+'('+itemObj.etsThresholdFloat_mV+'μV)' : '自动阈值'))
        } else if (itemObj.itemType == programType.KEGEL) { //类型3：凯格尔训练
            var dataArr = []
            for (var i=0; i<itemObj.kegelPointArray.length; i++) {
                dataArr.push([itemObj.kegelPointArray[i].x, itemObj.kegelPointArray[i].y])
            }
            createChart($cardBody, dataArr)
        } else if (itemObj.itemType == programType.MEDIA) { //类型4：多媒体游戏
            var $img = $("<img class='programDetail-cardBody-img'>").attr('src', '/src/assets/img/programNew/' + getGameImg(itemObj.gameName))
            $cardBody.append($img)
        }
        $bodyCard.append($cardBody)
        $stepTd.append($bodyCard)
    }
}

/**
    跳转-新增方案项
    @param {Dom} btn 新增按钮
    @return
 */
function goAddItem(btn) {
    currBtn = btn
    $('.dialog-head-title').text('新增')
    $('.dialog-shade').show()
    changeComponentType(1)
}

/**
    跳转-编辑方案项
    @param {Dom} btn 编辑按钮
    @return
 */
function goEditItem(btn) {
    currBtn = btn
    $('.dialog-head-title').text('编辑')
    $('.dialog-shade').show()
    var itemData = JSON.parse($(btn).parent().parent().attr('itemData'))
    changeComponentType(itemData.itemType, function() {
        initDialogData(itemData)
    })
}

/**
    跳转-删除方案项
    @param {Dom} btn 删除按钮
    @return
 */
function goDeleteItem(btn) {
    var $td = $(btn).parent().parent()
    var $tr = $td.parent()
    $td.remove()
    var $newTr = $('<td class="step"></td>')
    var $shade = $('<div class="shade"></div>').appendTo($newTr)
    $('<span class="add">新增</span>').appendTo($shade).click(function() {
        goAddItem(this)
    })
    $tr.children('.actionTd').before($newTr)
    refreshSessionNo()
    refreshTitle()
}

/**
    保存模板
    @param
    @return
 */
function saveTemplate() {
    var condition = getItemConditions().itemArray[0]
    condition.order = '1'
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/add-item',
        data: condition,
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if (data.code == 200) {
                tipDialog('保存模板成功', function() {
                    initComponents(condition.itemType, function() {
                        $('.component-content').scrollTop(999999)
                    })
                })
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    新增/保存方案项数据
    @param
    @return
 */
function saveItemData() {
    if (!validConditions()) {
        return
    }
    closeDialog()
    appendItemData($(currBtn).parent().parent(), getItemConditions())
    refreshSessionNo()
    refreshTitle()
    goEditProgram()
}

function validConditions() {
    var $common = $('#conditions-common')
    validCondition({input: $common.children('[key="itemName"]').find('input')[0], type: 'required'})
    validCondition({input: $common.children('[key="itemDurationFloat_S"]').find('input')[0], type: "section", min: 1, max: 60})
    var itemType = $('#componentType').children('.checkbox').children('span.active').attr('val')
    if (itemType == 1) {
        var $stim = $('#conditions-stim')
        validCondition({input: $stim.children('[key="stimWorkTimeFloat_S"]').find('input')[0], type: "section", min: 1, max: 20})
        validCondition({input: $stim.children('[key="stimRestTimeFloat_S"]').find('input')[0], type: "section", min: 1, max: 20})
        validCondition({input: $stim.children('[key="stimFreq1Int_Hz"]').find('input')[0], type: "section", min: 2, max: 250})
        validCondition({input: $stim.children('[key="stimPulseWidth1Int_mS"]').find('input')[0], type: "section", min: 20, max: 1000})
        var freq = $('#stimFreq').children('.checkbox').children('span.active').attr('val')
        if (freq == 'true') {
            validCondition({input: $stim.children('[key="stimFreq2Int_Hz"]').find('input')[0], type: "section", min: 2, max: 250})
            validCondition({input: $stim.children('[key="stimPulseWidth2Int_mS"]').find('input')[0], type: "section", min: 20, max: 1000})
            validCondition({input: $stim.children('[key="stimFreq3Int_Hz"]').find('input')[0], type: "section", min: 2, max: 250})
            validCondition({input: $stim.children('[key="stimPulseWidth3Int_mS"]').find('input')[0], type: "section", min: 20, max: 1000})
        }
        validCondition({input: $stim.children('[key="stimRampUpFloat_S"]').find('input')[0], type: "section", min: 0, max: 20})
        validCondition({input: $stim.children('[key="stimRampDnFloat_S"]').find('input')[0], type: 'required'})
        if ($stim.find('.dialog-error').length > 0) {
            return false
        }
        var stimRampUp = parseInt($stim.children('[key="stimRampUpFloat_S"]').find('input').val())
        var stimRampDn = parseInt($stim.children('[key="stimRampDnFloat_S"]').find('input').val())
        var stimWork = parseInt($stim.children('[key="stimWorkTimeFloat_S"]').find('input').val())
        if (stimRampUp + stimRampDn >= stimWork) {
            alert('上升时间+下降时间应该小于刺激时间')
            return false
        }
    } else if (itemType == 2) {
        var $ets = $('#conditions-ets')
        validCondition({input: $ets.children('[key="stimWorkTimeFloat_S"]').find('input')[0], type: "section", min: 1, max: 20})
        validCondition({input: $ets.children('[key="stimRestTimeFloat_S"]').find('input')[0], type: "section", min: 1, max: 20})
        validCondition({input: $ets.children('[key="stimFreq1Int_Hz"]').find('input')[0], type: "section", min: 2, max: 250})
        validCondition({input: $ets.children('[key="stimPulseWidth1Int_mS"]').find('input')[0], type: "section", min: 20, max: 1000})
        var freq = $('#etsFreq').children('.checkbox').children('span.active').attr('val')
        if (freq == 'true') {
            validCondition({input: $ets.children('[key="stimFreq2Int_Hz"]').find('input')[0], type: "section", min: 2, max: 250})
            validCondition({input: $ets.children('[key="stimPulseWidth2Int_mS"]').find('input')[0], type: "section", min: 20, max: 1000})
            validCondition({input: $ets.children('[key="stimFreq3Int_Hz"]').find('input')[0], type: "section", min: 2, max: 250})
            validCondition({input: $ets.children('[key="stimPulseWidth3Int_mS"]').find('input')[0], type: "section", min: 20, max: 1000})
        }
        validCondition({input: $ets.children('[key="stimRampUpFloat_S"]').find('input')[0], type: "section", min: 0, max: 20})
        validCondition({input: $ets.children('[key="stimRampDnFloat_S"]').find('input')[0], type: 'required'})
        var manualThreshold = $('#etsManualThreshold').children('.checkbox').children('span.active').attr('val')
        if (manualThreshold == 'true') {
            validCondition({input: $ets.children('[key="etsThresholdFloat_mV"]').find('input')[0], type: 'required'})
        }
        if ($ets.find('.dialog-error').length > 0) {
            return false
        }
        var stimRampUp = parseInt($ets.children('[key="stimRampUpFloat_S"]').find('input').val())
        var stimRampDn = parseInt($ets.children('[key="stimRampDnFloat_S"]').find('input').val())
        var stimWork = parseInt($ets.children('[key="stimWorkTimeFloat_S"]').find('input').val())
        if (stimRampUp + stimRampDn >= stimWork) {
            alert('上升时间+下降时间应该小于刺激时间')
            return false
        }
    } else if (itemType == 3) {
        //kegel图标无需校验
    } else if (itemType == 4) {
        //游戏图片无需校验
    }
    if ($('#conditions-common').find('.dialog-error').length > 0) {
        return false
    }
    return true
}

/**
    校验条件
    {
        @param {Dom} input 输入框
        @param {String} type 校验类型
        @param {Number} min 最小值
        @param {Number} max 最大值
    }
    @return
 */
function validCondition({input, type, min, max}) {
    var $error = $(input).parent().parent().next('.dialog-error')
    if (type == 'required') {
        if (CommonUtils.isEmpty($(input).val())) {
            if ($error.length == 0) {
                $(input).parent().parent().after('<div class="dialog-error">必填</div>')
            }
        } else {
            $error.remove()
        }
    } else if (type == 'section') {
        if (CommonUtils.isEmpty($(input).val())) {
            if ($error.length == 0) {
                var text = min + '-' + max
                $(input).parent().parent().after('<div class="dialog-error">请输入'+text+'</div>')
            }
            return
        }
        var val = parseInt($(input).val())
        if (val < min || val > max) {
            if ($error.length == 0) {
                $(input).parent().parent().after('<div class="dialog-error">请输入'+min+'-'+max+'</div>')
            }
        } else {
            $error.remove()
        }
    }
}

/**
    保存方案
    @param
    @return
 */
function saveProgram() {
    var noStr = '', isValid = true
    $('.programDetail-tbody').children('tr').each(function(i, tr) {
        if ($(tr).children('td.desc').attr('score') == 0) {
            if (noStr == '') {
                noStr += (i+1)
            } else {
                noStr += ',' + (i+1)
            }
            isValid = false
        }
    })
    if (!isValid) {
        alert('请先删除序号为'+noStr+'的数据')
        return
    }
    var programData = getProgramData()
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/upload-course',
        data: {
            token: getToken(),
            tcUID: window.parent.Router.getParameter('tcUID'),
            ContentType: programData.ContentType,
            course: programData.course,
            group_code: programData.group_code,
            scheme_type_code: programData.scheme_type_code,
            tcCourseClinic: programData.tcCourseClinic,
            tcCourseClinicMedical: programData.tcCourseClinicMedical,
            tcCourseDescMedical: programData.tcCourseDescMedical,
            tcCourseNameMedical: programData.tcCourseNameMedical,
            tcResourceType: programData.tcResourceType,
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if (data.code == 200) {
                tipDialog('保存成功', function() {
                    exitEditProgram()
                })
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    获取方案数据
    @param
    @return {Object} 方案数据
 */
function getProgramData() {
    var sessionArr = [], programCount = 0, programDuration = 0
    $('.programDetail-tbody').children('tr').each(function(i, tr) {
        var sessionObj = {
            itemsetArray: [],
            itemsetTotalNumberInt: 0,
            sessionDurationFloat_S: 0
        }
        var itemsetCount = 0, itemsetDuration = 0
        $(tr).children('td.step').each(function(j, td) {
            var itemData = $(td).attr('itemData')
            if (itemData) {
                var itemObj = JSON.parse(itemData)
                itemsetCount++
                itemsetDuration += itemObj.itemDurationFloat_S
                sessionObj.itemsetArray.push({
                    itemArray: [itemObj],
                    itemTotalNumberInt: 1,
                    itemsetDurationFloat_S: itemObj.itemDurationFloat_S
                })
            }
        })
        sessionObj.itemsetTotalNumberInt = itemsetCount
        sessionObj.sessionDurationFloat_S = itemsetDuration
        sessionArr.push(sessionObj)
        programCount ++
        programDuration += itemsetDuration
    })
    programData.course.sessionArray = sessionArr
    programData.course.courseTotalNumber = programCount
    programData.course.courseTotalTime_S = programDuration
    programData.course.courseName = $('.programDetail-title-programName-input').val()
    programData.course.courseDesc = $('.programDetail-title-remake-input').val()
    programData.course.updateTime = CommonUtils.dateFormat(new Date(), 'YYYY-MM-DD hh:mm:ss')
    if (programData.course.dataStructVersion == '') {
        programData.course.dataStructVersion = 10
    }
    if (programData.course.softVersion == '') {
        programData.course.softVersion = 10
    }
    programData.group_code = $('.programDetail-title-type-select').val()
    programData.scheme_type_code = $('.programDetail-title-subtype-select').val()
    programData.tcCourseClinic = $('.programDetail-title-clinic-input').val()
    programData.tcCourseClinicMedical = $('.programDetail-title-medicalClinic-input').val()
    programData.tcCourseNameMedical = $('.programDetail-title-medicalName-input').val()
    programData.tcCourseDescMedical = $('.programDetail-title-medicalRemake-input').val()
    programData.ContentType = $('.programDetail-title-train-select').val()
    return programData
}

/**
    获取弹窗数据(新增/编辑方案项)
    @param
    @return {Object} 方案项数据
 */
function getItemConditions() {
    var obj = {}
    $('#conditions-common').children('.dialog-content-condition').each(function() {
        var key = $(this).attr('key')
        if (key) {
            obj[key] = getItemCondition($(this))
        }
    })
    obj.itemDurationFloat_S = obj.itemDurationFloat_S * 60
    obj.stimWithKegelBool = false
    obj.itemType = parseInt(obj.itemType)
    if (obj.itemType == 1) {
        $('#conditions-stim').children('.dialog-content-condition').each(function() {
            var key = $(this).attr('key')
            if (key) {
                obj[key] = getItemCondition($(this))
            }
        })
        obj.stimCurrentFloat_mA = 0
        obj.stimNumberInt = 1
        obj.itemBeginTimeFloat_S = 0
        obj.itemEndTimeFloat_S = 0
        obj.etsManualThresholdBool = false
        obj.etsStimBelowBool = false
        obj.etsThresholdFloat_mV = 0
        obj.gameName = ''
        obj.gameParam1Float = 0
        obj.gameParam2Float = 0
        obj.kegelBaselineInt = 0
        obj.kegelDataLengthLong = 0
        obj.kegelNameString = ''
        obj.kegelOriDataLengthLong = 0
        obj.kegelOriDataStartLong = 0
        obj.kegelPointNumberInt = 0
        obj.kegelSampleRateInt = 0
        obj.kegelXMaxInt = 0
        obj.kegelYMaxInt = 0
        obj.imageFileNameString = ''
        obj.itemDesc = ''
    } else if (obj.itemType == 2) {
        $('#conditions-ets').children('.dialog-content-condition').each(function() {
            var key = $(this).attr('key')
            if (key) {
                obj[key] = getItemCondition($(this))
            }
        })
        obj.stimCurrentFloat_mA = 0
        obj.stimNumberInt = 1
        obj.itemBeginTimeFloat_S = 0
        obj.itemEndTimeFloat_S = 0
        obj.gameName = ''
        obj.gameParam1Float = 0
        obj.gameParam2Float = 0
        obj.kegelBaselineInt = 0
        obj.kegelDataLengthLong = 0
        obj.kegelNameString = ''
        obj.kegelOriDataLengthLong = 0
        obj.kegelOriDataStartLong = 0
        obj.kegelPointNumberInt = 0
        obj.kegelSampleRateInt = 0
        obj.kegelXMaxInt = 0
        obj.kegelYMaxInt = 0
        obj.imageFileNameString = ''
        obj.itemDesc = ''
    } else if (obj.itemType == 3) {
        kegelObj.itemDurationFloat_S = obj.itemDurationFloat_S
        kegelObj.itemName = obj.itemName
        kegelObj.kegelNameString = obj.itemName
        kegelObj.stimWithKegelBool = obj.stimWithKegelBool
        kegelObj.itemType = obj.itemType
        obj = kegelObj
    } else if (obj.itemType == 4) {
        gameObj.itemDurationFloat_S = obj.itemDurationFloat_S
        gameObj.itemName = obj.itemName
        gameObj.gameName = obj.itemName
        gameObj.stimWithKegelBool = obj.stimWithKegelBool
        gameObj.itemType = obj.itemType
        obj = gameObj
    }
    return {
        itemArray: [obj],
        itemTotalNumberInt: 1,
        itemsetDurationFloat_S: obj.itemDurationFloat_S
    }
}
function getItemCondition($condition) {
    var type = $condition.children('div').attr('class')
    if (type == 'input') {
        var $input = $condition.find('input')
        if ($input.attr('type') == 'number') {
            if ($input.val() == '') {
                return 0
            }
            return parseInt($input.val())
        }
        return $input.val()
    } else if (type == 'checkbox') {
        var val = $condition.find('span.active').attr('val')
        if (val == 'true') {
            return true
        } else if (val == 'false') {
            return false
        }
        return val
    } else if (type == 'select') {
        return $condition.find('select').val()
    }
    return ''
}

/**
    切换-组件类型
    @param {String} type 组件类型
    @param {Function} callback 回调函数
    @return
 */
function changeComponentType(type, callback) {
    var $group = $('#componentType').children('.checkbox')
    $group.children().removeClass('active')
    $group.children('[val='+type+']').addClass('active')
    $('.dialog-content-conditions[component-type='+type+']').show()
    $('.dialog-content-conditions[component-type!='+type+']').hide()
    if (type == 4) {
        $('#conditions-common').children('.dialog-content-condition[key="itemName"]').find('input').attr('disabled', true)
    } else {
        $('#conditions-common').children('.dialog-content-condition[key="itemName"]').find('input').attr('disabled', false)
    }
    initComponents(type, callback)
}
/**
    切换-组件
    @param {Number} val 组件索引
    @return
 */
function changeCompenent(val) {
    $('.component-content').children('p').removeClass('active')
    $('.component-content').children('p:eq('+val+')').addClass('active')
    initDialogData(componentArr[val])
}
/**
    切换-变频(电刺激)
    @param {Boolean} isYes 是否选中“是”
    @return
 */
function changeStimFreq(isYes) {
    var $group = $('#stimFreq').children('.checkbox')
    $group.children().removeClass('active')
    $group.children('[val='+isYes+']').addClass('active')
    var $conditions = $('#conditions-stim')
    if (isYes) {
        $conditions.children('[key="stimFreq2Int_Hz"]').show()
        $conditions.children('[key="stimPulseWidth2Int_mS"]').show()
        $conditions.children('[key="stimFreq3Int_Hz"]').show()
        $conditions.children('[key="stimPulseWidth3Int_mS"]').show()
    } else {
        $conditions.children('[key="stimFreq2Int_Hz"]').hide().next('.dialog-error').remove()
        $conditions.children('[key="stimPulseWidth2Int_mS"]').hide().next('.dialog-error').remove()
        $conditions.children('[key="stimFreq3Int_Hz"]').hide().next('.dialog-error').remove()
        $conditions.children('[key="stimPulseWidth3Int_mS"]').hide().next('.dialog-error').remove()
    }
}
/**
    切换-变频(触发电刺激)
    @param {Boolean} isYes 是否选中“是”
    @return
 */
function changeEtsFreq(isYes) {
    var $group = $('#etsFreq').children('.checkbox')
    $group.children().removeClass('active')
    $group.children('[val='+isYes+']').addClass('active')
    var $conditions = $('#conditions-ets')
    if (isYes) {
        $conditions.children('[key="stimFreq2Int_Hz"]').show()
        $conditions.children('[key="stimPulseWidth2Int_mS"]').show()
        $conditions.children('[key="stimFreq3Int_Hz"]').show()
        $conditions.children('[key="stimPulseWidth3Int_mS"]').show()
    } else {
        $conditions.children('[key="stimFreq2Int_Hz"]').hide().next('.dialog-error').remove()
        $conditions.children('[key="stimPulseWidth2Int_mS"]').hide().next('.dialog-error').remove()
        $conditions.children('[key="stimFreq3Int_Hz"]').hide().next('.dialog-error').remove()
        $conditions.children('[key="stimPulseWidth3Int_mS"]').hide().next('.dialog-error').remove()
    }
}
/**
    切换-触发方式(触发电刺激)
    @param {Boolean} isYes 是否选中“是”
    @return
 */
function changeEtsStimBelow(isYes) {
    var $group = $('#etsStimBelow').children('.checkbox')
    $group.children().removeClass('active')
    $group.children('[val='+isYes+']').addClass('active')
}
/**
    切换-阈值控制方式(触发电刺激)
    @param {Boolean} isYes 是否选中“是”
    @return
 */
function changeEtsManualThreshold(isYes) {
    var $group = $('#etsManualThreshold').children('.checkbox')
    $group.children().removeClass('active')
    $group.children('[val='+isYes+']').addClass('active')
    if (isYes) {
        $('.dialog-content-condition[key="etsThresholdFloat_mV"]').show()
    } else {
        $('.dialog-content-condition[key="etsThresholdFloat_mV"]').hide()
    }
}

/**
    初始化组件
    @param {Number} type 组件类型
    @param {Function} callback 回调函数
    @return
 */
function initComponents(type, callback) {
    AjaxUtils.ajax({
        header: {
            REQUESTAPP: 1
        },
        type: 'POST',
        url: request_path.programme + 'rihadm/course/get-items',
        data: {
            token: getToken(),
            program_type: type
        },
        notPrompt: true,
        success: function(data, textStatus, jqXHR) {
            if (data.code == 200) {
                $('.component-content').html(null)
                for (var i=0; i<data.data.length; i++) {
                    (function(n) {
                        var $componentItem = $('<p value='+n+'>'+data.data[n].itemName+'</p>').click(function() {
                            changeCompenent(n)
                        })
                        $('.component-content').append($componentItem)
                    })(i)
                }
                componentArr = data.data
                if (typeof(callback) == 'function') {
                    callback()
                } else {
                    changeCompenent(0)
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {

        }
    })
}

/**
    初始化弹窗数据(新增/编辑方案项)
    @param {Object} obj 组件数据
    @return
 */
function initDialogData(obj) {
    if (obj.itemType == 1) {
        $('.dialog-content-condition[key="itemName"]').find('input').val(obj.itemName)
        $('.dialog-content-condition[key="itemDurationFloat_S"]').find('input').val(parseInt(obj.itemDurationFloat_S / 60))
        $('.dialog-content-condition[key="stimWorkTimeFloat_S"]').find('input').val(parseInt(obj.stimWorkTimeFloat_S))
        $('.dialog-content-condition[key="stimRestTimeFloat_S"]').find('input').val(parseInt(obj.stimRestTimeFloat_S))
        $('.dialog-content-condition[key="stimFreq1Int_Hz"]').find('input').val(obj.stimFreq1Int_Hz)
        $('.dialog-content-condition[key="stimPulseWidth1Int_mS"]').find('input').val(parseInt(obj.stimPulseWidth1Int_mS))
        changeStimFreq(obj.stimInverterFreqBool)
        $('.dialog-content-condition[key="stimFreq2Int_Hz"]').find('input').val(parseInt(obj.stimFreq2Int_Hz))
        $('.dialog-content-condition[key="stimPulseWidth2Int_mS"]').find('input').val(parseInt(obj.stimPulseWidth2Int_mS))
        $('.dialog-content-condition[key="stimFreq3Int_Hz"]').find('input').val(parseInt(obj.stimFreq3Int_Hz))
        $('.dialog-content-condition[key="stimPulseWidth3Int_mS"]').find('input').val(parseInt(obj.stimPulseWidth3Int_mS))
        $('.dialog-content-condition[key="stimRampUpFloat_S"]').find('input').val(parseInt(obj.stimRampUpFloat_S))
        $('.dialog-content-condition[key="stimRampDnFloat_S"]').find('input').val(parseInt(obj.stimRampDnFloat_S))
    } else if (obj.itemType == 2) {
        $('.dialog-content-condition[key="itemName"]').find('input').val(obj.itemName)
        $('.dialog-content-condition[key="itemDurationFloat_S"]').find('input').val(parseInt(obj.itemDurationFloat_S / 60))
        $('.dialog-content-condition[key="stimWorkTimeFloat_S"]').find('input').val(parseInt(obj.stimWorkTimeFloat_S))
        $('.dialog-content-condition[key="stimRestTimeFloat_S"]').find('input').val(parseInt(obj.stimRestTimeFloat_S))
        $('.dialog-content-condition[key="stimFreq1Int_Hz"]').find('input').val(obj.stimFreq1Int_Hz)
        $('.dialog-content-condition[key="stimPulseWidth1Int_mS"]').find('input').val(parseInt(obj.stimPulseWidth1Int_mS))
        changeEtsFreq(obj.stimInverterFreqBool)
        $('.dialog-content-condition[key="stimFreq2Int_Hz"]').find('input').val(parseInt(obj.stimFreq2Int_Hz))
        $('.dialog-content-condition[key="stimPulseWidth2Int_mS"]').find('input').val(parseInt(obj.stimPulseWidth2Int_mS))
        $('.dialog-content-condition[key="stimFreq3Int_Hz"]').find('input').val(parseInt(obj.stimFreq3Int_Hz))
        $('.dialog-content-condition[key="stimPulseWidth3Int_mS"]').find('input').val(parseInt(obj.stimPulseWidth3Int_mS))
        $('.dialog-content-condition[key="stimRampUpFloat_S"]').find('input').val(parseInt(obj.stimRampUpFloat_S))
        $('.dialog-content-condition[key="stimRampDnFloat_S"]').find('input').val(parseInt(obj.stimRampDnFloat_S))
        changeEtsStimBelow(obj.etsStimBelowBool)
        changeEtsManualThreshold(obj.etsManualThresholdBool)
        $('.dialog-content-condition[key="etsThresholdFloat_mV"]').find('input').val(parseInt(obj.etsThresholdFloat_mV))
    } else if (obj.itemType == 3) {
        kegelObj = obj
        $('.dialog-content-condition[key="itemName"]').find('input').val(obj.itemName)
        $('.dialog-content-condition[key="itemDurationFloat_S"]').find('input').val(parseInt(obj.itemDurationFloat_S / 60))
        var dataArr = []
        for (var i=0; i<obj.kegelPointArray.length; i++) {
            dataArr.push([obj.kegelPointArray[i].x, obj.kegelPointArray[i].y])
        }
        createChart($('#kegelChart'), dataArr)
    } else if (obj.itemType == 4) {
        gameObj = obj
        $('.dialog-content-condition[key="itemName"]').find('input').val(obj.itemName)
        $('.dialog-content-condition[key="itemDurationFloat_S"]').find('input').val(parseInt(obj.itemDurationFloat_S / 60))
        $('#gameImg').attr('src', '/src/assets/img/programNew/' + getGameImg(obj.gameName))
    }
}

/**
    创建数据参数节点
    @param {string} name 参数名称
    @param {string} value 参数名
    @return {Dom} 数据节点
 */
function createDataPara(name, value) {
    var bodyCardItem = $("<div class='programDetail-tbody-cardBody-item'></div>")
    bodyCardItem.append($("<span class='programDetail-tbody-cardBody-name'></span>").text(name))
    bodyCardItem.append($("<span class='programDetail-tbody-cardBody-content'></span>").text(value))
    return bodyCardItem
}

/**
    创建图表
    @param {$} $node 节点
    @param {String} seriesArr 数据集
    @return
 */
function createChart($node, dataArr) {
    $node.highcharts({
        chart: {
            zoomType: 'xy'
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        title: {
            text: null,
        },
        tooltip: {
            enabled: false
        },
        colors: ['red', '#333'],
        xAxis: {
            labels: {
                enabled: true
            },
            tickInterval: 1
        },
        yAxis: {
            title: {
                text: null
            },
            tickInterval: 10
        },
        plotOptions: {
            line: {
                enableMouseTracking: false
            }
        },
        series: [{
            lineWidth: 0.5,
            _colorIndex: 1,
            _symbolIndex: 1,
            data: dataArr
        }]
    }, function() {
        setTimeout(function() {
            resizeWindow()
        }, 500)
    })
}

/**
    获取token
    @param
    @return {String} token
 */
function getToken() {
    if (window.parent.Router.getParameter('token') != '') {
        return window.parent.Router.getParameter('token')
    }
    return localStorage.token
}

/**
    获取训练类型
    @param {String} val 类型
    @return {String} 训练类型文案
 */
function getProgramType(val) {
    if(val == programType.STIM) {
        return '电刺激'
    } else if(val == programType.ETS) {
        return '触发电刺激'
    } else if(val == programType.KEGEL) {
        return 'Kegel训练'
    } else if(val == programType.MEDIA) {
        return '多媒体训练'
    } else {
        return val
    }
}

/**
    获取图片链接
    @param {String} val 类型
    @return {String} 图片链接
 */
function getProgramImgSrc(val) {
    if(val == programType.STIM) {
        return '/src/assets/img/programNew/ic_train_type_stim.webp'
    } else if(val == programType.ETS) {
        return '/src/assets/img/programNew/ic_train_type_trigger_stim.webp'
    } else if(val == programType.KEGEL) {
        return '/src/assets/img/programNew/ic_train_type_kegel.webp'
    } else if(val == programType.MEDIA) {
        return '/src/assets/img/programNew/ic_train_type_media.webp'
    } else {
        return val
    }
}

/**
    获取游戏图片
    @param {String} gameName 游戏名称
    @return {String} 游戏图片
 */
function getGameImg(gameName) {
    if (gameName == '饥饿鲨鱼') {
        return 'ic_course_experience_shark.webp'
    } else if (gameName == '接水果') {
        return 'ic_course_experience_fruit.webp'
    }
    return 'ic_course_experience_shark.webp'
}

/**
    获取数组最大长度
    @param {Array} arr 数组
    @return {Number} 数组长度
 */
function getArrMaxLength(arr) {
    var maxLength = 0
    for(var i=0; i<arr.length; i++) {
        if(maxLength < arr[i].itemsetArray.length) {
            maxLength = arr[i].itemsetArray.length
        }
    }
    return maxLength > 4 ? maxLength : 4
}

/**
    过滤URL主要将绝对路径改为相对路径
    @param {String} url 链接
    @return {String} 相对路径
 */
function filterUrl(url) {
    if(url.indexOf('http') > -1 || url.indexOf('https') > -1) { //绝对路径
        var arrUrl = url.split("//")
        var start = arrUrl[1].indexOf("/")
        return arrUrl[1].substring(start)
    } else {
        return url
    }
}

/**
    跳转-进入编辑方案状态
    @param
    @return
 */
function goEditProgram() {
    //方案名称+方案描述+方案类型
    $('.programDetail-title-programName-span').hide()
    $('.programDetail-title-programName-input').show()
    $('.programDetail-title-remake-span').hide()
    $('.programDetail-title-remake-input').show()
    $('.programDetail-title-clinic-span').hide()
    $('.programDetail-title-clinic-input').show()
    $('.programDetail-title-medicalName-span').hide()
    $('.programDetail-title-medicalName-input').show()
    $('.programDetail-title-medicalRemake-span').hide()
    $('.programDetail-title-medicalRemake-input').show()
    $('.programDetail-title-medicalClinic-span').hide()
    $('.programDetail-title-medicalClinic-input').show()
    $('.programDetail-title-type-span').hide()
    $('.programDetail-title-type-select').show()
    $('.programDetail-title-subtype-span').hide()
    $('.programDetail-title-subtype-select').show()
    $('.programDetail-title-train-span').hide()
    $('.programDetail-title-train-select').show()
    //顶部按钮
    $('.programDetail-btn.edit').hide()
    $('.programDetail-btn.addStep').show()
    $('.programDetail-btn.exitEdit').show()
    $('.programDetail-btn.save').show()
    //操作列
    $('.actionTh').show()
    $('.actionTd').show()
    //step列
    $('td.step').each(function() {
        if ($(this).children('.shade').length > 0) {
            $(this).children('.shade').remove()
        }
        if ($(this).children().length == 0) {
            var $shade = $(this).children('.shade')
            if ($shade.length == 0) {
                $shade = $('<div class="shade"></div>').appendTo($(this))
            }
            $('<span class="add">新增</span>').appendTo($shade).click(function() {
                goAddItem(this)
            })
        } else {
            var $shade = $(this).children('.shade')
            if ($shade.length == 0) {
                $shade = $('<div class="shade"></div>').appendTo($(this))
            }
            $('<span class="edit">编辑</span>').appendTo($shade).click(function() {
                goEditItem(this)
            })
            $('<span class="delete">删除</span>').appendTo($shade).click(function() {
                goDeleteItem(this)
            })
        }
    })
}

/**
    退出编辑方案状态
    @param
    @return
 */
function exitEditProgram() {
    //方案名称+方案描述+方案类型
    $('.programDetail-title-programName-span').show()
    $('.programDetail-title-programName-input').hide()
    $('.programDetail-title-remake-span').show()
    $('.programDetail-title-remake-input').hide()
    $('.programDetail-title-clinic-span').show()
    $('.programDetail-title-clinic-input').hide()
    $('.programDetail-title-medicalName-span').show()
    $('.programDetail-title-medicalName-input').hide()
    $('.programDetail-title-medicalRemake-span').show()
    $('.programDetail-title-medicalRemake-input').hide()
    $('.programDetail-title-medicalClinic-span').show()
    $('.programDetail-title-medicalClinic-input').hide()
    $('.programDetail-title-type-span').show()
    $('.programDetail-title-type-select').hide()
    $('.programDetail-title-subtype-span').show()
    $('.programDetail-title-subtype-select').hide()
    $('.programDetail-title-train-span').show()
    $('.programDetail-title-train-select').hide()
    //顶部按钮
    $('.programDetail-btn.edit').show()
    $('.programDetail-btn.addStep').hide()
    $('.programDetail-btn.exitEdit').hide()
    $('.programDetail-btn.save').hide()
    //操作列
    $('.actionTh').hide()
    $('.actionTd').hide()
    //step列
    $('td.step').children('.shade').remove()
    //数据重载
    initData()
}

/**
    新增步骤
    @param
    @return
 */
function addStep() {
    var $headTr = $('.programDetail-thead').children('tr')
    $headTr.children('th.actionTh').before('<th class="step" width="150">步骤'+($headTr.children('th.step').length+1)+'</th>')
    var $bodyTr = $('.programDetail-tbody').children('tr')
    var $newBodyTr = $('<td class="step"></td>')
    var $shade = $('<div class="shade"></div>').appendTo($newBodyTr)
    $('<span class="add">新增</span>').appendTo($shade).click(function() {
        goAddItem(this)
    })
    $bodyTr.children('.actionTd').before($newBodyTr)
    refreshSessionNo()
}

/**
    关闭弹窗
    @param
    @return
 */
function closeDialog() {
    $('.dialog-shade').hide()
}

/**
    提示框
    @param
    @return
 */
function tipDialog(content, callback) {
    $('#dialog-tip').text(content).show()
    setTimeout(function() {
        $('#dialog-tip').hide()
        typeof(callback) == 'function' ? callback() : ''
    }, 2000)
}

/**
    页面布局重置 & 自适应
    @param
    @return
 */
function resizeWindow() {
    //浏览器resize
    var event = document.createEvent('HTMLEvents')
    event.initEvent('resize', false, true)
    window.dispatchEvent(event)
    //表格自适应
    var windowHeight = document.documentElement.clientHeight || window.innerHeight
    var isWidthScroll = $('.programDetail-tbody-list').innerWidth() > $('.programDetail-content').innerWidth()
    if ($('.programDetail-tbody').innerHeight() > windowHeight - (isWidthScroll ? 142 : 125)) {
        $('.programDetail-tbody').css('max-height', windowHeight - (isWidthScroll ? 142 : 125) + 'px')
        $('.programDetail-thead').css('padding-right', '17px')
    }
}

function convertContentType(contentType) {
    if (contentType == '3') {
        return '凯格尔'
    } else if (contentType == '4') {
        return '游戏'
    }
    return ''
}
