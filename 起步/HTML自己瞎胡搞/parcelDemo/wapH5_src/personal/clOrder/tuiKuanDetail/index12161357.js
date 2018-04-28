/**
 * Created by hasee on 2017/4/26.
 */


$(function(){
    var orderNum = GetQueryString("orderNum"),orderFlag = GetQueryString("orderType");
    $.ajax({
        url:clRefundDetailListUrl,
        data:getAuth()+"info={orderNum:'"+orderNum+"',orderFlag:"+orderFlag+",type:5}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="";

                for(var i=0;i<list.length;i++){
                    switch (list[i].node){
                        case 1://1 待处理
                            li+="<li><h3>买家申请退款，平台客服介入处理</h3><p>订单编号："+list[i].orderNum+"</p>" +
                                "<p>商品名称："+list[i].pname+"</p><p>订单金额：<span>&yen;"+list[i].sum+"</span></p>" +
                                "<p>退款金额：<span>&yen;"+list[i].refundAmount+"</span></p><time>"+list[i].opt_time+"</time></li>";
                            break;
                        case 2:// 2 用户关闭申请退款
                            li+="<li><h3>买家取消了退款申请</h3><p>处理理由：买家主动取消了退款申请</p>" +
                                "<time>"+list[i].opt_time+"</time></li>";
                            break;
                        case 3://3 驳回申请退款请求
                            li+="<li><h3>平台已拒绝用户申请的退款</h3><p>处理理由："+list[i].reason+"</p>" +
                                "<p>退款金额：<span>&yen;"+list[i].refundAmount+"</span></p><time>"+list[i].opt_time+"</time></li>";
                            break;
                        case 4://4 同意申请退款请求
                            li+="<li><h3>平台已同意用户申请的退款</h3><p>处理理由："+list[i].reason+"</p>" +
                                "<p>退款金额：<span>&yen;"+list[i].refundAmount+"</span></p><time>"+list[i].opt_time+"</time></li>";
                            break;
                    }
                }
                $(".list").html(li);

                //判断当前状态 展现按钮
                switch (list[0].node){
                    case 1://1 待处理
                        $(".tuiKuanCancle").removeClass("hide");
                        break;
                    case 2:// 2 用户关闭申请退款
                        $(".tuiKuanAgain").removeClass("hide");
                        break;
                    case 3://3 驳回申请退款请求
                        if(orderFlag == 1){ //大订单被拒绝可以再次申请退款 子订单不可以
                            $(".tuiKuanAgain").removeClass("hide");
                        }
                        break;
                    case 4://4 同意申请退款请求
                        break;
                }



                //再次发起退款申请
                $(".tuiKuanAgain").click(function(){
                    //获取申请退款信息
                    $.ajax({
                        url:clGetRefundInfoUrl,
                        data:getAuth()+"info={orderNum:'"+orderNum+"',orderFlag:"+orderFlag+",type:5}",
                        success:function(data){
                            if(data.errCode == 0){
                                var msg = data.resultdata.alertMsg,refundAmount=data.resultdata.refundAmount;
                                confirmShow({
                                    title:"提示",
                                    content:msg,
                                    makeSure:function(){
                                        //申请退款
                                        $.ajax({
                                            url:clRefundRestartUrl,
                                            data:getAuth()+"info={orderNum:'"+orderNum+"',orderFlag:"+orderFlag+",type:5,refundAmount:"+refundAmount+"}",
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
                    });
                });


                //取消退款
                $(".tuiKuanCancle").click(function(){
                    confirmShow({
                        title:"提示",
                        content:"确定要取消此次退款申请吗？",
                        makeSure:function(){
                            $.ajax({
                                url:clRefundCancelUrl,
                                data:getAuth()+"info={id:"+list[0].id+"}",
                                success:function(data){
                                    if(data.errCode ==0){
                                        location.reload()
                                    }else {tip(data.msg)}
                                }
                            })
                        }

                    })
                })
            }else {tip(data.msg)}
        }

    })
});