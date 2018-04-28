/**
 * Created by hasee on 2016/11/24.
 */

//订单列表、订单详情、确认订单页面共用部分

//-----------------------------按钮的点击事件--------------------------------

//按钮组
var btnGroup = $(".btnGroupClick");

//----------------跳转页面-----------------
//跳转物流页面
btnGroup.on("click",".wuLiu",function(e){
    e.preventDefault();
        var wuLiuInfo = {
            id:$(this).attr("orderId"),
            orderNum:$(this).attr("orderNum"),
            type:4
        };
    sessionStorage.setItem("wuLiuInfo", JSON.stringify(wuLiuInfo));
    location.href = jumpUrl.wuLiu;
});


//跳转评价列表页面
btnGroup.on("click",".pingJia",function(e){
    e.preventDefault();
    var _this = $(this),
        //获取orderType 订单类别
        orderType = _this.parents("li").attr("orderType") ||btnGroup.attr("orderType");
    sessionStorage.setItem("orderId", $(this).attr("orderId"));
    if(orderType == typeObj.native){    //原产优品
        location.href = jumpUrl.commendList+"native"
    }else if(orderType == typeObj.groupBuy){      //拼团
        location.href = jumpUrl.commendList+"group&gid="+_this.attr("gid")
    }
});

//--------------改变订单状态-----------------
//取消订单  未付款直接关闭 status传1
btnGroup.on("click",".close",function(){
    var _this = $(this);
    //二次确认
    confirmShow({
        title:"提示",
        content:"是否关闭订单？",
        makeSure:function(){
            updateStatus(_this,"关闭订单")
        }
    });

});

//确认收货 status传4
btnGroup.on("click",".shouHuo",function(){
    var _this = $(this);
    //二次确认
    confirmShow({
        title:"提示",
        content:"是否确认收货？",
        makeSure:function(){
            updateStatus(_this,"确认收货")
        }
    });

});

//退款  已付款退款   status传6
btnGroup.on("click",".tuiKuan",function(){
    var _this = $(this),orderType = _this.parents("li").attr("orderType") ||btnGroup.attr("orderType");
    if(orderType == typeObj.native){
        //二次确认
        confirmShow({
            title:"提示",
            content:"是否取消订单？",
            makeSure:function(){
                updateStatus(_this,"退款")
            }
        });
    }else if(orderType == typeObj.groupBuy){
        //二次确认
        confirmShow({
            title:"提示",
            content:"是否拨打社长电话取消订单？<br>"+_this.attr("phone"),
            makeSure:function(){
                location.href = "tel:"+_this.attr("phone")
            }
        });
    }


});


//立即支付
btnGroup.on("click",".payNow",function(e){
    e.preventDefault();
    var _this = $(this),checkStockFlag = true,orderType = _this.parents("li").attr("orderType") ||btnGroup.attr("orderType"),
        orderNum=_this.attr("orderNum"), payType=_this.attr("payType"), pid=_this.attr("pid") || "",gid=_this.attr("gid") || "",
        title = _this.attr("title"), money = _this.attr("money");
    _this.attr("disabled",true);        //禁止点击 防止重复下单

    if(pid){
        //原产优品
        //stockLimitFlag    0 所有商品都没有库存限制 1 有商品有库存限制 默认1
        // var stockLimitFlag =  _this.attr("stockLimitFlag") || 1,quantityFlag=_this.attr("quantityFlag");
        //
        // if(quantityFlag == 0 || quantityFlag == 1){   //全部没有库存 0已售罄 1未全部售罄（包含部分售罄）
        //     checkStockFlag = false;
        //     noQuantityTip(pid);
        //     _this.attr("disabled",false);        //按钮解禁
        // }
        // else if(quantityFlag == 2 && stockLimitFlag == 1){
        //     //2全部没售罄 并且有商品有库存限制时
        //     //检查订单库存信息
        //     $.ajax({
        //         url:checkStockInfoUrl,
        //         data:getAuth()+"info={orderNum:'"+orderNum+"'}",
        //         async:false,
        //         success:function(data){
        //             if(data.errCode == 0){
        //
        //             }else {
        //                 checkStockFlag = false;
        //                 noQuantityTip(pid)
        //             }
        //         }
        //     })
        // }
        /*注意:1.3.3版本(即促销模块)待付款订单支付的时候不需要检查订单商品库存了,故将检查库存的代码注释掉*/

        if(checkStockFlag){
            $.ajax({
                url:checkOrderUrl,
                data:getAuth()+"info={type:4,pid:'"+pid+"'}",//1团购 2商品池 4 原产地精选
                success:function(data){
                    if(data.errCode==0){            //未失效

                        //开始检查促销信息是否修改
                        //校验促销信息是否变更,如果变更的话则提示用户,并且刷新当前页面
                        $.ajax({
                            url:checkpayorderforpromotion,
                            data:getAuth()+"info={type:4,orderNum:'"+_this.attr("orderNum")+"'}",//订单类型 4原产优品   5定制订单
                            success:function(data){
                                if(data.errCode==0){//促销信息未变更,直接下单

                                    payFor(payType,orderNum,title,money,_this,orderType)

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
                                    });
                                    _this.attr("disabled",false);        //按钮解禁

                                }
                                else{
                                    tip(data.msg);
                                    _this.attr("disabled",false);        //按钮解禁
                                }
                            }
                        });

                    }
                    else{
                        tip(data.msg);
                        _this.attr("disabled",false);        //按钮解禁
                    }
                }
            })
        }

    }
    else {        //拼团
        $.ajax({
            url:checkOrderUrl,
            data:getAuth()+"info={type:1,id:'"+gid+"'}",//1团购 2商品池 4 原产地精选
            success:function(data){
                if(data.errCode==0){            //未失效
                    payFor(payType,orderNum,title,money,_this,orderType)
                }else{
                    tip(data.msg);
                    _this.attr("disabled",false);        //按钮解禁
                }
            }
        })
    }

});




