/**
 * Created by hasee on 2017/5/11.
 */


$(function(){

    pidInfo = getPidInfo(pidInfo);

    //获取商品详情
    getDetail(pidInfo);
    //监听storage的改变
    if(window.addEventListener){
        window.addEventListener("storage",handle_storage,false);
    }
    else if(window.attachEvent)
    {
        window.attachEvent("onstorage",handle_storage);
    }


    //配送方式收起效果
    slideUp.click(function(){
        var ul = $(".autoSend ul"), liHeight = $(".autoSend ul li").outerHeight();
        ul.animate({height: 3 * liHeight}, "fast");
        slideUp.hide();
        slideDown.show()
    });
    //配送方式下拉效果
    slideDown.click(function(){
        var ul = $(".autoSend ul"),li = $(".autoSend ul li"),liHeight =li.outerHeight();
        ul.animate({height: Math.ceil(li.length/2 )* liHeight}, "fast");
        slideUp.show();
        slideDown.hide()
    });


    //手动自动配送切换
    $(".changeSendType").click(function(){
        $(".sendTypeWrap>div").toggleClass("active");
    });


    //图文详情和用户评价选项卡切换
    $(".tabs li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");     //更改选中状态
        var index = $(this).index();
        //切换选项内容
        $(".tabContent > div").eq(index).show().siblings().hide();
    });


    //上拉加载
    window.onscroll = function(){
        if (getScrollTop()  > getClientHeight()){
            $(".goTop").show()
        }else {
            $(".goTop").hide()
        }
    };

    //返回顶部
    $(".goTop").click(function(){
        window.scrollTo(0,0)
    });

    //下拉刷新
    pullDownFun({
        container: ".container",
        next: function(e) {
            //松手之后执行逻辑,ajax请求数据，数据返回后隐藏加载中提示
            var that = this;
            setTimeout(function() {
                location.reload();
                that.back.call();
            }, 500);
        }
    });
    //通过hash监听页面的返回 当返回时清空配送相关的缓存
    //if (window.history && window.history.pushState) {
    //    $(window).on('popstate', function() {
    //        //var hashLocation = location.hash;
    //        //var hashSplit = location.hash.split("#!/");
    //        var hashName = location.hash.split("#!/")[1];
    //
    //        if (hashName !== '') {
    //            var hash = window.location.hash;
    //            if (hash === '') {
    //                //alert('後退按鈕點擊');
    //                if(GetQueryString("isShare")){
    //                    if(isWeiXin()){
    //                        mainTip(456);
    //                        wx.call('closeWindow');   // 关闭微信浏览器
    //                    }
    //                    window.opener=null;
    //
    //                    window.open('','_self');
    //
    //                    window.close();   // 关闭电脑浏览器;
    //                }else {
    //                    sessionStorage.removeItem(pid+"pidInfo");
    //                    history.back();
    //                }
    //
    //            }
    //        }
    //    });
    //    window.history.pushState('forward', null, './#pid='+pid);
    //}

});

var dateLength,pid = GetQueryString("pid") || getUrlHash("pid"),pidInfo=sessionStorage.getItem(pid+"pidInfo") || {};
var slideUp = $(".sendTypeWrap .up"),slideDown = $(".sendTypeWrap .down");

//document.body.addEventListener('touchstart', function () { });


//获取商品参数
function getPidInfo(pidInfo){
    if(pidInfo) {
        pidInfo = JSON.parse(sessionStorage.getItem(pid + "pidInfo")) ||{};
    }
    pidInfo.pid = pid;

    return pidInfo
}

