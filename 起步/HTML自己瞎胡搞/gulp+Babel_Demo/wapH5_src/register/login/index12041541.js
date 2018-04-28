/**
 * Created by hasee on 2016/10/12.
 */

YaoqingmaLength = 6; //邀请码输入的长度

$(function(){

    //选项卡切换
    $("ul li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");
        $(".inner form").eq($(this).index()).show().siblings().hide()
    });

    var completeUrl = sessionStorage.getItem("completeUrl");        //得到当前的存储链接


    //--------------------------------获取openid--------------------------------
    if(isWeiXin()){
        if(GetQueryString("code")){
            $.ajax({
                url:wXUserUrl,
                data:getAuth()+"info={code:'"+GetQueryString("code")+"'}",
                async:false,
                success:function(data){
                    if(data.errCode == 0){       //请求成功  返回微信信息  获取openid
                        var user =data.resultdata.user;
                        //设置微信用户信息
                        localStorage.setItem("wXAppInfo",JSON.stringify({
                            openid:user.openid,
                            wXavatar:user.headimgurl,     //微信头像
                            wXusername:user.nickname     //微信昵称
                        }));
                        //通过openid获取已绑定app用户信息
                        $.ajax({
                            url:appUserUrl,
                            async:false,
                            data:getAuth()+"info={openid:'"+user.openid+"'}",
                            success:function(data){

                                if(data.errCode==0){    //已注册并且已绑定openid
                                    setUserInfo(data,completeUrl);      //设置用户信息
                                }else if(data.errCode==2){  //已注册没有绑定openid或者未注册

                                }
                            }
                        });
                    }
                }
            });
        }

    }

    //--------------------------------手机验证码登录--------------------------------
    //获取验证码
    $(".yanZheng").click(function(e){
        e.preventDefault();
        var num =58, _this = $(this);
        if(/^1[34578]\d{9}$/.test($(".input1").val())){
            $.ajax({
                url:getCaptchaUrl,
                data:getAuth()+"info={mobile:'"+$(".input1").val()+"'}",
                success:function(data){
                    if(data.errCode == 0){      //发送成功
                        _this.attr("disabled",true);      //禁止再次点击
                        _this.html("59秒后重发");
                        var interval=setInterval(function(){
                            _this.html(num+"秒后重发");num--;
                            if(num < 0){
                                clearInterval(interval);
                                _this.html("再次获取").attr("disabled",false)
                            }},1000)
                    }
                    else{
                        mainTip(data.msg)
                    }
                }
            });
        }else {
            mainTip("请输入正确的手机号")
        }

    });

    //手机验证登录按钮样式改变
    $(".form1 input").bind('input propertychange', function() {
        $(this).next().show();
        if(/^1[34578]\d{9}$/.test($(".input1").val()) && $(".input2").val().length == 4 ){
            $(".sub1").attr("disabled",false)
        }else {
            $(".sub1").attr("disabled",true)
        }
    });

    //单独绑定邀请码的输入改变监听事件
    $(".form1 .input5").bind('input propertychange',function () {
        //获取邀请码的文字
        var yaoqingmaTxt=$(".input5").val();
        //判断是否达到6位的长度，只有达到邀请码的长度之后才进行后台校验
        if (yaoqingmaTxt.length == YaoqingmaLength){
            //开始校验
            mainTip("开始校验"+ yaoqingmaTxt)
            //假设校验成功,获取到社区名称,让社区元素向下滑动
            var shequname = "后台返的社区名称";
            $(".input6").attr("placeholder",shequname);
            $(".input6div").slideDown("fast");
        }
        else{
            //如果在输入的过程没有达到邀请码的长度，则清空社区名称并且向上滑动社区元素
            $(".input6").attr("placeholder","");
            $(".input6div").slideUp("fast");

        }



    })

    //手机验证码登录
    $(".sub1").click(function(e){
        e.preventDefault();
        //在登录前需要做一个监测,即如果邀请码一栏中有文字并且没有社区名称的情况下，则证明是输入了错误的邀请码，这个时候需要提示用户输入了错误的邀请码 1.3.2_3版本屏蔽邀请码功能
        // var yaoqingma = $(".input3").val();
        // var shequname = $(".input4").attr('placeholder');
        // if (yaoqingma && yaoqingma.length>0 && (!shequname || shequname.length == 0)){
        //     mainTip("请输入正确的邀请码");
        //     $(".input3").focus();
        //     return
        // }

        var info = "";
        localStorage.wXAppInfo?
            info = {        //存在本地缓存 传openid
                type:1, mobile:$(".input1").val(), captcha:$(".input2").val(),
                openid:JSON.parse(localStorage.wXAppInfo).openid}
            : info = {      //不存在本地缓存 openid传空
            type:1, mobile:$(".input1").val(), captcha:$(".input2").val(), openid:null};
        $.ajax({
            url:loginUrl,
            data:getAuth()+"info="+JSON.stringify(info),
            success:function(data){
                if(data.errCode==0){       //登录成功  绑定openid

                    setUserInfo(data,completeUrl)
                }else if(data.errCode == 2){    //注册 需要设置密码
                    sessionStorage.setItem("mobile",info.mobile);   // 将手机号保存在本地
                    location.replace(jumpUrl.setPWD);          //进入设置密码页面
                }else if(data.errCode ==1){     //验证码错误
                    mainTip("请输入正确的验证码")
                }else {
                    mainTip(data.msg)
                }
            }
        })
    });


    //--------------------------------手机密码登录--------------------------------
    //手机密码登录按钮样式改变
    $(".form2 input").bind('input propertychange', function() {
        $(this).next().show();
        if(/^1[34578]\d{9}$/.test($(".input3").val()) && $(".input4").val()!= ""){
            $(".sub2").attr("disabled",false)
        }
        else {
            $(".sub2").attr("disabled",true)
        }
    });

    //手机密码登录
    $(".sub2").click(function(e){
        e.preventDefault();
        var info = "";
        localStorage.wXAppInfo?
            info = {        //存在本地缓存 传openid
                type:2, mobile:$(".input3").val(), pwd:hex_md5($(".input4").val()),
                openid:JSON.parse(localStorage.wXAppInfo).openid}
            :info = {      //不存在本地缓存 openid传空
                type:2, mobile:$(".input3").val(), pwd:hex_md5($(".input4").val()), openid:null};
        $.ajax({
            url:loginUrl,
            data:getAuth()+"info="+JSON.stringify(info),
            success:function(data){
                if(data.errCode==0){       //登录成功  绑定openid

                    setUserInfo(data,completeUrl)
                }else if(data.errCode == 1){
                    mainTip(data.msg)
                }
            }
        })
    });







    //清空信息
    $(".clear").click(function(){
        $(this).prev().val("");$(this).hide();  //清除input内容
        $(".sub").attr("disabled",true);       //登录按钮禁用
    });
    //点击手机号码的清空
    //$(".input1").next().click(function(){
    //    //$(".yanZheng").attr("disabled",true).css("background","");  //验证按钮禁用
    //    $(".yanZheng").attr("disabled",true).css("background","");  //验证按钮禁用
    //});

});