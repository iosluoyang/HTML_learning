/**
 * Created by hasee on 2016/9/12.
 */

var Page = 0;//评论数据的第一页的页码数
var myDate = '';//用于分页使用,接口会在第0页返回,以后上送就传此值即可
var CommentsCount = '';//评论总数量,接口会在第0页进行返回
var limitationcount = "";   //如果该商品为促销商品，则增加促销限购量，用于在选择规格和数量的时候进行判断
var promotionInfo;//该商品的促销信息
var cheapFlag;//该用户是否可以享受促销优惠的字段


$(function () {

    //--------------------------------立即打开----------------------------------------
    openApp($("header"),$(".scrollWrap"));
    //------------------------------设置遮罩层及中心页面的高度------------------------------------------
    $(".guiGeMask").height(innerHeight-$("footer").height());
    $(".scrollWrap").height(innerHeight-2*$("footer").height());


    //---------------------------------------返回顶部------------------------------------------
    //显示返回顶部按钮
    $(".scrollWrap").on("scroll",function(){
        var t = $(".scrollWrap").scrollTop();
        if( t >= innerHeight ) {
            $(".goTop").show();
        } else {
            $(".goTop").hide();
        }
    });
    //点击返回顶部
    $(".goTop").click(function(){
        $(".scrollWrap").scrollTop(0)
    });



    //---------------------------------------获取数据------------------------------------------
    //解析传入参数 获取商品pid
    var pid = GetQueryString("pid"), type =typeObj.native;      //原产地精选类型

    if (pid != null && pid.toString().length > 0) {

        productsDetail(pid,type);        //获取商品详情
        commentList(pid);               //获取评价数据
        baoKuanList(pid);               //获取爆款推荐列表

    }


    //-------------------------------------点击事件------------------------------
    //点击收藏
    $(".shouCang").click(function(){
        var _this = $(this);
        sessionStorage.setItem("completeUrl",location.href);    //保存当前地址 登录完成后跳回
        isLogin(UID,function(){shouCangAction(_this,"yiShouCang","收藏","已收藏","pid",pid,UID)});
    });



    $(".guiGeMaskChoose").click(function(e){e.stopPropagation(); });//阻止冒泡

    //点击选择规格
    $(".guiGeMaskChoose .row2 ul").on("click","li",function(){
        var _this = $(this),stockQuantity = _this.data("stockQuantity");
        if(!_this.hasClass("active") && !_this.hasClass("noQuantity") ){  //当前未被选中 并且库存不为0（没有被置灰）
            stockQuantity? $(".stockQuantity").html("库存："+stockQuantity):$(".stockQuantity").html("货源充足");
            _this.addClass("active").siblings().removeClass("active");  //改变选中的状态
        }
    });

    //增加数量
    $(".guiGeMaskChoose .row3 .plus").click(function(){
        var val= Number($(this).prev().val())+ 1,minus = $(".guiGeMaskChoose .row3 .minus");
        if(!minus.hasClass("canMinus")){    //改变减号的默认效果
            minus.addClass("canMinus")
        }
        //如果数量超过了最大限购数,则提醒用户超过了最大限购数,数量不增加
        if (limitationcount && parseInt(val) > parseInt(limitationcount)){
            mainTip("最大限购数为"+limitationcount);
        }
        else {
            $(this).prev().val(val)
        }
    });
    //减少数量
    $(".guiGeMaskChoose .row3 .minus").click(function(){
        var val= Number($(this).next().val());
        if(val > 1){
            val--;
            if(val == 1){   //当数量为1 改变减号颜色
                $(this).removeClass("canMinus")
            }
            $(this).next().val(val)
        }else{
            tip("最少选择一个商品");
        }
    });




    //隐藏选择规格遮罩层
    $(".guiGeMask").click(function(){
        $(".guiGeMask").fadeOut(200);
        $("body").unbind('touchmove');
    });
    $(".guiGeMask .close").click(function(){
        $(".guiGeMask").fadeOut(200);
        $("body").unbind('touchmove');
    });

    //爆款推荐商品列表点击跳转详情
    $(".baoKuanList").on("click", "li", function(){
        var pid = $(this).attr("pid");  //获取商品id
        location.href=jumpUrl.productsDetail+pid;
    });

    //选项卡
    $(".tabs li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");     //更改选中状态
        var index = $(this).index();
        //切换选项内容
        $(".tabContent > div").eq(index).show().siblings().hide();
    });



});


