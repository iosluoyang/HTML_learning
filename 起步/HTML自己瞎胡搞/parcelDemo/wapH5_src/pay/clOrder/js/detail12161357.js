/**
 * Created by hasee on 2017/4/21.
 */

$(function(){
    var payTime = $(".payTime"),sendTime = $(".sendTime"),
        receiveTime = $(".receiveTime"),refoundTime = $(".refoundTime"),closeTime = $(".closeTime");
    var orderNum = GetQueryString("orderNum"),userType=GetQueryString("userType"),
        orderType= GetQueryString("orderType");//订单类型 1大订单详情 2子订单详情;
    var url;
    if(orderType == 1){ //大订单详情
        url = clOrderDetailUrl;
    }else if(orderType == 2){//子订单详情
        url = clSubOrderDetailUrl;
    }


    isLogin(UID,function(){
        $.ajax({
            url:url,
            data:getAuth()+"info={orderNum:'"+orderNum+"'}",
            success:function(data){
                if(data.errCode==0){
                    var bean = data.resultdata.bean,subOrder =bean.subOrder,deliveryTypeDom="",
                        orderStatus,sendType,psType,img;
                    if(orderType == 1){
                        //-------------------------------大订单详情---------------------------------------------
                        switch (bean.status){
                            case "0"://0待付款
                                orderStatus = "待付款";
                                $(".payNow").attr("sum",bean.sum).attr("title",bean.title).attr("orderNum",bean.orderNum).removeClass("hide");
                                $(".close").attr("orderid",bean.orderid).removeClass("hide");
                                break;
                            case "1"://1进行中
                                orderStatus = "进行中";
                                payTime.append(bean.payTime).removeClass("hide");
                                break;
                            case "2"://2(全部订单发货或者退款)已完成
                                orderStatus = "已完成";
                                break;
                            case "3"://3已退款
                                orderStatus = "已退款";
                                break;
                            case "4"://4货源下架未发货变为已关闭（已关闭）
                                orderStatus = "已关闭";
                                closeTime.append(bean.closeTime).removeClass("hide");
                                break;
                            case "5"://5手动取消（已关闭）
                                orderStatus = "已关闭";
                                closeTime.append(bean.closeTime).removeClass("hide");
                                break;
                            case "6"://6 待付款24小时后自动关闭（已关闭）
                                orderStatus = "已关闭";
                                closeTime.append(bean.closeTime).removeClass("hide");
                                break;

                        }

                        //状态和金额信息
                        $(".sec1 p:last").append("&yen;"+bean.sum );

                        //配送信息
                        $(".sec2 p:first").append(bean.userName +" "+bean.userPhone);
                        $(".sec2 p:last").append(bean.psMsg);

                        //配送类型1送货上门(快递包邮)2自提
                        psType = bean.psType;
                        if(psType ==2){
                            appendZiTiMsg(bean.fetchAddress);    //获取自提点信息
                        }


                        var deliverycycles = bean.deliverycycles;
                        if(bean.deliveryType == 1){  //自动配送
                            sendType = "自动配送";
                            for(var i=0;i<deliverycycles.length;i++){
                                if(deliverycycles.count!=0){
                                    deliveryTypeDom += "<li>"+deliverycycles[i].date+" "+deliverycycles[i].count+bean.units+"</li>"
                                }
                            }
                            deliveryTypeDom = "<div class='f_left'>配货日期</div><ul class='grey9 f13'>" +deliveryTypeDom+"</ul>"
                        }else if(bean.deliveryType == 2){    //手动配送
                            sendType = "手动配送";
                            deliveryTypeDom = "<div class='f_left'>配货日期</div><ul class='grey9 f13'><li class='handle'>首次配货日期 "+deliverycycles[0].date+" "+deliverycycles[0].count+bean.units+"</li>" +
                                "<li class='handle'>未指定配货日期 "+(bean.count-deliverycycles[0].count)+bean.units+"</li></ul>";
                        }


                        //商品信息
                        bean.img==""?img=jumpUrl.defaultShopAvatar:img=imgIndexUrl+bean.img;
                        //判断是否已经售罄 quantityFlag 0 已售罄  非0 未全部售罄
                        var quantityFlag = bean.quantityFlag == "0" ? "quantityFlag" : "";
                        //促销的相关信息
                        var promotionInfo = {"tag":bean.tag,"type":"7"};//自己构建促销信息字典 设置type为7则可选择带有圆角的促销标签
                        //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
                        var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);


                        $(".sec4 .top").append(
                            "<li>" +
                                "<div class='row1 clearfix f12' >" +
                                    "<div class='pic f_left "+quantityFlag+" ' style='background-image:url("+img+");'>"+promotionstr+"</div>" +
                                    "<div class='f_left leftDiv'>" +
                                        "<h4 class='title f14 grey6 twoClamp'>"+bean.title+"</h4>" +
                                        "<div class='color oneClamp'>规格："+bean.guige+"/"+bean.units+"</div>" +
                                    "</div>" +
                                    "<div class='f_right rightDiv'>" +
                                        "<div class='price f17 oneClamp'>&yen;"+(bean.sum)+"</div>" +
                                        "<div class='num oneClamp'>x"+(bean.count)+"</div>" +
                                        "<div class='sendType'>"+sendType+"</div>" +
                                    "</div>" +
                                "</div>" +
                                "<div class='row2 f15 clearfix'>"+deliveryTypeDom+"</div></li>");



                        $(".sec4 .bot li:first span:last").append(bean.sum );
                        $(".sec4 .bot li").eq(1).children("span").eq(1).append(bean.freight );
                        $(".sec4 .bot li:last span:last").append(bean.sum );


                        //订单编号
                        $(".sec6 p:first").append(bean.orderNum);

                    }
                    else if(orderType == 2){
                        //-------------------------------小订单详情---------------------------------------------

                        switch (subOrder.status){ //1待发货  2已发货 3已退款 4已完成
                            case "1"://1待发货
                                orderStatus= "待发货";

                                (subOrder.date == "")?
                                    $(".sendToMe").attr("orderNum",bean.orderNum).attr("units",bean.units).removeClass("hide")//配送日期为空
                                    :$(".cuiFaHuo").attr("orderNum", subOrder.orderNum).attr("uid", bean.buyerUser.uid).removeClass("hide");//配送日期不为空
                                //refundFlag 是否申请退款 申请退款标识 0未申请过退款 1大订单申请退款 2子订单单独申请退款
                                if(subOrder.refundFlag == 0){
                                    $(".tuiKuan").attr("subOrderNum",subOrder.orderNum).removeClass("hide");
                                }else if(subOrder.refundFlag == 1 ){//1大订单申请退款
                                    $(".tuiKuanDetail").data({
                                        orderNum:bean.orderNum,
                                        userType:userType
                                    }).removeClass("hide");
                                }else if(subOrder.refundFlag == 2){//2子订单单独申请退款
                                    $(".tuiKuanDetail").data({
                                        subOrderNum:subOrder.orderNum,
                                        userType:userType
                                    }).removeClass("hide");
                                }
                                break;
                            case "2"://2已发货
                                orderStatus= "待收货";

                                //iswlfh 是否物流发货 0 无须物流发货 1物流发货
                                if(subOrder.iswlfh  == 1){
                                    $(".wuLiu").attr("ordernum",subOrder.orderNum).attr("orderid",subOrder.orderid).removeClass("hide");
                                }

                                //确认收货
                                $(".shouHuo").attr("orderNum",subOrder.orderNum).removeClass("hide");

                                sendTime.append(subOrder.sendTime).removeClass("hide");
                                break;

                            case "3"://3已退款
                                orderStatus= "已退款";
                                refoundTime.append(subOrder.refoundTime).removeClass("hide");
                                break;

                            case "4"://4已完成
                                orderStatus= "已完成";


                                //commentFlag 是否评价0未评价1已评价
                                if(subOrder.commentFlag == 0){
                                    $(".comment").data({
                                        orderid:subOrder.orderid,
                                        color:bean.guige,
                                        pid:bean.pid,
                                        orderType:typeObj.customLife
                                    }).removeClass("hide");
                                }

                                sendTime.append(subOrder.sendTime).removeClass("hide");
                                receiveTime.append(subOrder.receiveTime).removeClass("hide");

                        }
                        if(bean.deliveryType == 2){    //手动配送
                            $(".topTip").append("温馨提示：订单需在"+addDate(bean.firstPsdate,365)+"前消费完成").removeClass("hide")
                        }


                        //状态和金额信息
                        $(".sec1 p:last").append("&yen;"+subOrder.sum);

                        //支付方式
                        var payType;
                        if(bean.payType==1){//支付方式 1支付宝2微信
                            payType="支付宝"
                        }else if(bean.payType==2){
                            payType="微信支付"
                        }
                        $(".sec3 .payType").append(payType).removeClass("hide");

                        //配送信息
                        $(".sec2 p:first").append(subOrder.userName+" "+subOrder.userPhone);
                        $(".sec2 p:last").append(subOrder.psMsg);

                        psType=subOrder.sendType;
                        if(psType ==2){
                            appendZiTiMsg(bean.fetchAddress,subOrder.pickupcode);    //获取自提点信息
                        }

                        //配送方式
                        if(bean.deliveryType == 1){  //自动配送
                            sendType = "自动配送";
                        }else if(bean.deliveryType == 2){    //手动配送
                            sendType = "手动配送";
                            if(subOrder.date ==""){
                                subOrder.date = "未指定配货日期";
                            }
                        }
                        deliveryTypeDom = "<div class='f_left'>配货日期</div><ul class='grey9 f13'><li>"+subOrder.date+"</li></ul>";



                        //商品信息
                        bean.img==""?img=jumpUrl.defaultShopAvatar:img=imgIndexUrl+bean.img;
                        //判断是否已经售罄 quantityFlag 0 已售罄  非0 未全部售罄
                        var quantityFlag = bean.quantityFlag == "0" ? "quantityFlag" : "";
                        //促销的相关信息
                        var promotionInfo = {"tag":bean.tag,"type":"7"};//自己构建促销信息字典 设置type为7则可选择带有圆角的促销标签
                        //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
                        var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);



                        $(".sec4 .top").append("<li><div class='row1 clearfix f12' >" +
                            "<div class='pic f_left "+quantityFlag+" ' style='background-image:url("+img+")'>"+promotionstr+"</div><div class='f_left leftDiv'>" +
                            "<h4 class='title f14 grey6 twoClamp'>"+bean.title+"</h4><div class='color oneClamp'>规格："+bean.guige+"/"+bean.units+"</div></div>" +
                            "<div class='f_right rightDiv'><div class='price f17 oneClamp'>&yen;"+subOrder.sum+"</div>" +
                            "<div class='num oneClamp'>x"+subOrder.count+"</div><div class='sendType'>"+sendType+"</div></div></div>" +
                            "<div class='row2 f15 clearfix'>"+deliveryTypeDom+"</div></li>");

                        $(".sec4 .bot li:first span:last").append(subOrder.sum);
                        $(".sec4 .bot li").eq(1).children("span").eq(1).append(subOrder.freight);
                        $(".sec4 .bot li:last span:last").append(subOrder.sum);

                        //时间信息
                        payTime.append(bean.payTime).removeClass("hide");

                        //订单编号
                        $(".sec6 p:first").append(subOrder.orderNum);

                    }


                    //状态
                    $(".sec1 p:first").append(orderStatus);
                    //配送方式
                    $(".sec3 p:first").append(getPsType(psType));
                    //买家留言
                    if(bean.memo){
                        $(".sec3 p:last").append(bean.memo).removeClass("hide");
                    }
                    //下单时间
                    $(".sec6 p").eq(1).append(bean.orderTime);

                    //获取客服电话
                    $.ajax({
                        url:getItemsUrl,
                        data:getAuth()+"info={itemCode:7}",
                        success:function(data){
                            var lisArr = data.resultdata.list;
                            for(var i =0;i<lisArr.length;i++){
                                if(lisArr[i].desc == "客服电话"){
                                    $(".keFu a").attr("href","tel:"+lisArr[i].itemValue);
                                    break;
                                }
                            }
                        }
                    });

                    //----------------------------------点击事件-----------------------------------------


                    //打电话
                    $(".sec5 .tel").attr("href","tel:"+bean.sellerUser.phone);

                    //收起
                    $(".topTip img").click(function(){
                        $(this).parent().slideUp("fast")
                    });

                    //跳转商品详情
                    $(".sec4 .top ").on("click",".row1",function(){
                        location.href = jumpUrl.clProDetail+bean.pid
                    })

                }else {tip(data.msg)}
            }
        });
    });


});


