/**
 * Created by hasee on 2017/5/11.
 */

$(function(){
    isLogin(UID,function () {
        var pid=GetQueryString("pid"),pidInfo = JSON.parse(sessionStorage.getItem(pid+"pidInfo")),
            deliveryTypeDom="",deliveryType;

        //获取可用地址
        //监听storage的改变 为了safari浏览器下 返回地址不刷新
        if(window.addEventListener){
            window.addEventListener("storage",handle_storage);
        } else if(window.attachEvent) {
            window.attachEvent("onstorage",handle_storage);
        }



        function handle_storage(e){
            if(!e){e=window.event;}
            pidInfo = JSON.parse(sessionStorage.getItem(pid+"pidInfo"));
            getAddress(pidInfo);
        }

        //获取可配送地址
        getAddress(pidInfo);
        //展现支付方式
        isWeiXin()?
            $(".sec2 ul").append("<li class='active' pay_type='"+payTypeSign.wx+"'><span style='background-image: url(../../public/images/products/wx.png)' >微信支付</span></li>")    //在微信内只显示微信支付 并成选中状态
            :$(".sec2 ul").append("<li class='active' pay_type='"+payTypeSign.zfb+"'><span  style='background-image: url(../../public/images/products/zfb.png)'>支付宝</span></li>");   //不在微信内 显示支付宝并为选中状态 隐藏微信支付

        //展现配送方式
        getSendTypeList(pidInfo);


        //获取商品配送日期
        if(pidInfo.deliveryType == 1 || pidInfo.deliveryType == 3){  //自动配送 或者单次配送
            deliveryType = "自动配送"; var dateList=[] ;
            if(pidInfo.deliveryType == 1){  //自动配送
                dateList = pidInfo.autoDateList
            }else if( pidInfo.deliveryType == 3){   //单次配送
                dateList = [{date:pidInfo.onceDateList.date,count:pidInfo.onceDateList.count}]
            }
            for(var i=0;i<dateList.length;i++){
                if(dateList[i].count!=0){
                    deliveryTypeDom += "<li>"+dateList[i].date+" "+dateList[i].count+pidInfo.units+"</li>"
                }
            }
        }else if(pidInfo.deliveryType == 2){    //手动配送
            deliveryType = "手动配送";
            deliveryTypeDom = "<li class='handle'>首次配货日期 "+pidInfo.handleDateList.date+" "+pidInfo.handleDateList.count+pidInfo.units+"</li>" +
                "<li class='handle'>未指定配货日期 "+(pidInfo.sumCount-pidInfo.handleDateList.count)+pidInfo.units+"</li>";
            //订单时间提示
            $(".sec8").html("订单需在"+addDate(pidInfo.handleDateList.date,365)+"前消费").removeClass("hide");
        }


        //商品清单
        $(".sec3 .mid span").html(pidInfo.shopName);
        //获取促销信息:
        var promotionInfo = pidInfo.promotionInfo;
        //根据本次存储的是否享有优惠信息来展现不同的文字
        var cheapFlag = pidInfo.cheapFlag ;//判断该用户享受优惠的类型    1享受优惠   2促销中不优惠 3促销未开始/该商品不是促销不优惠
        var promotionId = "";//促销id 没有促销或者不享受促销则不传
        var promotiontag = "";//促销标签文字  没有促销或者不享受促销则不传

        //根据promotion字典对象返回对应的标签字符串(有促销 分定制列表和其他 不同促销类型不同展示 无促销不展示 不享受也不展示)
        var promotionstr = cheapFlag && cheapFlag.toString() == "1" ? returnpromotiontagstr(ifcustomlist=false,promotionInfo) : "";

        $(".sec3 .proList").append("<li><div class='row1 clearfix f12'>" +
            "<div class='pic f_left' style='background-image:url("+imgIndexUrl+pidInfo.img+")'></div><div class='f_left leftDiv'>" +
            "<h4 class='title f14 grey6 twoClamp'>"+promotionstr+pidInfo.title+"</h4><div class='color oneClamp'>"+pidInfo.guige+"/"+pidInfo.units+"</div></div>" +
            "<div class='f_right rightDiv'><div class='price f17 oneClamp'>&yen;"+pidInfo.sumPrice+"</div>" +
            "<div class='num oneClamp'>x"+pidInfo.sumCount+"</div><div class='sendType'>"+deliveryType+"</div></div></div>" +
            "<div class='row2 f15 clearfix'><div class='f_left'>配送清单</div>" +
            "<ul class='grey9 f13'>" +deliveryTypeDom+"</ul></div>" +
            "<div class='row3 f16'><span class='t_center'>备注</span><textarea placeholder='选填，可填写您的备注信息'></textarea></div></li>");

        //共计
        $(".sec7").html(" 共计" + pidInfo.sumCount + "件商品     合计<span class='red bold'>&yen;" + pidInfo.sumPrice  + "</span>");

        //确认下单
        $(".sec5 div span").html("&yen;"+pidInfo.sumPrice);


        //首先判断该商品是否为促销商品
        if (promotionInfo && JSON.stringify(promotionInfo) != '{}'){
            //有促销
            //判断是否可以享受优惠
            if (cheapFlag && cheapFlag.toString() == "1"){
                //可以享受促销
                //促销标签
                var promotiontag = promotionInfo.tag;
                $('.promotiontag').html('优惠:'+ promotiontag);

                promotionId = promotionInfo.cid;
                promotiontag = promotionInfo.tag;
            }
            else{
                //不可享受促销,展示尚不能享受优惠
                $('.promotiontag').html('尚不能享受优惠');
            }

            //设置总价那里两个P的显示高度
            $('.promotiontag').css({"height":"40%"});
            $('.totalprice').css({"height":"60%"});

        }
        else{
            //无促销,不展示促销信息

            //设置总价那里两个P的显示高度
            $('.promotiontag').css({"height":"0"});
            $('.totalprice').css({"height":"100%"});
        }



        //----------------------------------------点击事件---------------------------------------

        //选择配送方式
        $(".sec6 li span").click(function(e){
            e.stopPropagation();
            var _this = $(this);
            //记录当前选择的配送方式的下标 为了从自提点地址选择跳转回确认下单页面 展现之前选择的配送方式
            pidInfo.actSendType = _this.parents("li").index();
            _this.parent().addClass("active").siblings().removeClass("active")

        });


        //选择送货上门地址
        $(".sec1 li").click(function(){
            sessionStorage.setItem("completeUrl",location.href);
            //当前页面历史记录为确认下单页面 将历史记录改为地址列表链接 为了选择地址后跳转确认下单页面带上from参数 再返回时能返回到商品详情页面
            window.history.replaceState("",null,jumpUrl.address+"?from=clDetail&pid="+pid);
            location.href = jumpUrl.address+"?from=clDetail&pid="+pid;    //跳转收货地址链接
        });


        //选择自提地址
        $(".sec6 .ziTi").click(function(e){
            e.stopPropagation();
            if(!$(this).hasClass("disabled")){
                pidInfo.clMrid = $(".sec6").attr("mrid");
                pidInfo.fetchid = $(".sec6").attr("fetchid") || "";
                sessionStorage.setItem(pid+"pidInfo",JSON.stringify(pidInfo));
                location.href = jumpUrl.clFetchAdd+pid;     //跳转自提点列表选择
            }else {tip("您所在地区暂无自提点")}
        });


        //确认下单
        $(".makeOrder").click(function(e){
            e.preventDefault();
            var _this = $(this),sendType = $(".sec6 .active").attr("sendType"),
                mrid = $(".sec6").attr("mrid"),fetchid = $(".sec6").attr("fetchid") || "";

            if($(".hasAdd").hasClass("hide")){  //不论是送货上门还是自提 下单地址都不能为空
                tip("请选择下单地址")
            }
            else {
                if(sendType == 2 && fetchid == ""){        //用户选择自提 且未选择自提地址
                    tip("请选择自提点")
                }else {
                    _this.attr("disabled",true);
                    var deliverycycles=[];
                    if(pidInfo.deliveryType == 1){  //自动
                        for(var i=0;i<pidInfo.autoDateList.length;i++){
                            if(pidInfo.autoDateList[i].count != 0){
                                deliverycycles.push({date:pidInfo.autoDateList[i].date,count:pidInfo.autoDateList[i].count})
                            }
                        }
                    }
                    else if(pidInfo.deliveryType == 2){  //手动
                        deliverycycles.push({date:pidInfo.handleDateList.date,count:pidInfo.handleDateList.count})
                    }
                    else if(pidInfo.deliveryType == 3){  //单次配送
                        deliverycycles.push({date:pidInfo.onceDateList.date,count:pidInfo.onceDateList.count})
                    }

                    var info= {
                        deliverycycles:deliverycycles,	//配送周期数组jsonArray
                        pid:pidInfo.pid,	//商品id
                        count:pidInfo.sumCount,	//购买数量
                        wap:1,	//是否wap站下单标识1为wap下单非1和空app下单
                        payType: $(".sec2 ul .active").attr("pay_type"),       //支付方式 1支付宝 2微信
                        sum:pidInfo.sumPrice,	//总价
                        mrid: mrid,	        //收货地址id
                        fetchid:fetchid,    //自提点id
                        date:pidInfo.modifyDate,  //商品详情回传的时间 下单是需要判定商品是否被编辑
                        uid:UID,	//用户id
                        vid:sessionStorage.getItem("vid"),	//社区id
                        sendType:$(".sec6 .active").attr("sendType"),	        //配送方式1送货上门2自提
                        guige:pidInfo.guige,	//商品规格
                        deliveryType:pidInfo.deliveryType,	//配送类型 1 自动2手动
                        message:$(".sec3 textarea").val(),	//买家留言
                        price:pidInfo.price,	//商品均价
                        //以下两个字段只有当用户享受优惠时才有值,否则为空字符串
                        promotionId:promotionId,//促销id
                        tag:promotiontag,//促销标签文字
                    };

                    confirmShow({
                        title:"提示",
                        content:"根据平台商品定制规则，退款时需要扣除一定比例的订单金额，该商品扣除的比例为："+(100-pidInfo.refundDiscount)+"%",
                        makeSure:function(){
                            $.ajax({
                                url:clOrderUrl,
                                data:getAuth(UID)+"info="+encodeURIComponent(JSON.stringify(info)),
                                success:function(data){
                                    // mainTip(data.errCode);
                                    if(data.errCode == 0 || (data.errCode == 4 && sendType == 1)){
                                        // 0下单成功 调起支付
                                        var payType = $(".sec2 ul .active").attr("pay_type"),//支付方式 1支付宝 2微信
                                            orderNum =data.resultdata.orderNum ;
                                        //清除配送缓存
                                        // sessionStorage.removeItem(pid + "pidInfo");
                                        payFor(payType,orderNum,pidInfo.title,pidInfo.sumPrice,_this,typeObj.customLife);
                                    }
                                    else if(data.errCode == 2){//2表示商品信息修改了
                                        oneBtnTip({
                                            title:"提示",
                                            content:"商品部分信息已被修改，点击确定返回商品详情页查看最新数据。",
                                            cancel:function(){      //返回详情页面
                                                sessionStorage.removeItem(pidInfo.pid+"pidInfo");   //清空当前缓存 重新获取送货日期
                                                history.back();
                                            }
                                        })
                                    }
                                    else if(data.errCode == 3){//3表示仅退款比例修改了）
                                        oneBtnTip({
                                            title:"提示",
                                            content:"商品退款扣除金额比例已被修改，请再次尝试下单。",
                                            cancel:function(){      //修改退款比例
                                                pidInfo.refundDiscount = data.resultdata.refund_discount;
                                                _this.attr("disabled",false);
                                            }
                                        })
                                    }
                                    else if(data.errCode == 4 && sendType == 2){    //  4 表示仅当自提点发生变化 并且选择了自提点
                                        oneBtnTip({
                                            title:"提示",
                                            content:"自提点部分信息已被修改，请重新选择。",
                                            cancel:function(){      //重置自提点
                                                sessionStorage.removeItem(mrid+"fetchAdd");
                                                $(".sec6 .ziTi div").html("");
                                                $(".sec6").attr("fetchid","");
                                                _this.attr("disabled",false);
                                            }
                                        })
                                    }
                                    else if(data.errCode == -5){
                                        //促销信息发生了改变
                                        oneBtnTip({
                                            title:"提示",
                                            content:"商品促销信息已变更,请确认后再次下单",
                                            cancel:function(){
                                                //返回详情页面
                                                sessionStorage.removeItem(pidInfo.pid+"pidInfo");
                                                history.back();
                                            }
                                        });

                                    }
                                    else{tip(data.msg)}

                                }

                            });
                        },
                        cancel:function(){
                            _this.attr("disabled",false);
                        }
                    })
                }
            }
        });
    });
});