//获取商品详情
function getDetail(pidInfo){
    $.ajax({
        url:clDetailUrl,
        data:getAuth()+"info={pid:'"+pidInfo.pid+"',uid:'"+UID+"'}",
        success:function(data){
            if(data.errCode == 0){
                var customLife = data.resultdata.customLife,moRenCounts=6,
                    sellerUser = customLife.sellerUser,//卖家信息
                    mianImg = customLife.carouselImg.split(",")[0] || jumpUrl.moRenAvatar;//主图
                pidInfo.priceList = data.resultdata.priceList;//价格列表
                pidInfo.units = customLife.units;       //单位
                pidInfo.deliveryCycleType = customLife.deliveryCycleType;//配送周期类型1周2月3单次配送
                pidInfo.deliveryCycle = customLife.deliveryCycle; //配送周期


                var status = customLife.status;//商品状态 1待上架2审核中 3在售中 4停售 5已下架

                if(status == 3 || status == 4){ //用户端在售中和停售中都展现商品详情
                    $(".proDetail").show();
                    //设置轮播图的高度 与宽度比例为1：1
                    $(".lunBo").height($(".lunBo").width());
                    //轮播图
                    $(".lunBo ul").append(getCarouselImgLi(customLife.carouselImg));
                    if($(".lunBo ul li").length>1){
                        var swiper = new Swiper('.swiper-container', {
                            pagination: '.swiper-pagination',
                            loop:true,
                            autoplay: 3000,
                            autoplayDisableOnInteraction: false
                        });
                    }
                    sessionStorage.setItem("asmian", mianImg);   //保存图片 为分享做准备

                    var promotionInfo = customLife.promotionInfo;
                    //标题
                    //促销商品的标题展示(无促销时展示原标题,有促销时展示促销标题)
                    var mytitle = promotionInfo && JSON.stringify(promotionInfo) != '{}' ? promotionInfo.title : customLife.title;
                    $(".title").html(mytitle);

                    //设置分享标题
                    //sessionStorage.setItem("title",mytitle);//保存标题 为分享做准备
                    //简介
                    $(".wrap .jianjie").html(customLife.characteristic);

                    //判断是否有促销信息,如果有的话则展示促销页面的样式


                    /*promotionInfo	促销信息 注意只有当商品促销还未开始和正在进行才有此字段 如果已经结束或者不是促销商品的话没有该字段
                promotionInfo 字典含义
                cid	促销id
                status	促销状态1未开始2促销中
                price	促销价
                pid	商品id
                ptype	商品类型4原产优品5定制商品
                title	促销商品名称
                tag	促销标签
                type	促销类型    1自定义2限时3折扣4特价5专享6买赠
                playbillImg	促销海报
                playbillDesc	海报文案
                userType	促销用户群1全部2新用户3老用户
                checkInvitationCode	1不限有无邀请码用户2仅限有邀请码用户
                startTime	促销开始时间
                endTime	促销结束时间(空代表永久)
                nowTime	系统当前时间*/

                    //有促销信息,说明该商品为促销商品并且促销状态为未开始或者正在进行中
                    if (promotionInfo && JSON.stringify(promotionInfo) != '{}'){
                        //获取海报的图片地址
                        var haibaoimgUrl =  promotionInfo.playbillImg;
                        /*首先使用正则表达式获取图片的宽高*/
                        var truepicwidth = $('body').width();
                        var truepicheight = truepicwidth * returnpicratewithUrl(haibaoimgUrl);

                        $('.promotionhaibaodiv').css({
                            "background-image": "url('"+imgIndexUrl + haibaoimgUrl+"')",
                            "height":truepicheight,
                        });
                        //海报文案
                        var wenan = promotionInfo.playbillDesc;
                        $('.haibaowenan').html(wenan);
                        //将促销海报展示出来
                        $('.promotionhaibaodiv').show();


                        //判断促销活动是否已经开始
                        //未开始,展示新的价格区域
                        if (promotionInfo.status.toString() == "1"){

                            //展示预计开始时间
                            var aboutstartTime = promotionInfo.startTime; //开始时间举例 2017-11-02 15:15:56
                            //使用正则提取年月日时分秒
                            var matches = aboutstartTime.match(/\d+/g);
                            var year = matches[0];
                            var month = matches[1];
                            var date = matches[2];
                            var hour = matches[3];
                            var minute = matches[4];
                            var second = matches[5];
                            var timestr = "预计" + month + "月" + date + "日" + " " +hour + ":" + minute + ":" + second + " 开始";

                            //促销标签的返回
                            //根据promotion字典对象返回对应的标签字符串(有促销 分定制列表和其他 不同促销类型不同展示 无促销不展示)
                            var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);

                            var htmlstr = '<p">'+promotionstr+'<span style="font-size: 1rem;color: #3088ff;margin-left: 0.5rem;">'+timestr+'</span></p>';
                            $('.promotionpricediv').html(htmlstr);
                            $('.promotionpricediv').css({
                                "padding":"0 0 10px 0",
                            });
                        }
                        //促销中
                        else if(promotionInfo.status.toString() == "2"){

                            //系统当前时间:
                            var currenttime = promotionInfo.nowTime;
                            //结束时间:
                            var endtime = promotionInfo.endTime;
                            //根据是否有结束时间判断该促销是否是永久期限,来判断左右两边的宽度比例
                            var leftwidthpercent = "";
                            var rightwidthpercent = "";
                            if (!endtime || endtime == ''){
                                //没有结束时间,说明为永久有效,则将左侧div的宽度设置为100%
                                leftwidthpercent = "100%";
                                rightwidthpercent = "0";
                            }
                            else{
                                //有结束时间,则说明左右各占70%和30%
                                leftwidthpercent = "70%";
                                rightwidthpercent = "30%";
                            }

                            //因为定制商品没有促销价,所以取值取的是平台售价
                            var cuxiaojia = customLife.price;
                            var str1 = '<p style="font-size: 2rem;color: #ffffff;margin-bottom: 5px;"><span style="font-size: 1.5rem">&yen; </span>'+cuxiaojia+'</p>';

                            //根据促销信息字典选择不同的特殊促销标签
                            var str2 = returnspecialpromotiontagstr(ifcustomlist = false,promotionInfo);


                            var div1str = '<div class="specialbgdiv f_left" style="padding: 5px 10px 5px 10px;width: '+leftwidthpercent+';box-sizing: border-box;">'+str1+str2+'</div>';


                            //距结束文字
                            var str4 = '<p style="font-size: 1.1rem;color: #ff3b30;text-align: center;margin: 10px auto;">距结束还剩</p>';
                            //倒计时区域
                            var str5 = '<p style="font-size: 1.1rem;color: #ff3b30;text-align: center;">' +
                                '<span id="hour" style="color: #ffffff;background-color: #f4224d;border-radius: 0.5rem;text-align: center;padding: 0.3rem 0.2rem;">XX</span>' +
                                ' : '+
                                '<span id="minute" style="color: #ffffff;background-color: #f4224d;border-radius: 0.5rem;text-align: center;padding: 0.3rem 0.2rem;">XX</span>' +
                                ' : '+
                                '<span id="second" style="color: #ffffff;background-color: #f4224d;border-radius: 0.5rem;text-align: center;padding: 0.3rem 0.2rem;">XX</span>' +
                                '</p>';
                            var div2str = '<div class="daojishidiv f_right" style="background-color: #ffeae9;width: '+rightwidthpercent+';height:100%;box-sizing: border-box;">'+str4+str5+'</div>';

                            //如果没有结束时间,直接不把右侧div加入到促销信息展示区域中来
                            var totalelements = endtime && endtime != '' ? div1str + div2str : div1str;

                            $('.promotiondiv').html(totalelements);
                            //将div2的高度设置和div1一样高
                            $('.daojishidiv').height(document.getElementsByClassName('specialbgdiv')[0].clientHeight);




                            //增加完之后开始设置倒计时功能(只有当有结束时间时才显示倒计时,如果没有结束时间则不显示,也就不计算时间差)
                            if (endtime && endtime != ''){
                                var time_distance = counttimewithstr(currenttime,endtime);

                                var intervel = setInterval(function () {
                                    var int_hour,int_minute,int_second;
                                    if(time_distance>0){

                                        int_hour=Math.floor(time_distance/3600);
                                        left1 = Math.floor(time_distance%3600);
                                        int_minute=Math.floor(left1/60);
                                        left2 = Math.floor(left1%60);
                                        int_second=Math.floor(left2);
                                        if(int_hour<10)
                                            int_hour="0"+int_hour;
                                        if(int_minute<10)
                                            int_minute="0"+int_minute;
                                        if(int_second<10)
                                            int_second="0"+int_second;
                                        //将计算出来的时分秒展示在相应位置
                                        $('#hour').html(int_hour);
                                        $('#minute').html(int_minute);
                                        $('#second').html(int_second);

                                        //如果是抢购还剩下最后第5分钟,则提醒用户抓紧抢购
                                        if (time_distance/60 == 5){
                                            longmainTip("抢购还剩下最后5分钟,抓紧时间行动吧!");
                                        }
                                        //如果是抢购还剩下最后第3分钟,则提醒用户抓紧抢购
                                        if (time_distance/60 == 3){
                                            longmainTip("抢购还剩下最后3分钟,错过这村可就没这店了!");
                                        }
                                        time_distance -= 1;

                                    }
                                    else{
                                        //倒计时结束 刷新当前页面 去除定时器
                                        clearInterval(intervel);
                                        location.reload();
                                    }

                                },1000);
                            }

                        }



                    }
                    //无促销信息,说明该商品没有加入促销或者促销已经结束,不增加其他的类别
                    else{}


                    //查看是否有更多促销商品的接口 返回URL则跳转至对应URL , 没有URL则不展示更多促销商品
                    /*
                        pid	商品id
                        type	商品类型    4原产优品   5定制商品
                    */
                    $.ajax({
                        url:checkifhasmorepromotion,
                        data:getAuth()+"info={pid:'"+pid+"',type:5}",
                        success:function(data){
                            if(data.errCode == 0){
                                //有促销链接
                                if (data.resultdata.url && data.resultdata.url != ''){
                                    //显示更多促销链接栏目
                                    $('.morepromotion').show();
                                }
                            };
                        }
                    });

                    //增加查看促销链接是否失效的点击事件
                    $(".morepromotion").off().click(function () {

                        $.ajax({
                            url:checkifhasmorepromotion,
                            data:getAuth()+"info={pid:'"+pid+"',type:5}",
                            success:function(data){
                                if(data.errCode == 0){
                                    //有促销链接
                                    if (data.resultdata.url && data.resultdata.url != ''){
                                        var jumpUrl = data.resultdata.url;
                                        location.href = jumpUrl;

                                    }
                                    //无促销链接 提示之后 刷新当前页面
                                    else {
                                        oneBtnTip({
                                            title:"提示",
                                            content:"该页面已失效，点击确认刷新详情页",
                                            cancel:function(){
                                                location.reload();
                                            }
                                        });
                                    }
                                };
                            }
                        });

                    });


                    //获取价格列表
                    if(pidInfo.priceList.length>1){ //有多个价格
                        $(".wrap .priceGroup").html(getPriceLi(pidInfo.priceList,customLife)).removeClass("hide");
                    }else {     //只有单一价格
                        $(".wrap .price").html("<span class='f14'>&yen;</span><span class='bold red f16'>"+pidInfo.priceList[0].price+"</span>" +
                            "<span class='grey9 f13'>&yen;"+customLife.marketPrice+"</span>").removeClass("hide");
                    }

                    //规格和库存
                    var guigeArr = customLife.stockQuantitys;

                    getGuiGeList(guigeArr,pidInfo.units);
                    if(customLife.quantityFlag == 0){  //全部售罄
                        $(".wrap .guiGe").html("规格：<span></span>"+guigeArr[0].color+"<span>"+getStockLimit(guigeArr[0])+"</span>");
                    }else{          //未全部售罄
                        var noStockQuantityFirstGuiGe = $(".wrap .guiGeArr div:not(.noStockQuantity):first");   //第一个有库存的规格
                        $(".wrap .guiGe").html("规格："+noStockQuantityFirstGuiGe.html());
                        noStockQuantityFirstGuiGe.addClass("red")
                    }

                    if(guigeArr.length>1){  //多个规格
                        $(".wrap .guiGe").addClass("moreGuiGe");

                        //选择规格
                        $(".wrap .guiGe").click(function(){
                            $(".guiGeArr").slideToggle("fast")
                        });
                        $(".wrap .guiGeArr div").click(function(){
                            var _this = $(this);
                            if(!_this.hasClass("red") && !_this.hasClass("noStockQuantity")){      //未被选择过并且有库存
                                _this.addClass("red").siblings().removeClass("red");
                                $(".wrap .guiGe").html("规格："+_this.html());
                            }
                            $(".guiGeArr").slideToggle("fast")
                        });
                    }

                    //支持服务
                    //sendType	配送方式1送货上门2用户自提3送货上门和用户自提都支持
                    if(customLife.sendType == 1){
                        $(".service span:last").hide()
                    }else if(customLife.sendType == 2){
                        $(".service span:first").hide()
                    }


                    //原产地
                    $(".wrap .address").html("原产地：<span class='grey6'>"+customLife.address+"</span>");

                    //联系卖家
                    //打电话
                    $(".tel").attr("href","tel:"+sellerUser.phone);


                    //设置默认数量
                    moRenCounts = pidInfo.sumCount || 6;
                    $(".numGroup input").val(moRenCounts);
                    //获取配送周期
                    getSendPlan(pidInfo,moRenCounts);
                    //获取总价和总量
                    getSumNumAndSumPrice(moRenCounts,pidInfo);


                    //配送方式 如果是单次配送的话
                    if(customLife.deliveryCycleType == 3){
                        $(".sendTypeWrap>div[deliveryType=3]").prepend("<div class='f_right'>"+pidInfo.onceDateList.date+" " +
                            "<span class='grey9'> "+moRenCounts+pidInfo.units+"</span></div>")
                            .addClass("active").siblings().removeClass("active");
                    }


                    //图文详情
                    $(".tabs .tab2").html("用户评价（"+customLife.totalComments+"）");
                    $(".tabContent .contents").html(customLife.productIntroduct);

                    //配送时间
                    var deliveryCycleArr = pidInfo.deliveryCycle.split(","),deliveryCycle = "";
                    if(pidInfo.deliveryCycleType==1){  //1周
                        if(deliveryCycleArr.length == 7){ //七天都可配送
                            deliveryCycle = "全年配送"
                        }else{
                            for(var j=0;j<deliveryCycleArr.length;j++){
                                switch (deliveryCycleArr[j]){
                                    case "1":
                                        deliveryCycleArr[j] = "周一";break;
                                    case "2":
                                        deliveryCycleArr[j] = "周二";break;
                                    case "3":
                                        deliveryCycleArr[j] = "周三";break;
                                    case "4":
                                        deliveryCycleArr[j] = "周四";break;
                                    case "5":
                                        deliveryCycleArr[j] = "周五";break;
                                    case "6":
                                        deliveryCycleArr[j] = "周六";break;
                                    case "7":
                                        deliveryCycleArr[j] = "周日";break;
                                }
                            }
                            deliveryCycleArr = deliveryCycleArr.join("、");
                            //console.log(deliveryCycleArr);
                            deliveryCycle = "每"+deliveryCycleArr+"可配送"
                        }
                    }else if(pidInfo.deliveryCycleType==2){//2月
                        if(deliveryCycleArr.length == 31){   //31天都可配送
                            deliveryCycle = "全年配送"
                        }else{

                            deliveryCycleArr = deliveryCycleArr.join("日、");
                            deliveryCycle = "每月"+deliveryCycleArr+"日可配送"
                        }
                    }
                    $(".tabContent .contents").append("<p style='font-size:14px'><b>配送时间：</b>"+deliveryCycle+"</p>");
                    //配送范围
                    var scopeValues;
                    if(customLife.countryFlag == 1){//是否全国1是2否
                        customLife.scopeValues?
                            scopeValues = "全国配送，除"+customLife.scopeValues.substr(0,customLife.scopeValues.length-1)+"以外"
                            : scopeValues = "全国配送";
                    }else if(customLife.countryFlag == 2){
                        scopeValues = customLife.scopeValues+"可配送"
                    }
                    $(".tabContent .contents").append("<p style='font-size:14px'><b>配送范围：</b>"+scopeValues+"</p>");
                    $(".scopeValues").html(scopeValues);

                    //详情图片
                    var detailImg = customLife.detailImg.split(",");
                    if(detailImg.length>0 && detailImg != 0){
                        var imgArr ="";
                        for(var i=0;i<detailImg.length;i++){
                            imgArr+="<img src='"+imgIndexUrl+detailImg[i]+"' align='middle'>"
                        }
                        $(".tabContent .img").html(imgArr)
                    }


                    //获取评论
                    commentList(pidInfo.pid);

                    //---------------------------数量操作------------------------
                    if(pidInfo.editFlag){   //从编辑页面点击完成返回详情页
                        $(".numGroup input").attr("disabled",true);  //禁止input操作
                        $(".sendTypeWrap .changeSendType ").remove();  //删除切换手动自动按钮

                        $(".sendTypeWrap >div[deliveryType="+pidInfo.deliveryType+"]").addClass("active").siblings().removeClass("active");


                        $(".numGroup .minus").unbind("click");
                        $(".numGroup .plus").unbind("click");
                    }else {

                        //数量输入
                        $(".numGroup input").bind('input propertychange', function() {
                            var _this = $(this),val = Number(_this.val()),minus =  $(".numGroup .minus");
                            if(val > 999) {
                                val= String(val).substr(0,3);
                            }else if(val< 1 ){
                                val= 1;
                            }
                            if(val == 1){   //当数量为1 改变减号颜色
                                minus.removeClass("canMinus")
                            }else {
                                minus.addClass("canMinus")
                            }
                            _this.val(val);
                            getSumNumAndSumPrice(val,pidInfo);
                            //获取配送日期及数量
                            getSendPlan(pidInfo,val);
                            //控制autoSend ul的高度
                            setAutoSendUlHeight(pidInfo.deliveryCycleType,slideUp,slideDown)
                        });

                        //数量减
                        $(".numGroup .minus").click(function() {
                            var val = Number($(this).next().val());
                            if(val>1){
                                val--;
                                if(val == 1){   //当数量为1 改变减号颜色
                                    $(this).removeClass("canMinus")
                                }
                                $(this).next().val(val);
                                getSumNumAndSumPrice(val,pidInfo);
                                //获取配送日期及数量
                                getSendPlan(pidInfo,val);
                                //控制autoSend ul的高度
                                setAutoSendUlHeight(pidInfo.deliveryCycleType,slideUp,slideDown)
                            }else {tip("最少选择一件商品")}
                        });

                        //数量加
                        $(".numGroup .plus").click(function() {
                            var val =  Number($(this).prev().val()),minus =  $(".numGroup .minus");
                            if(!minus.hasClass("canMinus")){    //改变减号的默认效果
                                minus.addClass("canMinus")
                            }
                            if(val < 999){
                                val++;
                                $(this).prev().val(val);
                                getSumNumAndSumPrice(val,pidInfo);
                                //获取配送日期及数量
                                getSendPlan(pidInfo,val);
                                //控制autoSend ul的高度
                                setAutoSendUlHeight(pidInfo.deliveryCycleType,slideUp,slideDown)
                            }else {tip("商品数量太多啦~")}

                        });
                    }

                    //-------------------------------------------------------------------------------

                    //------------------------------页面跳转----------------------------------------
                    //跳转编辑配送页面
                    $(".sendTypeWrap h3 a").click(function(){
                        pidInfo.sumCount = $(".numGroup input").val();//总量
                        pidInfo.sumPrice = $(".numGroups>p span:last").html();//总价
                        pidInfo.deliveryType =$(this).parents("div").attr("deliveryType");//1自动 2手动
                        if(pidInfo.deliveryType == 1){//自动
                            var index = 0;
                            for(var i=0;i<pidInfo.autoDateList.length;i++){
                                if(pidInfo.autoDateList[i].date == $(".autoSend ul li:last span:first").html()){
                                    index = i;
                                    break
                                }
                            }
                        }else if(pidInfo.deliveryType == 2){    //手动

                        }
                        pidInfo.dateIndex = index;
                        sessionStorage.setItem(pidInfo.pid+"pidInfo",JSON.stringify(pidInfo));//保存配送数据
                        location.href = jumpUrl.clEditSendType+pidInfo.pid;
                        //location.replace(jumpUrl.clEditSendType+pidInfo.pid)
                    });

                    //商品状态 1待上架2审核中 3在售中 4停售 5已下架
                    if(status == 3 && customLife.quantityFlag != 0){
                        //所有规格有库存
                        //立即购买,点击立即购买的时候就检测用户是否已经登录,如果未登录则先去登录,如果已经登录了则再进行下面上面的校验
                        $(".submit").html("立即购买").click(function(){

                            sessionStorage.setItem("completeUrl",location.href);    //保存当前页面 登录完成后跳回
                            isLogin(UID,function () {
                                //登录完成之后的操作(已经将用户选择的一切信息作为以pid为唯一标识的pidInfo存在了本地)
                                pidInfo.uid = UID;

                                //开始检查商品是否失效
                                $.ajax({
                                    url:clCheckCustomLifeUpdateUrl,
                                    data:getAuth()+"info={id:'"+pidInfo.pid+"',date:'"+customLife.modifyDate+"'}",
                                    success:function(data){
                                        if(data.errCode == 0){
                                            //商品未失效,检测用户是否可以享受优惠(此时用户肯定是已经登录的状态了)
                                            $.ajax({
                                                url:checkifusercanusepromotion,
                                                data:getAuth() + "info={uid:'"+pidInfo.uid+"',pid:'"+pidInfo.pid+"',type:5}",/*type  4原产优品 5定制生活*/
                                                success:function (data) {
                                                    if (data.errCode == 0){
                                                        //返回成功,根据后台不同字段名称判断该用户是否享受促销优惠,将该字段保存在本地以便于后面的下单页使用,根据不同的标识显示不同的下单页
                                                        // cheapFlag    享受优惠    1享受优惠   2促销中不优惠 3促销未开始/该商品不是促销不优惠
                                                        // cheapNum	可享受优惠次数

                                                        var cheapFlag = data.resultdata.cheapFlag;

                                                        //将之前的商品是否失效的检查结果和该用户享受优惠的类型一起存在本地
                                                        pidInfo.cheapFlag = cheapFlag;//判断该用户享受优惠的类型    1享受优惠   2促销中不优惠 3促销未开始/该商品不是促销不优惠
                                                        //将该商品的促销优惠信息存在本地
                                                        pidInfo.promotionInfo = promotionInfo;
                                                        pidInfo.sumCount = $(".numGroups p span:first").html();        //总量
                                                        pidInfo.sumPrice = $(".numGroups p span:last").html();       //总价
                                                        pidInfo.img = mianImg || jumpUrl.defaultShopAvatar;
                                                        pidInfo.shopName = customLife.shopName;
                                                        pidInfo.title = mytitle;
                                                        pidInfo.guige = $(".guiGe span").html();            //规格
                                                        pidInfo.deliveryType =$(".sendTypeWrap .active").attr("deliveryType");//1自动 2手动 3单次配送
                                                        pidInfo.refundDiscount =customLife.refundDiscount;//退款百分比
                                                        pidInfo.price = getPrice(pidInfo.sumCount,pidInfo.priceList);
                                                        pidInfo.sendType = customLife.sendType;         //配送方式 1送货上门 2用户自提 3送货上门和用户自提都支持
                                                        pidInfo.modifyDate = customLife.modifyDate;         //商品详情回传的时间 下单是需要判定商品是否被编辑
                                                        sessionStorage.removeItem("clMrid"); //清除之前地址选择缓存
                                                        sessionStorage.setItem(pidInfo.pid+"fromFlag","product");   //表明是从商品详情页面跳转确认下单页面
                                                        sessionStorage.setItem(pidInfo.pid+"pidInfo", JSON.stringify(pidInfo));
                                                        location.href = jumpUrl.clMakeSureOrder+pid;     //跳转确认下单页面



                                                    }
                                                    else{
                                                        //校验失败,提示用户重新校验
                                                        mainTip(data.msg);
                                                    }
                                                }
                                            });

                                        }else {
                                            oneBtnTip({
                                                title:"提示",
                                                content:"商品部分信息已被修改，点击确定刷新页面查看",
                                                cancel:function(){
                                                    sessionStorage.removeItem(pidInfo.pid+"pidInfo");   //清空当前缓存 重新获取送货日期
                                                    location.reload()
                                                }
                                            });
                                        }
                                    }
                                });
                            });

                        }).removeClass("hide");
                    }
                    else if(status == 4 ){
                        //商品状态为停售 展暂停销售按钮
                        $(".submit").removeClass("hide").html("暂停销售").css("background","#cdcdcd");
                    }
                    else if(customLife.quantityFlag == 0  ){
                        //所有规格全部售罄 展现已售罄按钮
                        $(".submit").removeClass("hide").html("已抢光").css("background","#cdcdcd").click(function () {
                            tip("该规格商品剩余库存不足，请联系卖家补足库存")
                        });
                    }

                }else{ //用户端已下架、待上架或是审核中
                    $(".noPro").show();
                }
            }else{
                tip(data.msg)
            }
        }
    });
}



