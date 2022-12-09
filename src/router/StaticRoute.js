/**
    文件描述：系统路由
    创建人：卢信桥
    创建时间：2018-11-21
*/
//系统路由(404)
Router.addRoute({
    route: 'error',
    children: [{
        route: '404', url: '404.html'
    }]
})
//训练(个人报告)
Router.addRoute({
    type: 'chain',
    route: 'train',
    children: [{
        route: 'search', url: 'trainWeb/Train_Search.html'
    }, {
        route: 'list', url: 'trainWeb/Train_List.html'
    }, {
        route: 'record', url: 'trainWeb/Train_Record.html'
    }]
})
// 方案
Router.addRoute({
    route: 'programme',
    children: [{
        route: 'getProgramme', url: 'programme/getProgramme.html'
    }]
})
// 子宫托
Router.addRoute({
    route: 'pessulum',
    children: [{
        route: 'introduce', url: 'pessulum/introduce/introduce.html'
    }, {
        route: 'introduce_share', url: 'pessulum/introduce/introduce_share.html'
    }, {
        route: 'newGuidance/followUpVisit', url: 'pessulum/newGuidance/followUpVisit.html' //子宫托的随访
    }, {
        route: 'newGuidance/clean', url: 'pessulum/newGuidance/clean.html' //子宫托的清洗
    }, {
        route: 'newGuidance/fitness', url: 'pessulum/newGuidance/fitness.html' //检查子宫托的合适度
    }, {
        route: 'newGuidance/symptom', url: 'pessulum/newGuidance/symptom.html' //子宫托的适应范围和禁忌有哪些
    }, {
        route: 'newGuidance/courseB', url: 'pessulum/newGuidance/courseB.html' //子宫托B款产品的使用教程
    }, {
        route: 'newGuidance/courseA', url: 'pessulum/newGuidance/courseA.html' //子宫托A款产品的使用教程
    }]
})
//常见问题
Router.addRoute({
    route: 'commonQuestions',
    children: [{
        route: 'list', url: 'commonQuestions/questions_List.html'
    }, {
        route: 'answer', url: 'commonQuestions/answer.html'
    }]
})
//新手指导详情页
Router.addRoute({
    route: 'newGuidance',
    children: [{
        route: 'openSurprise', url: 'newGuidance/openSurprise.html' //开箱有惊喜(kegel球)
    }, {
        route: 'chooseRight', url: 'newGuidance/chooseRight.html' //选择合适规格的康复器很重要
    }, {
        route: 'howToClean', url: 'newGuidance/howToClean.html' //如何清洗，有诀窍
    }, {
        route: 'courseTrain', url: 'newGuidance/courseTrain.html' //课程训练，循序渐进有成效
    }, {
        route: 'positionAnalysis', url: 'newGuidance/positionAnalysis.html' //康复器的放置位置解析
    }, {
        route: 'trainTF', url: 'newGuidance/trainTF.html' //掌握正确的训练时长和频率
    }, {
        route: 'userContraindication', url: 'newGuidance/userContraindication.html' //康复器使用的适应范围和禁忌
    }, {
        route: 'userStrategy', url: 'newGuidance/userStrategy.html' //康复器训练使用全攻略
    }, {
        route: 'openSurpriseSec', url: 'newGuidance/openSurpriseSec.html' //开箱有惊喜（盆底肌肉康复器）
    }, {
        route: 'firstUse', url: 'newGuidance/firstUse.html' //首次使用必了解技能
    }, {
        route: 'rightTrain', url: 'newGuidance/rightTrain.html' //解剖正确的训练姿势
    }, {
        route: 'trainPreview', url: 'newGuidance/trainPreview.html' //训练前的准备工作
    }, {
        route: 'trainStrategy', url: 'newGuidance/trainStrategy.html' //设备训练全攻略
    }, {
        route: 'trainAbout', url: 'newGuidance/trainAbout.html' // 训练中的那些事
    }, {
        route: 'cleanSkill', url: 'newGuidance/cleanSkill.html' //设备收纳小技巧
    }, {
        route: 'useForbid', url: 'newGuidance/useForbid.html' //设备使用的适应范围和禁忌
    }, {
        route: 'trainFreq', url: 'newGuidance/trainFreq.html' //设备训练的频率
    }, {
        route: 'searchUnify', url: 'newGuidance/searchUnify.html' //盆底肌筛查一体化
    }, {
        route: 'trainGet', url: 'newGuidance/trainGet.html' //训练方案获取渠道
    }]
})
//新手指导详情页190508
Router.addRoute({
    route: 'newGuidance190508',
    children: [{
        route: 'openExperience', url: 'newGuidance190508/openExperience.html' //开箱新体验
    }, {
        route: 'firstUse', url: 'newGuidance190508/firstUse.html' //首次使用必了解的那些事
    }, {
        route: 'doBeforeTrain', url: 'newGuidance190508/doBeforeTrain.html' //训练前，需要做哪些事
    }, {
        route: 'doInTrain', url: 'newGuidance190508/doInTrain.html' //训练中，你需要了解的那些事
    }, {
        route: 'cleanSkill', url: 'newGuidance190508/cleanSkill.html' //收纳小技巧：出门旅行必备之选
    }, {
        route: 'useForbid', url: 'newGuidance190508/useForbid.html' //恢复仪主机使用的适应范围和禁忌
    }, {
        route: 'trainFreq', url: 'newGuidance190508/trainFreq.html' //训练频率如何掌控
    }, {
        route: 'howtoWash', url: 'newGuidance190508/howtoWash.html' //电极片如何清洗，是门学问
    }, {
        route: 'trainGet', url: 'newGuidance190508/trainGet.html' //训练方案获取渠道
    }, {
        route: 'trainNew', url: 'newGuidance190508/trainNew.html' //单机进行训练：训练新体验
    }]
})
//新手指导详情页190619
Router.addRoute({
    route: 'newGuidance190619',
    children: [{
        route: 'openExperience', url: 'newGuidance190619/openExperience.html' //开箱新体验
    }, {
        route: 'firstUse', url: 'newGuidance190619/firstUse.html' //首次使用必了解的那些事
    }, {
        route: 'doBeforeTrain', url: 'newGuidance190619/doBeforeTrain.html' //训练前，需要做哪些事
    }, {
        route: 'doInTrain', url: 'newGuidance190619/doInTrain.html' //训练中，你需要了解的那些事
    }, {
        route: 'cleanSkill', url: 'newGuidance190619/cleanSkill.html' //收纳小技巧：出门旅行必备之选
    }, {
        route: 'useForbid', url: 'newGuidance190619/useForbid.html' //恢复仪主机使用的适应范围和禁忌
    }, {
        route: 'trainFreq', url: 'newGuidance190619/trainFreq.html' //训练频率如何掌控
    }, {
        route: 'howtoWash', url: 'newGuidance190619/howtoWash.html' //电极片如何清洗，是门学问
    }, {
        route: 'trainGet', url: 'newGuidance190619/trainGet.html' //训练方案获取渠道
    }, {
        route: 'trainNew', url: 'newGuidance190619/trainNew.html' //脱离APP，单机训练：训练新体验
    }]
})
//新手指导详情页190624
Router.addRoute({
    route: 'newGuidance190624',
    children: [{
        route: 'openExperience', url: 'newGuidance190624/openExperience.html' //开箱有惊喜
    }, {
        route: 'firstUse', url: 'newGuidance190624/firstUse.html' //首次使用必了解技能
    }, {
        route: 'correctTrain', url: 'newGuidance190624/correctTrain.html' //解剖正确的训练姿势
    }, {
        route: 'doBeforeTrain', url: 'newGuidance190624/doBeforeTrain.html' //训练前的准备工作
    }, {
        route: 'strategyTrain', url: 'newGuidance190624/strategyTrain.html' //训练全攻略
    }, {
        route: 'doInTrain', url: 'newGuidance190624/doInTrain.html' //训练中的那些事
    }, {
        route: 'cleanSkill', url: 'newGuidance190624/cleanSkill.html' //训练仪收纳小技巧
    }, {
        route: 'useForbid', url: 'newGuidance190624/useForbid.html' //恢复仪主机使用的适应范围和禁忌
    }, {
        route: 'trainFreq', url: 'newGuidance190624/trainFreq.html' //设备训练的频率
    }, {
        route: 'creenIntegrat', url: 'newGuidance190624/creenIntegrat.html' //盆底肌筛查一体化
    }, {
        route: 'trainGet', url: 'newGuidance190624/trainGet.html' //训练方案获取渠道
    }]
})
//视频播放
Router.addRoute({
    route: 'video',
    children: [{
        route: 'play', url: 'video/Video_Play.html'
    }]
})
//调查问卷
Router.addRoute({
    route: 'questionnaire',
    children: [{
        route: 'paper', url: 'questionnaire/paper.html'
    }, {
        route: 'statisticsDetail', url: 'questionnaire/statisticsDetail.html'
    }]
})
// 延保
Router.addRoute({
    route: 'guarantee',
    children: [{
        route: 'instruction', url: 'guarantee/Guarantee_Instrution.html'
    }, {
        route: 'instruction_medical', url: 'guarantee/Guarantee_InstrutionMedical.html'
    }, {
        route: 'buy', url: 'guarantee/Guarantee_Buy.html'
    }]
})
//盆底肌肉康复器新手教程
Router.addRoute({
    route: 'pkGreenGuideBook',
    children: [{
        route: 'productIntroduce', url: 'pkGreenGuideBook/productIntroduce.html' //产品介绍
    }, {
        route: 'quicklyKnowWell', url: 'pkGreenGuideBook/quicklyKnowWell.html' //快速上手
    }, {
        route: 'openExperience', url: 'pkGreenGuideBook/openExperience.html' //开箱有惊喜
    }, {
        route: 'chooseRight', url: 'pkGreenGuideBook/chooseRight.html' //选择合适的康复器很重要
    }, {
        route: 'howToClean', url: 'pkGreenGuideBook/howToClean.html' //如何清洗，有诀窍
    }, {
        route: 'courseTrain', url: 'pkGreenGuideBook/courseTrain.html' //课程训练
    }, {
        route: 'positionAnalysis', url: 'pkGreenGuideBook/positionAnalysis.html' //康复器的放置位置解析
    }, {
        route: 'trainTF', url: 'pkGreenGuideBook/trainTF.html' //掌握正确的训练时长和频率
    }, {
        route: 'userContraindication', url: 'pkGreenGuideBook/userContraindication.html' //康复器使用的适应范围和禁忌：您需要了解的小知识
    }, {
        route: 'userStrategy', url: 'pkGreenGuideBook/userStrategy.html' //康复器训练使用全攻略
    }]
})
//盆底肌肉训练仪产品介绍
Router.addRoute({
    route: 'pdjrxly',
    children: [{
        route: 'productDetail', url: 'pdjrxly/productDetail.html'
    }]
})
//积分（积分规则）
Router.addRoute({
    route: 'integral',
    children: [{
        route: 'rule', url: 'integral/rule.html'
    }]
})
//通用协议
Router.addRoute({
    route: 'protocol',
    children: [{
        route: 'recommendProduct', url: 'protocol/recommendProduct.html' //推荐商品记录状态
    },{
        route: 'inviteMan', url: 'protocol/inviteMan.html' //邀请推荐大使
    },{
        route: 'recommendMan', url: 'protocol/recommendMan.html' //推荐大使记录
    }, {
        route: 'applyMan', url: 'protocol/applyMan.html' //申请推荐大使
    }, {
        route: 'meetingxcx', url: 'protocol/meetingxcx.html' //会议吧小程序
    }, {
        route: 'kegelxcx', url: 'protocol/kegelxcx.html' //kegel小程序
    }]
})
//VIP（线下扫码）
Router.addRoute({
    route: 'vip', url: 'vip/vip.html'
})
//大礼包
Router.addRoute({
    route: 'gift',
    children: [{
        route: 'rule', url: 'gift/rule.html' //邀请推荐大使
    }, {
        route: 'index', url: 'gift/gift.html' //大礼包首页
    }]
})
//推荐系统
Router.addRoute({
    route: 'rec',
    children: [{
        route: 'apply', url: 'recommend/application.html' //申请加入
    }, {
        route: 'applyRule', url: 'recommend/applicationRule.html' //申请规则
    }, {
        route: 'rule', url: 'recommend/applicationRule_app.html' //推荐规则(app内嵌)
    }]
})
//调查问卷（供分级诊疗设备使用）
Router.addRoute({
    route: 'questionnairePc',
    children: [{
        route: 'list', url: 'questionnairePc/list.html'
    }, {
        route: 'detail', url: 'questionnairePc/detail.html'
    }]
})
//邀请注册
Router.addRoute({
    route: 'inviteApp',
    children: [{
        route: 'doc', url: 'inviteApp/inviteDoc.html'
    }, {
        route: 'user', url: 'inviteApp/inviteUser.html'
    }, {
        route: 'downDoc', url: 'inviteApp/downDoc.html'
    }, {
        route: 'downUser', url: 'inviteApp/downUser.html' //下载澜渟1代：盆底修复仪
    }, {
        route: 'downAll', url: 'inviteApp/downAll.html'
    }, {
        route: 'downMedUser', url: 'inviteApp/downMedUser.html' //下载澜渟1代医疗版：盆底生物刺激反馈仪
    }, {
        route: 'downMed', url: 'inviteApp/downMed.html'
    }]
})

