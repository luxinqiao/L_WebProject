$(function() {
    var trainData = JSON.parse(sessionStorage.trainData);
    //基本信息
    $('#phoneLabel').text(trainData.phone);
    $('#nickLabel').text(trainData.nickname);
    $('#nameLabel').text(trainData.name);
    //筛查记录
    for (var i=0; i<trainData.assessrecord.length; i++) {
        var record = trainData.assessrecord[i];
        var $recordItem = $('<div class="recordItem" onclick="recordDetail(\''+record.auid+'\',\''+record.fileurl+'\')"></div>');
        $recordItem.append('<div class="score"><span>'+record.score+'</span><span>得分</span></div>');
        $recordItem.append('<div class="createtime">筛查日期 : '+record.create_time+'</div>');
        $recordItem.append('<div class="detail">查看详情&gt;&gt;</div>');
        $('#recordListDiv').append($recordItem);
    }
    //训练记录
    for (var i=0; i<trainData.traincourse.length; i++) {
        var train = trainData.traincourse[i];
        var $trainItem = $('<div class="trainItem"></div>');
        $trainItem.append('<div class="trainName">'+train.name+'</div>');
        var $trainDetail = $('<div class="trainDetail"></div>');
        $trainDetail.append('<span>本方案共<span class="totalnum">'+train.totalnum+'</span>次</span>');
        $trainDetail.append('<span>已训练<span class="trainnum">'+train.trainnum+'</span>次</span>');
        $trainItem.append($trainDetail);
        $('#trainListDiv').append($trainItem);
    }
});

/**
    查询记录详情
    @param {String}auid 详情id
    @param {String}fileurl 文件路径
    @return
*/
function recordDetail(auid, fileurl) {
    sessionStorage.train_auid = auid;
    sessionStorage.train_fileurl = fileurl;
    window.parent.Router.jump('train/record');
}