//获取轮播图列表
function getCarouselImgLi(carouselImg){
    carouselImg = carouselImg.split(",");
    if(carouselImg.length>0 && carouselImg!="" ){
        var li = "";
        for(var i=0;i<carouselImg.length;i++){
            li += "<li class='swiper-slide' style='background-image: url("+imgIndexUrl+carouselImg[i]+")'></li>"
        }
        return li
    }
}

//获取价格列表
function getPriceLi(priceList,customLife){
    var li = "<li><p class='red'>&yen;"+customLife.price+"</p><p>≤"+priceList[1].count + customLife.units+"</p></li>";
    for(var i=1;i<priceList.length;i++){
        if(i+1 >= priceList.length){
            li += "<li><p class='red'>&yen;"+priceList[i].price+"</p><p>≥"+(Number(priceList[i].count)+1) + customLife.units+"</p></li>"
        }else{
            li += "<li><p class='red'>&yen;"+priceList[i].price+"</p><p>"+(Number(priceList[i].count)+1)+"-"+priceList[i+1].count + customLife.units+"</p></li>";
        }
    }
    return li
}


//获取规格列表
function getGuiGeList(guigeArr){
    var li="";
    for (var i=0;i<guigeArr.length;i++){
        //stockLimit 库存限制1有库存限制，非1无库存限制
        var noStockQuantity="";
        if(guigeArr[i].stockLimit == 1 && guigeArr[i].stockQuantity == 0){// >0代表有库存数量，=0代表刚好卖完，<0代表超卖
            noStockQuantity="noStockQuantity"
        }
        li +="<div class='oneClamp "+noStockQuantity+"'><span>"+guigeArr[i].color+"</span><span>"+getStockLimit(guigeArr[i])+"</span></div>"
    }
    $(".wrap .guiGeArr").html(li);
}

