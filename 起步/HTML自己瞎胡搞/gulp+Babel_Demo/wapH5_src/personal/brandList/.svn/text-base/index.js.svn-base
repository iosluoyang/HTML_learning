/**
 * Created by hasee on 2016/10/8.
 */
//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
var firstResult= 0,pageSize=10;          //设置默认页面分页
var pageStatus = sessionStorage.getItem(getOnlyPath());
if(pageStatus){
    if(JSON.parse(pageStatus).firstResult>0){
        firstResult=JSON.parse(pageStatus).firstResult-1;
        pageSize=  JSON.parse(pageStatus).firstResult*10;
    }
}
//设置标志变量 为没用内容后分页只增加一次做开关
var firstResultOnce = true;
//监听dom加载
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {scrollFun(pullDownAction,upAction)}, 200);
}, false);

//下拉刷新
//function downAction(){
//    firstResult= 0;pageSize=10;  //重置分页
//    location.reload()
//}

//上拉加载
function upAction(){
    $.ajax({
        url:brandPavilionGjListUrl,
        data:getAuth()+"info={pageSize:'10',firstResult:'"+firstResult+"',uid:'"+UID+"'}",
        success:function(data){
            var listArr = data.resultdata.list;
            setTimeout(function (){
                loadList(listArr);
                //重置上拉状态
                myScroll.refresh();
                if(listArr.length < 10 ) {
                    //当前商品条数小于10 显示提示内容
                    $(".pullUpLabel").html("没有更多内容了喔~");
                    //根据分页开关控制 分页只++一次 不会累加
                    if (firstResultOnce) {
                        firstResult++;
                        firstResultOnce = false;
                    }
                }else{firstResult++;}
            },500);
        },
        error:function(msg){
            console.log(msg.statusText);
            myScroll.refresh();
        }
    });
}


$(function(){
    //sessionStorage.setItem("completeUrl",jumpUrl.find);       //登录后跳转到首页
    isLogin(UID,function(){
        $.ajax({
            url:brandPavilionGjListUrl,
            data:getAuth()+"info={pageSize:'"+pageSize+"',firstResult:'0',uid:'"+UID+"'}",
            success:function(data){
                var listArr = data.resultdata.list;
                if(listArr.length==0){  //没有关注品牌
                    $(".noData").append("<img src='../../public/images/personal/noGuanZhu.png' alt=''>").show();
                    $(".pullUpLabel").html("")
                }else {
                    loadList(listArr);
                    firstResult++
                }
            }
        });
    });


    //跳转品牌馆
    $(".list").on("click","li",function(){
        var id = $(this).attr("guanId");    //获取馆id
        location.href=jumpUrl.brand+id+"&uid="+UID
    })

});

function loadList(listArr){
    //设置头像
    var li="";
    for(var i =0;i<listArr.length;i++){
        var img="";
        listArr[i].img?
            img=imgIndexUrl+listArr[i].img      //存在商户图片
            :img = "../../public/images/base/defaultShopAvatar.png";    //设置默认图片
        li +="<li class='clearfix' guanId = "+listArr[i].id+"><div class='pic f_left'  style='background-image: url("+img+")'></div>" +
            "<h3 class='f16 oneClamp'>"+listArr[i].name +"</h3><p class='grey9 f13'>"+listArr[i].count+"人关注</p></li>"
    }
    $(".list").append(li)
}

