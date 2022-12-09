//路由构造函数
function Router() {
    this.routes = [];
}
//路由原型添加
Router.prototype = {
    /** 版本 **/
    version: '20220121',
    /**
        添加路由
        @param {Object}param 配置
        @return
    */
    addRoute: function(param) {
        if (typeof(param.children) === 'object' && param.children.length > 0) {
            for (var i=0; i<param.children.length; i++) {
                this.routes.push({
                    type: param.type,
                    route: param.route+'/'+param.children[i].route,
                    path: param.children[i].url
                });
            }
        } else {
            this.routes.push({
                type: param.type,
                route: param.route,
                path: param.url
            });
        }
    },
    /**
        路由初始化
        @param
        @return
    */
    init: function() {
        window.addEventListener('load', this.load.bind(this));
        window.addEventListener('hashchange', this.hashchange.bind(this));
    },
    /**
        页面加载
        @param
        @return
    */
    load: function() {
        var obj = this.getRoute(this.getCurrRoute());
        if (typeof(obj.path) === 'undefined') {
            this.jump('error/404');
            return;
        } else {
            if (obj.type === 'chain') {
                CommonUtils.fullHeight();
                $('#rootPage').children('iframe').remove();
                this.createIframe(this.getPath(obj)+'?t='+this.version, '', this.getCurrRoute());
            } else {
                $('#rootPage').load(this.getPath(obj)+'?t='+this.version);
            }
        }
    },
    /**
        创建iframe
        @param {String}src 路径
        @param {String}from 原路由
        @param {String}to 新路由
        @return
    */
    createIframe: function(src, from, to) {
        var $iframe = $('<iframe></iframe>').attr({
            src: src,
            from: from,
            to: to
        });
        $('#rootPage').append($iframe);
    },
    /**
        获取链接
        @param {Object}obj 路由
        @return {String} 链接
    */
    getPath: function(obj) {
        var rootPath = obj.route.indexOf('error') === 0 ? page_root.error : page_root.app;
        return rootPath + obj.path;
    },
    /**
        跳转连接
        @param {String}route 路由
        @param {String}param 参数
        @return
    */
    jump: function(route, param) {
        var obj = this.getRoute(route);
        if (typeof(obj.path) === 'undefined') {
            this.jump('error/404');
            return;
        } else {
            this.createIframe(this.getPath(obj)+'?t='+this.version, this.getCurrRoute(), route);
            var url = window.location.origin + '/#/' + route;
            if (!CommonUtils.isEmpty(param)) {
                url += param;
            }
            window.location.href = url;
        }
    },
    /**
        hash路由变化
        @param
        @return
    */
    hashchange: function() {
        var obj = this.getRoute(this.getCurrRoute())
        if (obj.type === 'chain') {
            var $lastIframe = $('#rootPage').children('iframe:last-child')
            if (this.getCurrRoute() === $lastIframe.attr('to')) { //jump跳转
                //1.隐藏所有iframe 2.显示lastIframe
                $('#rootPage').children('iframe').hide()
                $lastIframe.show()
            } else if (this.getCurrRoute() === $lastIframe.attr('from')) { //浏览器回退
                //1.隐藏所有iframe 2.删除lastIframe 3.显示倒数第二个iframe
                $('#rootPage').children('iframe').hide()
                $lastIframe.remove()
                $('#rootPage').children('iframe:last-child').show()
            } else { //浏览器前进
                //1.隐藏所有iframe 2.新建iframe
                $('#rootPage').children('iframe').hide()
                this.createIframe(this.getPath(obj)+'?t='+this.version, $lastIframe.attr('to'), this.getCurrRoute())
            }
        } else {
            $('#rootPage').load(this.getPath(obj)+'?t='+this.version)
        }
        this.hashChangeCallback()
    },
    /**
        获取当前路由
        @param
        @return {String} 当前路由
    */
    getCurrRoute: function() {
        var h = window.location.hash.substr(1);
        var i = h.indexOf('?')<0 ? h.length : h.indexOf('?');
        return h.substring(1, i);
    },
    /**
        获取路由对象
        @param {String}route 路由
        @return {Object} 路由对象
    */
    getRoute: function(route) {
        for (var i=0; i<this.routes.length; i++) {
            if (route === this.routes[i].route) {
                return this.routes[i];
            }
        }
        return {};
    },
    /**
        获取参数链接
        @param
        @return {String} 参数集
    */
    getSearch: function() {
        var h = window.location.hash.substr(1);
        var i = h.indexOf('?')<0 ? h.length : h.indexOf('?');
        return h.substr(i+1);
    },
    /**
        获取链接参数
        @param {String}param 参数名
        @return {String} 参数值
    */
    getParameter: function(param) {
        var reg = new RegExp('(^|&)' + param + '=([^&]*)(&|$)', 'i');
        var r = this.getSearch().match(reg);
        if (r != null) {
            return r[2];
        } else {
            return '';
        }
    },
    hashChangeCallback: function() {
        var route = this.getCurrRoute()
        if (route.indexOf('knowledge') == 0) { //盆底百科（一代医疗）
            if (route == 'knowledge/index') {
                CommonUtils.appFun(function() {
                    window.jsInterface.showTabbar()
                }, function() {
                    window.webkit.messageHandlers.showTabbar.postMessage(null)
                })
            } else {
                CommonUtils.appFun(function() {
                    window.jsInterface.hideTabbar()
                }, function() {
                    window.webkit.messageHandlers.hideTabbar.postMessage(null)
                })
            }
        }
    }
}
//全局挂载Router
window.Router = new Router();
window.Router.init();