//个人中心（内嵌app）
Router.addRoute({
    route: 'personCenter',
    children: [{
        route: 'protocol', url: 'personCenter/protocol.html'
    }, {
        route: 'feedback', url: 'personCenter/feedback.html'
    }]
})
//澜渟方案
Router.addRoute({
    route: 'programNew',
    children: [{
        route: 'list', url: 'programNew/programList.html'
    }, {
        route: 'detail', url: 'programNew/programDetail.html'
    }, {
        route: 'listEdit', url: 'programNew/programListEdit.html'
    }]
})
//医生用户协议
Router.addRoute({
    type: 'chain',
    route: 'agent',
    children: [{
        route: 'doctor', url: 'agent/doctor.html'
    }, {
        route: 'mineslim', url: 'agent/mineslim.html'
    }, {
        route: 'recommend', url: 'agent/recommend.html'
    }]
})
//新手指导详情页200615
Router.addRoute({
    route: 'newGuidance200615',
    children: [{
        route: 'correctTrain', url: 'newGuidance200615/correctTrain.html' //解锁正确的训练姿势
    }, {
        route: 'doBeforeTrain', url: 'newGuidance200615/doBeforeTrain.html' //智能训练有准备
    }, {
        route: 'strategyTrain', url: 'newGuidance200615/strategyTrain.html' //训练全攻略
    }, {
        route: 'cleanSkill', url: 'newGuidance200615/cleanSkill.html' //清洗收纳小技巧
    }, {
        route: 'trainFreq', url: 'newGuidance200615/trainFreq.html' //修复仪训练频率
    }, {
        route: 'creenIntegrat', url: 'newGuidance200615/creenIntegrat.html' //盆底肌筛查/评估
    }, {
        route: 'trainGet', url: 'newGuidance200615/trainGet.html' //训练方案获取渠道
    }]
})
//澜渟二代
Router.addRoute({
    route: 'pelvicSecondG',
    children: [{
        route: 'deviceIntroduce', url: 'pelvicSecondG/introduce.html'
    }]
})
//医疗app
Router.addRoute({
    route: 'medical',
    children: [{
        route: 'protocol', url: 'medical/protocol.html' //用户协议（盆底生物刺激反馈仪）
    }, {
        route: 'pelFloPri', url: 'medical/pelFloPri.html' //隐私政策（盆底生物刺激反馈仪）
    }, {
        route: 'userAppPri', url: 'medical/userAppPri.html' //澜渟app隐私政策（澜渟修复仪）
    }, {
        route: 'docAppPri', url: 'medical/docAppPri.html' //澜渟医生app隐私政策
    }]
})
//澜渟1代
Router.addRoute({
    route: 'lt01',
    children: [{
        route: 'newer_medical', url: 'lt01/newer_medical.html' //kegel新手必读（医疗）
    }, {
        route: 'prepare_medical', url: 'lt01/prepare_medical.html' //智能训练有准备（医疗）
    }, {
        route: 'trainStrategy_medical', url: 'lt01/trainStrategy_medical.html' //训练全攻略（医疗）
    }, {
        route: 'cleanSkill_medical', url: 'lt01/cleanSkill_medical.html' //清洗收纳小技巧（医疗）
    }, {
        route: 'trainFrequency_medical', url: 'lt01/trainFrequency_medical.html' //盆底生物刺激反馈仪训练频率（医疗）
    }, {
        route: 'muscleSift_medical', url: 'lt01/muscleSift_medical.html' //盆底肌筛查/评估（医疗）
    }, {
        route: 'trainWay_medical', url: 'lt01/trainWay_medical.html' //训练方案获取方式（医疗）
    }, {
        route: 'saleInfoList', url: 'lt01/saleInfoList.html' //售后说明列表
    }, {
        route: 'saleInfo_kegel', url: 'lt01/saleInfo_kegel.html' //售后说明-盆底肌肉康复器
    }, {
        route: 'saleInfo_pdjxfy', url: 'lt01/saleInfo_pdjxfy.html' //售后说明-盆底肌修复仪（非医疗）
    }, {
        route: 'saleInfo_zlyy', url: 'lt01/saleInfo_zlyy.html' //售后说明-盆底生物刺激反馈仪（医疗）
    }, {
        route: 'saleInfo_wireless', url: 'lt01/saleInfo_wireless.html' //售后说明-无线产后恢复仪
    }, {
        route: 'wrightinNewer', url: 'lt01/wrightinNewer.html' //澜渟新手必读
    }, {
        route: 'kegelStrategy', url: 'lt01/kegelStrategy.html' //kegel功能指南
    }]
})

