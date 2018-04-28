/**
 * Created by hasee on 2016/9/12.
 */


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
    var gid = GetQueryString("gid"),type = typeObj.groupBuy;      //拼团类型


    if (gid != null && gid.toString().length > 0) {

        productsDetail(gid,type);        //获取商品详情
        commentList(gid);               //获取评价数据

    }


    //-------------------------------------点击事件------------------------------

    //显示选择规格遮罩层
    $(".chooseGuiGe").click(function() {

        $(".guiGeMask").fadeIn(200);
        $("body").on('touchmove',function(event) { event.preventDefault(); }, false);
    });
    $(".guiGeMaskChoose").click(function(e){e.stopPropagation(); });//阻止冒泡


    //点击选择规格
    $(".guiGeMaskChoose .row2 ul").on("click","li",function(){
        $(this).addClass("active").siblings().removeClass("active");  //改变选中的状态
    });

    //增加数量
    $(".guiGeMaskChoose .row3 .plus").click(function(){
        var val= Number($(this).prev().val())+ 1,minus = $(".guiGeMaskChoose .row3 .minus");
        if(!minus.hasClass("canMinus")){    //改变减号的默认效果
            minus.addClass("canMinus")
        }
        $(this).prev().val(val)
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



    //选项卡
    $(".tabs li").click(function(){
        $(this).addClass("active").siblings().removeClass("active");     //更改选中状态
        var index = $(this).index();
        //切换选项内容
        $(".tabContent > div").eq(index).show().siblings().hide();
    });


    //立即购买
    $(".buy").click(function(){
        if($(this).hasClass("isOver")){
            tip("团购已结束")
        }else {
            $(".guiGeMask").fadeIn(200);
            $("body").on('touchmove',function(event) { event.preventDefault(); }, false);
        }

    });


});





