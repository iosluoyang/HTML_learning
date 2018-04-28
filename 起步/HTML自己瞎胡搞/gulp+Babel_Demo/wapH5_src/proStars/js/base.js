/**
 * Created by hasee on 2017/6/7.
 */



//注入权限
function prostarswXConfig(jsApiListArr,share){
    $.ajax({
        url:getJsSdkSignatureUrl,       //获取微信签名等
        type:"POST",
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
                    var shareInfo = {     //默认分享设置
                        title: share.title || "超级社区", // 分享标题
                        desc: share.desc || "超级社区", // 分享描述
                        link: location.href, // 分享链接
                        imgUrl: share.imgUrl || publicUrl + "public/images/base/logo.png", // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            mainTip("您已经成功分享")
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                            mainTip("您取消了分享")
                        }
                    };

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
                                    console.log(data.msg)
                                }
                            }
                        })
                    }
                });
            }else {
                console.log(data.msg);
            }
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
        uid	:"",
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

//判断是否微信登陆
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}