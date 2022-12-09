function Page(){
	/**
		归属div
	*/
	this.divId = "";
	/**
		每页条数
 	*/
	this.eachPageNum = 10;
	/**
		当前页
	*/
	this.currPage = 1;
	/**
		总页数
	*/
	this.totalPage = 1;
	/**
		总条数
	*/
	this.totalNum = 0;
	/**
		分页查询方法
	*/
	this.pageChangeFun = function(){};
	/**
		配置参数
	*/
	this.param = {};
	/**
		初始化分页
		@param {Object}obj:数据源
		@return 
	*/
	this.initPage = function(obj){
		//1.配置必填参数
		if (typeof(obj.divId) != "undefined"){
			this.divId = obj.divId;
		}
		if (typeof(obj.eachPageNum) != "undefined"){
			this.eachPageNum = obj.eachPageNum;
		}
		if (typeof(obj.pageChangeFun) != "undefined"){
			this.pageChangeFun = obj.pageChangeFun;
		}
		//2.配置非必填参数
		this.param = {
			isEachPageNum: true, //是否显示每页条数
			isTotalNum: true, //是否显示总条数
			isPageDetail: true //是否显示详细页码
		};
		if (typeof(obj.isEachPageNum) != "undefined"){
			this.param.isEachPageNum = obj.isEachPageNum;
		}
		if (typeof(obj.isTotalNum) != "undefined"){
			this.param.isTotalNum = obj.isTotalNum;
		}
		if (typeof(obj.isPageDetail) != "undefined"){
			this.param.isPageDetail = obj.isPageDetail;
		}
	};
	/**
		加载分页
	*/
	this.loadPage = function() {
		var PageClone = this;
		//1.初始化总页数
		this.totalPage = Math.ceil(this.totalNum/this.eachPageNum);
		//2.添加详细页码
		$("#"+this.divId).html(null);
		var $pageDetailSpan = $("<span id='pageDetailSpan'></span>");
		$("#"+this.divId).append($pageDetailSpan);
		var $detailSpan = $("<span id='detailSpan'></span>").appendTo($pageDetailSpan);
		var $firstA = $("<a class='first'>首页</a>").bind("click", function(){
			PageClone.jumpPage(1);
		});
		$detailSpan.append($firstA);
		var $prePageA = $("<a class='prev'>上一页</a>").bind("click", function(){
			PageClone.jumpPage(PageClone.currPage-1);
		});
		$detailSpan.append($prePageA);
		if (this.totalPage <= 7){ //小于7页：直接展示
			for (var i=1; i<=this.totalPage; i++){
				PageClone.appendPage(i);
			}
		} else{ //大于7页：加入..展示
			if (this.currPage <= 3){ //1,2,3,4,5...99
				for (var i=1; i<=5; i++){
					PageClone.appendPage(i);
				}
				PageClone.appendEllipsis();
				PageClone.appendPage(this.totalPage);
			} else if (this.currPage >= 4 && this.currPage <= this.totalPage-3){ //1...12,13,14,15,16...99
				PageClone.appendPage(1);
				PageClone.appendEllipsis();
				for (var i=this.currPage-2; i<=this.currPage+2; i++){
					PageClone.appendPage(i);
				}
				PageClone.appendEllipsis();
				PageClone.appendPage(this.totalPage);
			} else{ //1...95,96,97,98,99
				PageClone.appendPage(1);
				PageClone.appendEllipsis();
				for (var i=this.totalPage-4; i<=this.totalPage; i++){
					PageClone.appendPage(i);
				}
			}
		}
		var $nextPageA = $("<a class='next'>下一页</a>").bind("click", function(){
			PageClone.jumpPage(PageClone.currPage+1);
		});
		$detailSpan.append($nextPageA);
		var $lastA = $("<a class='last'>末页</a>").bind("click", function(){
			PageClone.jumpPage(PageClone.totalPage);
		});
		$detailSpan.append($lastA);
		//3.激活选中页
		$("#"+this.divId).find("#pageDetailSpan>a").removeClass("active");
		$("#"+this.divId).find("#a"+this.currPage).addClass("active");
		//4.设置每页条数/总条数/详细页码/跳转页码是否显示
		if (this.param.isEachPageNum == false){
			$("#"+this.divId).find("#pageCountSpan").children("span:eq(0)").hide();
			$("#"+this.divId).find("#pageCountSpan").children("span:eq(1)").hide();
		}
		if (this.param.isTotalNum == false){
			$("#"+this.divId).find("#pageCountSpan").children("span:eq(2)").hide();
			$("#"+this.divId).find("#pageCountSpan").children("span:eq(1)").hide();
		}
		if (this.param.isPageDetail == false){
			$("#"+this.divId).find("#pageDetailSpan").children("span:eq(0)").hide();
		}
	};
	/**
		添加页
		@param {Number}i:页码
		@return 
	*/
	this.appendPage = function(i){
		var PageClone = this;
		var $a = $("<a class='num' id='a"+i+"'>"+i+"</a>").bind("click", function(){
			PageClone.jumpPage(i);
		});
		$("#"+this.divId).find("#detailSpan").append($a);
	};
	/**
		添加省略号
	*/
	this.appendEllipsis = function(){
		$("#"+this.divId).find("#detailSpan").append("<span>...</span>");
	};
	/**
		跳转分页
	*/
	this.jumpPage = function(page){
		if (page < 1){
			if (this.currPage == 1){
				return;
			}
			this.currPage = 1;
		} else if (page > this.totalPage){
			if (this.currPage == this.totalPage){
				return;
			}
			this.currPage = this.totalPage;
		} else{
			if (this.currPage == page){
				return;
			}
			this.currPage = page;
		}
		this.pageChangeFun();
	};
	/**
		设置当前页
		@param {Number}page: 当前页
		@return 
	*/
	this.setCurrPage = function(page){
		this.currPage = page;
	};
	/**
		设置总页数
		@param {Number}num: 总页数
		@return 
	*/
	this.setTotalNum = function(num) {
		this.totalNum = num;
	};
}
