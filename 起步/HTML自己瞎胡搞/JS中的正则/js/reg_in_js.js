/**
 * Created by haiyang on 2017/7/6.
 */
function  checkstr() {
    var orignstr = document.getElementsByClassName('strname')[0].innerHTML;
    var targetele = document.getElementsByClassName('searchbtn')[0];
    /*if (orignstr.search('大帅哥') == -1){
        targetele.innerHTML = '不存在大帅哥这三个字';
    }
    else{
        var strindex = orignstr.search('大帅哥');
        targetele.innerHTML = '存在大帅哥这三个字,从坐标为:' + strindex + '开始';
    }*/
    var patt = /大帅哥/;
    if (patt.test(orignstr)){
        targetele.innerHTML = '存在大帅哥这三个字';
    }
    else{
        targetele.innerHTML = '不存在大帅哥这三个字';
    }

}
function replacestr() {

    var orignstr = document.getElementsByClassName('strname')[0].innerHTML;
    var targetstr = orignstr.replace('大帅哥','超人');
    document.getElementsByClassName('strname')[0].innerHTML = targetstr;
}

function execstr() {

    var orignstr = document.getElementsByClassName('strname')[0].innerHTML;
    var targetele = document.getElementsByClassName('execbtn')[0];
    targetele.innerHTML = /大帅哥/.exec(orignstr);
}