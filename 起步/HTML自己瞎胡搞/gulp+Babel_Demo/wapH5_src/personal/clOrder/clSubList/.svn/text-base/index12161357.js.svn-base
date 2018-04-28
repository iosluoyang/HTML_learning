/**
 * Created by hasee on 2017/4/20.
 */
var orderNum = GetQueryString("orderNum"),firstResult=0,pageSize=60;//注意此处定制订单子订单列表后台没有做分页功能,所以前端写死一次性最多请求60条数据,
// 以后如果要再加分页功能再开启上拉加载的功能
$(function(){

    isLogin(UID,function(){
        getOrderList();
    });

    //上拉加载
    // window.onscroll = function(){
    //     if (getScrollTop() + getClientHeight() == getScrollHeight() && $(".noData").length != 1){
    //         getOrderList();
    //     }
    // };

    //列表跳转
    $(".orderList").on("click","li",function(){
        var _this = $(this),orderNum=_this.attr("orderNum");
        //orderType 1大订单 2子订单
        location.href = jumpUrl.clOrderDetail+orderNum+"&orderType=2";
    });

});



function getOrderList(){
    $.ajax({
        url:clOrderDetailUrl,
        data:getAuth()+"info={orderNum:'"+orderNum+"',pageSize:"+pageSize+",firstResult:"+firstResult+"}",
        success:function(data){
            if(data.errCode==0){
                var bean = data.resultdata.bean,subList = bean.subOrderList,
                    orderStatus,li="";

                if(subList.length<pageSize){
                    appendNoDataMsg($("section"))
                }else {
                    firstResult ++
                }

                for(var i=0;i<subList.length;i++){
                    var img;//设置默认头像
                    subList[i].img?img = imgIndexUrl+subList[i].img:img=jumpUrl.defaultShopAvatar;
                    var btnGroup="";
                    switch (subList[i].status){
                        case "1"://1待发货
                            orderStatus= "待发货";
                            (subList[i].date == "")?
                                btnGroup += "<button  class='sendToMe red' units='"+bean.units+"'  orderNum='"+bean.orderNum+"'>给我发货</button>"//配送日期为空
                                :btnGroup +="<button  orderNum='"+subList[i].orderNum+"'  uid='"+bean.buyerUser.uid+"' class='cuiFaHuo red'>催发货</button>";//配送日期不为空

                            //refundFlag 是否申请退款 申请退款标识 0未申请过退款 1大订单申请退款 2子订单单独申请退款
                            if(subList[i].refundFlag == 0){
                                btnGroup +="<button refundDiscount='"+bean.refundDiscount+"' subOrderNum='"+subList[i].orderNum+"' class='tuiKuan'>退款</button>";
                            }else if(subList[i].refundFlag == 1){   //1大订单申请退款
                                btnGroup +="<button class='tuiKuanDetail' data-order-Num='"+bean.orderNum+"' data-user-Type='1'>退款详情</button>";
                            }else if(subList[i].refundFlag == 2){   //2子订单单独申请退款
                                btnGroup +="<button class='tuiKuanDetail' data-sub-Order-Num='"+subList[i].orderNum+"' data-user-Type='1'>退款详情</button>";
                            }

                            break;
                        case "2"://2已发货
                            orderStatus= "待收货";
                            //iscsflag 是否有售后标识 0没有售后，1存在售后
                            //btnGroup = isShouHou(bean,subList[i]);

                            btnGroup+="<button  class='red shouHuo' orderNum='"+subList[i].orderNum+"'>确认收货</button>";

                            //iswlfh 是否物流发货 0 无须物流发货 1物流发货
                            if(subList[i].iswlfh  == 1){
                                btnGroup+="<button orderid='"+subList[i].orderid+"' ordernum='"+subList[i].orderNum+"' class='wuLiu'>查看物流</button>";
                            }

                            break;

                        case "3"://3已退款
                            orderStatus= "已退款";
                            break;

                        case "4"://4已完成
                            orderStatus= "已完成";
                            //btnGroup = isShouHou(bean,subList[i]);

                            //commentFlag 是否评价0未评价1已评价
                            if(subList[i].commentFlag == 0){
                                btnGroup +="<button  class='comment' data-orderid='"+subList[i].orderid+"' data-order-Type='"+typeObj.customLife+"' " +
                                    "data-pid='"+bean.pid+"' data-color='"+bean.guige+"' >评价</button>";
                            }

                            break;
                    }

                    //获取配送日期
                    var sendDate;
                    (subList[i].date=="")?
                        sendDate ="未指定配货日期"
                        :sendDate =subList[i].date.replace(/-/g,".");

                    li+="<li orderNum='"+subList[i].orderNum+"' >" +
                        "<div class='top f12 grey9'>"+bean.shopName+"<span>"+orderStatus+"</span></div>" +
                        "<div class='mid clearfix f13'><div class='pic f_left' style='background-image:url("+img+") '></div>" +
                        "<div class='hGroup'><h3 class='oneClamp'>"+subList[i].title+"</h3>" +
                        "<p class='grey6 oneClamp'>"+subList[i].guige+"/"+bean.units+"*"+subList[i].count+"</p>" +
                        "<p class='red sumPrice'>&yen;"+subList[i].sum+"</p>" +
                        "<p class='grey9'>"+sendDate+"</p></div></div>" +
                        "<div class='bot f13 t_right'>"+btnGroup+"</div></li>";
                }

                $(".orderList").append(li);

            }else {tip(data.msg)}

        }
    });
}


//是否有售后 返回售后或者售后详情按钮
//function isShouHou(bean,subList){
//    var btnGroup;
//    //iscsflag 是否有售后标识 0没有售后，1存在售后
//    if(subList.iscsflag == 0){
//        btnGroup="<button  class='shouHou' data-ordernum='"+bean.orderNum+"' data-sub-Order-Num='"+subList.orderNum+"'" +
//            "data-pid='"+bean.pid+"' data-specs='"+bean.guige+"' data-uid='"+bean.buyerUser.uid+"' data-img='"+bean.img+"' data-price='"+subList.sum+"'" +
//            "data-name='"+bean.title+"' data-count='"+subList.count+"'>售后</button>";
//    }else if(subList.iscsflag == 1){
//        btnGroup="<button  class='shouHouDetail' data-ordernum='"+subList.orderNum+"'" +
//            "data-pid='"+bean.pid+"' data-specs='"+bean.guige+"' data-uid='"+bean.buyerUser.uid+"' >售后详情</button>";
//    }
//    return btnGroup
//}









