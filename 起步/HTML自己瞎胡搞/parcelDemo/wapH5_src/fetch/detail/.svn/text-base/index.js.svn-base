/**
 * Created by hasee on 2017/7/3.
 */


$(function(){

    var orderNum = GetQueryString("orderNum");

    isFetchLogin(fetchid,function (){
        //获取订单信息
        $.ajax({
            url:getFetchOrderInfoUrl,
            data:getAuth()+"info={fetchid:"+fetchid+",orderNum:'"+orderNum+"'}",
            success:function(data){
                var bean = data.resultdata.bean;

                //配送信息
                $(".sec1 p:first").append(bean.userName+" "+bean.userPhone);
                $(".sec1 p:last").append(bean.psMsg);

                //商品信息
                var img = jumpUrl.defaultAvatar;
                if(bean.img){img = imgIndexUrl + bean.img}
                var proInfo = "<div class='pic f_left' style='background-image: url("+img+")' ></div>" +
                    "<h3 class='f14 twoClamp grey6'>"+bean.title+"</h3>" +
                    "<p class='grey9 f12'>"+bean.guige+"/"+bean.units+"*"+bean.count+"</p>";
                $(".sec2").html(proInfo);

                //时间信息
                $(".sec4 p:first").append(orderNum);
                $(".sec4 .sendTime").append(bean.sendTime);
                if(bean.arriveTime){      //有到货时间 说明是待取货状态
                    $(".sec4 .arrivalTime").append(bean.arriveTime).removeClass("hide");
                }else {                    //没有到货时间 说明是在途中状态
                    //确认到站
                    $(".arrive").on("click",function(){
                        confirmShow({
                            title:"提示",
                            content:"请仔细确认快递已到您的自提点，<br>确认后，系统会通知用户来取货",
                            makeSure:function(){
                                $.ajax({
                                    url:confirmArrivedUrl,
                                    data:getAuth()+"info={orderNum:'"+orderNum+"'}",
                                    success:function(data){
                                        if(data.errCode == 0){
                                            tip("此订单已确认到站");
                                            setTimeout(function () {
                                                location.href = document.referrer;
                                            },1000)
                                        }else{tip(data.msg)}
                                    }
                                });
                            }
                        })
                    }).removeClass("hide")
                }

                //联系买家
                $(".tel").attr("href","tel:"+bean.buyerUser.mobile);


                //拨打客服电话
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
            }
        });
    });
});
