/**
 * Created by hasee on 2016/10/14.
 */


//解析app传入参数方法
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//substr设置为1是为了把其中的?给去掉
    if(r!=null)return  r[2]; return null;
}

//获取hash
function getUrlHash(name){
    var reg = new RegExp( "(^|&)"+ name +"=([^&]*)(&|$)");
    var hash=location.hash.substr(1).match(reg);
    if(hash!=null)return  hash[2]; return null;
}

//获取唯一路径名称
function getOnlyPath(){
    var str = window.location.pathname.split("/");
    return str = str[str.length-2]+location.search+"Url";
}


//删除url参数
function funcUrlDel(name) {
    var loca = window.location,baseUrl = loca.origin + loca.pathname + "?",query = loca.search.substr(1);
    if(query.indexOf(name) > -1) {
        var obj = {},arr = query.split("&");
        for(var i = 0; i < arr.length; i++) {arr[i] = arr[i].split("=");obj[arr[i][0]] = arr[i][1];}
        delete obj[name];var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
        return url
    }else {
        return location.href
    }
}

//类型对象 用于下单时验证商品是否失效 及设置订单标识orderType
var typeObj={
    native:4,       //原产优品
    groupBuy:2,      //拼团
    customLife:6      //定制生活
};

//支付方式
var payTypeSign={
    zfb:1,      //支付宝
    wx:2        //微信
};


//------------------------------设置vid-----------------------------------
if(!sessionStorage.getItem("vid")){         //未设置缓存vid
    GetQueryString("vid")?      //存在社区属性
        sessionStorage.setItem("vid",GetQueryString("vid"))      //设置原产优品下单vid
        :sessionStorage.setItem("vid","-99");      //设置默认vid
}


//------------------------------设置uid-----------------------------------
var UID= "";
if(localStorage.getItem("userAppInfo")){    //获取用户的uid
    UID= JSON.parse(localStorage.getItem("userAppInfo")).uid
}


//公共方法

//------------------------------在HTML页面动态引入CSS文件和JS文件-----------------------------------

