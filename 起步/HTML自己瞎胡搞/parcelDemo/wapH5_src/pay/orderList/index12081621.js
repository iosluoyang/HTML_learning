/**
 * Created by hasee on 2016/10/9.
 */

var navP = $("nav .all p");     //导航显示分类Dom
var mySwiper = new Swiper ('.swiper-container', {slidesPerView : 'auto'});

//订单类型
//  type  1全部  2周边商家  3拼团  4原产精选  5周边商家和拼团
var type =  getUrlHash("type") || navP.attr("type")  ;

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


$(function(){
    //首次加载数据

    if(!UID){   //不存在用户信息 记录当前页面链接 登录后跳回当前页面
        sessionStorage.setItem("completeUrl",location.href);
    }
    isLogin(UID,function(){
        load();
    });

    //监听hash改变事件
    if(isQQInIos){
        hashHasChange(load)
    }else {
        window.onhashchange = function() {
            load();
        }
    }

    //-------------------------------导航点击事件---------------------------------------
    //可滑动导航点击事件
    $(".statusList li").click(function(){
        if(!$(this).hasClass("active")){        //当前没有被选中
            $(this).addClass("active").siblings().removeClass("active");    //更改选中效果
            firstResult=0;                      //分页重置
            firstResultOnce = true;             //分页标致重置
            location.hash = "type="+type+"&status="+$(this).attr("status");
            myScroll.scrollTo(0,0);      //回到顶部
        }
    });

    //导航第一项点击或失去焦点时显示或隐藏下拉菜单
    navP.click(function(){
        var _this = $(this);
        _this.next().slideToggle(300);        //显示或收起下拉菜单
        _this.parent().toggleClass("active");      //改变箭头效果
    }).blur(function(){
        var _this = $(this);
        _this.next().slideToggle(300);        //显示或收起下拉菜单
        _this.parent().toggleClass("active");      //改变箭头效果
    });

    //导航点击下拉菜单
    $("nav .all ul li").click(function(){
        var _this =$(this);
        if(_this.attr("type")!= navP.attr("type")){    //不为已经选中的状态
            navP.html(_this.html()).attr("type",_this.attr("type"));   //展现选中内容
            firstResult=0;                      //分页重置
            firstResultOnce = true;             //分页标致重置
            $(".statusList li").removeClass("active");      //清除选中效果
            //切换hash 为选中type status 状态为1
            location.hash = "type="+_this.attr("type")+"&status=1";
            myScroll.scrollTo(0,0);      //回到顶部

        }
    });

    //-------------------------------跳转点击事件---------------------------------------

    //跳转订单详情页
    $(".list").on("click","li",function(){
        var _this = $(this),
            orderInfo = {
                orderType:_this.attr("orderType"),
                orderNum:_this.attr("orderNum")
            };
        sessionStorage.setItem("orderInfo", JSON.stringify(orderInfo));
        location.href = jumpUrl.orderDetail
    });


    //-------------------------------状态点击事件---------------------------------------
    //阻止事件冒泡
    $(".list").on("click",".type1",function(e){e.stopPropagation();}).on("click",".type2",function(e){e.stopPropagation();});

});

//加载事件
function load(){


    //status 订单状态
    //  1全部 2待付款    3待发货    4待收货    5待评价    6已完成    7已关闭
    var status = getUrlHash("status") ||1;  //状态默认为1

    //订单类型
    //  type  1全部  2周边商家  3拼团  4原产精选  5原产精选和拼团
    type =  getUrlHash("type") || 5;    //类型默认为原产精选和拼团 ;
    if(type == 3){      //展现社区拼团
        navP.html("社区拼团")
    }else if(type == 4){    //展现原产精选
        navP.html("原产优品")
    }


    if(status == 1){    //选中全部
        $(".statusList li").removeClass("active");
    }else {
        for(var i=0;i<$(".statusList li").length;i++ ){
            if($(".statusList li").eq(i).attr("status") == status){
                $(".statusList li").eq(i).addClass("active").siblings().removeClass("active");      //增加选中样式

                break
            }
        }
    }
    //重新设置mySwiper宽度
    mySwiper.onResize();
    mySwiper.slideTo($(".statusList .active").index() || 0, 500,false);             //滑动到对应列表

    $(".list").empty();                 //清空列表
    $(".pullUpLabel").html("上拉加载更多...");        //上拉加载重置

    $.ajax({
        url:orderUserListUrl,
        data:getAuth()+"info={pageSize:'"+pageSize+"',firstResult:'0',uid:'"+UID+"',status:'"+status+"',type:'"+type+"'}",
        success:function(data){
            if(data.errCode==0){
                var orderUserListArr = data.resultdata.orderUserList;
                listLoad(orderUserListArr);
                if(orderUserListArr.length < 10){
                    $(".pullUpLabel").html("没有更多内容了喔~"); //显示提示内容
                }
                firstResult++
            }else {
                tip(data.msg)
            }
        }
    });
}



