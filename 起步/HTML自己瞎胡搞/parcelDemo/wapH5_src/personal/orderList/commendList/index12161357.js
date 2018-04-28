/**
 * Created by hasee on 2016/10/10.
 */



//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
var firstResult=0;          //页面分页
//设置标志变量 为没用内容后分页只增加一次做开关
var firstResultOnce = true;
//监听dom加载
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {scrollFun(pullDownAction,upAction)}, 200);
}, false);

//上拉加载
function upAction(){
    $.ajax({
        url:goodsDetails1Url,
        //type	订单类型 现在都传1
        data:getAuth()+"info={type:1,pageSize:10,firstResult:'"+firstResult+"',orderid:'"+orderid+"'}",
        success:function(data){
            var listArr = data.resultdata.goodsList;
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
                }else{
                    firstResult++;
                }
        },error:function(msg){
            console.log(msg.statusText);myScroll.refresh();
        }
    });
}

var orderid = sessionStorage.getItem("orderId"),
    from = GetQueryString("from"),
    gid=GetQueryString("gid")||"",
    pid=GetQueryString("pid")||"", color=GetQueryString("color")||"",//定制生活通过参数获取pid 和 color
    scrollWrapDom = $(".scrollWrap"),pingJiaDetailDom =$(".pingJiaDetail");
if(from == "native" ){  //原产优品商品评价 展现评价页面
    scrollWrapDom.show()
}else if(from == "group"|| from == "customLife"){  //拼团直接展现评价页面
    pingJiaDetailDom.show()
}

$(function(){
    isLogin(UID,function(){
        if(orderid){            //本地有从上页带进来的缓存
            $.ajax({
                url:goodsDetails1Url,
                //type	订单类型 现在都传1
                data:getAuth()+"info={type:1,pageSize:10,firstResult:'"+firstResult+"',orderid:'"+orderid+"'}",
                success:function(data){
                    var listArr = data.resultdata.goodsList;
                    loadList(listArr);
                    if(listArr.length < 10){$(".pullUpLabel").html("没有更多内容了喔~");}
                    firstResult++
                }
            });
        }else {                 //本地没有从上页带进来的缓存 进入首页
            location.replace(jumpUrl.find)
        }
    });


    //原产优品点击显示评价详情页面
    $(".list").on("click",".pingJia",function(){
        scrollWrapDom.hide();
        pingJiaDetailDom.show();
        pid=$(this).attr("pid");
        color=$(this).attr("color");
    });

    //提交评价
    $(".submit").click(function(e){
        e.preventDefault();
        var content = $("textarea").val(), star =$(".stars .active").length;
        var info= {
            "content": content, "uid": UID,
            "star": star,
            "orderid": orderid
        };
        //提交评价
        if(from == "native"){
            //原产优品提交评价
            info.pid = pid;
            info.color = color;
            $.ajax({
                url:addCommendUrl,
                data:getAuth()+"info="+JSON.stringify(info),
                success:function(data){
                    if(data.errCode == 0){  //评价成功
                        location.reload()
                    }else {tip(data.msg)}
                }
            })
        }else if(from == "customLife"){
            //定制生活提交评价
            info.pid = pid;
            info.guige = color;
            $.ajax({
                url:clSubmitCommentUrl,
                data:getAuth()+"info="+JSON.stringify(info),
                success:function(data){
                    if(data.errCode == 0){  //评价成功
                        history.back();
                    }else {tip(data.msg)}
                }
            })
        }else if(from == "group"){
            //拼团提交评价
            info.gid = gid;
            info.color = color;
            $.ajax({
                url:submitCommentUrl,
                data:getAuth()+"info="+JSON.stringify(info),
                success:function(data){
                    if(data.errCode == 0){  //评价成功
                      history.back();
                    }else {tip(data.msg)}
                }
            })
        }

    });


    //点击星星效果
    $(".stars div").click(function(){
        $(this).addClass("active").prevAll().addClass("active");
        $(this).nextAll().removeClass("active")
    });
    //显示输入字数
    $("textarea").keyup(function(){
        $("section ul li:last span").html($(this).val().length)
    });




});

function loadList(listArr){
    var li="";
    for(var i =0;i<listArr.length;i++){
        var img="",shiXiao = "" ;
        listArr[i].img?
            img=imgIndexUrl+listArr[i].img      //存在商户图片
            :img = "../../public/images/base/defaultShopAvatar.png";    //设置默认图片
        li+="<li class='clearfix' ><div class='pic f_left "+shiXiao+"' style='background-image: url("+img+")'></div>" +
            "<div class='f14 twoClamp title'><h3>"+listArr[i].name+"</h3></div>" +
            "<div class='price red oneClamp'>&yen;<span class='bold f15'>"+listArr[i].price+"</span>" +
            "<span class='f12 grey9'>"+listArr[i].color+"x"+listArr[i].count+"</span></div>" +
            "<div class='bot red clearfix f14'><span class='pingJia' pid ='"+listArr[i].id+"' color='"+listArr[i].color+"'>去评价</span></div></li>"
    }
    $(".list").append(li)
}