var dynamicLoading = {
    css: function(path){
        if(!path || path.length === 0){
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function(path){
        if(!path || path.length === 0){
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
};

//动态引入加载样式和js loader.min.css 以及 loader.css.js
// dynamicLoading.css(publicUrl+"libs/loader/loaders.min.css");
// dynamicLoading.js(publicUrl+"libs/loader/loaders.css.js");


//判断环境及登录状态
function isLogin(UID,loginFun){


    if(isWeiXin()){     //微信内置浏览器
        if(UID){   loginFun();                       //本地有缓存信息
        }
        else {     //本地没有缓存openid
            location.replace(jumpUrl.shouQuan);    //跳转授权链接
        }
    }
    else{
        if(UID){     loginFun();                     //本地有缓存信息
        }else {     //本地没有缓存openid
            location.href = jumpUrl.login;    //跳转登录链接
        }
    }
}


//判断页面的不同运行环境(微信QQ微博等，以做分享参数不同等区分) 注意此处判断运行环境的代码最好设置为通过函数方法返回，如果在初始化该js文件时就直接进行判断，则在部分安卓手机上无法获取该值
function getcurrentplatform() {
    var browser = {

        versions: function () {

            var u = navigator.userAgent, app = navigator.appVersion;

            return {         //移动终端浏览器版本信息

                trident: u.indexOf('Trident') > -1, //IE内核

                presto: u.indexOf('Presto') > -1, //opera内核

                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核

                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核

                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端

                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端

                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器

                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器

                iPad: u.indexOf('iPad') > -1, //是否iPad

                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部

            };

        }(),

        language: (navigator.browserLanguage || navigator.language).toLowerCase()

    };

    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象

    var currentplatform = {
        wx: ua.match(/MicroMessenger/i) == "micromessenger",//微信平台
        sina:ua.match(/WeiBo/i) == "weibo",//在新浪微博客户端打开
        QQ:ua.match(/QQ/i) == "qq",//在QQ中打开
        iosbrowser:browser.versions.ios,//在IOS浏览器打开
        androidbrowser:browser.versions.android,//在安卓浏览器打开
        PC:!browser.versions.mobile
    };
    return currentplatform;

}

//在页面加载前就直接使用一个全局变量判断当前的运行环境,如果是APP则全局变量ifApp == true,否则为false
var currentplatform = getcurrentplatform();
var ifApp = currentplatform.wx || currentplatform.QQ||currentplatform.sina || currentplatform.PC ? false :true;
var ifopenApp = false;//默认为没有打开App区域
//因为默认的body的padding-top为4.4rem,故这里设置如果为APP环境则padding-top为0
if (ifApp){
    $('body').css({
        "padding-top":"0px",
    });
}
/*wab中该链接是否为分享的链接 分享的链接才有打开App区域*/
else{
    ifopenApp = GetQueryString("isShare")==1 ? true : false;
}

console.log(ifApp ? "当前环境为:APP环境" : ifopenApp ? "当前环境为:wab站分享链接环境"  :"当前环境为:wab站非分享链接环境");


//设置本地用户信息
function setUserInfo(data,completeUrl){
    var appUser = data.resultdata.appUser,
        userInfo ={
            uid:appUser.uid,            //app的uid
            username:appUser.username,  //app的昵称
            avatar:appUser.avatar,         //app的头像
            mobile:appUser.mobile,       //app的手机号
            frontcover:appUser.frontcover       //app的封面
        };
    localStorage.setItem("userAppInfo",JSON.stringify(userInfo));

    completeUrl?
        location.replace(completeUrl)          //返回登录前页面
        :location.replace(jumpUrl.find);        //返回原产优品首页
}


//-------------------------------------ajax全局设置--------------------------------------------
$.ajaxSetup({
    type:"POST",
    beforeSend: function () {
        var wait = $(".wait");
        if(wait.length == 0){        //不存在加载中的提示
            $("body").append("<div class='wait'>加载中</div>");
        }
    },
    complete: function () {
        $(".wait").remove()
    },
    error:function(msg){console.log(msg.statusText)}
});
//防止重复提交
var pendingRequests = {};
$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    var key = options.url;
    console.log(key);
    if (!pendingRequests[key]) {
        pendingRequests[key] = jqXHR;
    }else{
        jqXHR.abort();    //放弃后触发的提交
        //pendingRequests[key].abort();   // 放弃先触发的提交
    }

    var complete = options.complete;
    options.complete = function(jqXHR, textStatus) {
        pendingRequests[key] = null;
        if ($.isFunction(complete)) {
            complete.apply(this, arguments);
        }
    };
});

//------------------------------微信注入权限 设置分享效果-----------------------------------

//设置微信分享效果
if(isWeiXin()) {
    //设置分享链接
    var shareUrl = "",       //链接携带参数时 用&连接 不携带参数用？
        search = location.search,       //?号之后的内容
        locaHref = funcUrlDel("code"),          //除去code的链接
        isShare = GetQueryString("isShare"),vid= GetQueryString("vid");
    if(location.hash){      //有hash 参数添加在hash前面
        if(isShare){     //已经分享过的链接不需要加isShare及vid参数
            shareUrl = location.href
        }else{
            //没有iShare参数
            if(vid){    //有vid参数
                search.length > 0 ?
                    shareUrl = locaHref.substr(0,locaHref.indexOf("#")) + "&isShare=1"+location.hash
                    :shareUrl = locaHref.substr(0,locaHref.indexOf("#")) + "?isShare=1"+location.hash
            }else {     //没有vid参数
                search.length > 0 ?
                    shareUrl = locaHref.substr(0,locaHref.indexOf("#")) + "&isShare=1&vid="+sessionStorage.getItem("vid")+location.hash
                    :shareUrl = locaHref.substr(0,locaHref.indexOf("#")) + "?isShare=1&vid="+sessionStorage.getItem("vid")+location.hash
            }
        }
    }
    else {     //没有hash

        if(isShare){    //已经分享过的链接不需要加isShare参数
            shareUrl = location.href
        }else {
            if(vid){
                search.length > 0 ? shareUrl = locaHref + "&isShare=1" : shareUrl = locaHref + "?isShare=1";
            }else {
                search.length > 0 ? shareUrl = locaHref + "&isShare=1&vid="+sessionStorage.getItem("vid")
                    : shareUrl = locaHref + "?isShare=1&vid="+sessionStorage.getItem("vid");
            }

        }
    }

    //注入权限  如果其他单独的页面需要单独设置分享参数的时候则在各个页面进行设置覆盖即可
    wXConfig("",shareUrl);
}


//注入权限 现分为两种调用方式
// 1.在进入页面的时候就调用 分享参数不需要动态获取
// 2.在获取到分享数据后再调用 分享参数需要动态获取(后者直接覆盖wXConfig方法即可)
// shareInfoObj 为分享参数（title desc imgUrl） shareUrl 分享链接
function wXConfig(shareInfoObj){
    //获取微信注入权限
    var jsApiListArr = ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "chooseWXPay"];

    $.ajax({
        url:getJsSdkSignatureUrl,       //获取微信签名等
        data: getAuth()+"info={url:'" + encodeURIComponent(location.href) + "'}",
        success: function(data) {
            var config = data.config;
            if(data.errCode == 0){

                //注入权限
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: config.appId, // 必填，公众号的唯一标识
                    timestamp: config.timestamp, // 必填，生成签名的时间戳
                    nonceStr: config.nonceStr, // 必填，生成签名的随机串
                    signature: config.signature, // 必填，签名，见附录1
                    jsApiList: jsApiListArr // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });

                //注入完成
                wx.ready(function () {
                    var shareInfo;

                    if(shareInfoObj){      //存在shareInfo(明星社长 艺术馆 拍卖等)
                        shareInfo = {     //默认分享设置
                            title: shareInfoObj.title || "超级社区", // 分享标题
                            desc: shareInfoObj.desc || "超级社区", // 分享描述
                            link: shareUrl || location.href, // 分享链接
                            imgUrl: shareInfoObj.imgUrl || publicUrl + "public/images/base/logo.png", // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                mainTip("分享成功");
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                mainTip("您取消了分享");

                            }
                        };
                    }
                    else{
                        shareInfo = {     //默认分享设置
                            title: document.title, // 分享标题
                            desc: location.href, // 分享描述
                            link: shareUrl, // 分享链接
                            imgUrl: publicUrl + "public/images/base/logo.png", // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        };
                        //除了明星社长外wap站页面分享设置
                        var pathName = location.pathname;
                        if(pathName.indexOf("products") > 0 || pathName.indexOf("theme") > 0 ||
                            pathName.indexOf("brand") > 0 || pathName.indexOf("comShop") > 0 ||
                            pathName.indexOf("activity") > 0){
                            shareInfo.title = sessionStorage.getItem("title"); // 分享标题
                            shareInfo.imgUrl = imgIndexUrl+sessionStorage.getItem("asmian") ;// 分享图标
                            if(pathName.indexOf("products") > 0 ){
                                if(pathName.indexOf("clDetail") > 0 ){
                                    //定制生活商品详情分享设置
                                    shareInfo.title = "【定制生活】新的姿态";
                                    shareInfo.desc = " 一人下单，全家私享；一次下单，全年配送。定制生活，与众不同！"; // 分享描述
                                }else {
                                    //商品详情分享设置
                                    shareInfo.desc = "我在超级社区发现了一个不错的商品，快来看看吧！..."; // 分享描述
                                }

                            }else if(pathName.indexOf("theme") > 0 ){
                                //主题馆分享设置
                                shareInfo.desc ="我在超级社区主题馆发现了很不错的商品，快来看看吧。";// 分享描述
                            }else if(pathName.indexOf("brand") > 0 ){
                                //品牌馆分享设置
                                shareInfo.desc ="我在超级社区品牌馆发现了很不错的商品，快来看看吧。";// 分享描述
                            }else if(pathName.indexOf("comShop") > 0){
                                //社长优选分享设置
                                var groupVidName = getGroupVidName(sessionStorage.getItem("vid"));
                                if( groupVidName.lastIndexOf("-") >0){          //社区名称包含 "-"
                                    groupVidName = groupVidName.substring(groupVidName.lastIndexOf("-")+1)
                                }
                                shareInfo.title = "超级社区[原产优品]";
                                shareInfo.desc =groupVidName+" “社长优选”为您精心挑选了这些商品，快来看看吧！";// 分享描述
                            }else if(pathName.indexOf("activity") > 0){
                                //快乐活动分享设置
                                shareInfo.desc ="我在超级社区发现了一个不错的活动，大家一起参加吧！";// 分享描述
                            }
                        }else if(pathName.indexOf("groupList") > 0){
                            //拼团列表分享设置
                            shareInfo.imgUrl = publicUrl+ "public/images/base/groupBuyLogo.png";  // 分享图标
                            shareInfo.desc ="我在超级社区"+sessionStorage.getItem("groupVidName")+"发现了很不错的拼团商品，快来一起拼吧。" ;  // 分享描述

                        }else if(pathName.indexOf("find") > 0){
                            //原产优品分享设置
                            shareInfo.imgUrl = publicUrl+ "public/images/base/nativeLogo.png";  // 分享图标
                            shareInfo.desc ="我在超级社区原产优品发现了很不错的商品，快来看看吧。";// 分享描述
                        }else if(pathName.indexOf("customLife") > 0){
                            //定制生活分享设置
                            shareInfo.title = "【定制生活】新的姿态";
                            shareInfo.imgUrl = publicUrl+ "public/images/base/customLife.png";  // 分享图标
                            shareInfo.desc =" 一人下单，全家私享；一次下单，全年配送。定制生活，与众不同！";// 分享描述
                        }else if(pathName.indexOf("fetch") > 0){
                            //自提点管理分享设置
                            shareInfo.title = "自提订单管理功能";
                            shareInfo.imgUrl = publicUrl+ "public/images/base/customLife.png";  // 分享图标
                            shareInfo.desc =" 登录后，可处理您自提点内的订单，请勿分享给其他人！";// 分享描述
                            shareInfo.link =jumpUrl.fetchLogin+GetQueryString("fetchid");// 分享链接
                        }
                    }


                    console.log('分享的内容为:' + JSON.stringify(shareInfo));

                    //分享给好友
                    wx.onMenuShareAppMessage(shareInfo);
                    //分享到朋友圈
                    wx.onMenuShareTimeline(shareInfo);
                    //分享到QQ
                    wx.onMenuShareQQ(shareInfo);
                    //分享到微博
                    wx.onMenuShareWeibo(shareInfo);
                    //分享到qq空间
                    wx.onMenuShareQZone(shareInfo);

                });

                //注入权限错误
                wx.error(function (res) {
                    console.log(res.errMsg);
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，
                    //具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                    if (res.errMsg == "config:invalid signature") {     //签名错误
                        $.ajax({
                            url:checkAccessTokenUrl,        //检查token
                            data:getAuth()+"info={accessToken:'"+config.access_token+"'}",
                            success:function(data){
                                if(data.errCode == 0){  //0未失效

                                }else if(data.errCode == 2){    //2更新token成功
                                    return wXConfig(jsApiListArr,shareUrl)
                                }else {
                                    tip(data.msg)
                                }
                            }
                        })
                    }
                });
            }
            else {
                tip(data.msg);
            }
        }
    });
}




