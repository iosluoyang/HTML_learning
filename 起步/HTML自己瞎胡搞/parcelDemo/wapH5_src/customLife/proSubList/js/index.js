/**
 * Created by hasee on 2017/4/2.
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

    var typeid =  GetQueryString("typeid"),typename =  GetQueryString("typename");
    //设置导航栏
    $("header h2").html(decodeURI(typename));

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

                //点击分类
                $(" .typeList2 li").on("click",function(){
                    var liTypeid = $(this).attr("typeid");
                    if(liTypeid == typeid){     //如果选择的分类为当前的分类 关闭分类侧边栏
                        bodyMask.animate({opacity:0},500);
                        setTimeout(function(){
                            bodyMask.addClass("hide");
                        },500);
                        swiper.slideTo(1, 500, false);//切换到第一个slide，速度为1秒
                    }else {
                        location.href = jumpUrl.clSubProList+liTypeid+"&typename="+$(this).children("div").html()

                    }
                });
            }else {tip(data.msg)}
        }
    });

    //设置侧边栏
    var bodyMask = $(".bodyMask"),slideLogo = $(".slideLogo");
    var swiper = new Swiper('.swiper-container', {
        resistanceRatio : 0,//让slide在边缘不能被拖动
        initialSlide :1,
        //autoHeight: true, //高度随内容变化
        slidesPerView:"auto",
        onSlideChangeStart:function(swiper){
            if(swiper.activeIndex == 0){
                $(".goTop").animate({"opacity":0},500);
                $("header").slideUp(); //收起头部和底部
                bodyMask.animate({opacity:1},500).removeClass("hide");
            }else {
                $(".goTop").animate({"opacity":1},500);
                $("header").slideDown(); //展示头部和底部
                bodyMask.animate({opacity:0},500);
                setTimeout(function(){
                    bodyMask.addClass("hide");
                },500);

            }
        }
    });



    $(".slideLogo,.bodyMask").click(function(e) {
        e.stopPropagation();
        if(swiper.activeIndex == 1){    //滑动到分类
            $(".goTop").animate({"opacity":0},500);
            $("header").slideUp();       //收起头部和底部
            bodyMask.animate({opacity:1},500).removeClass("hide");
            swiper.slideTo(0, 500, false);//切换到第一个slide，速度为1秒
        }else {                         //滑动内容
            $(".goTop").animate({"opacity":1},500);
            $("header").slideDown(); //展示头部和底部
            bodyMask.animate({opacity:0},500);
            setTimeout(function(){
                bodyMask.addClass("hide");
            },500);
            swiper.slideTo(1, 500, false);//切换到第一个slide，速度为1秒
        }
    });

    //获取商品列表
    getProList(typeid);


    //分类广告点击跳转推荐分类首页
    $(".banner").click(function(){
        location.href = jumpUrl.clProList
    });

    //商品列表点击跳转商品详情事件
    $(".proList").on("click","li",function(){
        var pid = $(this).attr("pid");
        location.href = jumpUrl.clProDetail+pid
    });
});

var firstResult=0,pageSize=10,DATE="",firstResultOnce = true;

//获取商品列表
function getProList(typeid){
    //typeid	2级产品分类id	int(11)	可空
    //recommend	是否推荐		可空 0否1是
    $.ajax({
        url:clListUrl,
        data:getAuth(UID)+"info={uid:'"+UID+"',date:'"+DATE+"',firstResult:"+firstResult+",pageSize:"+pageSize+",typeid:"+typeid+",recommend:0}",
        success:function(data){
            if(data.errCode == 0){
                var list = data.resultdata.list,li="";
                DATE = data.resultdata.date;
                if(list.length == 0 && firstResult == 0){   //首页加载
                    appendNoDataImg($(".proList"))
                }else {
                    if(list.length < pageSize){         //商品小于分页数量
                        appendNoDataMsg($(".proList"))
                    }else {
                        firstResult++
                    }

                    for(var i=0;i<list.length;i++){
                        var img=jumpUrl.defaultShopAvatar;
                        if(list[i].list_img){
                            img=imgIndexUrl+list[i].list_img
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

                        li += "<li pid='"+list[i].pid+"' style='background-image: url("+img+")'>"+hGroup+"<div class='customType'>"+customType+"</div></li>"
                    }
                    $(".proList ul").append(li)
                }
            }else{tip(data.msg)}
        }
    })
}