//展示库存效果
function getStockLimit(guigeArr){
    var stockLimit="货源充足";
    if(guigeArr.stockLimit == 1){
        if(guigeArr.stockQuantity == 0){ //>0代表有库存数量，=0代表刚好卖完，<0代表超卖
            stockLimit = "缺货";
        }else {
            stockLimit = "库存："+guigeArr.stockQuantity
        }
    }
    return stockLimit
}


//修改数量后获取总量总价
function getSumNumAndSumPrice(val,pidInfo){
    $(".numGroups p").html("共<span>"+val+"</span>"+pidInfo.units+"&yen;<span>"+
        (val*getPrice(val,pidInfo.priceList)).toFixed(2)+"</span>");

    $(".sendTypeWrap >div[deliveryType='3'] div span").html(val+pidInfo.units);

}

//根据数量获取单价
function getPrice(count,priceList){
    var price;
    count = Number(count);
    var priceListLength = priceList.length;
    if(priceListLength > 1){    //多个价格
        for(var i=1;i<priceListLength;i++){
            if(count > priceList[priceListLength-1].count){
                price = priceList[priceListLength-1].price;
                break
            }else if(count <= priceList[i].count){
                price = priceList[i-1].price;
                break
            }
        }
    }else{
        price = priceList[0].price;
    }

    return price
}