//获取爆款详情商品列表
function baoKuanList(pid){
    $.ajax({
        url: baoKuanUrl,
        data:getAuth()+"info={pageSize:20,firstResult:0,pid:'"+pid+"'}",
        success: function (data) {
            //获取爆款推荐商品列表数据
            var goodsListArr = data.resultdata.goodsList;
            if(goodsListArr.length == 0){
                //当爆款为空 隐藏页面
                $(".noData").show()
            }else {

                var goodsListLi = "";
                for (var i = 0; i < goodsListArr.length; i++) {
                    //商品信息
                    var productdict = goodsListArr[i];
                    //促销的相关信息
                    var promotionInfo = productdict.promotionInfo;

                    //促销商品的标题展示(无促销时展示原标题,有促销时展示促销标题)
                    var mytitle = promotionInfo && JSON.stringify(promotionInfo) != '{}' ? promotionInfo.title : productdict.title;

                    //判断是否已经售罄 quantityFlag 0 已售罄  非0 未全部售罄
                    var quantityFlag = productdict.quantityFlag == "0" ? "quantityFlag" : "";
                    //图片的展示
                    var img = productdict.img ? imgIndexUrl + productdict.img :jumpUrl.defaultShopAvatar;
                    //关于价格的展示逻辑 有促销字典时展示促销价  无促销字典时红字展示售价
                    var showprice = "";
                    if (promotionInfo && JSON.stringify(promotionInfo) != '{}'){
                        //有促销时 展示促销价
                        showprice = promotionInfo.price;
                    }
                    else{
                        //无促销时 展示售价
                        showprice = productdict.newprice;
                    }

                    //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
                    var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);


                    goodsListLi += "<li pid='" + productdict.pid + "'>" +
                        "<div class='pic "+quantityFlag+"' style='background-image: url(" + img + ")'></div>" + //图片
                        "<div class='title'><h3>" + mytitle + "</h3></div>" + //标题
                        "<p>&yen;<span class='price bold'>" + showprice + "</span></p>" + //价格
                        promotionstr+ //促销标签
                        "</li>"
                }
                $(".baoKuanList").append(goodsListLi);
            }
        }
    });
}

