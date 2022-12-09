访问路径:
http://web.wrightin.com/#/train/search
train和search分别为1级和2级路由，在src/router/staticRoute.js中配置
js中通过Router.jump('train/list')进行页面跳转

目录结构:
src                     源代码
    assets              静态文件
        css             样式
        img             图片
    components          公共组件
    config              配置文件
        index.js        公共路径配置
    page                应用页面
        app             应用html
        js              应用js
        resource        应用资源
    router              路由
        index.js        路由主文件
        StaticRoute.js  静态路由
    third               第三方库
    utils               工具类
    README.md           项目说明
index.html              项目入口文件

插件说明：
qrcode.min.js
var qrcode = new QRCode("test", {
    text: "http://www.runoob.com",
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
}); //生成一个二维码
qrcode.clear(); // 清除代码
qrcode.makeCode("http://www.w3cschool.cc"); // 生成另外一个二维码