//获取列表数据
function listLoad(orderUserListArr){
    var orderUserListLi = "";
    for(var i=0;i<orderUserListArr.length;i++){
        //orderType 订单类型
        //  1 原产优品 2拼团

        var  oneButton="", twoButton = "",img="",orderType="";


        if(orderUserListArr[i].pid){        //原产优品订单
            orderType =typeObj.native;       //设置订单类型标识

            //status 订单状态
            // 0待付款(立刻支付)                   立即支付
            // 1已关闭(待付款的取消订单)           已关闭
            // 2待发货 (已付款的取消订单)          待发货
            // 3已派发(确认收货)                   确认收货
            // 4已签收（待评价）                   待评价
            // 5已完成(再次购买)                   已完成
            // 6已取消(已付款的再次购买 退款)      已退款
            // 7已关闭(被动关闭)                   已关闭

            //if(orderUserListArr[i].tgOrderStatus == 0){             //待支付状态
            //
            //    oneButton = "<button class='payNow' pid='"+orderUserListArr[i].pid+"' title='"+orderUserListArr[i].title+"' " +
            //        "money='"+orderUserListArr[i].sum+"'payType='"+orderUserListArr[i].payType+"' orderNum='"+orderUserListArr[i].orderNum+"' >立即支付</button>"
            //}else if(orderUserListArr[i].tgOrderStatus ==3){        //待收货状态
            //    if(orderUserListArr[i].iswlfh == 0){                //无需物流发货 => 只有确认收货按钮
            //        oneButton = "<button class='shouHuo' orderId='"+orderUserListArr[i].orderid+"'>确认收货</button>"
            //    }else{                                              //需要物流发货 => 确认收货和查看物流两个按钮
            //        twoButton = "<div class='type2 t_center clearfix f14'><div class='wuLiu f_left red' orderNum = '"+orderUserListArr[i].orderNum+"' orderId='"+orderUserListArr[i].orderid+"' >查看物流</div>" +
            //            "<div class='shouHuo f_left red' orderId='"+orderUserListArr[i].orderid+"'>确认收货</div></div>";
            //    }
            //}else if(orderUserListArr[i].tgOrderStatus == 4){             //待评价状态
            //    oneButton = "<button class='pingJia' orderId = '"+orderUserListArr[i].orderid+"'>评价</button>"
            //}else {                                                 //没有按钮 只展现状态
            //
            //
            //}

            switch (orderUserListArr[i].tgOrderStatus){
                case "0":   //待支付状态

                    oneButton = "<button class='payNow' pid='"+orderUserListArr[i].pid+"' title='"+orderUserListArr[i].title+"' " +
                        "quantityFlag='"+orderUserListArr[i].quantityFlag+"' " +
                        "money='"+orderUserListArr[i].sum+"' payType='"+orderUserListArr[i].payType+"' orderNum='"+orderUserListArr[i].orderNum+"' >立即支付</button>";
                    break;
                case "2":
                    oneButton="<span>待发货</span>";break;
                case "3":
                    if(orderUserListArr[i].iswlfh == 0){                //无需物流发货 => 只有确认收货按钮
                        oneButton = "<button class='shouHuo' orderId='"+orderUserListArr[i].orderid+"'>确认收货</button>"
                    }else{                                              //需要物流发货 => 确认收货和查看物流两个按钮
                        twoButton = "<div class='type2 t_center clearfix f14'><div class='wuLiu f_left red' orderNum = '"+orderUserListArr[i].orderNum+"' orderId='"+orderUserListArr[i].orderid+"' >查看物流</div>" +
                            "<div class='shouHuo f_left red' orderId='"+orderUserListArr[i].orderid+"'>确认收货</div></div>";
                    }
                    break;
                case "4":   //待评价状态
                    oneButton = "<button class='pingJia' orderId = '"+orderUserListArr[i].orderid+"'>评价</button>";
                    break;
                case "5":
                    oneButton="<span>已完成</span>";break;
                case "6":
                    oneButton="<span>已退款</span>";break;
                case "7":
                    oneButton="<span>已关闭</span>";break;
                //case "1":
                //    orderStatus="<span>已关闭</span>";break;
            }
            //oneButton=orderStatus;


        }
        else if(orderUserListArr[i].gid) {      //拼团订单
            orderType =typeObj.groupBuy;       //设置订单类型标识

            //groupOrderStatus	订单状态:
            // 0待付款(立刻支付)            立即支付
            // 1已取消(待付款的取消订单)    已关闭
            // 2已取消(已付款的取消订单)    已退款
            // 3待发货(已付款的取消订单)    待发货
            // 4已派发(确认收货)            确认收货
            // 5已收货（待评价）            评价
            // 6已完成                      已完成
            // 7已关闭                      已关闭

            //if (orderUserListArr[i].groupOrderStatus == 0) {             //待支付状态
            //    oneButton = "<button class='payNow' gid='" + orderUserListArr[i].gid + "' title='" + orderUserListArr[i].title + "' " +
            //        "money='" + orderUserListArr[i].sum + "' payType='" + orderUserListArr[i].payType + "' orderNum='" + orderUserListArr[i].orderNum + "' >立即支付</button>"
            //} else if (orderUserListArr[i].groupOrderStatus == 4) {        //待收货状态
            //    oneButton = "<button class='shouHuo' orderId='" + orderUserListArr[i].orderid + "'>确认收货</button>"
            //} else if (orderUserListArr[i].groupOrderStatus == 5) {             //待评价状态
            //    oneButton = "<button class='pingJia' orderId = '" + orderUserListArr[i].orderid + "' gid='"+orderUserListArr[i].gid+"'>评价</button>"
            //} else {                                                 //没有按钮 只展现状态

                switch (orderUserListArr[i].groupOrderStatus) {
                    case "0":
                        oneButton = "<button class='payNow' gid='" + orderUserListArr[i].gid + "' title='" + orderUserListArr[i].title + "' " +
                            "money='" + orderUserListArr[i].sum + "' payType='" + orderUserListArr[i].payType + "' orderNum='" + orderUserListArr[i].orderNum + "' >立即支付</button>";
                        break;
                    case "2":
                        oneButton = "<span>已退款</span>";
                        break;
                    case "3":
                        oneButton = "<span>待发货</span>";
                        break;
                    case "4":
                        oneButton = "<button class='shouHuo' orderId='" + orderUserListArr[i].orderid + "'>确认收货</button>";
                        break;
                    case "5":
                        oneButton = "<button class='pingJia' orderId = '" + orderUserListArr[i].orderid + "' gid='"+orderUserListArr[i].gid+"'>评价</button>";
                        break;
                    case "6":
                        oneButton = "<span>已完成</span>";
                        break;
                    case "7":
                        oneButton = "<span>已关闭</span>";
                        break;
                }
                //oneButton = orderStatus;
            //}
        }


        orderUserListArr[i].img? img=imgIndexUrl+orderUserListArr[i].img : img="../../public/images/base/defaultShopAvatar.png";    //设置默认头像

        //判断是否已售罄  quantityFlag 0已售罄 非0未售罄
        var quantityFlag = orderUserListArr[i].quantityFlag == "0" ?"quantityFlag":"";



        orderUserListLi+="<li class='clearfix' orderType='"+orderType+"' status='"+orderUserListArr[i].status+"' orderNum = '"+orderUserListArr[i].orderNum+"'>" +
            "<div class='type1 f_right'>"+oneButton+"</div>" +
            "<div class='pic f_left "+quantityFlag+"' style='background-image: url("+img+")'></div>" +
            "<h3 class='oneClamp title f14'>"+orderUserListArr[i].title+"</h3>" +
            "<p class='guiGe f12 oneClamp'>"+orderUserListArr[i].color+"<span class='num red'>x"+orderUserListArr[i].count+"</span></p>" +
            "<time class='grey9 f11'>"+orderUserListArr[i].orderTime+"</time>"+twoButton+"</li>";
    }
    $(".list").append(orderUserListLi)
}


