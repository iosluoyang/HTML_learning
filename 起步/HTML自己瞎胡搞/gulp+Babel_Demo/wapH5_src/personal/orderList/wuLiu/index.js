/**
 * Created by hasee on 2016/12/19.
 */

$(function(){
    isLogin(UID,function(){
        if(sessionStorage.getItem("wuLiuInfo")){             //本地有从上页带进来的缓存
            var wuLiuInfo = JSON.parse(sessionStorage.getItem("wuLiuInfo"));
            $.ajax({
                url:selectOrderLogisticalUrl,
                // type   4 原产优品物流信息  5 定制生活物流信息
                data:getAuth()+"info={id:'"+wuLiuInfo.id+"',order_num:'"+wuLiuInfo.orderNum+"',type:'"+wuLiuInfo.type+"'}",
                success:function(data){
                    if(data.errCode ==0){
                        var products = data.resultdata.products,track =  data.resultdata.track.showapi_res_body;
                        var img="";
                        products.Imgs?img=imgIndexUrl+products.Imgs:img ="../../../public/images/base/defaultShopAvatar.png";
                        //商品图片
                        $(".pic").css("background-image","url("+img+")");
                        //商品名称
                        $(".title").html(products.CommodityName);
                        //承运公司
                        $(".Logistical").append(data.resultdata.Logistical);
                        //运单编号
                        $(".number").append(data.resultdata.number);
                        //官方电话
                        $(".phone").append(data.resultdata.phone).attr("href","tel:"+data.resultdata.phone);

                        //物流状态  -1 待查询 0 查询异常 1 暂无记录 2 在途中 3 派送中 4 已签收 5 用户拒签 6 疑难件 7 无效单 8 超时单 9 签收失败 10 退回
                        var statusDom = $(".status");
                        switch (track.status){
                            case -1:statusDom.html("待查询");break;
                            case 0:statusDom.html("查询异常");break;
                            case 1:statusDom.html("暂无记录");break;
                            case 2:statusDom.html("在途中");break;
                            case 3:statusDom.html("派送中");break;
                            case 4:statusDom.html("已签收");break;
                            case 5:statusDom.html("用户拒签");break;
                            case 6:statusDom.html("疑难件");break;
                            case 7:statusDom.html("无效单");break;
                            case 8:statusDom.html("超时单");break;
                            case 9:statusDom.html("签收失败");break;
                            case 10:statusDom.html("退回");break
                        }

                        //物流详细信息
                        if(track.flag){             //物流信息是否获取成功
                            if(track.data.length == 0){
                                $(".noWuLiu").show();       //没有物流提示
                            }else {
                                var li ="";
                                for(var i=0;i<track.data.length;i++){
                                    li+="<li class='clearfix'><time class='f_left f11 grey9'>"+track.data[i].time+"</time>" +
                                        "<p class='f_left f14'>"+track.data[i].context+"</p></li>"
                                }
                                $(".wuLiu ul").append(li)
                            }
                        }else {
                            mainTip(track.msg)
                        }


                    }else {
                        tip(data.msg)
                    }

                }
            })
        }else {        //本地没有从上页带进来的缓存 进入首页
            location.replace(jumpUrl.find)
        }


    })
});