//澜渟2代
Router.addRoute({
    route: 'lt02',
    children: [{
        route: 'wrightinNewer', url: 'lt02/wrightinNewer.html' //澜渟新手必读
    }]
})
//澜渟3代
Router.addRoute({
    route: 'lt03',
    children: [{
        route: 'protocol', url: 'lt03/protocol.html' //用户协议（盆底康复仪软件）
    }, {
        route: 'pelFloPri', url: 'lt03/pelFloPri.html' //隐私政策（盆底康复仪软件）
    }, {
        route: 'newer', url: 'lt03/newer.html' //新手必读
    }]
})
//新澜渟医疗版-百科
Router.addRoute({
    type: 'chain',
    route: 'knowledge',
    children: [{
        route: 'index', url: 'knowledge/index.html'
    }, {
        route: 'search', url: 'knowledge/search.html'
    }, {
        route: 'detail', url: 'knowledge/detail.html'
    }, {
        route: 'ask', url: 'knowledge/ask.html'
    }, {
        route: 'posterView', url: 'knowledge/posterView.html'
    }, {
        route: 'detailShare', url: 'knowledge/detailShare.html'
    }, {
        route: 'imgLook', url: 'knowledge/imgLook.html'
    }]
})
//介绍页（扫码短链跳转）
Router.addRoute({
    route: 'info',
    children: [{
        route: 'wxckhfypp', url: 'info/wxckhfypp/index.html' //无线产后恢复仪产品介绍-主页
    }, {
        route: 'wxckhfypp/detail', url: 'info/wxckhfypp/detail.html' //无线产后恢复仪产品介绍-详情页
    }, {
        route: 'pdjxfypp', url: 'info/pdjxfypp/index.html' //盆底肌修复仪产品介绍-主页
    }, {
        route: 'pdjxfypp/detail', url: 'info/pdjxfypp/detail.html' //盆底肌修复仪产品介绍-详情页
    }, {
        route: 'pdjxfyhl', url: 'info/pdjxfyhl/index.html' //盆底肌修复仪产品介绍-主页
    }, {
        route: 'pdjxfyhl/detail', url: 'info/pdjxfyhl/detail.html' //盆底肌修复仪产品介绍-详情页
    }, {
        route: 'mldSecret', url: 'info/mldSecret/index.html' //麦澜德私密医疗美容设备
    }]
})
//新手指导详情页200813
Router.addRoute({
    route: 'newGuidance200813',
    children: [{
        route: 'correctTrain', url: 'newGuidance200813/correctTrain.html' //正确训练
    }, {
        route: 'strainThing', url: 'newGuidance200813/strainThing.html' //盆底肌肉康复器训练使用全攻略：解锁训练前中后的那些事
    }]
})
//腹式呼吸
Router.addRoute({
    route: 'ventral',
    children: [{
        route: 'trainInfo', url: 'ventral/trainInfo.html' //训练说明
    }]
})
//无线产康
Router.addRoute({
    route: 'wireless',
    children: [{
        route: 'newer', url: 'wireless/newer.html' //新手必读
    }, {
        route: 'programPre', url: 'wireless/programPre.html' //方案准备
    }, {
        route: 'programInfo', url: 'wireless/programInfo.html' //方案准备
    }]
})
//图片查看器
Router.addRoute({
    route: 'imgLook', url: 'imgLook/index.html'
})
//发票规则
Router.addRoute({
    route: 'inv',
    children: [{
        route: 'rules', url: 'inv/rules.html' 
    }]
})
//新手指导详情页201215
Router.addRoute({
    route: 'newGuidance201215',
    children: [{
        route: 'introduce', url: 'newGuidance201215/introduce.html' //产品介绍
    }, {
        route: 'openExperience', url: 'newGuidance201215/openExperience.html' //开箱新体验
    }, {
        route: 'firstUse', url: 'newGuidance201215/firstUse.html' //首次使用必了解的那些事
    }, {
        route: 'doBeforeTrain', url: 'newGuidance201215/doBeforeTrain.html' //训练前，需要做哪些事
    }, {
        route: 'doInTrain', url: 'newGuidance201215/doInTrain.html' //训练中，你需要了解的那些事
    }, {
        route: 'cleanSkill', url: 'newGuidance201215/cleanSkill.html' //收纳小技巧：出门旅行必备之选
    }, {
        route: 'useForbid', url: 'newGuidance201215/useForbid.html' //恢复仪主机使用的适应范围和禁忌
    }, {
        route: 'trainFreq', url: 'newGuidance201215/trainFreq.html' //训练频率如何掌控
    }, {
        route: 'howtoWash', url: 'newGuidance201215/howtoWash.html' //电极片如何清洗，是门学问
    }, {
        route: 'trainGet', url: 'newGuidance201215/trainGet.html' //训练方案获取渠道
    }, {
        route: 'trainNew', url: 'newGuidance201215/trainNew.html' //脱离APP，单机训练：训练新体验
    }]
})
//下载页
Router.addRoute({
    route: 'download',
    children: [{
        route: 'pdxfy', url: 'download/pdxfy.html' //盆底修复仪-澜渟三代低端版
    }, {
        route: 'ltpd', url: 'download/ltpd.html' //盆底康复仪软件(HD)
    }, {
        route: 'pdkfy', url: 'download/pdkfy.html' //澜渟盆底-澜渟三代高端版
    }]
})
//独立软件
Router.addRoute({
    route: 'independent',
    children: [{
        route: 'protocol', url: 'independent/protocol.html' //用户协议
    }, {
        route: 'pelFloPri', url: 'independent/pelFloPri.html' //隐私政策
    }, {
        route: 'newer', url: 'independent/newer.html' //新手必读（盆底训练）
    }, {
        route: 'ckNewer', url: 'independent/ckNewer.html' //新手必读（产康训练）
    }]
})
//口碑营销-健康与美皆不负
Router.addRoute({
    route: 'brandMarketing',
    children: [{
        route: 'index', url: 'brandMarketing/index.html'
    }, {
        route: 'rule', url: 'brandMarketing/rule.html'
    }]
})
//kegel小程序
Router.addRoute({
    route: 'kegelxcx',
    children: [{
        route: 'quickStart', url: 'kegelxcx/quickStart.html'
    }]
})
//app下载
Router.addRoute({
    route: 'apps',
    children: [{
        route: 'wrightin', url: 'inviteApp/downUser.html' //澜渟App（盆底肌修复仪）（1代非医疗版）
    }, {
        route: 'wrightindoc', url: 'inviteApp/downDoc.html' //澜渟医生App
    }, {
        route: 'pfmedhs', url: 'inviteApp/downMedUser.html' //盆底生物刺激反馈仪软件App（1代医疗版）
    }, {
        route: 'wrightinall', url: 'inviteApp/downAll.html' //聚合下载页(澜渟/澜渟医生/盆底生物刺激反馈仪)
    }]
})
//产品
Router.addRoute({
    route: 'products',
    children: [{
        route: 'kegelballapp', url: 'inviteApp/downUser.html' //凯格尔球-下载
    }, {
        route: 'riapp', url: 'inviteApp/downUser.html' //无线产后恢复仪-下载
    }, {
        route: 'ribi', url: 'info/wxckhfypp/index.html' //无线产后恢复仪-产品介绍
    }, {
        route: 'ridetails', url: 'info/wxckhfypp/detail.html' //无线产后恢复仪-产品介绍
    }, {
        route: 'pfmedhsapp', url: 'inviteApp/downMedUser.html' //盆底生物刺激反馈仪-下载
    }, {
        route: 'pfmedhsbi', url: 'info/pdjxfypp/index.html' //盆底生物刺激反馈仪-产品介绍
    }, {
        route: 'pfmedhsdetails', url: 'info/pdjxfypp/detail.html' //盆底生物刺激反馈仪-产品介绍
    }, {
        route: 'pfnonmedhlapp', url: 'inviteApp/downUser.html' //盆底肌修复仪-下载
    }, {
        route: 'pfnonmedhlbi', url: 'info/pdjxfyhl/index.html' //盆底肌修复仪-产品介绍
    }, {
        route: 'pfnonmedhldetails', url: 'info/pdjxfyhl/detail.html' //盆底肌修复仪-产品介绍
    }, {
        route: 'pfnonmedplapp', url: 'inviteApp/downUser.html' //盆底肌修复仪（澜渟2代）-下载
    }, {
        route: 'pfnonmedplqg', url: 'pelvicSecondG/introduce.html' //盆底肌修复仪（澜渟2代）-产品介绍
    }, {
        route: 'pfmedhaapp', url: 'products/pfmedhaapp.html' //盆底康复仪（澜渟3代低端）-下载
    }, {
        route: 'pfmedhaqg', url: 'products/pfmedhaqg.html' //盆底康复仪（澜渟3代低端）-快速操作指南
    }, {
        route: 'pfmedhdapp', url: 'download/pdkfy.html' //盆底康复治疗仪（澜渟3代高端）-下载
    }, {
        route: 'pfmedhdqg', url: 'products/pfmedhdqg.html' //盆底康复治疗仪（澜渟3代高端）-快速操作指南
    }, {
        route: 'pfmedweapp', url: 'download/ltpd.html' //盆底康复电极配套App下载页
    }]
})

