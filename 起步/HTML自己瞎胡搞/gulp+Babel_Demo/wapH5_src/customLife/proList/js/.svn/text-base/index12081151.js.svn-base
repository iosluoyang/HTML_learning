/**
 * Created by hasee on 2017/5/11.
 */

$(function(){

    //上拉加载
    $(".innerMain").on("scroll",function(e){
        e.stopPropagation();
        var scrollHeight = $(this).scrollTop()+window.innerHeight,
        maxHeight = $(".proList").outerHeight()+ $("nav").outerHeight();
        if (scrollHeight >=maxHeight && $(".noData").length != 1){
            getProList()
        }
        if (scrollHeight  > 2*window.innerHeight){
            $(".goTop").show()
        }else {
            $(".goTop").hide()
        }
    });


    //返回顶部
    $(".goTop").click(function(){
        $(".innerMain").scrollTop(0)
    });


    //设置分类和内容页的高度 使页面能滚动
    $(".main,.innerMain").height(window.innerHeight);
    $(".menu,.innerMenu").height(window.innerHeight);

    //获取分类
    $.ajax({
        url:clTypeListUrl,
        data:getAuth()+"info={}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="";
                for(var i=0;i<list.length;i++){
                    var listtype = list[i].listtype;    //二级分类
                    var listtypeLi ="";
                    for(var l=0;l<listtype.length;l++){
                        var img = publicUrl+"public/images/customLife/fenLei.png";
                        if(listtype[l].img){ img = imgIndexUrl+listtype[l].img}
                        listtypeLi +="<li class='clearfix' typeid='"+listtype[l].typeid+"'><img src='"+img+"'><div>"+listtype[l].typename+"</div></li>"
                    }

                    li += "<li><h3>"+list[i].typename+"</h3><ul class='typeList2 clearfix'>"+listtypeLi+"</ul></li>"
                }
                $(".menu .typeList").append(li);

                $(" .typeList2 li").on("click",function(){
                    var typeid = $(this).attr("typeid");
                    location.href = jumpUrl.clSubProList+typeid+"&typename="+$(this).children("div").html()
                });
            }else {tip(data.msg)}
        }
    });


    //设置侧边栏
    var bodyMask = $(".bodyMask"),slideLogo = $(".slideLogo");
    var swiper = new Swiper('.swiper-container', {
        resistanceRatio : 0,//让slide在边缘不能被拖动
        initialSlide :1,
        slidesPerView:"auto",
        onSlideChangeStart:function(swiper){
            if(swiper.activeIndex == 0){    //展示分类页面
                $(".goTop").animate({"opacity":0},500);
                $("footer,header").slideUp(500); //收起头部和底部
                bodyMask.animate({opacity:1},500).removeClass("hide");

            }else {         //展示内容页面
                $(".goTop").animate({"opacity":1},500);
                $("footer,header").slideDown(500); //展示头部和底部
                bodyMask.animate({opacity:0},500);
                setTimeout(function(){
                    bodyMask.addClass("hide");
                },500);

            }
        }
    });


    $(".slideLogo,.bodyMask,.banner").click(function(e) {
        e.stopPropagation();
        if(swiper.activeIndex == 1){        //展示分类页面
            $(".goTop").animate({"opacity":0},500);
            $("footer,header").slideUp();       //收起头部和底部
            bodyMask.animate({opacity:1},500).removeClass("hide");
            swiper.slideTo(0, 500, false);//切换到第一个slide，速度为1秒
        }else {     //展示内容页面
            $(".goTop").animate({"opacity":1},500);
            $("footer,header").slideDown(); //展示头部和底部
            bodyMask.animate({opacity:0},500);
            setTimeout(function(){
                bodyMask.addClass("hide");
            },500);
            swiper.slideTo(1, 500, false);//切换到第一个slide，速度为1秒
        }
    });


    //获取顶部轮播
    getTopLubBo();

    //获取商品列表
    getProList();






    //轮播点击事件
    $(".lubBo").on("click","li",function(){
        var _this = $(this),targetType = _this.attr("targetType"),pid= _this.attr("pid"),
            firstColumn = _this.attr("firstColumn"),secondColumn = _this.attr("secondColumn"),url;

        //targetType	跳转类型 0馆1商品分类2商品详情3其他链接
        //firstColumn	当targetType为0时：1主题馆 2品牌馆
        //              当targetType为1时：此值代表商品的一级分类值
        //              当targetType为2时：此值代表商品的id （定制生活轮播时此值是定制生活商品id）
        //              当targetType为3时：此值为链接地址
        if(targetType == 2){    //商品详情
            url = jumpUrl.clProDetail+firstColumn
        }else if(targetType == 3){ //其他链接
            url = firstColumn
        }
        location.href = url;
    });

    //商品列表点击跳转商品详情事件
    $(".proList").on("click","li",function(){
        var pid = $(this).attr("pid");
        location.href = jumpUrl.clProDetail+pid
    });
});

