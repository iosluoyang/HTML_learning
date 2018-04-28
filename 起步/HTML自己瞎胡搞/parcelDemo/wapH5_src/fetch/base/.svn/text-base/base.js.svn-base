/**
 * Created by hasee on 2017/7/3.
 */

var fetchid = GetQueryString("fetchid");
//列表 详情 搜索页面需要验证密码是否正确
function isFetchLogin(fetchid,successFun){
    //获取对应自提点的密码
    var pwd = localStorage.getItem(fetchid+"fetchPWD");
    if(localStorage.getItem(fetchid+"fetchPWD")){   //有缓存的密码
        //进行登录 验证缓存密码是否正确
        $.ajax({
            url:loginFetchAddressUrl,
            data:getAuth()+"info={fetchid:"+fetchid+",pwd:'"+pwd+"'}",
            success:function(data){
                if(data.errCode === 0){
                    //密码正确
                    successFun();
                }else {
                    //密码不正确 保存当前链接地址 跳转登录页面登录
                    tip("请输入正确的账户或密码");
                    sessionStorage.setItem("fetchCompleteUrl",location.href); //保存当前链接地址 登陆后跳转
                    location.replace(jumpUrl.fetchLogin+fetchid)
                }
            }
        })
    }else {     //没有缓存的密码 保存当前链接地址 直接跳转登录页面
        sessionStorage.setItem("fetchCompleteUrl", location.href); //保存当前链接地址 登陆后跳转
        // location.href = jumpUrl.fetchLogin + fetchid
        location.replace(jumpUrl.fetchLogin+fetchid)
    }
}

