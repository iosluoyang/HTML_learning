/**
 * Created by hasee on 2017/4/22.
 */

var t1=null;//全局

$(function(){

    //按钮组
    var btnGroup = $(".btnGroupClick");

    //立即支付
    btnGroup.on("click",".payNow",function(e){
        e.stopPropagation();
        if (t1 == null){
            t1 = new Date().getTime();
        }
        else{
            var t2 = new Date().getTime();
            if(t2 - t1 < 800){
                t1 = t2;
                return;
            }else{
                t1 = t2;
            }
        }

        var _this = $(this),payType;


        $.ajax({
            url:checkOrderUrl,
            data:getAuth()+"info={type:5,orderNum:'"+_this.attr("orderNum")+"'}",//1团购 2商品池 4 原产地精选 5定制订单  5的时候传订单号
            success:function(data){
                if(data.errCode==0){            //未失效

                    //校验促销信息是否变更,如果变更的话则提示用户,并且刷新当前页面
                    $.ajax({
                        url:checkpayorderforpromotion,
                        data:getAuth()+"info={type:5,orderNum:'"+_this.attr("orderNum")+"'}",//订单类型 4原产优品   5定制订单
                        success:function(data){
                            if(data.errCode==0){//促销信息未变更,直接下单

                                isWeiXin()? payType = payTypeSign.wx:payType = payTypeSign.zfb;
                                payFor(payType,_this.attr("orderNum"),_this.attr("title"),_this.attr("sum"),_this,typeObj.customLife);

                            }
                            else if (data.errCode == -5){
                                //促销信息发生了改变
                                oneBtnTip({
                                    title:"提示",
                                    content:"商品促销信息已变更,请确认后再次下单",
                                    cancel:function(){
                                        //刷新当前页面
                                        location.reload();
                                    }
                                })

                            }
                            else{
                                tip(data.msg);
                                _this.attr("disabled",false);        //按钮解禁
                            }
                        }
                    });

                }else{
                    tip(data.msg);
                    _this.attr("disabled",false);        //按钮解禁
                }
            }
        });



    });

    //取消订单
    btnGroup.on("click",".close",function(e){
        e.stopPropagation();
        var orderid = $(this).attr("orderid");
        confirmShow({
            title:"提示",
            content:"是否取消订单",
            makeSure:function(){
                $.ajax({
                    url:clCloseOrderUrl,
                    data:getAuth()+"info={orderid:"+orderid+"}",
                    success:function(data){
                        if(data.errCode==0){
                            location.replace(location.href)
                        }else {tip(data.msg)}
                    }
                })
            }
        })
    });

    //申请退款
    btnGroup.on("click",".tuiKuan",function(e){
        e.stopPropagation();
        if (t1 == null){
            t1 = new Date().getTime();
        }else{
            var t2 = new Date().getTime();
            if(t2 - t1 < 2000){
                t1 = t2;
                return;
            }else{
                t1 = t2;
            }
        }
        var _this = $(this), ordernum,orderFlag,//申请退款入口标识：1大订单申请退款2子订单申请退款（默认大订单申请退款）
            orderNum = _this.attr("orderNum"),subOrderNum =  _this.attr("subOrderNum");
        if(orderNum){   //大订单退款
            ordernum = orderNum;
            orderFlag = 1
        }else if(subOrderNum){  //子订单退款
            ordernum = subOrderNum;
            orderFlag = 2
        }
        //获取申请退款信息
        $.ajax({
            url:clGetRefundInfoUrl,
            data:getAuth()+"info={orderNum:'"+ordernum+"',orderFlag:"+orderFlag+",type:5}",
            success:function(data){
                if(data.errCode == 0){
                    var msg = data.resultdata.alertMsg,refundAmount=data.resultdata.refundAmount;
                    confirmShow({
                        title:"提示",
                        content:msg,
                        makeSure:function(){
                            //申请退款
                            $.ajax({
                                url:clRefundServiceUrl,
                                data:getAuth()+"info={orderNum:'"+ordernum+"',orderFlag:"+orderFlag+",type:5,refundAmount:"+refundAmount+"}",
                                success:function(data){
                                    if(data.errCode == 0){
                                        location.reload()
                                    }else {tip(data.msg)}
                                }
                            })
                        }
                    })
                }else {tip(data.msg)}
            }
        })
    });

    //退款详情
    btnGroup.on("click",".tuiKuanDetail",function(e){
        e.stopPropagation();
        var _this = $(this), ordernum,orderFlag,//申请退款入口标识：1大订单申请退款2子订单申请退款（默认大订单申请退款）
            orderNum = _this.data("orderNum"),subOrderNum =  _this.data("subOrderNum");
        if(orderNum){   //大订单退款
            ordernum = orderNum;
            orderFlag = 1
        }else if(subOrderNum){  //子订单退款
            ordernum = subOrderNum;
            orderFlag = 2
        }
        location.href=jumpUrl.clTuiKuanDetail+ordernum+"&orderType="+orderFlag
    });

    //催发货
    btnGroup.on("click",".cuiFaHuo",function(e){
        e.stopPropagation();

        var _this = $(this),orderNum = _this.attr("orderNum"),uid = _this.attr("uid");
        $.ajax({
            url:cldeliveryUrl,
            data:getAuth()+"info={ordernum:'"+orderNum+"',uid:"+uid+",type:5}",
            success:function(data){
                if(data.errCode == 0){
                    oneBtnTip({
                        title:"提示",
                        content:"已为您成功提醒卖家发货，请耐心等待。",
                        btnName:"我知道了"
                    })
                }else {
                    oneBtnTip({
                        title:"提示",
                        content:data.msg,
                        btnName:"我知道了"
                    })
                }
            }
        })
    });


    //给我发货
    btnGroup.on("click",".sendToMe",function(e){
        e.stopPropagation();
        var orderNum = $(this).attr("orderNum"),units = $(this).attr("units");
        //获取手动配送给我发货信息
        $.ajax({
            url:clGetSendToMeInfoUrl,
            data:getAuth()+"info={orderNum:'"+orderNum+"'}",
            success:function(data) {
                if (data.errCode == 0) {
                    var orderinfo = data.resultdata.orderinfo;
                    confirmShow({
                        title:"选择发货数量",
                        content:"<div class='sendInfo clearfix'><div><div class='f_left'>剩余总量：</div><div class='f_left count'>"+orderinfo.count+units+"</div></div>" +
                        "<div class='mid'><div class='f_left'>发货数量：</div><div class='f_left'><span class='minus'></span>" +
                        "<input class='t_center' type='number' onpaste='return false;' pattern='[0-9]*' value='1' >" +
                            "<span class='plus'></span></div></div><div><div class='f_left'>配货时间：</div><div class='f_left'>"+orderinfo.date+"</div></div></div>",
                        makeSure:function(){
                            var count = $(".mid input").val();
                            //给我发货
                            $.ajax({
                                url:clSendToMeUrl,
                                data:getAuth()+"info={orderNum:'"+orderNum+"',count:"+count+",date:'"+orderinfo.date+"'}",
                                success: function (data) {
                                    if(data.errCode == 0){
                                        location.reload()
                                    }else {tip(data.msg)}
                                }
                            })
                        }

                    });

                    //数量加
                    $(".inner").on("click",".plus",function(){
                        var val = Number($(this).prev().val()),MaxVal = Number(orderinfo.count);
                        if(val < MaxVal ){ //选中数量小于剩余数量
                            val ++;
                            $(this).prev().val(val);
                        }else {
                            tip("数量输入有误")
                        }
                    });

                    //数量减
                    $(".inner").on("click",".minus",function(){
                        var val = Number($(this).next().val());
                        if(val > 1){
                            val --;
                            $(this).next().val(val);
                        }else {
                            tip("数量输入有误")
                        }
                    });

                    //数量输入
                    $(".inner").on('input propertychange'," input", function() {
                        var val = Number($(this).val()),MaxVal = Number(orderinfo.count);
                        if(val > MaxVal ) {
                            val = MaxVal
                        }else if(val< 1) {
                            val = 1
                        }
                        $(this).val(val);

                    });
                } else {
                    tip(data.msg)
                }
            }
        })

    });

    //确认收货
    btnGroup.on("click",".shouHuo",function(e){
        e.stopPropagation();
        var orderNum = $(this).attr("orderNum");
        confirmShow({
            title:"提示",
            content:"是否确认收货？",
            makeSure:function(){
                $.ajax({
                    url:clConfirmReceiptUrl,
                    data:getAuth()+"info={orderNum:'"+orderNum+"'}",
                    success:function(data){
                        if(data.errCode==0){
                            location.reload()
                        }else {tip(data.msg)}
                    }
                })
            }
        })
    });

    //查看物流
    btnGroup.on("click",".wuLiu",function(e){
        e.stopPropagation();
        var _this = $(this);
        sessionStorage.setItem("wuLiuInfo", JSON.stringify({
            type:5,
            orderNum:_this.attr("ordernum"),
            id:_this.attr("orderid")
        }));
        location.href = jumpUrl.wuLiu;
    });



    //评价
    btnGroup.on("click",".comment",function(e){
        e.stopPropagation();
        var _this = $(this),orderType = _this.data("orderType");
        sessionStorage.setItem("orderId", _this.data("orderid"));
        if(orderType == typeObj.native){    //原产优品
            location.href = jumpUrl.commendList+"native"
        }else if(orderType == typeObj.groupBuy){      //拼团
            location.href = jumpUrl.commendList+"group&gid="+_this.attr("gid")
        }else if(orderType == typeObj.customLife){      //定制生活
            location.href = jumpUrl.commendList+"customLife&pid=" +_this.data("pid")+"&color="+_this.data("color")
        }
    });


});









