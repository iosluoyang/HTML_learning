/**
 * Created by hasee on 2017/7/3.
 */


$(function(){


    isFetchLogin(fetchid,function (){
        //监听输入事件
        $("header input").on('input propertychange',function() {
            var queryString = $(this).val();
            if(queryString){
                $("#wrapper").removeClass("hide");
                $(".noData").addClass("hide");
                refresh();
                getOnTheWayList(queryString,fetchid)
            }else {     //搜索条件为""
                $("#wrapper").addClass("hide");
                $(".noData").removeClass("hide");
            }
        });


        //跳转详情
        $(".orderList").on("click","li",function(e){
            location.href = jumpUrl.fetchDetail+fetchid+"&orderNum="+$(this).attr("orderNum")
        });

        //确认到站
        $(".orderList").on("click",".arrive",function(e){
            e.stopPropagation();
            var _this = $(this),orderNum = $(this).parents("li").attr("orderNum");
            confirmShow({
                title:"提示",
                content:"请仔细确认快递已到您的自提点，<br>确认后，系统会通知用户来取货",
                makeSure:function(){
                    $.ajax({
                        url:confirmArrivedUrl,
                        data:getAuth()+"info={orderNum:'"+orderNum+"'}",
                        success:function(data){
                            if(data.errCode == 0){
                                _this.parents("li").remove();
                                tip("此订单已确认到站");
                            }else{tip(data.msg)}
                        }
                    });
                }
            })
        });
    });


});


//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
var firstResult= 0,pageSize = 10;
//设置标志变量 为没用内容后分页只增加一次做开关
var firstResultOnce = true;
var pageStatus = sessionStorage.getItem(getOnlyPath());
if(pageStatus){
    if(JSON.parse(pageStatus).firstResult>0){
        firstResult=JSON.parse(pageStatus).firstResult-1;
        pageSize=  JSON.parse(pageStatus).firstResult*10;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function(){
        scrollFun(upAction,downAction)
    }, 200); }, false);


//下拉刷新
function upAction(){
    refresh();  //页面重置
    var queryString = $("header input").val();
    getOnTheWayList(queryString,fetchid)
}

//上拉加载
function downAction(){
    if(firstResultOnce){
        var queryString = $("header input").val();
        getOnTheWayList(queryString,fetchid)
    }else {//没有更多数据
        myScroll.refresh();
        $(".pullUpLabel").html("没有更多数据了哦~");
    }

}



//获取在途中列表       type 1在途中 2待取货
function getOnTheWayList(queryString,fetchid){
    $.ajax({
        url:fetchOrderListUrl,
        data:getAuth()+"info={type:1,fetchid:"+fetchid+",firstResult:"+firstResult+",pageSize:"+pageSize+",queryString:'"+queryString+"'}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="";
                if(list.length==0 && firstResult==0){   //当list长度为0 并且分页为第一页  说明没有数据展现缺省页
                    $("#wrapper").addClass("hide");
                    $(".noData").show();

                }else {
                    $("#wrapper").removeClass("hide");
                    $(".noData").hide();

                    if (list.length < pageSize) {
                        firstResultOnce = false;//禁止上拉加载
                        if(myScroll){myScroll.refresh();}
                        $(".pullUpLabel").html("没有更多数据了哦~");
                    }
                    firstResult++;

                    for(var i=0;i<list.length;i++){
                        var img = jumpUrl.defaultShopAvatar;
                        if(list[i].img){img = imgIndexUrl +list[i].img}
                        li +="<li orderNum='"+list[i].orderNum+"'><div class='top f12'><div class='pic f_left' style='background-image: url("+img+")'></div>" +
                            "<h3 class='f13'>"+list[i].title+"</h3>" +
                            "<p>"+list[i].guige+"/"+list[i].units+"*"+list[i].count+"</p>" +
                            "<p>发货时间："+list[i].sendTime+"</p></div>" +
                            "<div class='bot f12 grey6 clearfix'><div class='red arrive'>确认到站</div>" +
                            "<p>"+list[i].userName+"<span>"+list[i].userPhone+"</span></p></div></li>"
                    }
                    $(".orderList").append(li);
                }
            }else{
                tip(data.msg)
            }
        }
    });
}


//页面重置
function refresh(){
    firstResult=0;          //分页重置为0
    firstResultOnce = true;//允许分页
    $(".orderList").empty();//清空订单列表
    $(".pullUpLabel").html("上拉加载更多");     //重置上拉加载提示
}
