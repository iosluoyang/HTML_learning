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
    var timestr = '当前时间为:' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second ;
    var timep = document.getElementById('currenttime');
    timep.innerHTML = timestr;
    t = setTimeout('startTime()',500)
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
//倒叙移除所有的P标签
function removePelement(obj) {
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