//获取可用地址
function getAddress(pidInfo){
    var fromFlag = sessionStorage.getItem(pidInfo.pid+"fromFlag");
    //在地址列表缓存选择过的地址
    var clMrid = sessionStorage.getItem("clMrid");

    // sessionStorage.removeItem("clMrid"); //获取地址后是释放缓存

    //从商品详情跳转（第一次进入下单页面）
    // 或者未选择过送货上门地址时（比如选择自提地址后跳转）
    if(fromFlag === "product" || !clMrid){
        $.ajax({
            url:clGetaddressUrl,
            data:getAuth(UID)+"info={pid:'"+pidInfo.pid+"',uid:"+UID+"}",
            success:function(data){
                if(data.errCode === 0){
                    var addObj = data.resultdata.address;
                    if(addObj){
                        $(".hasAdd").html("<span>" + addObj.receiver + "</span><span class='grey9'>" +addObj.receiverMobile + "</span><br>" +
                            "<span class='grey6'>" + addObj.detailAddress + "</span>").removeClass("hide");
                        //设置mrid
                        $(".sec6").attr("mrid",addObj.mrid);
                        isZiTi(pidInfo,addObj.mrid,fromFlag)
                    }else {
                        //没有可配送地址
                        $(".noUseAdd").removeClass("hide");
                        //当前商品支持自提 但没有配送地址 不能点击自提
                        if(pidInfo.sendType == 2 || pidInfo.sendType == 3){
                            $(".sec6 .ziTi").addClass("disabled");
                            $(".sec6 .ziTi div").html("所在地区暂无自提点")
                        }
                    }
                }else {tip(data.msg)}
            }
        })
    }else {     //从选择地址页面跳转　（不是第一次进入下单页面）　或者有选择过送货上门地址时
        $.ajax({
            url:clReceAddreUrl,
            data:getAuth(UID)+"info={uid:"+UID+",pid:"+pidInfo.pid+",firstResult:0,pageSize:1000}",
            success:function(data){
                if(data.errCode==0){
                    var list = data.resultdata.list;
                    for(var i=0;i<list.length;i++){
                        if(list[i].mrid == clMrid){
                            if($(".hasAdd").hasClass("hide")){
                                $(".hasAdd").removeClass("hide");
                                $(".noUseAdd").addClass("hide")
                            }
                            $(".hasAdd").html("<span>" + list[i].receiver + "</span><span class='grey9'>" +list[i].receiverMobile + "</span><br>" +
                                "<span class='grey6'>" + list[i].detailAddress + "</span>");
                            break;
                        }
                    }
                }else {tip(data.msg)}
            }
        });

        //设置mrid
        $(".sec6").attr("mrid",clMrid);
        isZiTi(pidInfo,clMrid,fromFlag);
    }
}



