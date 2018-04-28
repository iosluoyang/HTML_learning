/**
 * Created by hasee on 2016/10/18.
 */


$(function(){
    $('body').height($('body')[0].clientHeight);

    //获取验证码
    $(".yanZheng").click(function(e){
        e.preventDefault();
        var num =59, _this = $(this);
        if(/^1[34578]\d{9}$/.test($(".input1").val())){
            $.ajax({
                url:getCaptchaUrl,
                //133版本重置密码获取验证码时增加上送参数state  = 1
                data:getAuth()+"info={mobile:'"+$(".input1").val()+"',state:1}",
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
                        //获取验证码失败，提示信息
                        mainTip(data.msg)
                    }
                }
            });
        }else {
            mainTip("请输入正确的手机号")
        }
    });

    //重置密码按钮状态改变
    $("input").bind('input propertychange', function() {
        $(this).next().show();
        if( /^1[34578]\d{9}$/.test($(".input1").val()) && $(".input2").val().length == 4){
            $(".sub").attr("disabled",false)
        }else {$(".sub").attr("disabled",true)}
    });

    //重置密码
    $(".sub").click(function(e){
        e.preventDefault();
        if(!/^[a-zA-Z0-9]{6,20}$/.test($(".input3").val())){
            mainTip("密码至少为6-20位数字字母组合")
        }else {
            if($(".input3").val()!=$(".input4").val() != ""){
                mainTip("两次密码输入不一致")
            }else {
                //验证验证码
                $.ajax({
                    url:checkCaptchaUrl,
                    data:getAuth()+"info={mobile:'"+$(".input1").val()+"',captcha:'"+$(".input2").val()+"'}",
                    success:function(data) {
                        if (data.errCode == 0) {    //验证码正确
                            //重置密码
                            $.ajax({
                                url: updatePwdUrl,
                                data: getAuth()+"info={mobile:'" + $(".input1").val() + "',pwd:'" + hex_md5($(".input3").val()) + "'}",
                                success: function (data) {
                                    if (data.errCode == 0) {
                                        location.replace(jumpUrl.login);          //返回登录页面
                                    } else {mainTip(data.msg)}
                                }
                            })
                        }else {mainTip(data.msg)}
                    }

                })
            }
        }
    });

    //清空信息
    $(".clear").click(function(){
        $(this).prev().val("");$(this).hide();  //清除input内容
        $(".sub").attr("disabled",true);       //登录按钮禁用
    });




});