//------------------------------信息提示效果-----------------------------------
//显示主要提示
function mainTip(msg){
    $("body").append("<div class='mainTip hide'>"+msg+"</div>");
    var mainTip = $(".mainTip");

    mainTip.fadeIn();   //显示提示消息
    setTimeout(function(){
        mainTip.fadeOut(300,function(){
            mainTip.remove()
        })
    },800);

}

//显示收藏或者关注的提示
function tip(msg){
    $("body").append("<div class='tip hide'>"+msg+"</div>");
    var tip = $(".tip");

    tip.fadeIn();   //显示提示消息
    setTimeout(function(){
        tip.fadeOut(300,function(){
            tip.remove()
        })
    },800);
}

//长时间显示主要提示
function longmainTip(msg){
    $("body").append("<div class='longmainTip hide'>"+msg+"</div>");
    var longmainTip = $(".longmainTip");

    longmainTip.fadeIn();   //显示提示消息
    setTimeout(function(){
        longmainTip.fadeOut(300,function(){
            longmainTip.remove()
        })
    },3000);

}



//一个按钮的提示框
function oneBtnTip(confirmObj) {
    confirmObj.btnName = confirmObj.btnName || "确定";
    $("body").append("<div class='oneBtnMask '>"+
        "<div class = 'oneBtnTip grey6 t_center'><h3 class = 'f17 red' >"+confirmObj.title+"</h3>"+
        "<div class = 'inner f14'>"+confirmObj.content+"</div>"+
        "<div class = 'bot f17 t_center'>"+confirmObj.btnName+"</div></div></div>");

    var oneBtnMask = $(".oneBtnMask"),h3=$(".oneBtnMask h3"),
        oneBtnTip = $(".oneBtnTip"), inner = $(".oneBtnTip .inner"),
        btn = $(".oneBtnMask .bot");


    oneBtnMask.click(function(){      //点击遮罩层删除遮罩层
        oneBtnMask.remove();
    });

    btn.click(function(e){e.stopPropagation()});

    //取消事件
    btn.click(function(){
        try{
            confirmObj.cancel();        //执行指定取消事件
            confirmObj.cancel();        //执行指定取消事件
            oneBtnMask.remove();
        }catch(e) {
            //没有取消事件 默认删除遮罩层
            oneBtnMask.remove();
        }
    }) ;

}

