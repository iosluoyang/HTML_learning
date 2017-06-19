/**
 * Created by haiyang on 2017/6/14.
 */
//点击浮标的触发事件
function helloxiaohaige() {
    var x = document.getElementById("drogue")
    if (x.innerHTML.match('小海哥')){
        x.innerHTML = "小海妹";
        x.style.color = "#ff0000";
    }
    else{
        x.innerHTML = "小海哥";
        x.style.color = "#ededed";

    }
}
//检查昵称
function checknickname() {
    var value = document.getElementById("姓名").value;
    var warningstr = "恭喜,'" + value + "'这么屌炸天的昵称还没有人用过呢~~"
    alert(warningstr)
}
//检查手机号码
function checkphonenumber() {
    var value = document.getElementById("手机号码").value;

    if(value ==""||isNaN(x))
    {
        alert("都说了不是你BB机号，再好好检查一下~");
    }
    else{
        var alertstr = value + ',这个手机号的机主绝对是最牛逼的~'
        alert(alertstr)
    }
}
//根据选择的颜色改变表单的背景颜色
function changebgcolor() {
    var color = document.getElementById('likecolor').value;
    /*获取表单元素*/
    var x = document.getElementById('mambaask');
    x.style.backgroundColor = color;
}
//给科比球迷的一份礼物
function presentforyou() {
    var presentstr = '知道你舍不得科比退役，知道你看到老大在最后一场比赛拿了60分泪流满脸，知道你看的不仅仅是球，更是你的青春，那些篮球场上挥汗如雨的瞬间，' +
        '那些无忧无虑，只要踏上篮球场就可以肆无忌惮的时光~~~可是，当蜗壳说出那句Mamba Out的时候，我想你也一定是心怀祝福，勇敢前行吧。少年，无论如何,'+
        '收拾起你的行囊，带着勇气，继续往前走吧，少年路，莫回头！';
    alert(presentstr)
}
//开始计算时间
function startTime() {
    var d = new Date();
    var year = d.getYear();
    var month = d.getMonth();
    var day = d.getDay();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    //var timestr = '当前时间为:' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second ;
    var timestr = '当前时间为:' + hour + ':' + minute + ':' + second ;
    var timep = document.getElementById('currenttime');
    timep.innerHTML = timestr;
    t = setTimeout('startTime()',500) //1000毫秒代表1秒
}
//使用JS追加元素
function addelementswithJS() {
    var p  = document.createElement("p");
    var pstr = document.createTextNode("哈哈，惊喜吧，我是用JS追加的元素哦");
    p.appendChild(pstr);
    var bodyelement = document.getElementById("mybody");
    bodyelement.appendChild(p);
    var addstr = '永远的黑曼巴';
    document.write('<p> 使用js增加一个橘色的文字:'+ addstr.replace(/黑曼巴/,'科比布莱恩特').fontcolor('orange') + ' </p>');

    var d =  new Date();
    document.write('<p> 当前距1970年1月1日相隔了:' + d.getTime() + '毫秒</p>');
    d.setFullYear(1993,6,1);//因为月份是从0~11，所以要表示7月1日，需要传入6
    document.write('<p> 更改当前日期为:' + d.toUTCString() + '</p>');
}
//倒叙移除所有的P标签(增加二次确认)
function removePelement(obj) {
    var r = confirm("万水千山总是情，给点活路行不行?" + '\n' + "你确定要把我给删了?")
    if (r == true){
        //删除P标签
        //如果P标签仅剩3个的话，则直接移除删除按钮本身
        var childelements = document.getElementsByTagName('p');
        var Pcount = childelements.length;
        if (Pcount == 2){
            obj.innerHTML = '给P标签留点活路吧，就删到这里了~';
        }
        //倒叙移除P标签
        else{
            var lastp = childelements[childelements.length - 1 ];
            lastp.parentNode.removeChild(lastp);
        }
    }
    else{
        //点击了取消
        var name = prompt("大侠可否告知我你的名字?","炫酷屌炸天的我~~")
        if (name != null && name != ""){
            alert("多谢" + name +"手下留情" + '\n' + "我们萍水相逢!")
        }
        else{
            alert("多谢无名大侠手下留情" + '\n' + "我们萍水相逢!")
        }

    }
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
