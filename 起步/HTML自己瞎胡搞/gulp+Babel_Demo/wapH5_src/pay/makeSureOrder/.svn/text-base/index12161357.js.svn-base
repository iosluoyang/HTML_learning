/**
 * Created by hasee on 2016/10/11.
 */

isWeiXin()?
    $(".sec2 ul").append("<li class='active' pay_type='"+payTypeSign.wx+"'><span style='background-image: url(../../public/images/products/wx.png)' >微信支付</span></li>")    //在微信内只显示微信支付 并成选中状态
    :$(".sec2 ul").append("<li class='active' pay_type='"+payTypeSign.zfb+"'><span  style='background-image: url(../../public/images/products/zfb.png)'>支付宝</span></li>");   //不在微信内 显示支付宝并为选中状态 隐藏微信支付
var from = GetQueryString("from");

$(function() {

    isLogin(UID,function(){

        //监听storage的改变 为了safari浏览器下 返回地址不刷新
        if(window.addEventListener){
            window.addEventListener("storage",handle_storage,false);
        }else if(window.attachEvent) {
            window.attachEvent("onstorage",handle_storage);
        }

        function handle_storage(e){
            if(!e){e=window.event;}
            //获取地址
            getAdress(from);
        }


        //获取地址
        getAdress(from);

        //获取商品信息

        var promotionId = "";//促销id 没有促销或者不享受促销则不传
        var promotiontag = "";//促销标签文字  没有促销或者不享受促销则不传

            //存在商品信息
        if(sessionStorage.getItem("proInfo")){
            //判断进入的方式   从商品详情直接进来 需要从本地获取信息
            var proInfo = JSON.parse(sessionStorage.getItem("proInfo")),li="",proListDom=$(".sec3 .proList"),zongJiaDom= $(".sec5>div"),btnDom = $(".sec5>button");
            proInfo.sum=(proInfo.price * proInfo.count).toFixed(2);             //商品总金额的计算方式(如果是可以享受促销则取促销价*数量 其他情况取平台售价*数量 在原产优品分类中进行修改)

            //原产优品下单(增加促销商品的信息)
            if (from == "native"){
                //获取促销信息:
                var promotionInfo = proInfo.promotionInfo;
                //无论是不是促销商品,无论能不能享受优惠,都会展示优惠信息这一行
                var youhuimsg = "";//展示的优惠信息
                //根据本次存储的是否享有优惠信息来展现不同的文字
                var cheapFlag = proInfo.cheapFlag ;//判断该用户享受优惠的类型    1享受优惠   2促销中不优惠 3促销未开始/已结束/该商品不是促销不优惠
                //根据promotion字典对象返回对应的标签字符串(有促销 分定制列表和其他 不同促销类型不同展示 无促销不展示  只有享受优惠才展现标签)
                var promotionstr = cheapFlag && cheapFlag.toString() == "1"? returnpromotiontagstr(ifcustomlist=false,promotionInfo):"";
                //判断是否可以享受优惠
                if (cheapFlag && cheapFlag.toString() == "1"){
                    //可以享受促销
                    //促销价:
                    var cuxiaojia = promotionInfo.price;
                    //平台售价:
                    var shoujia = proInfo.price;
                    //差值:
                    var chajia = (shoujia - cuxiaojia).toFixed(2);
                    //修改总价
                    proInfo.sum = (cuxiaojia * proInfo.count).toFixed(2);

                    //获取促销id和促销标签
                    promotionId = promotionInfo ?  promotionInfo.cid.toString() : "";//促销id
                    promotiontag =  promotionInfo ? promotionInfo.tag : "",//促销标签文字


                    //售价和促销价之间的差值进行展示
                    youhuimsg = "<div class='row2 f16'>优惠<span class='f14'>&yen;"+(chajia*proInfo.count).toFixed(2)+"</span></div>";
                    //设置总价的展现方式
                    zongJiaDom.append("<p class='oneClamp yiYouHui f11'>已优惠：<span class='grey9'>&yen;"+(chajia*proInfo.count).toFixed(2)+"</span></p>" +
                        "<p class='f16 oneClamp'>总价: <span class='red bold'>&yen;" + proInfo.sum + "</span></p>");
                }
                else if (cheapFlag && cheapFlag.toString() == "2"){
                    //促销中不优惠
                    youhuimsg = "<div class='row2 f16'>优惠<span class='f14'>尚不能享受优惠</span></div>";
                    //设置总价的展现方式
                    zongJiaDom.append("总价: <span class='red bold'>&yen;" + proInfo.sum  + "</span>");
                }
                else{
                    //促销未开始/已结束/该商品不是促销不优惠
                    youhuimsg = "<div class='row2 f16'>优惠<span class='f14'>无可用优惠</span></div>";
                    //设置总价的展现方式
                    zongJiaDom.append("总价: <span class='red bold'>&yen;" + proInfo.sum  + "</span>");
                }



                li="<li><div class='row1 clearfix'>" +
                    "<div class='pic' style='background-image:url(" +imgIndexUrl+proInfo.img + ")'></div>" +
                    "<h4 class='title oneClamp f14'>" +promotionstr+ proInfo.title + "</h4>" +
                    "<div class='price oneClamp f14'>&yen;" + proInfo.price + "</div>" +
                    "<div class='color oneClamp f12'>" + proInfo.color + "</div>" +
                    "<div class='num oneClamp f11'>x" + proInfo.count + "</div></div>" +
                    "<div class='row2 f16'>运费<span class='f14'>快递包邮</span></div>" +
                    youhuimsg+  //优惠信息的展示行
                    "<div class='row3'><sapn class='f16'>备注</sapn><textarea placeholder='选填，可填写您的备注信息'></textarea></div>" +
                    "<div class='row4 t_right oneClamp f14'>共计" + proInfo.count + "件商品     合计<span class='red bold'>&yen;" +proInfo.sum  + "</span></div></li>";

                proListDom.append(li);
                btnDom.attr("orderType",typeObj.native);       //设置标识 支付时需要
            }
            //拼团下单
            else if(from == "group"){
                document.title = "社区拼团";    //title变为社区详情
                $(".sec6").show();              //显示送货上门方式
                var sendTypeList = $(".sec6 ul"),
                    sendTypeLi="<li class='active'>送货上门</li><li><p>自取</p><p class='grey9 f12'>"+proInfo.location+"</p></li>";
                if(proInfo.sendType==0 ){      //sendType 0 不支持送货上门 1 支持送货上门
                    sendTypeLi="<li class='active'><p>自取</p><p class='grey9 f12'>"+proInfo.location+"</p></li>";
                }
                if(!proInfo.location){         //自提地址为空 不支持自提
                    sendTypeLi="<li class='active'>送货上门</li>";
                }

                sendTypeList.append(sendTypeLi);

                li = "<li><div class='row1 clearfix'>" +
                    "<div class='pic' style='background-image:url(" +imgIndexUrl+proInfo.img + ")'></div>" +
                    "<h4 class='title oneClamp f14'>" + proInfo.title + "</h4>" +
                    "<div class='price oneClamp f14'>&yen;" + proInfo.price + "</div>" +
                    "<div class='color oneClamp f12'>" + proInfo.color + "</div>" +
                    "<div class='num oneClamp f11'>x" + proInfo.count + "</div></div>" +
                    "<div class='row3'><sapn class='f16'>备注</sapn><textarea placeholder='选填，可填写您的备注信息'></textarea></div>" +
                    "<div class='row4 t_right oneClamp f14'>共计" + proInfo.count + "件商品     合计<span class='red bold'>&yen;" + proInfo.sum  + "</span></div></li>";
                proListDom.append(li);
                zongJiaDom.append("<p class='oneClamp yiYouHui f11'>已优惠：<span class='grey9'>&yen;"+((proInfo.oldPrice - proInfo.price)*proInfo.count).toFixed(2)+"</span></p>" +
                    "<p class='f16 oneClamp'>总价: <span class='red bold'>&yen;" + proInfo.sum + "</span></p>");
                btnDom.attr("orderType",typeObj.groupBuy);       //设置标识 支付时需要
            }
        }
        //不存在商品信息   跳转到首页
        else{
            location.replace(jumpUrl.find)
        }

        //确认下单
        $(".makeOrder").on("click",function(e){
            e.preventDefault();
            var _this=$(this),orderType = _this.attr("orderType");
            //判断有没有选择地址
            if($(".sec1 .hasAdd").html() == ""){      //没有选择地址
                tip("请选择地址")
            }else if(isEmojiCharacter($(".sec3 textarea").val())){
                tip("备注不支持表情输入");
            }else{
                _this.attr("disabled",true);        //禁止点击 防止重复下单
                var xiaDanInfo;

                if(from == "native"){       //原产优品下单 增加促销信息参数

                    xiaDanInfo={
                        pay_type: $(".sec2 ul .active").attr("pay_type"),       //支付方式 1支付宝 2微信
                        mrid:$(".hasAdd").attr("mrid"),                         //取货地址
                        uid:UID,
                        iszg:1,                                                 //是否直接购买 0否 1是
                        vid:sessionStorage.getItem("vid"),                         //社区id
                        wap:1,                                                     //wap站购买标识
                        shops:[{                                                   //商户,社长或者商铺集合
                            type:1,                                               //商品类型 现在都是1代表原产地精选
                            bz:$(".sec3 textarea").val(),                        //备注
                            sum: proInfo.sum,                                        //总金额
                            counts:proInfo.count,                                //总数量
                            sid:"",
                            goods:[{
                                id:proInfo.pid,                                     //商品id
                                color:proInfo.color,                                //商品规格
                                newprice:cheapFlag && cheapFlag.toString() == "1" ? promotionInfo.price : proInfo.price, //商品单价 如果该用户能享受优惠的时候传促销单价,其他情况传递售价单价
                                countprice:proInfo.sum,                             //商品总价格
                                count:proInfo.count,                                 //商品数量
                                //以下两个字段只有当用户享受优惠时才有值,否则为空字符串
                                promotionId:promotionId,//促销id
                                tag:promotiontag,//促销标签文字
                            }]
                        }]
                    };
                    //验证商品是否失效
                    $.ajax({
                        url:checkProductUrl,
                        data:getAuth()+"info={type:'"+typeObj.native+"',id:'"+proInfo.pid+"'}",
                        success:function(data){
                            if(data.errCode==0) {        //未失效

                                //调用下单接口
                                $.ajax({
                                    url:addGoodsUrl,
                                    data:getAuth()+"info="+encodeURIComponent(JSON.stringify(xiaDanInfo)),
                                    success:function(data){
                                        if(data.errCode == 0){      //下单成功
                                            payFor(xiaDanInfo.pay_type,data.orderNum,proInfo.title,proInfo.sum,_this,orderType);
                                        }else{
                                            tip(data.msg);
                                            _this.attr("disabled",false);   //解开按钮点击
                                        }
                                    }
                                });
                            }else{
                                tip(data.msg);
                                _this.attr("disabled",false);   //解开按钮点击
                            }
                        }
                    });


                }
                else if(from == "group"){       //拼团下单

                    xiaDanInfo={
                        uid:UID,
                        count:proInfo.count,                                //总数量
                        payType: $(".sec2 ul .active").attr("pay_type"),       //支付方式 1支付宝 2微信
                        sum: proInfo.sum,                                           //总金额
                        vid:sessionStorage.getItem("groupVid"),                     //拼团社区id
                        title:proInfo.title,                                     //团购标题
                        gid:proInfo.gid,                                               //团购主键
                        asmain:proInfo.img,	                                    //主图地址
                        poster:proInfo.poster,                              //发布人id
                        color:proInfo.color,                                //商品规格
                        mrid:$(".hasAdd").attr("mrid"),                       //取货地址   都需要传
                        memo:$(".sec3 textarea").val(),                        //备注
                        wap:1                                                     //wap站购买标识
                    };

                    if($(".sec6 ul .active").html() != "送货上门"){
                        xiaDanInfo.location=proInfo.location;                    //自提地址 送货上门不传location
                    }

                    //调用下单接口
                    $.ajax({
                        url:addBuyOrderUserUrl,
                        data:getAuth()+"info="+encodeURIComponent(JSON.stringify(xiaDanInfo)),
                        success:function(data){
                            if(data.errCode == 0){      //下单成功
                                payFor(xiaDanInfo.payType,data.orderNum,proInfo.title,proInfo.sum,_this,orderType);
                            }else{
                                tip(data.msg);
                                _this.attr("disabled",false);   //解开按钮点击
                            }
                        }
                    });
                }

            }
        });

    });





    //选择地址
    $(".sec1 li").click(function(){
        sessionStorage.setItem("completeUrl",location.href);
        location.href = jumpUrl.address+"?from="+from;    //跳转收货地址链接
    });

    //选择支付方式
    $(".sec2 li").click(function(){
        $(this).addClass("active").siblings().removeClass("active")
    });

    //选择配送方式
    $(".sec6").on("click","li",function(){
        $(this).addClass("active").siblings().removeClass("active")
    });

    //点击收起提示信息
    $(".slideUp").click(function(){
        $(this).parent().slideUp(300);
    })


});