//二次确认
function confirmShow(confirmObj) {
    var disabled = "";
    if(confirmObj.disabled === false){disabled = "disabled"}
    //设置确认按钮文案
    confirmObj.makeSureBtn = confirmObj.makeSureBtn || "确认";
    $("body").append("<div class='confirmMarsk '>"+
        "<div class = 'confirm grey6 t_center'><h3 class = 'f17 red' >"+confirmObj.title+"</h3>"+
        "<div class = 'inner f14'>"+confirmObj.content+"</div>"+
        "<div class = 'bot f17'><span class = 'cancel'>取消 </span><span class='makeSure "+disabled+"'>"+confirmObj.makeSureBtn+"</span></div></div></div>");

    var confirmMarsk = $(".confirmMarsk"),confirm = $(".confirm"),
        cancel = $(".confirmMarsk .cancel"), makeSure = $(".confirmMarsk .makeSure");

    confirmMarsk.click(function(){      //点击遮罩层删除遮罩层,并且增加调用取消事件
        try{        //执行指定取消事件
            confirmObj.cancel();
            confirmMarsk.remove();
        }catch(e) {         //没有取消事件 默认删除遮罩层
            confirmMarsk.remove();
        }
    });

    confirm.click(function(e){e.stopPropagation()});

    //取消事件
    cancel.click(function(){
        try{        //执行指定取消事件
            confirmObj.cancel();
            confirmMarsk.remove();
        }catch(e) {         //没有取消事件 默认删除遮罩层
            confirmMarsk.remove();
        }
    }) ;
    //确认事件
    makeSure.click(function(){
        if(!makeSure.hasClass("disabled")){       //确认按钮未被禁止点击
            confirmObj.makeSure(makeSure);
            confirmMarsk.remove();
        }
    });
}

//-----------------------------收藏和关注--------------------------------

//  haveCalss 判断是否有需要的ClassName
//  html    没有收藏或关注的html
//  actHtml 已经关注的html
//  idKey   接口需要的参数Key
//  idVal   参数key的值
//  uid     用户id
function shouCangAction(_this,haveCalss,html,actHtml,idKey,idVal,UID){

    var shouCangType =2; //1 没有收藏-收藏    2 已经收藏-取消收藏
    //判断当前收藏状态
    if(!_this.hasClass(haveCalss)){shouCangType =1}

    $.ajax({
        url:shouCangUrl,
        data:getAuth()+"info={uid:'"+UID+"',type:'"+shouCangType+"',"+idKey+":'"+idVal+"'}",
        success:function(data){
            if(data.errCode == 0){    //收藏成功
                shouCangType==2?
                    _this.html(html).removeClass(haveCalss)  //改变样式
                    :_this.html(actHtml).addClass(haveCalss);  //改变样式
            }
            tip(data.msg);      //显示提示消息
        }
    })

}


//  haveCalss 判断是否有需要的ClassName
//  html    没有收藏或关注的html
//  actHtml 已经关注的html
//  idKey   接口需要的参数Key
//  idVal   参数key的值
//  uid     用户id
//  numDom  需要更换关注人数的dom
//  type    需要在关注dom上显示关注人数 1 不需要 0
function guanZhuAction(_this,haveCalss,html,actHtml,idVal,UID,numDom,type){

    //1 没有关注-关注    2 已经关注-取消关注
    var guanZhuType=2,num = numDom.html();
    if(_this.hasClass(haveCalss)){num--}
    else{guanZhuType=1;num++;}

    //已经关注
    $.ajax({
        url: guanZhuUrl,
        data:getAuth()+"info={uid:'"+UID+"',type:'"+guanZhuType+"',id:'"+idVal+"'}",
        success: function (data) {
            if(data.errCode == 0){          //关注成功
                numDom.html(num);    //更改关注人数
                if(guanZhuType==2){
                    (type == 0) ?
                        _this.removeClass(haveCalss).html(html)     //改变样式
                        :_this.removeClass(haveCalss);              //改变样式
                }else {
                    (type == 0) ?
                        _this.addClass(haveCalss).html(actHtml)     //改变样式
                        :_this.addClass(haveCalss);              //改变样式
                }

            }
            tip(data.msg);      //显示提示消息
        }
    });

}




//-------------------------------------安全验证--------------------------------------------
function getAuth(){
    var date = new Date(), encrypt = new JSEncrypt();
    var auth={
        app_key	:123456,
        imei:"",
        os:"H5",
        os_version:"",
        app_version	:"1.2.4",
        ver:"",
        uid	:UID,
        crc	:	"",
        appid:"SuperUserClientApp"
    };

    auth.time_stamp =date.getFullYear()+""+(date.getMonth()+1)+(date.getDate()+(date.getHours()>9?'':'0'))+
        (date.getHours()+(date.getMinutes()>9?'':'0'))+(date.getMinutes()+(date.getSeconds()>9?'':'0'))+date.getSeconds();

    encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDho4LGayB+hwx0kmbLLncXD2YcM0tspvnKIN1ygmGK7JZ1Uop/pkehNqQu95o6EqeTq+Z2+Klca+BmacRjhOm+9ORUkv7Em1eS92iFIVVJvOIC2mfmTvwmw5ESFoMZdaJsUDlM2sKTKPPUAQDplwYYaPKxl8J9D/ahfq+Uper+GwIDAQAB");
    var signature = encrypt.encrypt(auth.app_version+"&"+auth.appid+"&"+auth.time_stamp);
    auth.signature=BASE64.encoder(signature);

    auth = "auth="+JSON.stringify(auth)+"&";
    return auth
}

//-------------------------------------判断登录环境--------------------------------------------
//判断是否微信登陆
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
//判断是否ios QQ登陆
function isQQInIos() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/qq\//i) == "qq/" && /(iphone|ipad|ipod|ios)/i.test(ua) ){
        return true;
    } else {
        return false;
    }
}

//-------------------------------------获取社区名称--------------------------------------------
//获取社区名称
//groupVid  社区id
//clear 是否需要清除缓存社区名 1 需要
function getGroupVidName(groupVid,clear){

    if(clear == 1){
        sessionStorage.removeItem("groupVidName")
    }

    //获取缓存的社区名称
    var groupVidName = sessionStorage.getItem("groupVidName");

    if(!groupVidName){      //没有缓存社区名称
        $.ajax({
            url:selectVillageNameUrl,
            async:false,
            data:getAuth()+"info={vid:'"+groupVid+"'}",
            success:function(data){
                if(data.errCode==0){
                    sessionStorage.setItem("groupVidName",data.resultdata.village.name);    //缓存社区名称
                    groupVidName = data.resultdata.village.name;
                }else {
                    tip(data.msg)
                }
            }
        });
    }
    return groupVidName
}


