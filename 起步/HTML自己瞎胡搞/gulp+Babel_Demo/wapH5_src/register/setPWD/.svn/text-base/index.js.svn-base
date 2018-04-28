/**
 * Created by hasee on 2016/10/18.
 */

$(function(){
    //登录点击
    $(".sub").click(function(e){
        e.preventDefault();
        if(!/^[a-zA-Z0-9]{6,20}$/.test($(".input1").val())){
            mainTip("密码至少为6-20位数字字母组合")
        }else{
            if($(".input1").val() != $(".input2").val()){
                mainTip("两次密码输入不一致")
            }else {     //满足密码条件
                var info = "";
                localStorage.wXAppInfo?
                    info = {
                        mobile:sessionStorage.getItem("mobile"),
                        pwd:hex_md5($(".input1").val()),
                        openid:JSON.parse(localStorage.wXAppInfo).openid
                    }
                    :info={
                    mobile:sessionStorage.getItem("mobile"),
                    pwd:hex_md5($(".input1").val()),
                    openid:null
                };
                $.ajax({
                    url:regeistUrl,
                    data:getAuth()+"info="+JSON.stringify(info),
                    success:function(data){
                        if(data.errCode==0){
                        //    var appUser = data.resultdata.appUser, avatar,username;
                        //    appUser.avatar? avatar = imgIndexUrl+appUser.avatar:avatar = JSON.parse(localStorage.userAppInfo).avatar;
                        //    appUser.username=="未起名"? username = JSON.parse(localStorage.userAppInfo).username:username = appUser.username;
                        //
                        //    var    userInfo ={         //存在本地缓存 传openid
                        //        openid:info.openid,         //openid
                        //        uid:appUser.uid,            //app的uid
                        //        username:username,  //app的昵称
                        //        avatar:avatar,         //app的头像
                        //        mobile:appUser.mobile,      //app的手机号
                        //        frontcover:appUser.frontcover       //app的封面
                        //    };
                        //    localStorage.setItem("userAppInfo",JSON.stringify(userInfo));
                        //    sessionStorage.getItem("completeUrl")?
                        //        location.replace(sessionStorage.getItem("completeUrl"))          //返回登录前页面
                        //        :location.replace(jumpUrl.find);                                  //默认登录首页

                            setUserInfo(data,sessionStorage.getItem("completeUrl"))
                        }
                    }
                })

            }
        }
    });





//        //显示清空信息按钮
//        $("input").bind('input propertychange', function() {$(this).next().show();});
//
//        //清空信息
//        $(".clear").click(function(){
//            $(this).prev().val("");$(this).hide();  //清除input内容
//            $(".sub").attr("disabled",true);       //登录按钮禁用
//        });
})