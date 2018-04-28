/**
 * Created by hasee on 2017/7/5.
 */

$(function () {

    login();

    var button = $(".login button");

    if(fetchid){    //获取到fetchid
        //获取自提点名称
        $.ajax({
            url:getFetchInfoByIdUrl,
            data:getAuth()+"info={fetchid:"+fetchid+"}",
            success:function(data){
                if(data.errCode === 0){
                    $(".fetch").val(data.resultdata.bean.name);
                }else {tip(data.msg);}
            }
        })
    }else{
        mainTip("未获取到自提点id");
    }


    $(".pwd").bind('input propertychange', function() {
        var pwdVal = $(".pwd").val();
        (pwdVal !== "")?
            button.attr("disabled",false):button.attr("disabled",true)
    });

    //登录自提点列表
    button.click(function (e) {
        e.preventDefault();
        var pwdVal = $(".pwd").val();
        //进行登录 验证缓存密码是否正确
        login(pwdVal)
    })
});

function login(pwd) {
    //获取缓存密码
    pwd = pwd || localStorage.getItem(fetchid+"fetchPWD") || "";
    if(pwd){
        $.ajax({
            url:loginFetchAddressUrl,
            data:getAuth()+"info={fetchid:"+fetchid+",pwd:'"+pwd+"'}",
            success:function(data){
                if(data.errCode === 0){
                    //密码正确 有缓存链接就跳转缓存链接 没有就跳转列表首页
                    var fetchCompleteUrl = sessionStorage.getItem("fetchCompleteUrl") || jumpUrl.fetchList+fetchid;
                    localStorage.setItem(fetchid+"fetchPWD",pwd); //缓存对应自提点的自提密码
                    location.replace(fetchCompleteUrl);             //页面跳转
                }else {
                    //密码不正确 保存当前链接地址 跳转登录页面登录
                    tip("请输入正确的账户或密码");
                }
            }
        })
    }

}