//-------------------------------------打开app区块展示及操作(只有分享出去的页面才会有,wab商城自己的页面没有该区块)--------------------------------------------
//firstDom 立即打开下面第一个板块 一般为header
//secondDom 立即打开下面第二个板块 一般是主要内容 scroll 或者导航 nav
//thirdDom 立即打开下面第三个板块 一般是主要内容 scroll
//不传入参数 适用于没有导航栏及内容不定位的页面（活动详情页）
function openApp(firstDom,secondDom,thirdDom){
    if(GetQueryString("isShare")==1){       //是分享的页面
        var config = {
            /*scheme:必须*/
            scheme: "cjsqapp://mycjsq.app/",
            download_url: "http://a.app.qq.com/o/simple.jsp?pkgname=com.lcworld.intelligentCommunity"
        };

        var openWrap = "<div class='openWrap'>" +
            "<img src='"+publicUrl+"public/images/base/logo2.png' class='logo'>" +
            "<img class='slideUp' src='"+publicUrl+"public/images/base/slideUp.png'>" +
            "<p>超级社区</p><p>超级方便</p>" +
            "<a href='"+config.scheme+"' class='t_center'>立即打开</a></div>";

        if(firstDom){
            firstDom.before(openWrap).css({"top":"4.4rem","transition":"0.3s"});
            if(secondDom){
                secondDom.css({"top":"8.8rem","transition":"0.3s"});
            }

            if(thirdDom){
                thirdDom.css({"top":"13.2rem","transition":"0.3s"});
            }
        }
        else {
            $("body").append(openWrap);
            $(".openWrap").css("z-index","10")
        }


        //点击收起效果
        $(".openWrap .slideUp").click(function(){
            if(firstDom){
                firstDom.css("top","");
                if(secondDom){
                    secondDom.css("top","");
                }
                if(thirdDom){
                    thirdDom.css("top","");
                }
            }else {
                $(this).parent().slideToggle();
            }

        });
        //立即打开
        $(".openWrap a").click(function(){

            if(isWeiXin()){
                //若在ios微信端打开   显示遮罩层 提示在浏览器内打开
                $("body").append("<div class='openMask'></div>");
                $(".openMask").click(function(){
                    $(this).remove()
                })

            }
            else {
                //启动应用
                //location.href = config.scheme;
                setTimeout(function(){
                    location.href = config.download_url
                },2000)
            }

        })
    }

}



//-----------------------------------------上拉加载----------------------------
//获取滚动条当前的位置
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

//获取当前可视范围的高度
function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    }else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}

//获取文档完整的高度
function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

//--------------------------------------插入提示---------------------------
//插入没有数据图片
function appendNoDataImg(parentDom){
    if(parentDom.children(".noData").length == 0){
        parentDom.append("<div class='noData'><img src='"+jumpUrl.noData+"'></div>")
    }
}
//插入没有数据提示
function appendNoDataMsg(parentDom,msg){
    msg = msg || "没有更多数据咯~";
    if(parentDom.children(".noData").length == 0){
        parentDom.append("<div class='noData'><p>"+msg+"</p></div>")
    }
}



//-----------------------------支付调用--------------------------------

//payType 支付方式 1支付宝 2微信
//orderNum 订单编号
//title 标题
//money 金额 微信以分为单位
//orderType 和typeObj保持一致 2拼团 4原产优品 6定制订单类型
function payFor(payType,orderNum,title,money,_this,orderType){
    //type 1拼团 2周边商家 4商品池 5原产优品 6定制订单类型
    //toUrl 支付完成后跳转页面
    //return_url 支付宝支付完成后跳转验签链接
    //modifyType 1周边商家 2商品池 3原产地精选 4拼团管理 5定制生活订单
    var type="",toUrl,return_url,modifyType;
    if(orderType ==typeObj.native){
        type = 5;modifyType=3;
        return_url = jumpUrl.pay+"?type="+typeObj.native;
        toUrl = jumpUrl.orderList;              //支付完成跳转订单列表
    }else if(orderType ==typeObj.groupBuy) {
        type = 1;modifyType=4;
        return_url = jumpUrl.pay+"?type="+typeObj.groupBuy;
        toUrl = jumpUrl.orderList.split("#")[0]+"#type=3&status=3";         //拼团支付完成跳转至拼团待发货状态
    }else if(orderType ==typeObj.customLife){   //定制生活
        type = 6;modifyType=5;
        return_url = jumpUrl.pay+"?type="+typeObj.customLife;
        toUrl = jumpUrl.clOrderList;            //定制生活支付完成跳转定制生活订单列表
    }

    if(isWeiXin()){
        //在微信内
        money = Math.round(money* 100);      //微信支付金额以分为单位
        if( modifyPayType(payType,UID,modifyType,orderNum,payTypeSign.wx)){

            //支付方式正确或者修改成功后调起微信支付

            $.ajax({
                url:wXgetSignDataUrl,
                data:getAuth()+"info={orderNum:'"+orderNum+"',title:'"+title+"',money:'"+money+"',openid:'"+JSON.parse(localStorage.getItem("wXAppInfo")).openid+"',type:'"+type+"'}",
                success:function (data){
                    if(data.errCode == 0){
                        //请求成功
                        var config = data.resultdata.config;

                        wx.chooseWXPay({
                            timestamp: config.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: config.noncestr, // 支付签名随机串，不长于 32 位
                            package: config.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                            signType: config.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: config.paySign, // 支付签名
                            success: function (res) {
                                // 支付成功后的回调函数
                                if(location.pathname.indexOf("orderList")== -1){        //不在订单列表页面
                                    location.href = toUrl;           //跳转订单页面
                                }else {                         //在订单列表页面
                                    location.reload();           //刷新页面
                                }
                            },
                            cancel:function(){
                                // 支付取消后
                                if(location.pathname.indexOf("orderList")== -1 || location.pathname.indexOf("clOrderList")== -1){        //不在订单页面
                                    //mainTip(orderType);
                                    if(orderType ==typeObj.customLife){
                                        location.href = jumpUrl.clOrderList;           //跳转定制生活订单首页
                                    }else {
                                        location.href = jumpUrl.orderList;           //跳转订单首页
                                    }
                                }else {                         //在订单列表页面
                                    location.reload();           //刷新页面
                                }

                            },
                            fail:function(res){
                                mainTip("支付失败");
                                console.log(res);
                                //解开按钮点击
                                _this.attr("disabled",false);
                            }
                        });
                    }
                    else {
                        //解开按钮点击
                        _this.attr("disabled",false);
                    }

                }
            });
        }
    }
    else {
        //在QQ及浏览器内
        if( modifyPayType(payType,UID,modifyType,orderNum,payTypeSign.zfb)){
            //支付方式正确或者修改成功后调起支付宝支付

            $.ajax({
                url:getSignDataUrl,
                data:getAuth()+"info={orderNum:'"+orderNum+"',title:'"+title+"',money:'"+money+"',return_url:'"+return_url+"',type:'"+type+"'}",
                success:function(data){
                    if(data.errCode == 0){      //请求成功
                        location.replace(data.resultdata.getUrl)
                    }else {
                        mainTip(data.msg);
                    }
                }
            })
        }
    }
}

