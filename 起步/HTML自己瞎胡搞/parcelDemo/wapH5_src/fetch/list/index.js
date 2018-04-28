/**
 * Created by hasee on 2017/7/3.
 */


$(function(){

    isFetchLogin(fetchid,function () {
        //获取列表数据
        getOrderList(fetchid);
        //设置自提点名称
        $.ajax({
            url:getFetchInfoByIdUrl,
            data:getAuth()+"info={fetchid:"+fetchid+"}",
            success:function(data){
                if(data.errCode === 0){
                    $("header h2").html(sliceStr(data.resultdata.bean.name));
                }else {tip(data.msg)}
            }
        });


        //跳转搜索页面
        $(".search").click(function(){
            location.href = jumpUrl.fetchSearch+fetchid
        });

        //导航切换
        $("nav li").click(function(){
            var _this = $(this);
            if(!_this.hasClass("active")){
                _this.addClass("active").siblings().removeClass("active");
                $(".pickUp,.search").toggleClass("hide");
                refresh();  //页面重置
                getOrderList(fetchid,_this);
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



        //验证取货
        $(".pickUp").click(function(){

            confirmShow({
                title:"验证取货码",
                disabled:false,
                content:"取货码 <input  type='number' onpaste='return false;' placeholder='请输入取货验证码'>",
                makeSureBtn:"验证",
                makeSure:function(){
                    var pickupcode = $('.inner input').val();
                    if(/^\d{6}$/.test(pickupcode)){
                        $.ajax({
                            url:getFetchOrderDetailUrl,
                            data:getAuth()+"info={pickupcode:"+pickupcode+",fetchid:"+fetchid+"}",
                            success:function(data){
                                if(data.errCode == 0){  //设置成功
                                    var bean = data.resultdata.bean,img = jumpUrl.defaultAvatar;
                                    if(bean.img){img = imgIndexUrl + bean.img}
                                    confirmShow({
                                        title:"验证成功",
                                        content:"<div class='proDetail'><div class='clearfix mid'><div class='pic f_left' style='background-image: url("+img+")' ></div>" +
                                        "<h3 class='f14 twoClamp grey6'>"+bean.title+"</h3>" +
                                        "<p class='grey9 f12'>"+bean.guige+"/"+bean.units+"*"+bean.count+"</p></div>" +
                                        "<p class='contact f13 oneClamp'><img src='../../public/images/fetch/icon3.png'>"+bean.userName + "<span>" + bean.userPhone+"</span></p></div>",
                                        makeSureBtn:"确认取货",
                                        makeSure:function(){
                                            $.ajax({
                                                url:confirmPickupUrl,
                                                data:getAuth()+"info={orderNum:'"+bean.orderNum +"'}",
                                                success:function(data){
                                                    if(data.errCode == 0){
                                                        tip("此订单已完成取货");
                                                        setTimeout(function () {
                                                            location.reload()
                                                        },1000);
                                                    }else {tip(data.msg)}
                                                }
                                            });

                                        }
                                    })
                                }else {tip(data.msg)}
                            }
                        })
                    }
                }
            });

            //监听输入事件
            $('.inner').on('input propertychange',"input", function() {
                var val = $(this).val(),length = val.length;
                (length >= 6)?
                    $(".confirmMarsk .makeSure").removeClass("disabled")
                    :$(".confirmMarsk .makeSure").addClass("disabled");
                if(val.length>4){
                    $(this).val(val.slice(0,6));
                }
            });
        })

    });



});

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
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function(){
        scrollFun(upAction,downAction)
    }, 100); }, false);

//下拉刷新
function upAction(){
    refresh();  //页面重置
    getOrderList(fetchid);
}

//上拉加载
function downAction(){
    if(firstResultOnce){
        var type =  $("nav .active").attr("type");
        if(type == 1){      //在途中
            //获取在途中列表
            getOnTheWayList(type,fetchid)
        }else if(type == 2){    //待取货
            //获取待取货列表
            getWaitPickUp(type,fetchid)
        }
    }else {//没有更多数据
        myScroll.refresh();
        $(".pullUpLabel").html("没有更多数据了哦~");
    }

}

//根据选择获取在途中或者待取货列表
function getOrderList(fetchid,_this){
    var type;
    _this?type= _this.attr("type") : type=$("nav .active").attr("type");
    if(type == 1){      //在途中
        //获取在途中列表
        getOnTheWayList(type,fetchid)
    }else if(type == 2){    //待取货
        //获取待取货列表
        getWaitPickUp(type,fetchid)
    }
}

//获取在途中列表       type 1在途中 2待取货
function getOnTheWayList(type,fetchid){
    $.ajax({
        url:fetchOrderListUrl,
        data:getAuth()+"info={type:"+type+",fetchid:"+fetchid+",firstResult:"+firstResult+",pageSize:"+pageSize+"}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="";
                if(list.length==0 && firstResult==0){   //当list长度为0 并且分页为第一页  说明没有数据展现缺省页
                    $(".orderList").addClass("hide");
                    $(".noOrder1").removeClass("hide");

                }else {
                    $(".orderList").removeClass("hide");
                    $(".noOrder1").addClass("hide");

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
                            "<h3 class='f14'>"+list[i].title+"</h3>" +
                            "<p>"+list[i].guige+"/"+list[i].units+"*"+list[i].count+"</p>" +
                            "<p>发货时间："+list[i].sendTime+"</p></div>" +
                            "<div class='bot f12 grey6 clearfix'><div class='red arrive'>确认到站</div>" +
                            "<p class='f13'>"+list[i].userName+"<span>"+list[i].userPhone+"</span></p></div></li>"
                    }
                    $(".orderList").append(li);
                }
            }else{
                tip(data.msg)
            }
        }
    });
}

//获取待取货列表
function getWaitPickUp(type,fetchid){
    $.ajax({
        url:fetchOrderListUrl,
        data:getAuth()+"info={type:"+type+",fetchid:"+fetchid+",firstResult:"+firstResult+",pageSize:"+pageSize+"}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="";
                if(list.length==0 && firstResult==0){   //当list长度为0 并且分页为第一页  说明没有数据展现缺省页
                    $(".orderList").addClass("hide");
                    $(".noOrder2").removeClass("hide");

                }else {
                    $(".orderList").removeClass("hide");
                    $(".noOrder2").addClass("hide");

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
                            "<p>到货时间："+list[i].arrivalTime+"</p></div>" +
                            "<div class='bot f12 grey6 clearfix'>" +
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
    $(".noOrder,.noOrder2").addClass("hide");   //隐藏订单为空图片
    $(".pullUpLabel").html("上拉加载更多");     //重置上拉加载提示
}
//截取标题
function sliceStr(str) {
    if(str.length>8){
        str = str.substr(0,8)+"...";
    }
    return str
}