//时间计算
function addDate(date,days){
    var d=new Date(date);
    d.setDate(d.getDate()+days);
    var m=d.getMonth()+1;
    return d.getFullYear()+'-'+m+'-'+d.getDate();
}

//获取配送模式
function getPsType(psType){
    var sendType;
    if(psType==1){//配送类型1送货上门(快递包邮)2自提
        sendType="送货上门";
    }else if(psType ==2){
        sendType="上门自提";
    }
    return sendType;
}



//获取自提数据
function appendZiTiMsg(fetchAddress,pickupcode){
    var pickUpCode = "";
    if(pickupcode){
        pickUpCode = "<div class='pickUpCode f_right f14'>取货码：<span class='f16 red bold'>"+pickupcode+"</span></div>"
    }
    var ziTiMsg = "<div class='ziTiMsg'><h3 class='f16 bold'>自提点信息</h3>" +
        "<h4 class='f16'>"+fetchAddress.name+"</h4><p class='address'>"+fetchAddress.detailAddress+"</p>"+
        "<p class='time'>"+fetchAddress.serviceOntime+"-"+fetchAddress.serviceStoptime+"</p>" +pickUpCode+
        "<p class='tel'><a class='blue' href='tel:"+fetchAddress.mobile+"'>"+fetchAddress.mobile+"</a></p></div>";
    $(".sec3").append(ziTiMsg)
}




