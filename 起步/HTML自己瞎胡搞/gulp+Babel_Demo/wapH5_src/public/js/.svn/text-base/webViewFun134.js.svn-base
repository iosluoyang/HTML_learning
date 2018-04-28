/**
 * Created by hasee on 2016/12/3.
 */


//原生和js交互
/*这段代码是固定的，必须要放到js中*/
//安卓回调需要
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}
//ios交互需要
function connectIosWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

/*注册native要调用js的方法，为了方便维护，注册方法都写在这里*/
function registernativetojs(bridge) {
    // 这里注册Native 要调用的js 功能。
    bridge.registerHandler('getshareparameter', function(data, responseCallback) {
        var shareparameterdic = getshareparpmeter();
        responseCallback(shareparameterdic);
    })
    // 如果要有其他Native 调用的js 功能，在这里按照上面的格式添加。

}

connectIosWebViewJavascriptBridge(function(bridge) {
    registernativetojs(bridge);//注册native要调用js的方法
    bridge.init();
});
connectWebViewJavascriptBridge(function(bridge) {
    registernativetojs(bridge);//注册native要调用js的方法
    bridge.init();
});



//----------------原产优品------------------------
//商品详情评价内跳转个人主页
//点击事件 js向原生发送参数
function sendToNativeUid(_this) {
    var uid = _this.attr("uid"),mobile = _this.attr("mobile");
    window.WebViewJavascriptBridge.callHandler("turn",{"uid":uid,"mobile":mobile},function(responseData){
        console.log(responseData);
    })
}

//跳转商品详情
//点击事件 js向原生发送参数
//  参数 商品id pid     是否是从品牌馆跳转 isPPG 100 是 101 否
function sendToNative(_this,isPPG) {
    var pid = _this.attr("pid");
    window.WebViewJavascriptBridge.callHandler("ycturndetail",{"pid":pid,"isPPG":isPPG},function(responseData){
        console.log(responseData);
    })
}

//跳转定制生活商品详情
function clturndetail(url) {
    window.WebViewJavascriptBridge.callHandler("clturndetail",{"url":url},function(responseData){
        console.log(responseData);
    })
}

//跳转馆 app内需要隐藏搜索图标
function jumpToGuan(){
    window.WebViewJavascriptBridge.callHandler("jumpToGuan",{},function(responseData){
        console.log(responseData);
    })
}

//馆分享 品牌馆 主题馆 社长优选
function guanShare(guanObj){
    window.WebViewJavascriptBridge.callHandler("guanShare",
        guanObj,
        function(responseData){
        console.log(responseData);
    })
}



//----------------------周边商家-----------------------
//跳转全部评价页面
function nearbyAllCommend(){
    window.WebViewJavascriptBridge.callHandler("nearbyAllCommend",{},function(responseData){
        console.log(responseData);
    })
}

//跳转个人主页
function nearbyPersonal(_this){
    window.WebViewJavascriptBridge.callHandler(
        "nearbyPersonal",
        {"uid":_this.attr("uid"),"mobile":_this.attr("mobile")},
        function(responseData){
            console.log(responseData);
    })
}

//评价成功
function nearbySubSuccess(){
    window.WebViewJavascriptBridge.callHandler(
        "nearbySubSuccess",
        {},
        function(responseData){
            console.log(responseData);
        })
}

//给ios传递页面高度
function nearbyViewHeight(){
    var height = document.body.offsetHeight;
    window.WebViewJavascriptBridge.callHandler(
        "nearbyViewHeight",
        {"height":height},
        function(responseData){
            console.log(responseData);
        })
}

//------------------搜索页面--------------------------
function searchJumpTo(info){
    window.WebViewJavascriptBridge.callHandler(
        "searchJumpTo",info,
        function(responseData){
            console.log(responseData);
        })
}

//-----------------社长申请开通保险收益人---------------
function insuranceApplyShare(url){
    window.WebViewJavascriptBridge.callHandler(
        "insuranceApplyShare",url,
        function(responseData){
            console.log(responseData);
        })
}
//-----------------保险列表跳转详情---------------
function toInsuranceDetail(url){
    window.WebViewJavascriptBridge.callHandler(
        "toInsuranceDetail",url,
        function(responseData){
            console.log(responseData);
        })
}

//------------------保险订单页面-----------------------
//返回原生界面
function insuranceOrderBack(){
    window.WebViewJavascriptBridge.callHandler(
        "insuranceOrderBack","",
        function(responseData){
            console.log(responseData);
        })
}

//跳转订单详情
function toInsuranceOrderDetail(url){
    window.WebViewJavascriptBridge.callHandler(
        "toInsuranceOrderDetail",url,
        function(responseData){
            console.log(responseData);
        })
}

//------------------返回原生界面-----------------------
function backmyvc(){
    window.WebViewJavascriptBridge.callHandler(
        "backmyvc",{data:123},
        function(responseData){
            console.log(responseData);
        })
}

//--------------------定制生活---------------------------------
//------------------定制生活列表-----------------------
function cllist(data){
    window.WebViewJavascriptBridge.callHandler(
        "cllist",data,
        function(responseData){
            console.log(responseData);
        })
}

//------------------定制生活详情-----------------------
function cldetail(data,responseCallback){
    window.WebViewJavascriptBridge.callHandler(
        "cldetail",data,responseCallback)
}

//------------------定制生活订单相关-----------------------
function clorderlist(data,responseCallback){
    window.WebViewJavascriptBridge.callHandler(
        "clorderlist",data,responseCallback)
}


//------------------自提订单相关-----------------------
function zitiorder(data,responseCallback){
    window.WebViewJavascriptBridge.callHandler(
        "zitiorder",data,responseCallback)
}

//------------------首页预留位置webview相关-----------------------

function homePageclick(data,responseCallback) {
    window.WebViewJavascriptBridge.callHandler(
        "homePageclick",data,responseCallback)
}

//------------------APP内嵌活动页交互相关-----------------------

function mutualAction(data,responseCallback) {
    window.WebViewJavascriptBridge.callHandler(
        "mutualAction",data,responseCallback)
}

//------------------跳转至原产优品订单列表页-----------------------
function tonativeorderlist(title){
    window.WebViewJavascriptBridge.callHandler(
        "tonativeorderlist",
        function(responseData){
            console.log(responseData);
        })
}

//------------------动态改变APP中浏览器标题的交互事件-----------------------
function changeAPPwebtitle(data,responseCallback){
    window.WebViewJavascriptBridge.callHandler(
        "changeAPPwebtitle",data,responseCallback)
}

//------------------通知原生APP跳转至搜索页面的交互事件-----------------------
function jumptosearchpage(data,responseCallback){
    window.WebViewJavascriptBridge.callHandler(
        "jumptosearchpage",data,responseCallback)
}