//改变状态逻辑
function updateStatus(_this,toStatus){
    var orderType = _this.parents("li").attr("orderType") ||btnGroup.attr("orderType"),
        orderId = _this.attr("orderId");

    //---------改变原产优品订单状态
    // 0待付款(立刻支付)
    // 7已取消                     待付款取消订单
    // 2已付款
    // 3已派发                     确认收货
    // 4已签收
    // 5已完成
    // 6已付款的已取消(退款)       已付款退款
    // 7已关闭
    //-------------------------------------------------
    //---------改变拼团订单状态
    // 0待付款(立刻支付)
    // 7已取消(未付款的已取消)    待付款取消订单
    // 2已取消(已付款的已取消)    已付款退款
    // 3待发货(确认发货)
    // 4已派发(确认收货)          确认收货
    // 5已收货（待评价）
    // 6已完成
    // 7已关闭
    //--------------------------------
    var status ="";
    if(toStatus == "关闭订单"){
        if(orderType == typeObj.native){         //原产优品
            //status = 1;
            status = 7;
            //alert("原产取消订单")
        }else if(orderType == typeObj.groupBuy){       //拼团
            //status = 1;
            status = 7;
            //alert("拼团取消订单");
        }
    }else if(toStatus == "退款"){
        status = 6;     //原产优品  拼团需要调起社长联系方式 通过社长退款

    }else if(toStatus == "确认收货"){
        if(orderType == typeObj.native){         //原产优品
            status = 4;
            //alert("原产确认收货")
        }else if(orderType == typeObj.groupBuy){       //拼团
            status = 5;
            //alert("拼团确认收货")
        }
    }
    var url="";
    if(orderType == typeObj.native){         //原产优品
        url = updateStatusUrl;

    }else if(orderType == typeObj.groupBuy){       //拼团
        url= updateOrderStausUrl
    }

    $.ajax({
        url:url,
        data:getAuth()+"info={orderid:'"+orderId+"',status:'"+status+"'}",
        success:function(data){
            if(data.errCode==0){    //改变状态成功
                if(status == 6){        //退款完成后 缓存标识 刷新页面显示提示信息
                    sessionStorage.setItem("tip","订单退款将于七个工作日内退还到您的支付账户")
                }
                location.reload();
            }else {tip(data.msg)}
        }
    })

}


//单个或多个商品库存不足提示
function noQuantityTip(pid){
    (pid.indexOf(",")>0)?
        oneBtnTip({title:"提示",content:"部分商品剩余库存不足，请联系卖家补足库存。",btnName:"确认"})       //多个商品
        :oneBtnTip({title:"提示",content:"该规格商品剩余库存不足，请联系卖家补足库存。",btnName:"确认"}) ;      //单个商品

}







