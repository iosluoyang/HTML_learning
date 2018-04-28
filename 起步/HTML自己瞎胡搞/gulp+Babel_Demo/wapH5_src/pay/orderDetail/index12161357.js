/**
 * Created by hasee on 2016/10/10.
 */

$(function(){
    isLogin(UID,function(){

        if(sessionStorage.getItem("orderInfo")){             //本地有从上页带进来的缓存

            //有缓存的提示信息
            if(sessionStorage.getItem("tip")){
                //提示缓存信息
                tip(sessionStorage.getItem("tip"));
                //清除缓存信息
                sessionStorage.removeItem("tip")
            }


            var orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
                var orderStatusDom =$(".sec1 p:first span:last"),    //状态
                    payTimeDom = $(".sec6 .payTime"),                  //支付时间
                    sendTimeDom = $(".sec6 .sendTime"),                  //发货时间
                    receiveTimeDom = $(".sec6 .receiveTime"),                  //收货时间
                    refoundTimeDom = $(".sec6 .refoundTime");                  //退款时间

            if(orderInfo.orderType == typeObj.native){       //原产优品订单
                btnGroup.attr("orderType",typeObj.native);
                //获取原产优品订单详情
                $.ajax({
                        url:tgOrderUrl,
                        data:getAuth()+"info={orderNum:'"+orderInfo.orderNum+"'}",
                        success:function(data) {
                            var tgOrder = data.resultdata.tgOrder;
                            //sec1
                            $(".sec1 p:last span:last").append(tgOrder.sum);      //订单金额
                            //sec2
                            $(".sec2 p:first").append(tgOrder.psMsg);   //配送信息
                            $(".sec2 p:last").append(tgOrder.userMsg);   //联系人
                            //.sec3
                            //配送方式
                            if (tgOrder.psType == 1) {
                                $(".sec3 p:first").append("快递包邮")
                            }
                            //买家留言
                            if (tgOrder.memo) {
                                $(".sec3 p:last").append(tgOrder.memo).show()
                            }
                            //支付方式
                            if(tgOrder.payType==payTypeSign.zfb){        //存在支付方式
                                $(".sec3 .payType").append("支付宝支付");
                            }else if(tgOrder.payType == payTypeSign.wx){
                                $(".sec3 .payType").append("微信支付");
                            }

                            //.sec4
                            var tgListArr = tgOrder.list, tgListli = "";
                            for (var i = 0; i < tgListArr.length; i++) {
                                //商品信息
                                var productdict = tgListArr[i];


                                //促销的相关信息
                                var promotionInfo = {"tag":productdict.tag,"type":"7"};//自己构建促销信息字典 设置type为7则可选择带有圆角的促销标签
                                //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
                                var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);

                                //判断是否已售罄  quantityFlag 0已售罄 非0未售罄
                                var quantityFlag = productdict.quantityFlag == "0" ?"quantityFlag":"";

                                var img = "";
                                productdict.img ? img = imgIndexUrl + productdict.img : img = jumpUrl.defaultShopAvatar;

                                tgListli += "<li pid='" + productdict.pid + "' class='clearfix'>" +
                                    "<div class='pic "+quantityFlag+"' style='background-image: url(" + img + ")'>"+promotionstr+"</div>" +
                                    "<h3 class='title oneClamp f14'>" + productdict.name + "</h3>" +
                                    "<div class='price oneClamp f14'>&yen;" + productdict.price + "</div>" +
                                    "<span class='guiGe f_left oneClamp f12'>规格" + productdict.color + "</span>" +
                                    "<span class='num oneClamp f12'>x" + productdict.quantity + "</span>" +
                                    "</li>"
                            }

                            $(".sec4 .top").append(tgListli);


                            $(".sec4 .bot li:first span:last").append(tgOrder.sum - tgOrder.freight);     //商品金额
                            $(".sec4 .bot li").eq(1).children().eq(1).append(tgOrder.freight);     //配送费用

                            $(".sec4 .bot li:last span:last").append(tgOrder.sum);

                            //sec5
                            (tgOrder.sellerUser && tgOrder.sellerUser.phone)?     //存在卖家信息并且联系方式不为空
                                $(".sec5 a").attr("href", "tel:" + tgOrder.sellerUser.phone)
                                :$(".sec5 a").click(function(){alert('卖家暂时没有提供联系方式')});



                            //sec6
                            $(".sec6 p").eq(0).append(tgOrder.orderNum);    //订单编号
                            $(".sec6 p").eq(1).append(tgOrder.orderTime);    //下单时间

                            //判断订单状态
                            switch (tgOrder.status) {
                                case 0:
                                    //0待付款(立刻支付)            待付款
                                    //      按钮  立即支付 关闭订单 客服
                                    var pidArr = [];
                                    for (var j = 0; j < tgListArr.length; j++) {
                                        pidArr.push(tgListArr[j].pid)
                                    }
                                    orderStatusDom.append("待付款");
                                    $(".payNow").show().attr("orderNum", tgOrder.orderNum).attr("pid", pidArr).attr("title", tgListArr[0].name)
                                        .attr("money", tgOrder.sum).attr("payType", tgOrder.payType);


                                    $(".close").show().attr("orderId", tgOrder.orderid);
                                    $(".sec3 .payType").hide();     //隐藏支付方式
                                    break;
                                //case 1:
                                //    //1已取消 （主动关闭）  取消订单          已关闭
                                //    //      按钮  客服
                                //    orderStatusDom.append("已关闭");
                                //    break;
                                case 2:
                                    //2已付款(已付款的取消订单)    待发货
                                    //      按钮  取消订单 客服
                                    //      时间  支付时间
                                    orderStatusDom.append("待发货");
                                    $(".tuiKuan").show().attr("orderId", tgOrder.orderid);
                                    payTimeDom.show().append(tgOrder.pay_time);
                                    break;
                                case 3:
                                    //3已派发(确认收货)            待收货
                                    //      按钮  1.确认收货 客服  2.确认收货 查看物流 客服
                                    //      时间  支付时间 发货时间
                                    orderStatusDom.append("待收货");
                                    if (tgOrder.iswlfh == 1) {        //物流发货
                                        //$(".wuLiu").show().attr("orderNum", tgOrder.orderNum).attr("orderId", tgOrder.orderid).attr("type", type);
                                        $(".wuLiu").show().attr("orderNum", tgOrder.orderNum).attr("orderId", tgOrder.orderid);
                                    }
                                    $(".shouHuo").show().attr("orderId", tgOrder.orderid);
                                    payTimeDom.show().append(tgOrder.pay_time);
                                    sendTimeDom.show().append(tgOrder.sendTime);
                                    break;
                                case 4:
                                    //4已签收（待评价）            待评价
                                    //      按钮  评价 客服
                                    //      时间  支付时间 发货时间 收货时间
                                    orderStatusDom.append("待评价");
                                    $(".pingJia").show().attr("orderId", tgOrder.orderid);
                                    payTimeDom.show().append(tgOrder.pay_time);
                                    sendTimeDom.show().append(tgOrder.sendTime);
                                    receiveTimeDom.show().append(tgOrder.receive_time);
                                    break;
                                case 5:
                                    //5已完成                      已完成
                                    //      按钮  客服
                                    //      时间  支付时间 发货时间 收货时间
                                    orderStatusDom.append("已完成");
                                    payTimeDom.show().append(tgOrder.pay_time);
                                    sendTimeDom.show().append(tgOrder.sendTime);
                                    receiveTimeDom.show().append(tgOrder.receive_time);
                                    break;
                                case 6:
                                    //6已退款(6已付款的退款)        已退款
                                    //      按钮  客服
                                    //      时间  退款时间
                                    orderStatusDom.append("已退款");
                                    refoundTimeDom.show().append(tgOrder.refound_time);
                                    break;
                                case 7:
                                    //7已关闭 （被动关闭）          已关闭
                                    //      按钮  客服
                                    orderStatusDom.append("已关闭");
                                    $(".sec3 .payType").hide();     //隐藏支付方式
                                    break;
                            }
                        }
                });
            }else if(orderInfo.orderType == typeObj.groupBuy){         //拼团订单
                btnGroup.attr("orderType",typeObj.groupBuy);
                //获取拼团订单详情
                $.ajax({
                    url:grouobuyOrderUrl,
                    data:getAuth()+"info={orderNum:'"+orderInfo.orderNum+"'}",
                    success:function(data){
                        var grouobuyOrder = data.resultdata.grouobuyOrder;

                        //sec1
                        $(".sec1 p:last span:last").append(grouobuyOrder.sum);      //订单金额

                        //sec2
                        $(".sec2 p:last").append(grouobuyOrder.userMsg);   //联系人
                        $(".sec2 p:first").append(grouobuyOrder.psMsg);   //配送信息

                        //.sec3 配送方式
                        if (grouobuyOrder.psType == 1) {
                            $(".sec3 p:first").append("用户自提");
                            $(".sec2 p:first span").html("自提信息：");   //将配送信息改为自提信息
                        }else if(grouobuyOrder.psType == 2){
                            $(".sec3 p:first").append("送货上门");

                        }
                        //买家留言
                        if (grouobuyOrder.memo) {
                            $(".sec3 p:last").append(grouobuyOrder.memo).show()
                        }
                        //支付方式
                        if(grouobuyOrder.payType==payTypeSign.zfb){        //存在支付方式
                            $(".sec3 .payType").append("支付宝支付");
                        }else if(grouobuyOrder.payType == payTypeSign.wx){
                            $(".sec3 .payType").append("微信支付");
                        }


                        //.sec4 商品信息
                        var groupListli = "",img = "";
                        grouobuyOrder.asmain ? img = imgIndexUrl + grouobuyOrder.asmain : img = jumpUrl.defaultShopAvatar;
                        groupListli = "<li gid='" + grouobuyOrder.gid + "' class='clearfix'><div class='pic' style='background-image: url(" + img + ")'></div>" +
                            "<h3 class='title oneClamp f14'>" + grouobuyOrder.title + "</h3>" +
                            "<div class='price oneClamp f14'>&yen;" + grouobuyOrder.price + "</div>" +
                            "<span class='guiGe f_left oneClamp f12'>规格" + grouobuyOrder.color + "</span>" +
                            "<span class='num oneClamp f12'>x" + grouobuyOrder.count + "</span></li>";

                        $(".sec4 .top").append(groupListli);

                        $(".sec4 .bot li:first span:last").append(grouobuyOrder.price);     //商品金额
                        $(".sec4 .bot li").eq(1).children().eq(1).append(0.0);     //配送费用
                        $(".sec4 .bot li:last span:last").append(grouobuyOrder.sum);
                        //sec5
                        (grouobuyOrder.sellerUser && grouobuyOrder.sellerUser.phone) ?
                            $(".sec5 a").attr("href", "tel:" + grouobuyOrder.sellerUser.phone)
                            : $(".sec5 a").click(function(){alert('卖家暂时没有提供联系方式')});

                        //sec6
                        $(".sec6 p").eq(0).append(grouobuyOrder.orderNum);    //订单编号
                        $(".sec6 p").eq(1).append(grouobuyOrder.orderTime);    //下单时间


                        //判断订单状态
                        switch (grouobuyOrder.status) {
                            case 0:
                                //0待付款（未付款）                      待付款
                                //      按钮  立即支付  关闭订单   客服
                                orderStatusDom.append("待付款");
                                $(".payNow").show().attr("orderNum", grouobuyOrder.orderNum)
                                    .attr("gid", grouobuyOrder.gid).attr("title", grouobuyOrder.title)
                                    .attr("money", grouobuyOrder.sum).attr("payType", grouobuyOrder.payType);
                                $(".close").show().attr("orderId", grouobuyOrder.orderid);
                                $(".sec3 .payType").hide();     //隐藏支付方式
                                break;
                            //case 1:
                            //    // 1已取消（未付款取消）                 已关闭
                            //    //      按钮  客服
                            //    orderStatusDom.append("已关闭");
                            //    break;
                            case 2:
                                // 2已退款（已付款退款）                 已退款
                                //      按钮  客服
                                //      时间  支付时间  退款时间
                                orderStatusDom.append("已退款");
                                payTimeDom.show().append(grouobuyOrder.pay_time);
                                refoundTimeDom.show().append(grouobuyOrder.refound_time);
                                break;
                            case 3:
                                // 3待发货（待发货）                     待发货
                                //      按钮  取消订单  客服
                                //      时间  支付时间
                                orderStatusDom.append("待发货");
                                $(".tuiKuan").show().attr("orderId", grouobuyOrder.orderid).attr("phone",grouobuyOrder.sellerUser.phone);
                                payTimeDom.show().append(grouobuyOrder.pay_time);
                                break;
                            case 4:
                                // 4已派发（待收货）                     待收货
                                //      按钮  确认收货  客服
                                //      时间  支付时间  发货时间
                                orderStatusDom.append("待收货");
                                $(".shouHuo").show().attr("orderId", grouobuyOrder.orderid);
                                $(".sec1").append("<div class='t_center'><img src='"+imgIndexUrl+grouobuyOrder.qrcode+"'><p>扫码确认收货</p></div>");
                                payTimeDom.show().append(grouobuyOrder.pay_time);
                                sendTimeDom.show().append(grouobuyOrder.sendTime);

                                break;
                            case 5:
                                // 5已收货（待评价）                     待评价
                                //      按钮  评价   客服
                                //      时间  支付时间  发货时间  收货时间
                                orderStatusDom.append("待评价");
                                $(".pingJia").show().attr("orderId", grouobuyOrder.orderid).attr("gid",grouobuyOrder.gid);
                                payTimeDom.show().append(grouobuyOrder.pay_time);
                                sendTimeDom.show().append(grouobuyOrder.sendTime);
                                receiveTimeDom.show().append(grouobuyOrder.receive_time);
                                break;
                            case 6:
                                // 6已完成（已完成）                     已完成
                                //      按钮  客服
                                orderStatusDom.append("已完成");
                                //payTimeDom.show().append(grouobuyOrder.pay_time);
                                //sendTimeDom.show().append(grouobuyOrder.sendTime);
                                //receiveTimeDom.show().append(grouobuyOrder.receive_time);
                                break;

                            case 7:
                                // 7已关闭（已关闭）                     已关闭
                                //      按钮  客服
                                orderStatusDom.append("已关闭");
                                $(".sec3 .payType").hide();     //隐藏支付方式
                                break;
                        }
                    }
                })
            }

        }else {//本地没有从上页带进来的缓存 进入首页
            location.replace(jumpUrl.find)
        }

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
    });







    //----------------------页面跳转-------------------------------
    //跳转商品详情页
    $(".sec4 .top").on("click","li",function(){
        var pid = $(this).attr("pid"),gid = $(this).attr("gid");
        if(pid){    //跳转原产优品详情
            location.href = jumpUrl.productsDetail+pid
        }else if(gid){      //跳转拼团详情
            location.href = jumpUrl.groupProductsDetail+gid
        }
    });

});