//获取配送日期及数量 proCounts 商品数量
function getSendPlan(pidInfo,proCounts){

    //获取自动配送日期
    var autoDateList =getDateList(pidInfo,proCounts);
    dateLength = autoDateList.length;

    //获取手动配送日期
    var handleDateList= pidInfo.handleDateList || autoDateList[0];

    //获取单次配送日期
    var onceDateList = {};
    onceDateList.date = handleDateList.date;


    if(!pidInfo.editFlag){ //在商品详情页编辑 需要配置份数信息
        //生成配送计划数组
        var length = Math.floor(proCounts/dateLength);
        for(var i=0;i<dateLength;i++){
            autoDateList[i].count = length;
        }
        var yuShu = proCounts%dateLength;
        for(var j=0;j<yuShu;j++){
            autoDateList[j].count ++;
        }
        //手动配送 默认数量为1
        handleDateList.count = 1;
        //单次配送 数量为默认或设置的数量
        onceDateList.count = proCounts;

    }else { //从编辑页面进入 不需要配置份数信息

    }

    //获取自动配送日期及数量列表
    var li="";
    for(var k=0;k<dateLength;k++){
        if (autoDateList[k].count != 0){
            li += "<li><span>"+autoDateList[k].date+"</span><span>"+autoDateList[k].count+pidInfo.units+"</span></li>"
        }
    }
    $(".autoSend ul").html(li);
    //console.log("生成配送计划:"+JSON.stringify(pidInfo.dateList));
    //获取手动配送日期
    $(".handleSend p:first").html("首次配送时间<span>"+handleDateList.date+" "+handleDateList.count+pidInfo.units+"</span>");
    $(".handleSend p:last span").html((proCounts-handleDateList.count)+pidInfo.units);

    pidInfo.autoDateList = autoDateList;
    pidInfo.handleDateList = handleDateList;
    pidInfo.onceDateList = onceDateList;
}