//上拉加载
function upAction(){
    var statusListArr = $(".statusList li"), status ="1";    //默认为全部状态
    for(var i=0;i<statusListArr.length;i++){
        if(statusListArr.eq(i).hasClass("active")){     //获取当前选中的状态 若列表内的都是为选中 默认为全部状态
            status = statusListArr.eq(i).attr("status")
        }
    }
    //加载数据
    $.ajax({
        url:orderUserListUrl,
        data:getAuth()+"info={pageSize:'10',firstResult:'"+firstResult+"',uid:'"+UID+"',status:'"+status+"',type:'"+type+"'}",
        success:function(data){
            if(data.errCode==0){
                var orderUserListArr = data.resultdata.orderUserList;
                listLoad(orderUserListArr);
                if(orderUserListArr.length < 10){
                    myScroll.refresh();
                    $(".pullUpLabel").html("没有更多内容了喔~"); //显示提示内容
                    //根据分页开关控制 分页只++一次 不会累加
                    if (firstResultOnce) {
                        firstResult++;
                        firstResultOnce = false;
                    }
                }else {
                    firstResult++
                }
            }else {
                tip(data.msg)
            }
        },
        error:function(msg){console.log(msg.statusText);myScroll.refresh();}
    });
}



//ios QQ内置浏览器不能通过onhashchange事件监听hash改变
function hashHasChange(load){
    var location = window.location,
        oldURL = location.href,
        oldHash = location.hash;
    // 每隔100ms检测一下location.hash是否发生变化
    setInterval(function() {
        var newURL = location.href,
            newHash = location.hash;

        // 如果hash发生了变化,且绑定了处理函数...
        if(newHash != oldHash) {
            load();
            oldURL = newURL;
            oldHash = newHash;
        }
    }, 150);
}