//判断并修改支付方式
//payType 原支付方式
//modifyType 1周边商家 2商品池 3原产地精选 4拼团管理
//orderNum 订单号
//payTypeSign 支付标识 1支付宝 2微信
function modifyPayType(payType,UID,modifyType,orderNum,payTypeSign){
    var flag=false;
    if(payType != payTypeSign){
        //原支付方式不为现环境下所需支付方式 需要修改支付方式
        $.ajax({
            url:modifyPayTypeUrl,
            data:getAuth(UID)+"info={uid:'"+UID+"',type:'"+modifyType+"',orderNum:'"+orderNum+"',payType:'"+payTypeSign+"'}",
            async:false,
            success:function(data){
                if(data.errCode == 0){
                    flag = true
                }else {
                    tip(data.msg)
                }
            }
        });
    }
    else {
        flag = true
    }
    return flag
}


//为了解决在安卓机上出现的fixed布局或者absolute布局在键盘弹出的时候布局错位的问题,使用监听键盘是否弹出的方式来设置fixed或者absolute布局的定位模式,注意应该是在页面结构加载完毕之后进行监听
$(function () {
    var winHeight = $(window).height();   //获取当前页面高度
    $(window).resize(function(){
        var thisHeight=$(this).height();
        if(winHeight - thisHeight >50){
            //当软键盘弹出，在这里面操作
            $(".shuoMing").hide();

        }else{
            //当软键盘收起，在此处操作
            $(".shuoMing").show();
        }
    });
})

//动态修改浏览器的标题
function changewebtitle(title) {

    var data = {"title":title};
    //和原生进行交互,让原生改变浏览器标题
    try {
        changeAPPwebtitle(data);
    }
    //如果是wab站环境则会走到catch方法中,使用wab站方式改变标题
    catch (exception) {
        console.log("向原生发送改变浏览器标题事件失败,改为使用wab站的方法来改变标题");

        //需要jQuery
        var $body = $('body');
        document.title = title;

        //微信wkwebview解决了标题改变的问题,待验证
        //hack在微信等webview中无法修改document.title的情况
        // var $iframe = $('<iframe></iframe>');
        // $iframe.on('load',function() {
        //     setTimeout(function() {
        //         $iframe.off('load').remove();
        //     }, 0);
        // }).appendTo($body);
    }

}