//获取配送日期
function  getDateList(pidInfo,proCounts){
    //proCounts  商品数量
    //count	获取日期周期数量
    var count,pidDateList=[] ;
    if(pidInfo.autoDateList){
        pidDateList = pidInfo.autoDateList
    }
    //type 配送周期类型1周2月
    //周配时 当数量小于12 获取12个日期 当数量超过12 获取53个日期
    //月配时 直接获取12个日期
    if(pidInfo.deliveryCycleType == 1 ){
        proCounts <= 12 ? count = 12 : count = 53
    }else{
        count=12
    }

    //没有缓存日期 或者周配时 商品数量大于缓存日期周期 并且日期周期小于52  获取日期
    if(pidDateList.length == 0 ||(pidInfo.deliveryCycleType ==1 && proCounts > pidDateList.length && pidDateList.length < 53 && !pidInfo.editFlag ) ){
        $.ajax({
            url:clDatelistUrl,
            async:false,
            data:getAuth(UID)+"info={pid:"+pidInfo.pid+",type:"+pidInfo.deliveryCycleType+",deliveryCycle:'"+
            pidInfo.deliveryCycle+"',enddate:'',count:"+count+"}",
            success:function(data){
                if(data.errCode == 0){
                    pidDateList = data.resultdata.list;
                }else{tip(data.msg)}
            }
        })
    }
    return pidDateList
}


