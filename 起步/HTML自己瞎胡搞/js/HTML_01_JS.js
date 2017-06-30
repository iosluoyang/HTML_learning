/**
 * Created by haiyang on 2017/6/14.
 */

//开始计算时间
function startTime() {
    var d = new Date();
    var year = d.getYear();
    var month = d.getMonth();
    var day = d.getDay();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    //var timestr = '北京时间: ' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second ;
    var timestr = '北京时间: ' + hour + ':' + minute + ':' + second ;
    var timep = document.getElementById('currenttime');
    timep.innerHTML = timestr;
    t = setTimeout('startTime()',500) //1000毫秒代表1秒
}
//创建可以存储cookies的变量
function setCookies(cookies_name, cookies_value) {


    //存储到document中的cookies
    document.cookie=cookies_name + "=" +  cookies_value + ";" ;

}
//获取cookies中存储的数据
function getcookies(cookies_name) {
    //有cookies
    if (document.cookie.length > 0){
        //找到该要取的cookie名称对应的值
        var c_startindex = document.cookie.indexOf(cookies_name + '=');
        if (c_startindex != -1){
            c_startindex = c_startindex + cookies_name.length + 1/*这个1是等号的占位*/ ; //找到值开始的位置索引
            var c_endindex = document.cookie.indexOf(";",c_startindex);//从起始位置一直开始找到分号所在的位置，则该索引为结束的索引
            if (c_endindex != -1){
                //如果结束索引不存在，即没有找到分号所在的地方，则结束索引为整个cookies的长度
                c_endindex = document.cookie.length;
            }
            //返回从开始索引到结束索引中间的cookies的值
            var cookiesvalue = document.cookie.substring(c_startindex,c_endindex);
            return cookiesvalue
        }

    }
    //在各种情况都取不到的情况下直接返回空字符串
    return "";
}
//检查cookies是否存在，如果存在则报欢迎语，不存在则弹框输入相应的数据
function checkcookies() {
    var username = getcookies("username");
    if (username != null && username != ""){
        //cookies 存在
        alert("欢迎您的到来," + username)
    }
    else{
        //cookies 不存在,自动设置cookies
        var promptstr = prompt("请输入您的姓名~","炫酷屌炸天的我")
        if (promptstr != null && promptstr != ""){
            //将用户输入的文本进行cookies存储
            setCookies("username",promptstr);
            alert("欢迎您的到来," + promptstr)
        }

    }
}