//工程中任何一处的促销标签返回 (在这里进行样式和图片文字的选择)
//参数为 ifcustomlist 是否是定制列表 True  False  促销字典promotionInfo 记录该商品的所有促销信息
//返回值为element 在各个用到的地方将元素添加到相应位置即可 样式放在各个地方进行判断
function returnpromotiontagstr(ifcustomlist,promotionInfo) {
    /*
    标签选择的概要逻辑:
    1.如果有促销信息(即促销状态为未开始或者正在进行中),则区分是定制列表还是其他(其他列表或者详情)选择是固定的定制列表背景还是从6种固定的标签背景中对应选择,然后选择对应的背景颜色
    2.其他情况(无促销信息或者促销已经结束)的时候不展示促销标签
    3.根据不同的促销类型设置不同的展示样式(文字在图片起点还是有一定的间距)
    4.具体的标签元素展示位置回归到各个js中进行元素的设置,为了各个js文件能找到对应的标签 规定定制列表的标签class为cllisttag 其他的类型class固定为pmtag
     */
    var elementstr = "";

    /*promotionInfo	促销信息 注意只有当商品促销还未开始和正在进行才有此字段 如果已经结束或者不是促销商品的话没有该字段
            promotionInfo 字典含义
            cid	促销id
            status	促销状态1未开始2促销中
            price	促销价
            pid	商品id
            ptype	商品类型4原产优品5定制商品
            title	促销商品名称
            tag	促销标签
            type	促销类型    1自定义2限时3折扣4特价5专享6买赠
            playbillImg	促销海报
            playbillDesc	海报文案
            userType	促销用户群1全部2新用户3老用户
            checkInvitationCode	1不限有无邀请码用户2仅限有邀请码用户
            startTime	促销开始时间
            endTime	促销结束时间(空代表永久)
            nowTime	系统当前时间*/

    //若有促销信息(即促销状态为未开始或者正在进行中),则从6种固定的标签背景中对应选择
    if (promotionInfo && JSON.stringify(promotionInfo) != '{}'){
        //促销标签背景图片类名 根据不同类型设置不同类名,在全局css文件中设置其对应的背景图片
        var pmtagclass = "";
        //促销标签
        var tagstr = promotionInfo.tag;//后台设置最多6个字
        //如果不存在促销标签则直接返回空字符串即可
        if (!tagstr || tagstr == ''){
            return elementstr;
        }

        //如果是定制列表,则展示固定的定制背景图片 如果是非定制列表,则根据促销类型选择不同的背景图片
        if (ifcustomlist){
            //由于界面要求,故这里设置根据不同的标签字数设置不同的字体大小和行高
            var aboutfontandpadding = tagstr.length > 4 ? " font-size: 1rem;" + " line-height:1.1rem;" +" padding:0.55rem 1.175rem 1rem 1.175rem;" :
                " font-size: 1.6rem;" + " line-height:1.6rem;" + " padding:0.5rem 0.5rem 1rem 0.5rem;"

            pmtagclass = "cllistpmtag";
            elementstr = "<span class='cllisttag "+pmtagclass+"' style='background-repeat: no-repeat;background-position: top left;background-size: 100% 100%;" + /*背景图片和样式*/
                aboutfontandpadding + /*定制标签中的文本行高以及文本大小*/
                " color:#ffffff;"+  /*定制标签中的文本颜色*/
                " width: 4.35rem;"+  /*定制标签的宽度,注意设置为inline-block宽度才起作用*/
                " height: 4.85rem;"+  /*定制标签的高度,注意设置为inline-block高度才起作用*/
                " box-sizing: border-box;-webkit-box-sizing: border-box;"+/*设置定制标签的宽高为包含边框和内边距*/
                " display:inline-block;"+
                " word-wrap: break-word;word-break:break-all;white-space: pre-wrap;" +  /*设置span强制转行*/
                " text-align: center;" +    /*设置文字居中显示*/
                " position: absolute; top: 0; right: 0;" + /*设置定制列表的标签位置*/
                "'>"+   //样式结束
                tagstr+
                "</span>";
        }
        //非定制列表(其他的列表或者详情)
        else{

            var backgroundcolor = "";
            switch (promotionInfo.type.toString()){
                //1自定义
                case "1":{

                    pmtagclass = "pmzidingyi";
                    elementstr =
                        "<span class='pmtag "+pmtagclass+"' style='background-repeat: no-repeat;background-position: top left;background-size: 100% 100%;" + /*背景图片和样式*/
                        " display:inline-block;"+/*解决部分安卓机的不居中问题*/
                        " text-align: center;" +  /*设置文字居左显示*/
                        " color:#ffffff;"+  /*自定义标签中的文本颜色*/
                        " font-size:1rem;"+  /*自定义标签的文本大小*/
                        " line-height:0;"+/*设置自定义标签的行高*/
                        " padding:0.75rem 2px;"+/*自定义标签内边距*/
                        "'>"+   //样式结束
                        tagstr+ //标签内容
                        "</span>";


                    return elementstr;

                }break;
                //2限时
                case "2":{
                    pmtagclass = "pmxianshi";
                    backgroundcolor = "#f22d7a";
                }break;
                //3折扣
                case "3":{
                    pmtagclass = "pmzhekou";
                    backgroundcolor = "#33a5e0";
                }break;
                //4特价
                case "4":{
                    pmtagclass = "pmtejia";
                    backgroundcolor = "#fd990b";
                }break;
                //5专享
                case "5":{
                    pmtagclass = "pmzhuanxiang";
                    backgroundcolor = "#66b706";

                }break;
                //6买赠
                case "6":{
                    pmtagclass = "pmmaizeng";
                    backgroundcolor = "#ff0000";
                }break;
                //7其他 带有圆弧角度的标签背景,放置在订单详情页中商品图片上面的标签 是一个单独的span标签带有背景图片
                case "7":{

                    pmtagclass = "iscircularpmtag";

                    elementstr =
                        "<span class='"+pmtagclass+"' style='background-repeat: no-repeat;background-position: top left;background-size: 100% 100%;position: absolute;left: 0;bottom: 0.5rem;padding: 2px;" + /*背景图片和样式*/
                        " display:inline-block;"+/*只有行块级元素padding和margin才起作用*/
                        " text-align: left;" +  /*设置文字居左显示*/
                        " color:#ffffff;"+  /*定制标签中的文本颜色*/
                        " font-size:1rem"+  /*定制标签的文本大小*/
                        "'>"+   //样式结束
                        tagstr+ //标签内容
                        "</span>";

                    return elementstr;

                }break;
            }


            //除去自定义和特殊标签之外的普通左图右文标签
            elementstr =
                "<span class='pmtag "+pmtagclass+" ' style='" +
                "background-repeat: no-repeat;background-position: left center;-webkit-background-size: 1.5rem 1.5rem;background-size:1.5rem 1.5rem;" +
                "background-color:"+backgroundcolor+";" +
                "color:#ffffff;font-size:1rem;text-align: left;line-height: 0;padding:0.75rem 2px 0.75rem 1.5rem; display:inline-block;position: relative;'>"+
                tagstr+ //标签内容
                "</span>";
        }

        //将设置好的标签元素字符串返回,各个处理的js添加到各自合适的位置,添加完之后再设置其标签的位置(注意先后顺序)
        return elementstr;

    }
    //没有促销信息(即促销已经结束或者该商品根本没有促销) 则直接返回空字符串即可,不需要添加标签元素之类的字符串
    else {
        return elementstr;
    }

}