//获取商品详情
function productsDetail(gid,type){
    $.ajax({
        url:groupBuyUserUrl,
        data:getAuth()+"info={gid:'"+gid+"'}",
        async:false,
        success:function(data){
            if(data.errCode == 0) {
                var groupBuy = data.resultdata.groupBuy;
                //设置拼团跳转链接
                $("header .shangCheng").attr("href",jumpUrl.groupList+groupBuy.vid);
                //缓存拼团vid 下单时需要
                sessionStorage.setItem('groupVid',groupBuy.vid);
                //团购社区
                // 1 需要清除缓存社区名 必须通过链接的vid获取社区名称
                //      从订单页面跳转详情页 可能存在多个社区的情况 所以每次进入详情页必须清除缓存 重新请求社区名称
                $(".sheQu").html("发起团购社区："+getGroupVidName(groupBuy.vid,1)+"。购买时，请注意核对社区及考虑配送范围。");


                //----------------------------轮播图---------------------------
                //设置轮播图的高度 与宽度比例为1：1
                $(".lunBo").height($(".lunBo").width());

                var lunBoImg = groupBuy.img.split(",");
                var li = "";
                for (var i = 0; i < lunBoImg.length; i++) {
                    li += "<li class='swiper-slide' style='background-image: url(" + imgIndexUrl + lunBoImg[i] + ")' ></li>";
                }
                $(".lunBo").append(li);

                if ($(".lunBo li").length == 1) {
                    console.log("只有一张图片")
                } else {
                    //轮播图
                    var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination', paginationClickable: true,
                        loop: true, spaceBetween: 0, centeredSlides: true,
                        autoplay: 3000, autoplayDisableOnInteraction: false
                    });
                }

                //标题
                $(".main .title").html(groupBuy.title);
                //$("header h2").html(groupBuy.title);
                //价格
                var span = $(".main .wrap .price span");
                span.eq(1).html(groupBuy.newprice + "/" + groupBuy.units);
                span.eq(2).html("&yen;" + groupBuy.oldprice + "/" + groupBuy.units);



                //联系卖家
                groupBuy.sphone ?
                    $(".main .tel a").attr("href", "tel:" + groupBuy.sphone)    //联系方式不为空
                    : $(".main .tel a").click(function(){alert('卖家暂时没有提供联系方式')});



                //sendType为 0 不支持送货上门 1 支持送货上门
                if(groupBuy.sendType == 0){
                    $(".support span:last").hide()
                }
                //location为空 不能自提
                groupBuy.location?
                    $(".sendTypeAdd").append("自提地点："+groupBuy.location).show()  //取货地点
                    :$(".support span:first").hide();        //自提地址为空不让用户选择自提


                //标题
                $(".tab1Content .title").html(groupBuy.title);
                //内容
                $(".tab1Content .contents").html(groupBuy.product_detail);
                //详情
                $(".tab1Content .detail").append("<div class='f12'>" + groupBuy.detail + "</div>");

                //详情图片
                if (groupBuy.img2) {      //图片不为空
                    var imgArr = groupBuy.img2.split(",");
                    var img = "";
                    for (var k = 0; k < imgArr.length; k++) {
                        img += "<img src='" + imgIndexUrl + imgArr[k] + "' alt='图片加载失败' align='top'>"
                    }
                    $(".tab1Content .img").append(img)
                }


                //规格遮罩层
                //row1  图片 标题 价格
                sessionStorage.setItem("asmian", groupBuy.asmian);   //保存图片 为分享做准备
                sessionStorage.setItem("title", groupBuy.title);   //保存商品名称 为分享做准备
                $(".guiGeMaskChoose .row1 .pic").css("background-image", "url(" + imgIndexUrl + groupBuy.asmian + ")");
                $(".guiGeMaskChoose .row1 .title").html(groupBuy.title);
                $(".guiGeMaskChoose .row1 .price span:last-child").html(groupBuy.newprice + "/" + groupBuy.units);

                //row2  规格
                var guiGeArr = groupBuy.color.split(","),
                    guiGeLi = "";
                for (var j = 0; j < guiGeArr.length; j++) {
                    guiGeLi += "<li class='oneClamp'>" + guiGeArr[j] + "</li>"
                }
                $(".guiGeMaskChoose .row2 ul").append(guiGeLi);
                //当中只有一个规格  默认选中状态
                if (guiGeArr.length == 1) {
                    $(".guiGeMaskChoose .row2 ul li").addClass("active")
                }



                //-------------------------------------上下架状态、效果------------------------------

                //时间及满件效果
                var groupNumDom = $(".groupNum"),submitDom=$(".submit"),buyDom=$(".buy"),endTimeDom = $(".endTime");

                //成团量
                groupBuy.min_group_num?
                    groupNumDom.html("<span>"+groupBuy.min_group_num+"件成团</span>")
                    :groupNumDom.html("<span>0件成团</span>");

                if (groupBuy.isOnstore == 0) {        //下架状态

                    //展现已结束状态
                    overTime(groupBuy,groupNumDom,submitDom,buyDom,endTimeDom);

                } else if (groupBuy.isOnstore == 1) {   //上架状态

                    //成团量与已售数量的差值 剩余件数
                    var num = groupBuy.min_group_num-groupBuy.sales ;
                    //剩余件数 小于等于0 已满件 大于0 还剩几件
                    num<=0?
                        groupNumDom.append("<span>已满件</span>")
                        :groupNumDom.append("<span>差"+num+"件</span>");


                    //结束时间
                    var endTime =groupBuy.endTime;
                    //var endTime ="2016-11-20 09:46:05";
                    //当前时间
                    var dqTime =groupBuy.dqTime;
                    //var dqTime ="2016-11-20 09:46:00";
                    //结束时间与当前时间的差值
                    var time = get_unix_time(endTime) - get_unix_time(dqTime);

                    endTimeDom.html(countTime(time));
                    time -= 1000;
                    //运行计时器
                    var interval = setInterval(function(){
                        if(time <= 0){
                            //当时间差小于等于0时 停止计时器 改变状态
                            clearInterval(interval);
                            //展现已结束状态
                            overTime(groupBuy,groupNumDom,submitDom,buyDom,endTimeDom);
                        }else {
                            //当时间差大于0时运行显示倒计时
                            endTimeDom.html(countTime(time));
                            time -= 1000;
                        }
                    }, 1000);
                }

                //-------------------------------------跳转确认下单页面------------------------------
                //跳转确认下单页面
                $(".submit").click(function () {
                    if($(this).hasClass("isOver")){
                        tip("团购已结束")
                    }else {
                        sessionStorage.setItem("completeUrl", jumpUrl.makeSureOrder + "?from=group");    //保存当前地址 登录完成后跳转确认订单页面
                        var guiGeLi = $(".guiGeMaskChoose .row2 ul .active");
                        if (guiGeLi.length == 0) {    //没有选中
                            tip("请选择商品规格")
                        } else if (!/^[0-9]*$/.test($(".guiGeMaskChoose .row3 input").val())) {
                            tip("数量必须为数字")
                        } else {

                            var info = {
                                "gid": gid,      //商品pid
                                "count": parseInt($(".guiGeMaskChoose .row3 input").val()), //商品数量
                                "color": guiGeLi.html(),            //规格
                                "img": groupBuy.asmian,             //图片
                                "title":groupBuy.title,            //商品名称
                                "price": groupBuy.newprice,         //商品团购价格
                                "oldPrice":groupBuy.oldprice,       //商品原价
                                "poster":groupBuy.uid,              //发布人id
                                "sendType":groupBuy.sendType,       //sendType 0 不支持送货上门 1 支持送货上门
                                "location":groupBuy.location	    //自提地址 为空不能自提
                            };
                            sessionStorage.setItem('proInfo', JSON.stringify(info));
                            isLogin(UID, function () {
                                location.href = jumpUrl.makeSureOrder + "?from=group";  //从团购详情跳转
                            });
                        }
                    }
                })


            }else {
                tip(data.msg)
            }
        }
    });
}