//根据送货地址判断是否有自提地址
function isZiTi(pidInfo,mrid,fromFlag) {
    //获取自提地址数据 因为编辑配送地址 mrid不改变 但是省市区会发生变化 通过缓存获取自提地址不能实时更新数据
    //所以每次选择配送地址后 都需要重新获取自提地址数据
    var fetchAddList;
    $.ajax({
        url:clFetchlistUrl,
        data:getAuth()+"info={pid:"+pidInfo.pid+",mrid:"+mrid+"}",
        async:false,
        success:function (data) {
            if(data.errCode ===0){
                fetchAddList = data.resultdata.list;
                //缓存自提地址列表
                sessionStorage.setItem(mrid+"fetchAdd",JSON.stringify(fetchAddList));
            }else {tip(data.msg)}
        }
    });
    if(fetchAddList.length === 0){      //当前配送地址没有匹配的自提点
        $(".sec6 .ziTi div").html("所在地区暂无自提点");
        $(".sec6 .ziTi").addClass("disabled");
        $(".sec6").attr("fetchid", "");
    }else {         //当前配送地址有匹配的自提点
        if(fromFlag === "fetchAdd"){    //从自提点配送跳转
            $(".sec6 .ziTi div").html(pidInfo.fetchName);
            $(".sec6").attr("fetchid",pidInfo.fetchid);
        }else if(fromFlag === "addList" || fromFlag === "product" ){//从送货上门地址跳转或者从商品详情进入 自提点名称展示为空 重置fetchid
            $(".sec6 .ziTi div").html("");
            $(".sec6").attr("fetchid", "");
            $(".sec6 .ziTi").removeClass("disabled");
        }
    }
}

//展现配送方式
function getSendTypeList(pidInfo) {
    //配送方式 1送货上门 2用户自提 3送货上门和用户自提都支持
    if(pidInfo.sendType == 1){
        $(".sec6 li:first").addClass("active").removeClass("hide")
    }else if(pidInfo.sendType == 2){
        $(".sec6 li:last").addClass("active").removeClass("hide")
    }else if(pidInfo.sendType == 3){
        var fromFlag = sessionStorage.getItem(pidInfo.pid+"fromFlag");
        if(fromFlag === "fetchAdd" || fromFlag === "addList"){    //从地址选择页面跳转
            $(".sec6 li").eq(pidInfo.actSendType||0).addClass("active");
        }else {     //从商品详情跳转
            $(".sec6 li:first").addClass("active");
        }

        $(".sec6 li").removeClass("hide")
    }
}

//
function addDate(date,days){
    var d=new Date(date);
    d.setDate(d.getDate()+days);
    var m=d.getMonth()+1;
    return d.getFullYear()+'-'+m+'-'+d.getDate();
}