//获取地址
function getAdress(from){
    $.ajax({
        url: receAddreUrl,
        data:getAuth()+"info={pageSize:5000,firstResult:0,uid:'"+UID+"'}",
        success: function (data) {
            var addArr = data.resultdata,   //获取本地存储的地址
                hasAdd = $(".hasAdd"),noAdd = $(".noAdd");
            //若有对应存储地址 取存储地址 若没有对应存储地址 取默认地址
            for (var i = 0; i < addArr.length; i++) {
                if (addArr[i].mrid == sessionStorage.getItem("mrid")) {       //存在存储地址
                    noAdd.hide();
                    hasAdd.html("<span>" + addArr[i].receiver + "</span><span>" + addArr[i].receiverMobile + "</span><br>" +
                        "<span>" + addArr[i].detailAddress + "</span>").attr("mrid",addArr[i].mrid).show();
                    break
                }else if (addArr[i].isDefault == 1) {       //存在默认地址
                    noAdd.hide();
                    hasAdd.html("<span>" + addArr[i].receiver + "</span><span>" + addArr[i].receiverMobile + "</span><br>" +
                        "<span>" + addArr[i].detailAddress + "</span>").attr("mrid",addArr[i].mrid).show();
                }
            }

            if(from == "group" &&   $(".sec1 .hasAdd").html() != ""){   //从拼团详情进来 并且地址不为空
                //显示提示信息
                $(".sec4").append("<p>注意：发起团购社区为"+ getGroupVidName(sessionStorage.getItem("groupVid"))+"。请核对地址联系社长或到自提点自取</p>").show();
            }
        }
    });
}


//检查表情输入
function isEmojiCharacter(substring) {
    for ( var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                || hs == 0x2b50) {
                return true;
            }
        }
    }
}