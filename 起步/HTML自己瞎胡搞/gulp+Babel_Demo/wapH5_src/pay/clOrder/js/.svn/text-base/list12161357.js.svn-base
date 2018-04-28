/**
 * Created by hasee on 2017/4/8.
 */

$(function(){
    //切换导航
    $("nav li").click(function(){
        var _this = $(this),navStatus=_this.attr("status");
        if(!_this.hasClass("active")){
            $(this).addClass("active").siblings().removeClass("active");
            $(".orderList").empty();
            firstResult=0;
            pageSize=10;
            firstResultOnce = true;
            myScroll.scrollTo(0,0);
            DATE="";
            //获取数据列表
            load(navStatus)
        }
    });

    if(!UID){   //不存在用户信息 记录当前页面链接 登录后跳回当前页面
        sessionStorage.setItem("completeUrl",location.href);
    }
    isLogin(UID,function(){
        load(status);
    });



    //列表跳转
    $(".orderList").on("click","li",function(){

        var _this = $(this),subOrderFlag = _this.attr("subOrderFlag"),orderNum=_this.attr("orderNum");
        if(subOrderFlag == 0){  //是否有子订单标识0否1是
            //跳转详情页面     //orderType 1大订单 2子订单
            location.href = jumpUrl.clOrderDetail+orderNum+"&orderType=1";
        }else if(subOrderFlag == 1){
            //跳转子订单列表
            location.href = jumpUrl.clSubList+orderNum;
        }
    });



});


var firstResult= 0,pageSize=10,DATE="",status= -1;//-1全部0待付款1待进行中2已结束;          //设置默认页面分页
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
    setTimeout(function () {scrollFun(upAction,downAction)}, 200);
}, false);




//下拉刷新
function upAction(){
    $(".orderList").empty();
    firstResult=0;
    firstResultOnce = true;
    DATE="";
    var navStatus=$("nav .active").attr("status");
    load(navStatus)
}

function downAction(){
    var navStatus=$("nav .active").attr("status");
    $.ajax({
        url:clOrderListUrl,
        data:getAuth(UID)+"info={uid:'"+UID+"',status:"+navStatus+",date:'"+DATE+"',firstResult:"+firstResult+",pageSize:"+pageSize+"}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="";
                DATE = data.resultdata.date;
                if(list.length < 10){
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

                getOrderList(list)
            }else {tip(data.msg)}
        },error:function(msg){console.log(msg.statusText);myScroll.refresh()}
    });

}

//获取订单列表
function load(status){
    $.ajax({
        url:clOrderListUrl,
        data:getAuth(UID)+"info={uid:'"+UID+"',status:"+status+",date:'"+DATE+"',firstResult:0,pageSize:"+pageSize+"}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list;
                DATE = data.resultdata.date;
                console.log(DATE);
                if(list.length==0 ){   //当list长度为0 并且分页为第一页  说明没有数据展现缺省页
                    $("#wrapper").hide();
                    $(".noOrder").show();
                }else{
                    $("#wrapper").show();
                    $(".noOrder").hide();

                    if(list.length < 10){
                        $(".pullUpLabel").html("没有更多内容了喔~"); //显示提示内容
                        //根据分页开关控制 分页只++一次 不会累加
                        if (firstResultOnce) {
                            firstResult++;
                            firstResultOnce = false;
                        }
                    }else {
                        firstResult++
                    }
                    getOrderList(list)
                }
            }else {tip(data.msg)}
        }
    })
}


function getOrderList(list){
    var li="";
    for(var i= 0;i<list.length;i++){
        var img;//设置默认头像
        list[i].img?img = imgIndexUrl+list[i].img:img=jumpUrl.defaultShopAvatar;
        var orderStatus,btnGroup="",sendPlan="";
        switch (list[i].orderStatus){
            case "0"://0待付款
                orderStatus = "待付款";
                btnGroup="<button orderNum='"+list[i].orderNum+"' sum='"+list[i].sum+"' " +
                    "title='"+list[i].title+"'  class='payNow red'>立即支付</button>";
                break;
            case "1"://1进行中
                orderStatus = "进行中";
                //refundFlag	申请退款标识0未申请过退款1大订单申请退款2子订单单独申请退款
                if(list[i].refundFlag == 0 || list[i].refundFlag == 2){ //当未申请过退款 或只有子订单申请过退款 都展示退款按钮
                    btnGroup="<button  orderNum='"+list[i].orderNum+"'  class='tuiKuan'>退款</button>";
                }else if(list[i].refundFlag == 1 ){     //当大订单申请过退款 展示退款详情
                    btnGroup="<button class='tuiKuanDetail' data-order-Num='"+list[i].orderNum+"' data-user-type='1'>退款详情</button>";
                }

                sendPlan = "<span class='f_right'>（已发"+list[i].sendCount+list[i].units+" 未发"+list[i].subCount+list[i].units+"）</span>";
                break;
            case "2"://2(全部订单发货或者退款)已完成
                orderStatus = "已完成";
                break;
            case "3"://3已退款
                orderStatus = "已退款";
                break;
            case "4"://4货源下架未发货变为已关闭（已关闭）
                orderStatus = "已关闭";
                break;
            case "5"://5手动取消（已关闭）
                orderStatus = "已关闭";
                break;
            case "6"://6 待付款24小时后自动关闭（已关闭）
                orderStatus = "已关闭";
                break;
        }
        list[i].orderTime = list[i].orderTime.split(" ")[0].replace(/-/g,".");
        //判断是否已经售罄 quantityFlag 0 已售罄  非0 未全部售罄
        var quantityFlag = list[i].quantityFlag == "0" ? "quantityFlag" : "";
        //促销标签
        var promotiontag = list[i].tag;
        //促销的相关信息
        var promotionInfo = {"tag":promotiontag,"type":"7"};//自己构建促销信息字典 设置type为7则可选择带有圆角的促销标签
        //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
        var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);


        li+="<li orderNum='"+list[i].orderNum+"' subOrderFlag='"+list[i].subOrderFlag+"'>" +
            "<div class='top f12 grey9'>"+list[i].shopName+"<span>"+orderStatus+"</span></div>" +
            "<div class='mid clearfix f13'><div class='pic f_left "+quantityFlag+" ' style='background-image:url("+img+") '>"+promotionstr+"</div>" +
            "<div class='hGroup'><h3 class='oneClamp'>"+list[i].title+"</h3>" +
            "<p class='grey6 oneClamp'>"+list[i].guige+"/"+list[i].units+"*"+list[i].count+"</p>" +
            "<p class='red sumPrice f14'>&yen;"+list[i].sum+"</p>" +
            "<p class='grey9 f12'>"+list[i].orderTime+ sendPlan+"</p></div></div>" +
            "<div class='bot f13 t_right'>"+btnGroup+"</div></li>";
    }
    $(".orderList").append(li)
}