//控制autoSend ul的高度 调整自动发货展示效果
function setAutoSendUlHeight(deliveryCycleType,slideUp,slideDown){
    var ul = $(".autoSend ul"),liLength= $(".autoSend ul li").length,
        liHeight= $(".autoSend ul li").outerHeight();
    //liHeight= 43;
    ul.height(Math.ceil(liLength/2 )* liHeight);
    //周配时 当li数量超过12个 展现上拉按钮
    if(liLength > 12 && deliveryCycleType==1){
        slideUp.show()
    }else {
        slideUp.hide();slideDown.hide()
    }
}


//获取评价数据
function commentList(pid){
    $.ajax({
        url:clCommendListUrl,
        data:getAuth()+"info={pageSize:5000,firstResult:0,pid:'"+pid+"'}",
        success:function(data){
            if(data.errCode == 0){
                var commentListArr = data.resultdata.commendList;
                if(commentListArr.length == 0){
                    //没有评价 显示提示信息
                    appendNoDataMsg($(".tab2Content"),"暂时没有评价");
                }else {
                    var li = "";
                    for (var i = 0; i < commentListArr.length; i++) {
                        var avatar = jumpUrl.moRenAvatar,  //设置默认头像
                            stars = "";
                        if (commentListArr[i].img) {
                            avatar = imgIndexUrl + commentListArr[i].img
                        }
                        for (var j = 0; j < commentListArr[i].star; j++) {
                            stars +="<img src='../../public/images/products/star.png'>"
                        }

                        li += "<li class='clearfix' uid ='" + commentListArr[i].uid + "' mobile='" + commentListArr[i].mobile + "'><div class='pic f_left' style='background-image:url(" + avatar + ")'></div>" +
                            "<time class='f_right'>" + commentListArr[i].post_time + "</time>" +
                            "<p class='name f15 oneClamp'>" + commentListArr[i].username + "</p>" +
                            "<div class='stars'>" + stars + "</div>" +
                            "<p class='cont f12'>" + commentListArr[i].content + "</p></li>"
                    }
                    $(".commentList").append(li)
                }
            }else{
                tip(data.msg)
            }
        }
    })
}

//ios5内返回不刷新 需要监听缓存的变化
function handle_storage(e){
    if(!e){e=window.event;}
    pidInfo=sessionStorage.getItem(pid+"pidInfo") || {};
    pidInfo = getPidInfo(pidInfo);

    getDetail(pidInfo)

}



