//工程中任何一处的特殊促销标签返回(例如在原产和定制的商品详情页中促销正在进行中时要展示的是图标为带颜色,背景为白色的促销标签)
//参数为 ifcustomlist 是否是定制列表 True  False  促销字典promotionInfo 记录该商品的所有促销信息
//返回值为element 在各个用到的地方将元素添加到相应位置即可 样式放在各个地方进行判断
function returnspecialpromotiontagstr(ifcustomlist,promotionInfo) {
    //该方法是在特殊促销标签背景中根据促销类型选择不同的促销标签背景,此方法不涉及到普通标签

    var promotionstr = '';

    if (!ifcustomlist && promotionInfo && JSON.stringify(promotionInfo) != '{}'){

        //促销标签背景图片类名 根据不同类型设置不同类名,在全局css文件中设置其对应的背景图片
        var pmtagclass = "";
        //促销标签
        var tagstr = promotionInfo.tag;//后台设置最多6个字
        //如果不存在促销标签则直接返回空字符串即可
        if (!tagstr || tagstr == ''){
            return promotionstr;
        }


        switch (promotionInfo.type.toString()){
            //1自定义
            case "1":{
                //如果是自定义的特殊标签，则不需要选择背景图片，透明即可，边框设置为白色即可

                promotionstr =
                    "<span class='pmspecialtag "+"' style='" +
                    " display:inline-block;"+/*解决部分安卓机的不居中问题*/
                    " text-align: left;" +  /*设置文字居左显示*/
                    " color:#ffffff;"+  /*自定义标签中的文本颜色*/
                    " font-size:1rem;"+  /*自定义标签的文本大小*/
                    " line-height:0;"+/*自定义标签的行高*/
                    " padding:0.65rem 2px;"+/*自定义标签内边距*/
                    "'>"+   //样式结束
                    tagstr+ //标签内容
                    "</span>";

                return promotionstr;

            }break;
            //2限时
            case "2":{
                pmtagclass = "specialpmxianshi";
            }break;
            //3折扣
            case "3":{
                pmtagclass = "specialpmzhekou";
            }break;
            //4特价
            case "4":{
                pmtagclass = "specialpmtejia";
            }break;
            //5专享
            case "5":{
                pmtagclass = "specialpmzhuanxiang";
            }break;
            //6买赠
            case "6":{
                pmtagclass = "specialpmmaizeng";
            }break;
        }

        promotionstr =
            "<span class='pmspecialtag "+pmtagclass+" ' style='" +
            "background-repeat: no-repeat;background-position: left center;-webkit-background-size: 1.3rem 1.3rem;background-size:1.3rem;1.3rem;" +
            "color:#ffffff;font-size:1rem;text-align: left;line-height:0; padding: 0.65rem 2px 0.65rem 1.3rem;display:inline-block;position: relative;'>"+
            tagstr+ //标签内容
            "</span>";

    }
    else{}
    return promotionstr;
}



//判断两个字符串类型的包含时间的日期大小 前者小返回 -1 前者大返回 1 前者和后者相同返回0
function compareTimeStr(startStr, endStr) {
    //开始时间和结束时间都存在
    if (startStr.length > 0 && endStr.length > 0) {
        var startDateTemp = startStr.split(" ");
        var endDateTemp = endStr.split(" ");

        var arrStartDate = startDateTemp[0].split("-");
        var arrEndDate = endDateTemp[0].split("-");

        var arrStartTime = startDateTemp[1].split(":");
        var arrEndTime = endDateTemp[1].split(":");

        var allStartDate = new Date(arrStartDate[0], arrStartDate[1], arrStartDate[2], arrStartTime[0], arrStartTime[1], arrStartTime[2]);
        var allEndDate = new Date(arrEndDate[0], arrEndDate[1], arrEndDate[2], arrEndTime[0], arrEndTime[1], arrEndTime[2]);

        if (allStartDate.getTime() == allEndDate.getTime()) {
            //开始时间和结束时间相同 返回0
            return 0;
        }
        else if (allStartDate.getTime() > allEndDate.getTime()) {
            //开始时间大于结束时间 返回1
            return 1;
        }
        else {
            //开始时间小于结束时间 返回-1
            return -1;
        }
    }
    //如果两者有一个不存在则返回false
    else {
        return false;
    }

}

//根据传进来的两个时间字符串计算该两个值的时间差,返回时间差的秒值(向下取整得到的秒数)
function counttimewithstr(timestr1,timestr2) {
    //注意此处计算时间差毫秒的时候要考虑苹果安卓等不同机型的问题,如果单纯使用Date(timestr1).getTime()会有问题，所以统一设置为new Date(timestr1.replace(/-/g,'/')).getTime()这种形式
    var timevalue = new Date(timestr2.replace(/-/g,'/')).getTime() > new Date(timestr1.replace(/-/g,'/')).getTime() ?  new Date(timestr2.replace(/-/g,'/')).getTime() - new Date(timestr1.replace(/-/g,'/')).getTime() : new Date(timestr1.replace(/-/g,'/')).getTime() - new Date(timestr2.replace(/-/g,'/')).getTime();   //时间差的毫秒数
    var miaovalue = Math.floor(timevalue/1000);
    return miaovalue;
}

//根据后台图片地址获取该图片的真实宽高比,返回高度/宽度的比例,计算完成之后各个地方直接✖真实宽度即可得到真实高度
function returnpicratewithUrl(Url) {

    var picwidth ;
    var picheight ;

    /*首先使用正则表达式获取图片的宽高 根据是s宽*高_的形式还是_w宽x高_的形式选择不同的正则表达式 通过是否有atsh_这几个字来进行区分*/
    if (Url.indexOf('atsh_') != -1){
        var re = /_w(.*?)xh(.*?)_/;
        var picaddress = Url;
        var myArray = picaddress.match(re);
        picwidth = myArray[1];
        picheight = myArray[2];
    }
    else{
        var re = /(\d+)\*(\d+)/g;
        var picaddress = Url;
        var tempArray = picaddress.match(re);
        var str1 = tempArray[0];
        var myArray = str1.split("*");
        //注意 形如s245*305_atsh这种样式的 前面是高后面是宽
        picwidth = myArray[1];
        picheight = myArray[0];
    }


    var rate = picheight / (picwidth * 1.0);//宽高比
    return rate;


}

/**数组根据数组对象中的某个属性值进行排序的方法
 * 使用例子：newArray.sort(dicArrsortby('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
 * @param attr 排序的属性 如number属性
 * @param rev true表示升序排列，false降序排序
 * */
function dicArrsortby(attr,rev){
    //第二个参数没有传递 默认升序排列
    if(rev ==  undefined){
        rev = 1;
    }
    else{
        rev = (rev) ? 1 : -1;
    }

    return function(a,b){
        a = a[attr];
        b = b[attr];
        if(a < b){
            return rev * -1;
        }
        if(a > b){
            return rev * 1;
        }
        return 0;
    }
}

/*拍卖系统中关于价格的展示方式的处理*/
function handlethepriceshow(originalprice) {
    //这里根据通用规则对价格的展示进行处理,返回规定好的价格字样
    var resultprice = originalprice;
    return resultprice;
}