//获取商品详情
function productsDetail(pid,type){

    $.ajax({
        url:nativeProductsDetailUrl,
        data:getAuth()+"info={pid:'"+pid+"',uid:'"+UID+"'}",
        async:false,
        success:function(data){
            if(data.errCode ==0){
                var bean = data.bean;

                //----------------------------轮播图---------------------------
                //设置轮播图的高度 与宽度比例为1：1
                $(".lunBo").height($(".lunBo").width());

                var lunBoImg = bean.img.split(",");
                var li = "";
                for(var i = 0;i<lunBoImg.length;i++){
                    li+="<li class='swiper-slide' style='background-image: url("+imgIndexUrl+ lunBoImg[i] +")' ></li>";
                }
                $(".lunBo").append(li);

                if($(".lunBo li").length ==1){
                    console.log("只有一张图片")
                }
                else {
                    //轮播图
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination', paginationClickable: true,
                        loop:true, spaceBetween: 0, centeredSlides: true,
                        autoplay: 3000, autoplayDisableOnInteraction: false
                    });
                }


                //判断是否有促销信息,如果有的话则展示促销页面的样式
                promotionInfo = bean.promotionInfo;
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
                        var cuxiaojia = promotionInfo.price;
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
                        //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
                        var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);

                        var htmlstr =  '<p class="red"><span style="font-size: 1.5rem;margin-right: 0.5rem;">&yen;</span><span style="font-size: 2rem;">'+bean.jinhuo_price+'</span><span style="font-size: 1rem;color: #3088ff;margin-left: 0.5rem;">'+timestr+'</span></p>' +
                                        '<p class="red" style="margin-top: 0.5rem;">'+promotionstr+'<span style="font-size: 1.1rem;margin-left: 0.5rem;">'+"&yen;"+cuxiaojia+'</span></p>';
                        $('.promotionpricediv').html(htmlstr);
                    }
                        //促销中
                    else if(promotionInfo.status.toString() == "2"){
                        //轮播图下方的倒计时区域显示

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

                        //促销价
                        var cuxiaojia = promotionInfo.price;
                        var str1 = '<p style="font-size: 2rem;color: #ffffff;margin-bottom: 5px;"><span style="font-size: 1.5rem">&yen; </span>'+cuxiaojia+'</p>';
                        //根据促销信息字典选择不同的特殊促销标签
                        var str2 = returnspecialpromotiontagstr(ifcustomlist = false,promotionInfo);

                        //原价
                        var price = bean.jinhuo_price;
                        var str3 = '<span style="color: #ffffff;font-size: 1rem;margin-left: 0.5rem;">原价 &yen; '+price+'</span>';

                        var div1str = '<div class="specialbgdiv f_left" style="padding: 5px 10px 5px 10px;width: '+leftwidthpercent+';box-sizing: border-box;">'+str1+str2+str3+'</div>';


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
                //无促销信息,说明该商品没有加入促销或者促销已经结束  将原始价格区域展示出来,不增加其他的类别
                else{
                    //显示原始的价格区域
                    $('.wrap .price').show();
                }

                //促销商品的标题展示(无促销时展示原标题,有促销时展示促销标题)
                var mytitle = promotionInfo && JSON.stringify(promotionInfo) != '{}' ? promotionInfo.title : bean.title;
                $(".main .title").html(mytitle);
                //简介
                $(".main .wrap .jianjie").html(bean.jianjie);
                //价格
                var span = $(".main .wrap .price span");
                span.eq(1).html(bean.jinhuo_price+"/"+bean.units);
                span.eq(2).html("&yen;"+bean.price +"/"+bean.units);
                //原产地
                $(".main .wrap .address").append(bean.address);

                //联系卖家  通过卖家的uid请求接口 获取卖家的联系方式
                $.ajax({
                    url:mobileInfoUrl,
                    data:getAuth()+"info={uid:'"+bean.uid+"'}",
                    success:function(data){
                        if(data.errCode == 0){
                            $(".main .tel a").attr("href","tel:"+data.resultdate.user.phone);    //联系方式不为空
                        }else{
                            $(".main .tel a").click(function(){alert('卖家暂时没有提供联系方式')});
                        }
                    }
                });


                //更多品牌商品
                //  是否是品牌馆的商品
                //      否 不显示查看更多品牌商品
                if(bean.isppg == 1){
                    //是 显示查看更多品牌商品 点击并跳转到对应的品牌馆
                    $(".main .more").show();
                    $(".main .more a").attr("href",jumpUrl.brand+bean.ppgid)
                };

                //查看是否有更多促销商品的接口 返回URL则跳转至对应URL , 没有URL则不展示更多促销商品
                /*
                    pid	商品id
                    type	商品类型    4原产优品   5定制商品
                */
                $.ajax({
                    url:checkifhasmorepromotion,
                    data:getAuth()+"info={pid:'"+pid+"',type:4}",
                    success:function(data){
                        if(data.errCode == 0){
                            //有促销链接
                            if (data.resultdata.url && data.resultdata.url != ''){
                                //显示更多促销链接栏目
                                $('.main .morepromotion').show();
                            }
                        };
                    }
                });

                //增加查看促销链接是否失效的点击事件
                $(".morepromotion").off().click(function () {

                    $.ajax({
                        url:checkifhasmorepromotion,
                        data:getAuth()+"info={pid:'"+pid+"',type:4}",
                        success:function(data){
                            if(data.errCode == 0){
                                //有促销链接
                                if (data.resultdata.url && data.resultdata.url != ''){
                                    //跳转链接
                                    location.href = data.resultdata.url;
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



                //内容
                $(".main .contents").html(bean.content);

                //详情
                $(".main .detail").append("<div class='f12'>"+bean.detail+"</div>");
                //详情图片
                if(bean.img2){      //详情图片不为空
                    var imgArr = bean.img2.split(",");
                    var img="";
                    for(var k = 0;k<imgArr.length;k++){
                        img += "<img src='"+imgIndexUrl+imgArr[k]+"' alt='图片加载失败' align='top'>"
                    }
                    $(".main .img").append(img)
                }


                //规格遮罩层
                //row1  图片 标题 价格
                sessionStorage.setItem("asmian",bean.asmian);   //保存图片 为分享做准备
                sessionStorage.setItem("title",mytitle);   //保存商品名称 为分享做准备
                $(".guiGeMaskChoose .row1 .pic").css("background-image","url("+imgIndexUrl+bean.asmian+")");
                $(".guiGeMaskChoose .row1 .title").html(mytitle);


                //row2  规格
                var guiGeArr = bean.stockQuantitys,guiGeLi="";
                for(var j =0;j<guiGeArr.length;j++){
                    var quantity="";
                    //库存限制 1有库存限制，非1无库存限制
                    (guiGeArr[j].stockLimit == 1 && guiGeArr[j].stockQuantity <=0)?
                        quantity = "noQuantity"//当前规格有库存限制 并且库存规格小于等于0 规格置灰
                        :quantity = "hasQuantity";//当前规格有库存限制 并且库存规格大于0 规格置灰

                    guiGeLi += "<li class='oneClamp "+quantity+"' " +
                        "data-stock-Quantity='"+guiGeArr[j].stockQuantity+"'>"+guiGeArr[j].color+"</li>"
                }
                $(".guiGeMaskChoose .row2 ul").append(guiGeLi);

                //获取所有有库存的规格
                var hasQuantityDom = $(".guiGeMaskChoose .row2 ul .hasQuantity");
                if(hasQuantityDom.length==1){
                    hasQuantityDom.addClass("active");
                    var stockQuantity = hasQuantityDom.data("stockQuantity");
                    stockQuantity? $(".stockQuantity").html("库存："+stockQuantity):$(".stockQuantity").html("货源充足");
                }



                //footer收藏状态
                if(bean.issc ==1){
                    $("footer .shouCang").addClass("yiShouCang").html("已收藏")
                }

                //是否已售罄
                if(bean.quantityFlag == 0){   //全部没有库存0已售罄非0未全部售罄
                    //立即购买
                    $(".buy").html("已抢光").css("background","#cdcdcd").click(function(){
                        tip("该商品剩余库存不足，请联系卖家补足库存")
                    });
                    //显示选择规格遮罩层
                    $(".chooseGuiGe").click(function() {
                        tip("该商品剩余库存不足，请联系卖家补足库存")
                    });
                }else{
                    //立即购买的点击事件,需要用户登录之后再进行展示
                    $(".buy").html("立即购买").css("background","#ff3b30").click(function(){
                        sessionStorage.setItem("completeUrl",location.href);    //保存当前页面 登录完成后跳回
                        isLogin(UID,function () {
                            //根据登录之后的UID获取该用户是否可以享受促销优惠信息
                            //规格的价格显示,根据从后台获取的该用户是否可以享受优惠选择对应的价格(若可以享受优惠则展示优惠价,如果不可以享受优惠则展示) 该接口的调用为登录之后
                            //调取接口获取用户是否可以享受优惠信息
                            $.ajax({
                                url:checkifusercanusepromotion,
                                data:getAuth() + "info={uid:'"+UID+"',pid:'"+pid+"',type:4}",/*type  4原产优品 5定制生活*/
                                success:function (data) {
                                    if (data.errCode == 0){
                                        //返回成功,根据后台不同字段名称判断该用户是否享受促销优惠,将该字段保存在本地以便于后面的下单页使用,根据不同的标识显示不同的下单页
                                        // cheapFlag    享受优惠    1享受优惠   2促销中不优惠 3促销未开始/该商品不是促销不优惠
                                        // cheapNum	可享受优惠次数

                                        cheapFlag = data.resultdata.cheapFlag;
                                        var cheapNum = data.resultdata.cheapNum;
                                        var showprice = "";

                                        //如果可以享受优惠则展示优惠价,并且显示限购数量
                                        if (cheapFlag.toString() == "1"){
                                            showprice = promotionInfo.price;
                                            $('.guiGeMaskChoose .row3 .limitationcount').html("(促销价限购"+cheapNum+bean.units + ")");
                                            //只有当该用户享受促销优惠时才赋值给全局变量限购数量
                                            limitationcount = cheapNum;
                                        }
                                        else {
                                            //展示原价,并且不展示限购数量
                                            showprice = bean.jinhuo_price;
                                        }
                                        $(".guiGeMaskChoose .row1 .price span:last-child").html(showprice+"/"+bean.units);
                                        //登录完成之后的操作(已经将用户选择的一切信息作为以pid为唯一标识的pidInfo存在了本地)
                                        $(".guiGeMask").fadeIn(200);
                                        $("body").on('touchmove',function(event) { event.preventDefault(); }, false);

                                    }
                                    else{
                                        //校验失败,提示用户重新校验
                                        mainTip(data.msg);
                                    }
                                }
                            });



                        });


                    });

                    //显示选择规格遮罩层(和点击立即购买的效果一样)
                    $(".chooseGuiGe").click(function() {
                        sessionStorage.setItem("completeUrl",location.href);    //保存当前页面 登录完成后跳回
                        isLogin(UID,function () {
                            //根据登录之后的UID获取该用户是否可以享受促销优惠信息
                            //规格的价格显示,根据从后台获取的该用户是否可以享受优惠选择对应的价格(若可以享受优惠则展示优惠价,如果不可以享受优惠则展示) 该接口的调用为登录之后
                            //调取接口获取用户是否可以享受优惠信息
                            $.ajax({
                                url:checkifusercanusepromotion,
                                data:getAuth() + "info={uid:'"+UID+"',pid:'"+pid+"',type:4}",/*type  4原产优品 5定制生活*/
                                success:function (data) {
                                    if (data.errCode == 0){
                                        //返回成功,根据后台不同字段名称判断该用户是否享受促销优惠,将该字段保存在本地以便于后面的下单页使用,根据不同的标识显示不同的下单页
                                        // cheapFlag    享受优惠    1享受优惠   2促销中不优惠 3促销未开始/该商品不是促销不优惠
                                        // cheapNum	可享受优惠次数

                                        cheapFlag = data.resultdata.cheapFlag;
                                        var cheapNum = data.resultdata.cheapNum;
                                        var showprice = "";

                                        //如果可以享受优惠则展示优惠价,并且显示限购数量
                                        if (cheapFlag.toString() == "1"){
                                            showprice = promotionInfo.price;
                                            $('.guiGeMaskChoose .row3 .limitationcount').html("(促销价限购"+cheapNum+bean.units + ")");
                                            //只有当该用户享受促销优惠时才赋值给全局变量限购数量
                                            limitationcount = cheapNum;
                                        }
                                        else {
                                            //展示原价,并且不展示限购数量
                                            showprice = bean.jinhuo_price;
                                        }
                                        $(".guiGeMaskChoose .row1 .price span:last-child").html(showprice+"/"+bean.units);
                                        //登录完成之后的操作(已经将用户选择的一切信息作为以pid为唯一标识的pidInfo存在了本地)
                                        $(".guiGeMask").fadeIn(200);
                                        $("body").on('touchmove',function(event) { event.preventDefault(); }, false);

                                    }
                                    else{
                                        //校验失败,提示用户重新校验
                                        mainTip(data.msg);
                                    }
                                }
                            });



                        });
                    });

                    //下单
                    $(".submit").click(function(){
                        sessionStorage.setItem("completeUrl",jumpUrl.makeSureOrder + "?from=native");    //保存当前地址 登录完成后跳回
                        var guiGeLi = $(".guiGeMaskChoose .row2 ul .active"),
                            stockQuantity = guiGeLi.data("stockQuantity"),//获取当前选中规格库存数量
                            val = parseInt($(".guiGeMaskChoose .row3 input").val());

                        if(guiGeLi.length != 0){
                            if(stockQuantity == "" || val <= stockQuantity){
                                //当货源充足 或者所选数量小于或等于库存
                                //验证商品是否失效
                                $.ajax({
                                    url:checkProductUrl,
                                    data:getAuth()+"info={type:"+type+",id:'"+pid+"'}",
                                    success:function(data){
                                        if(data.errCode==0) {        //未失效   //将商品信息缓存到本地 下单页面获取

                                            var info = {
                                                "pid": pid,      //商品pid
                                                "count": val,             //商品数量
                                                "color": guiGeLi.html(),            //规格
                                                "img": bean.asmian,                  //图片
                                                "title": mytitle,                  //商品名称
                                                "price": bean.jinhuo_price,            //商品平台售价
                                                "promotionInfo":promotionInfo,          //商品促销信息
                                                "cheapFlag":cheapFlag                   //该用户是否可以享受优惠信息的字段

                                            };
                                            sessionStorage.setItem('proInfo', JSON.stringify(info));
                                            isLogin(UID,function(){
                                                location.href = jumpUrl.makeSureOrder + "?from=native";     //从原产优品进订单确认页面
                                            })
                                        }
                                        else{tip("商品已失效")}
                                    }
                                })
                            }
                            else {tip("库存不足，请重新选择购买数量")}
                        }
                        else { //没有选中商品规格
                            tip("请选择商品规格")
                        }
                    });


                }





            }else {
                tip(data.msg)
            }
        }
    });
}

//获取评价数据
function commentList(pid){
    $.ajax({
        url:commendListUrl,
        data:getAuth()+"info={pageSize:20,firstResult:"+Page+",pid:"+pid+",date:'"+myDate+"'}",
        success:function(data){
            if (data.errCode == "0"){

                var commentListArr = data.commentList;

                //判断是否是第0页,存储后台返回的date字段和评论总数
                if (Page == 0){
                    myDate = data.date;
                    CommentsCount = data.total;
                    //设置评论总数的展示
                    $(".tabs .tab2").html("用户评价("+CommentsCount+")");      //展示用户评价数量
                }

                var li = "";
                for(var i = 0;i<commentListArr.length;i++){
                    var avatar = jumpUrl.moRenAvatar,  //设置默认头像
                        username = "",stars="";
                    if(commentListArr[i].user){ //当存在user字段
                        if(commentListArr[i].user.avatar){  //并且user内头像字段不为空
                            avatar = imgIndexUrl+commentListArr[i].user.avatar
                        }
                        if(commentListArr[i].user.username){  //并且user内名称字段不为空
                            username = commentListArr[i].user.username
                        }
                    }
                    for(var j=0;j<commentListArr[i].star;j++){
                        stars +="<img src='../../public/images/products/star.png'>"
                    }

                    li += "<li class='clearfix'><div class='pic f_left' style='background-image:url("+avatar+")'></div>" +
                        "<time class='f_right f11'>"+commentListArr[i].post_time+"</time>" +
                        "<p class='name f14 oneClamp'>"+username+"</p>" +
                        "<div class='stars'>"+stars+"</div>" +
                        "<p class='cont f12 grey6'>"+commentListArr[i].content+"</p></li>"
                }
                $(".commentList").append(li)

                //增加完评论数据之后根据是否是最后一页，根据是否有评论判断要显示的评论Tip字样
                var Tip = ""
                //正好在新的一页没有数据了
                if (commentListArr.length == 0){
                    Tip = "已经加载所有评论"
                    //移除Tip的点击事件
                    $(".contentWrap .tab2ContentTip").off();

                }
                //已经是最后一页
                else if (commentListArr.length <20){
                    Tip = "已经加载所有评论"
                    $(".contentWrap .tab2ContentTip").off();
                }
                //后面还有评论数据
                else {
                    Tip = "点击查看更多评论"
                    //设置点击的事件
                    $(".contentWrap .tab2ContentTip").off().click(function () {
                        //当前的页码数:
                        Page ++;
                        //加载下一页的评论数据
                        commentList(pid)
                    });
                }

                $(".contentWrap .tab2ContentTip").html("<div class='f13 grey9 t_center'>"+Tip+"</div>");

            }
            else {
                $(".contentWrap .tab2ContentTip").html("<div class='f13 grey9 t_center'>评论加载失败,请点击重试</div>");
                $(".contentWrap .tab2ContentTip").off().click(function () {
                    //再次加载当前页的评论数据
                    commentList(pid)
                });
            }



        }
    })
}