//市场运营：曝光
Router.addRoute({
    route: 'marketing',
    children: [{
        route: 'expodealerinfo', url: 'marketing/expodealerinfo.html'
    }, {
        route: 'expodealerinfoSuccess', url: 'marketing/expodealerinfoSuccess.html'
    }]
})
//澜渟二代
Router.addRoute({
    route: 'GMAA',
    children: [{
        route: 'detail', url: 'GMAA/detail.html'
    }]
})
//新手指导详情页211123
Router.addRoute({
    route: 'newGuidance211123',
    children: [{
        route: 'wrightinNewerOne', url: 'newGuidance211123/wrightinNewerOne.html' //澜渟新手必读-1代
    }, {
        route: 'wrightinNewerTwo', url: 'newGuidance211123/wrightinNewerTwo.html' //澜渟新手必读-2代
    }, {
        route: 'doBeforeTrain', url: 'newGuidance211123/doBeforeTrain.html' //智能训练有准备
    }, {
        route: 'strategyTrain', url: 'newGuidance211123/strategyTrain.html' //训练全攻略
    }, {
        route: 'creenIntegrat', url: 'newGuidance211123/creenIntegrat.html' //盆底肌筛查/评估
    }, {
        route: 'trainGet', url: 'newGuidance211123/trainGet.html' //训练方案获取方式
    }]
})