//获取评价数据
function commentList(gid){
    $.ajax({
        url:selectGroupbuyCommListUrl,
        data:getAuth()+"info={pageSize:5000,firstResult:0,gid:'"+gid+"'}",
        success:function(data){
            if(data.errCode == 0){
                var commentListArr = data.resultdata.commList;
                if(commentListArr.length == 0){
                    //没有评价 显示提示信息
                    $(".contentWrap .tab2Content").append("<div class='t_center grey9 f13'>暂时没有评价</div>")
                }else {
                    $(".tabs .tab2").html("用户评价(" + commentListArr.length + ")");      //展示用户评价数量
                    var li = "";
                    for (var i = 0; i < commentListArr.length; i++) {
                        var avatar = jumpUrl.moRenAvatar,  //设置默认头像
                            stars = "";
                        if (commentListArr[i].avatar) {
                            avatar = imgIndexUrl + commentListArr[i].avatar
                        }
                        for (var j = 0; j < commentListArr[i].star; j++) {
                            stars += "<img src='../../public/images/products/star.png'>"
                        }

                        li += "<li class='clearfix' uid ='" + commentListArr[i].uid + "' mobile='" + commentListArr[i].mobile + "'><div class='pic f_left' style='background-image:url(" + avatar + ")'></div>" +
                            "<time class='f_right'>" + commentListArr[i].postTime + "</time>" +
                            "<p class='name f15 oneClamp'>" + commentListArr[i].uname + "</p>" +
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


//将时间格式转换为时间戳
function get_unix_time(dateStr){
    var newstr = dateStr.replace(/-/g,'/');
    var date =  new Date(newstr);
    var time_str = date.getTime().toString();
    return time_str.substr(0, 13);
}

//倒计时逻辑
function countTime(time) {

    //计算出相差天数
    var days=Math.floor(time/(24*3600*1000));

    //计算出小时数
    var leave1=time%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000)  ;      //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));

    //计算相差秒数
    var leave3=leave2%(60*1000) ;     //计算分钟数后剩余的毫秒数
    var seconds=Math.floor(leave3/1000);

    //构建显示结构
    return "距结束 <span>"+days+"</span>天<span>"+hours+"</span>时<span>"+minutes+"</span>分<span>"+seconds+"</span>秒";

}


//团购已结束逻辑
function overTime(groupBuy,groupNumDom,submitDom,buyDom,endTimeDom){

    //显示已结束
    groupNumDom.children().length==2?   //存在满件或差几件显示
        groupNumDom.children().eq(1).html("已结束")
        :groupNumDom.append("<span>已结束</span>");

    //下单及立即购买样式改变
    //确认下单
    submitDom.addClass("isOver");      //更改样式  添加结束标识

    //立即购买
    buyDom.addClass("isOver");       //更改样式   添加结束标识

    //结束时间
    endTimeDom.html("结束时间："+groupBuy.jsTime);

}

