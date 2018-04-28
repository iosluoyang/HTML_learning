/**
 * Created by hasee on 2016/11/20.
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


//app分享拼团列表社区属性为vid wap站链接跳转社区属性为groupVid
var groupVid = GetQueryString("groupVid") || GetQueryString("vid");

//设置进入我页面的链接    携带拼团参数
$("footer ul li:last a").attr("href","javascript:location.href = jumpUrl.person+'?from=group'");
//缓存拼团列表页面链接 进入我页面后需要跳转到拼团链接
sessionStorage.setItem("groupListUrl",location.href);


$(function(){

    //--------------------------------立即打开----------------------------------------
    openApp($("header"),$("#wrapper"));


    //获取社区名称
    // 1 需要清除缓存社区名 必须通过链接的vid获取社区名称
    $("header h3").append("（<img src='../../public/images/group/location.png' align='bottom'>"+getGroupVidName(groupVid,1)+"）");

    //获取团购列表
    $.ajax({
        url:groupBuyUserListUrl,
        data:getAuth()+"info={firstResult:0,pageSize:'"+pageSize+"',vid:'"+groupVid+"'}",
        success:function(data){
            if(data.errCode==0){
                var groList = data.resultdata.groList;
                getGroList(groList);
                if(groList.length<10){
                    //当前商品条数小于10 显示提示内容
                    $(".pullUpLabel").html("没有更多内容了喔~");
                }
                firstResult++
            }else{tip(data.msg)}
        }
    });


    //点击跳转到详情
    $(".groList").on("click","li",function(){
        var gid = $(this).attr("gid");
        location.href = jumpUrl.groupProductsDetail+gid
    })




});

//上拉加载
function upAction(){
    $.ajax({
        url:groupBuyUserListUrl,
        data:getAuth()+"info={firstResult:'"+firstResult+"',pageSize:'10',vid:'"+groupVid+"'}",
        success:function(data){
            if(data.errCode==0){
                var groList = data.resultdata.groList;
                //setTimeout(function (){
                    getGroList(groList);
                    //重置上拉状态
                    myScroll.refresh();
                    if(groList.length < 10 ) {
                        //当前商品条数小于10 显示提示内容
                        $(".pullUpLabel").html("没有更多内容了喔~");
                        //根据分页开关控制 分页只++一次 不会累加
                        if (firstResultOnce) {
                            firstResult++;
                            firstResultOnce = false;
                        }
                    }else{firstResult++;}
                //},500);
            }else{tip(data.msg)}
        },error:function(msg){console.log(msg.statusText);myScroll.refresh()}
    });
}


//获取拼团列表数据
function getGroList(groList){
    var li="";
    for(var i=0;i<groList.length;i++){
        var tuanGouOver ="",groupNumSpan="";
        if(groList[i].status == 0){        //0团购已结束     1团购中
            tuanGouOver = "tuanGouOver";
            groupNumSpan="<span>已结束</span>"
        }else {
            //成团量和已售的差值 剩余数量
            var num = groList[i].min_group_num - groList[i].sales;
            num >0?
                groupNumSpan="<span>差"+num+"件</span>"
                :groupNumSpan="<span>已满件</span>";
        }
        li+="<li class='clearfix' gid='"+groList[i].gid+"'><div class='pic "+tuanGouOver+"' style='background-image: url("+imgIndexUrl+groList[i].asmian+")'></div>" +
            "<h3 class='title oneClamp f16'>"+groList[i].title+"</h3>" +
            "<div class='groupNum oneClamp f_left f12'><span>"+groList[i].min_group_num+"件成团</span>"+groupNumSpan+"</div>" +
            "<div class='price red f_right'>" +
            "<span class='grey9 f13'>&yen;"+groList[i].oldprice+"</span>" +
            "<span class='f14'>&yen;</span><span class='bold f17'>"+groList[i].newprice+"</span></div></li>"
    }
    $(".groList").append(li)
}