var firstResult=0,pageSize=10,DATE="";

//获取顶部轮播
function getTopLubBo(){
    //type	广告投放对象(1用户端2社长专员端)
    //position	广告投放位置(1轮播图2启动画面3定制生活)
    $.ajax({
        url:adsenseUrl,
        data:getAuth(UID)+"info={type:1,position:3}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="",length;
                list.length >3? length=3 : length=list.length;  //只取前三个轮播图
                for(var i=0;i<length;i++){
                    var img = publicUrl+"public/images/base/defaultLogo.png";
                    if(list[i].imgurl){
                        img = imgIndexUrl+list[i].imgurl
                    }
                    li += "<li class='swiper-slide' targetType='"+list[i].targetType+"'  firstColumn='"+list[i].firstColumn+"'  " +
                        "secondColumn='"+list[i].secondColumn+"' style='background-image: url("+img+")'></li>"
                }
                $(".lubBo").append(li);
                //轮播图
                if(length>1){
                    var swiper2 = new Swiper('.swiper-container2', {
                        pagination: '.swiper-pagination',
                        loop:true,
                        autoplay: 3000,
                        lazyLoading : true,
                        autoplayDisableOnInteraction: false
                    });
                }
            }else {tip(data.msg)}
        }
    });
}


//获取商品列表
function getProList(){
    $.ajax({
        url:clListUrl,
        data:getAuth()+"info={uid:'"+UID+"',date:'"+DATE+"',firstResult:"+firstResult+",pageSize:"+pageSize+",recommend:1}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="";
                DATE = data.resultdata.date;
                if(list.length < pageSize){         //商品小于分页数量
                    appendNoDataMsg($(".proList"))
                }else {
                    firstResult++
                }

                for(var i=0;i<list.length;i++){
                    var img = publicUrl+"public/images/base/defaultShopAvatar.png";
                    if(list[i].list_img){
                        img = imgIndexUrl+list[i].list_img
                    }
                    var hGroup = "";
                    if(list[i].list_title && list[i].list_description){
                        hGroup = "<div class='hGroup t_center'><h3 class='oneClamp'>"+list[i].list_title+"</h3>" +
                            "<p class='oneClamp'>"+list[i].list_description+"</p></div>"
                    }
                    var customType = "全国定制";
                    if(list[i].custom_type == 1){    //定制类型0全国定制1地方定制
                        customType = list[i].superscript
                    }

                    //促销标签的展示
                    var promotionInfo = list[i].promotionInfo;
                    var promotionstr = returnpromotiontagstr(ifcustomlist = true ,promotionInfo = promotionInfo);

                    li += "<li pid='"+list[i].pid+"' style='background-image: url("+img+")'>"+hGroup+promotionstr+"<div class='customType'>"+customType+"</div></li>"
                }
                $(".proList ul").append(li)
            }
            else{tip(data.msg)}
        }
    })
}


