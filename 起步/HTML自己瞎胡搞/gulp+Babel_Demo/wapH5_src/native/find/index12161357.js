/**
 * Created by hasee on 2016/9/9.
 */

$(function () {
    //--------------------------------立即打开----------------------------------------
    openApp($("header"),$("nav"),$("#wrapper"));

    //-----------------------------------进入首页-----------------------------------------------

    //请求导航菜单数据
    $.ajax({
        url:nativeNavUrl,
        data:getAuth()+"info={}",
        success:function(data){
            if(data.errCode == 0){
                var nativeNavData = data.resultdata.typeList;
                //获取一级菜单数据
                var swiper = typeList(nativeNavData);
                //获取首页页面数据
                indexLoad(swiper,nativeNavData);

                //hash改变 重新加载数据
                if(isQQInIos){
                    hashHasChange(window,swiper,nativeNavData)
                }else {
                    window.onhashchange = function() {
                        indexLoad(swiper,nativeNavData);
                    }
                }
            }else {
                console.log(data.msg)
            }
        }
    });


    //获取地区数据及列表
    getAreaData();


    //-----------------------------------获取导航和导航的点击事件-----------------------------------------------

    //导航一级列表列表点击效果
    $("nav .typeList").on("click","li",function(){
        if(!$(this).hasClass("active")){
            clearStatus();           //清除排序和地区选择状态
            location.hash = "typeid="+$(this).attr("typeid");
            myScroll.scrollTo(0,0);      //回到顶部
        }
    });


    //二级列表点击事件
    $(".typeList2").on("click","li",function(){
        if(!$(this).hasClass("active")){
            clearStatus();           //清除排序和地区选择状态
            location.hash = "typeid="+$(this).attr("typeid")+"&typeids="+$(this).attr("typeids");
            myScroll.scrollTo(0,0);      //回到顶部
        }
    });


    //导航发现列表点击效果
    $(".find").click(function(){
        if(!$(this).hasClass("active")) {
            findReset();    //重置页面数据
            location.hash = "";
            myScroll.scrollTo(0,0);      //回到顶部
        }
    });


    //------------------------------页面跳转部分逻辑--------------------------------------------


    //首页跳转到主题馆
    $(".guan").on("click",".zhuTi",function () {

        //132新需求，如果该主题馆配置的有链接，则跳转至相应的链接页面
        var Url = $(this).attr('Url');
        //活动链接存在的情况下跳转活动链接
        if (Url){
            //如果是艺术馆的链接，则根据不同环境选择不同的艺术馆链接地址
            if (Url.indexOf("artisticHall/index.html") == -1){
                //非艺术馆，直接跳转
                location.href= Url;
            }
            else{
                //艺术馆链接，根据不同环境进行判断

                var wabartisticurl = jumpUrl.ArtisticHall;//wab站艺术馆链接
                var APPartisticurl = APPpublicUrl + "newH5/inUserApp/artisticHall/index.html";//手机端艺术馆链接
                var currentplatform = getcurrentplatform();

                //如果是微信QQ微博等应用外，则打开为wab站链接,如果是应用内则打开为APP链接,注意此处不能根据iosbrowser和androidbrowser来区分是否是手机APP，需要排除QQ微博微信和PC端之后剩余的才是手机APP
                if (currentplatform.wx || currentplatform.QQ||currentplatform.sina || currentplatform.PC){
                    location.href = wabartisticurl;
                }
                //手机APP
                else{
                    location.href = APPartisticurl;
                }


            }

        }
        //活动链接不存在的情况下跳转主题馆
        else{
            var id = $(this).attr("guanId");    //获取馆id
            location.href=jumpUrl.theme+id
        }


    });

    //首页跳转到品牌馆
    $(".guan").on("click",".pinPai .pinPaiImg",function () {
        var id = $(this).parent().attr("guanId");    //获取馆id
        location.href=jumpUrl.brand+id
    });

    //发现首页品牌馆商品跳转native详情
    $(".guan").on("click ",".products li",function(){
        var pid = $(this).attr("pid");  //获取商品id
        location.href=jumpUrl.productsDetail+pid
    });

    //爆款推荐商品跳转native详情
    $(".baoKuan").on("click","li",function(){
        var pid = $(this).attr("pid");  //获取商品id
        location.href=jumpUrl.productsDetail+pid
    });


    //发现一级二级商品列表通用  点击跳转native详情
    $(".productsListArr").on("click","li",function(){
        var pid = $(this).attr("pid");  //获取商品id
        location.href=jumpUrl.productsDetail+pid
    });



    //-------------------------排序和选择地区效果------------------------------

    //点击排序显示效果
    $(".select .sort").click(function(){
        if (t1 == null){
            t1 = new Date().getTime();
        }else{
            var t2 = new Date().getTime();
            if(t2 - t1 < 500){
                t1 = t2;
                return;
            }else{
                t1 = t2;
            }
        }
        $(this).toggleClass("active"); //下拉箭头改变
        //点击排序显示下拉菜单
        $(this).children("ul").slideToggle();

    });

    //点击下拉菜单获取内容显示
    $(".select .sort ul li").click(function(){
        var _this = $(this);
        _this.parent().prev().html(_this.html()).attr("zhpx",_this.attr("zhpx")).css("color","#ff3b30");   //更改排序内容和标致
        $(".productsListArr").empty();   //清空当前商品列表
        //选择排序
        selSortAndArea(indexProductListLoad)
    });

    //点击地区显示效果
    $(".select .area").click(function() {
        //通过时间差解决iscroll点击事件在三星和vivo手机上会触发两次
        if (t1 == null){
            t1 = new Date().getTime();
        }else{
            var t2 = new Date().getTime();
            if(t2 - t1 < 500){
                t1 = t2;
                return;
            }else{
                t1 = t2;
            }
        }
        $(".select .sort").removeClass("active").children("ul").slideUp();
        $(this).toggleClass("active"); //下拉箭头改变
        $("#selArea").fadeIn(300);  //显示选择地区弹层
    });

    //点击地区弹层隐藏显示
    $("#selArea").click(function(){
        //通过时间差解决iscroll点击事件在三星和vivo手机上会触发两次
        if (t1 == null){
            t1 = new Date().getTime();
        }else{
            var t2 = new Date().getTime();
            if(t2 - t1 < 500){
                t1 = t2;
                return;
            }else{
                t1 = t2;
            }
        }
        $(this).fadeOut(300);
        $(".innerRight ul").empty();      //清空市级数据
        $(".area").removeClass("active");       //清除选中状态
    });

    //-------------------------------品牌馆关注效果--------------------------------------
    //点击关注和取消关注效果
    $(".guan").on("click",".guanZhu",function (e) {
        //e.stopPropagation();
        //通过时间差解决iscroll点击事件在三星和vivo手机上会触发两次
        if (t1 == null){
            t1 = new Date().getTime();
        }else{
            var t2 = new Date().getTime();
            if(t2 - t1 < 800){
                t1 = t2;
                return;
            }else{
                t1 = t2;
            }
        }
        var _this = $(this),   //获取当前发生事件的对象
            guanId = _this.parent().attr("guanId"),
            numDom = _this.children("span");
        //  haveCalss 判断是否有需要的ClassName
        //  html    没有收藏或关注的html
        //  actHtml 已经关注的html
        //  idKey   接口需要的参数Key
        //  idVal   参数key的值
        //  uid     用户id
        //  numDom  需要更换关注人数的dom
        //  type    需要在关注dom上显示关注人数 1 不需要 0
        //判断是否关注
        sessionStorage.setItem("completeUrl",location.href);    //保存当前地址 登录完成后跳回
        isLogin(UID,function(){guanZhuAction(_this,"yiGuanZhu","","",guanId,UID,numDom,1)})
    });

});





//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
var firstResult= 0,pageSize=10;          //设置默认页面分页
var pageStatus = sessionStorage.getItem(getOnlyPath());
if(pageStatus){
    if(JSON.parse(pageStatus).firstResult>0){
        firstResult=JSON.parse(pageStatus).firstResult-1;
        pageSize=  JSON.parse(pageStatus).firstResult*10;
    }
}

//设置标志变量 为没用内容后分页只增加一次做开关
var firstResultOnce = true;

//监听dom加载
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        scrollFun(findDownAction,findUpAction)}, 200);
}, false);


//----------------------------------获取页面数据方法-----------------------------------------
//进入页面逻辑
function indexLoad(swiper,nativeNavData){
    var typeid = getUrlHash("typeid"),  //一级列表id
        typeids = getUrlHash("typeids") ||0;    //二级列表id

    if(typeid){
        $(".content").fadeOut(300);    //隐藏发现页面
        $(".content2").fadeIn(300);    //显示一二级页面
        $("footer").fadeOut(300);         //隐藏底部
        //$('#scroller').css({"padding":"8.8rem 0 0"});
        $(".goTop").css("bottom","10px");           //调整样式
        //clearStatus();           //清除排序和地区选择状态

        $(".find").removeClass("active");
        if(typeid ==0){     //推荐    不存在二级菜单
            $(".typeList li").eq(0).addClass("active").siblings().removeClass("active");
            $(".typeList2").empty();        //清空二级菜单
        }else{                  //存在二级菜单
            typeList2(nativeNavData,typeid);  //展示二级菜单
            for(var i=0;i<$(".typeList li").length;i++){
                if($(".typeList li").eq(i).attr("typeid") == typeid ){
                    $(".typeList li").eq(i).addClass("active").siblings().removeClass("active");        //一级菜单选中效果
                    break
                }
            }
            if(typeids){        //选中二级菜单
                for(var j=0;j<$(".typeList2 li").length;j++){
                    if($(".typeList2 li").eq(j).attr("typeids") ==typeids ){
                        $(".typeList2 li").eq(j).addClass("active").siblings().removeClass("active");   //二级菜单选中效果
                        break
                    }
                }
            }
        }


        $(".productsListArr").empty();
        //获取商品列表
        indexProductListLoad(1,0,0);
        swiper.slideTo($(".typeList>.active").index(), 500, false);             //滑动到对应列表
    }
    else {
        //获取发现页面数据
        $(".find").addClass("active");
        $("nav ul li").removeClass("active");
        swiper.slideTo(0, 500, false);             //滑动到对应列表
        //清空content
        $(".content2").fadeOut(300);
        $(".content").fadeIn(300);
        $("footer").fadeIn(300);         //显示底部
        $(".goTop").css("bottom", "");           //调整样式
        //findReset();    //重置页面数据

        findLoad(0);
    }
}

//获取发现页面首页的请求
function findLoad(gSize){
    $.ajax({
        url:findUrl,
        data:getAuth()+"info={pageSize:"+pageSize+",firstResult:'0',uid:'"+UID+"',gSize:'"+gSize+"'}",
        async:false,
        success:function(data){
            var pavilionListArr = data.resultdata.pavilionList;
            var goodsListArr = data.resultdata.goodsList || "";      //当goodsListArr为空是 显示空
            //获取馆的数据
            guanLoad(pavilionListArr);
            //馆的数量和爆款推荐数量共十个
            if(pavilionListArr.length < 10){
                //馆的数量小于10个 显示爆款推荐
                $(".baoKuanTuiJian").fadeIn();
                $(".baoKuan").fadeIn();
                baoKuanLoad(goodsListArr)
            }
            if((pavilionListArr.length+goodsListArr.length)<10){
                //当前馆的数量和商品数量小于10 显示提示内容
                $(".pullUpLabel").html("没有更多内容了喔~");
            }
            firstResult++
        }
    });
}

//获取发现页面馆的数据
function guanLoad(pavilionListArr){

    var guanLi = "";
    for (var i = 0 ;i<pavilionListArr.length ;i++){
        //type 0 是主题馆  1是品牌馆
        if(pavilionListArr[i].type == 0){
            //主题馆
            guanLi += "<li class='zhuTi' guanId='"+pavilionListArr[i].id+"' Url='"+pavilionListArr[i].url+"'>" +
                "<div class='hGroup'>" +
                "<p class='title bold oneClamp'>"+pavilionListArr[i].title+"</p>" +
                "<p class='detail'>"+pavilionListArr[i].note+"</p></div>" +
                "<div class='zhuTiImg' style='background-image:url("+imgIndexUrl+pavilionListArr[i].img+") '></div></li>"

        }else if(pavilionListArr[i].type == 1){
            //品牌馆
            //判断当前用户是否关注过   0 不关注  1 已关注
            var guanZhuClassName = "";
            (pavilionListArr[i].isgz==0)? guanZhuClassName = "guanZhu" :guanZhuClassName = "guanZhu yiGuanZhu";

            //判断当前品牌馆展示商品数量是否满足三个 小于三个不显示
            var productsLi = "";
            if(pavilionListArr[i].productList != null && pavilionListArr[i].productList.length >= 3 ){
                for(var j=0;j<=2;j++){   //下标从0开始 到2一共是三个商品
                    //获取当前品牌馆详情

                    //商品信息
                    var productdict = pavilionListArr[i].productList[j];
                    //促销的相关信息
                    var promotionInfo = productdict.promotionInfo;


                    //促销商品的标题展示(无促销时展示原标题,有促销时展示促销标题)
                    var mytitle = promotionInfo && JSON.stringify(promotionInfo) != '{}' ? promotionInfo.title : productdict.title;

                    //判断是否已经售罄 quantityFlag 0 已售罄  非0 未全部售罄
                    var quantityFlag = productdict.quantityFlag == "0" ? "quantityFlag" : "";


                    //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
                    //因为这里要求展示的是特殊标签的样式,所以需要重新组装促销字典信息
                    var showpromotiondict = promotionInfo && JSON.stringify(promotionInfo) != '{}' ? {"tag":promotionInfo.tag,"type":"7"}:{};//自己构建促销信息字典,没有促销信息的话则为空字典 设置type为7则可选择带有圆角的促销标签
                    var promotionstr = returnpromotiontagstr(ifcustomlist=false,showpromotiondict);

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


                    productsLi += "<li pid = '"+productdict.pid+"'>" +
                        "<div class='pic "+quantityFlag+" ' style='background-image: url("+imgIndexUrl+productdict.img+");position: relative'>"+promotionstr+"</div>" +  //商品图片(包含图片)
                        "<div class='title twoClamp'>"+mytitle+"</div>" +  //产品标题
                        "<p class='price red'>&yen;<span class='bold'>"+showprice+"</span></p>" + //价格
                        "</li>"
                }
            }

            guanLi +="<li class='pinPai' guanId='"+pavilionListArr[i].id+"'>" +
                "<div class='"+guanZhuClassName+"'><span>"+pavilionListArr[i].gzCount+"</span>人关注</div>" +
                "<div class='pinPaiImg' style='background-image:url("+imgIndexUrl+pavilionListArr[i].img+") '></div>" +
                "<ul class='products clearfix'>"+productsLi+"</ul></li>"
        }
    }
    $(".guan").append(guanLi);
    //品牌馆商品列表图片高度和宽度保持一致
    $(".products .pic").height($(".products .pic").width());
    //设置标签的样式  无论根据公共方法选择的是什么标签背景，这里都添加一个新的背景样式 是带有弧度的背景图片 样式也单独设置
    $('.pmtag').addClass("iscircularpmtag");
    $('.pmtag').css({
        "position":"absolute",
        "left":"0",
        "bottom":"0.5rem",
        "padding":"3px 10px 3px 3px",
    });
}

//获取发现页面爆款推荐的数据
function baoKuanLoad(goodsListArr){
    var baoKuanLi="";

    for(var i = 0 ;i<goodsListArr.length;i++){

        //商品信息
        var productdict = goodsListArr[i];
        //促销的相关信息
        var promotionInfo = productdict.promotionInfo;

        //促销商品的标题展示(无促销时展示原标题,有促销时展示促销标题)
        var mytitle = promotionInfo && JSON.stringify(promotionInfo) != '{}' ? promotionInfo.title : productdict.title;

        //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
        var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);
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

        //判断是否已经售罄 quantityFlag 0 已售罄  非0 未全部售罄
        var quantityFlag = productdict.quantityFlag == "0" ? "quantityFlag" : "";
        var img = productdict.img ? imgIndexUrl + productdict.img :jumpUrl.defaultShopAvatar;

        baoKuanLi += "<li class='clearfix' pid='"+productdict.pid +"'>" +
            "<div class='pic f_left "+quantityFlag+"' style='background-image: url("+img+")'></div>" +//商品图片
            "<h3 class='title bold'>"+mytitle+"</h3>" +//商品标题
            "<p class='guiGe'>"+productdict.color+"</p>" +//商品规格
            "<p class='price red'>&yen;<span class='bold'>"+showprice+"</span></p>" +//商品价格
            promotionstr+//商品促销标签
            "</li>"

    }
    $(".baoKuan").append(baoKuanLi)
}

//请求地区列表数据
function getAreaData(){
    var areaData= localStorage.getItem("areaData");
    if(areaData){
        getAreaList(JSON.parse(areaData));
    }else {             //本地不存在地区列表信息
        $.ajax({
            url:selProvinceUrl,
            data:getAuth()+"info={}",
            success:function(data){
                localStorage.setItem("areaData",JSON.stringify(data.regList));   //缓存地区数据
                getAreaList(data.regList);
            }
        })
    }

}

//获取地区列表
function getAreaList(areaData){
    var proviencLi = "";
    for (var i = 0; i < areaData.length; i++) {
        proviencLi += "<li regid='" + areaData[i].rid + "' value='" + areaData[i].rLocalname + "'>" + areaData[i].rLocalname + "</li>"
    }
    //添加省份列表
    $(".selProvince").html(proviencLi);

    //点击省份
    $(".selProvince").on("click","li",function (e){
        e.stopPropagation();    //阻止事件冒泡
        $(this).addClass("active").siblings($(".selProvince li")).removeClass("active");  //样式改变
        var rid = $(this).attr("regid");  //获取点击省份的rid
        $(".area").attr("regid",rid);

        if(rid == 0){
            //点击全部的时候 直接获取数据
            $(".area").attr("regid","0").attr("rregid","0").html("全部").removeClass("active");   //重置地区
            selSortAndArea(indexProductListLoad);                       //获取数据
            $("#selArea").fadeOut(300);                //隐藏地区遮罩层
        }else {
            //点击其他省份需要获取市级菜单
            for (var i = 0; i < areaData.length; i++) {
                if (areaData[i].rid == rid) {   //通过当前省份的rid获取二级市区的数据
                    var rregListArr = areaData[i].rregList;    //获取列表数据
                    var cityLi = "";
                    for (var k = 0; k < rregListArr.length; k++) {
                        //当前的rid为0时 为全部选项 将value改为省级名称  为了点击市级的"全部"输出省级的名称
                        (rregListArr[k].rid == 0)?
                            cityLi += "<li regid='"+rid+"'  rregid='"+rregListArr[k].rid +"' value='" + areaData[i].rLocalname + "'>" + rregListArr[k].rLocalname + "</li>"
                            :cityLi += "<li regid='"+rid+"'  rregid='"+rregListArr[k].rid +"' value='" + rregListArr[k].rLocalname + "'>" + rregListArr[k].rLocalname + "</li>"
                    }
                    //添加城市
                    $(".selCity").html(cityLi);
                    break
                }
            }
        }
    });

    //点击城市
    $(".selCity").on("click","li",function (e) {
        e.stopPropagation();    //阻止事件冒泡
        $(".area").css("color","#ff3b30");
        $("#selArea").fadeOut(300);
        var val = $(this).attr("value");
        if(val.length >10){
            //选择城市大于10个字 截取后省略号显示
            val = val.substr(0,10)+"..."
        }
        $(".area").html(val).removeClass("active")                    //显示选中数据 清除选中样式
            .attr("regid",$(this).attr("regid")).attr("rregid",$(this).attr("rregid")); //获取当前选择城市的标识

        //获取商品列表数据
        $(".productsListArr").empty();      //清空列表数据
        selSortAndArea(indexProductListLoad)
    })
}

//------------------------------------获取一二级列表-----------------------------------------

//获取一级列表数据
function typeList(nativeNavData){
    var typeListLi = "";
    for(var i=0;i<nativeNavData.length;i++){
        typeListLi +="<li class='swiper-slide' typeid='"+nativeNavData[i].id+"'>"+nativeNavData[i].name+"</li>"
    }

    $("nav ul").append(typeListLi);
    //导航列表滑动效果
    var mySwiper = new Swiper ('.swiper-container', {
        slidesPerView : 'auto'
    });

    return mySwiper
}

//获取二级列表数据
function typeList2(nativeNavData,typeid){
    for(var i=0;i<nativeNavData.length;i++){
        if(nativeNavData[i].id == typeid){
            var type2ListLi = "";
            for(var j=0;j<nativeNavData[i].list.length;j++){
                type2ListLi += "<li typeid='"+typeid+"'  typeids='"+nativeNavData[i].list[j].id+"'>"+
                    nativeNavData[i].list[j].name+"</li>"
            }
            $(".typeList2").html(type2ListLi);
            break
        }
    }
}

//----------------------------------获取一二级列表数据-----------------------------------------

//点击获取一级列表 二级列表商品 选择地区 排序通用
function indexProductListLoad(zhpx,regid,rregid){
    var info={
        pageSize:pageSize,
        firstResult:0,
        uid:UID,            //用户uid
        typeid:getUrlHash("typeid") || 0,       //一级种类id
        typeids:getUrlHash("typeids") || 0,    //二级种类id
        zhpx:zhpx,          //排序规则        1 综合排序 2人气最高 默认1综合排序
        regid:regid,       // 省地区id       省全部 regid和rregid传空字符串
        rregid:rregid      //市地区id      市全部 regid 对应的省级id和rregid传空字符串
    };
    $.ajax({
        url:nativeSearchTypeProductsUrl,
        data:getAuth()+"info="+JSON.stringify(info),
        success:function(data){
            //隐藏提示内容
            $(".noData").hide();
            //获取商品列表数据
            var goodsListArr = data.resultdata.list;
            productsListLoad(goodsListArr);
            if(goodsListArr.length<10){
                //当前商品条数小于10 显示提示内容
                $(".pullUpLabel").html("没有更多内容了喔~");
            }
            //没有数据显示提示页面
            if(goodsListArr.length==0){
                //当前没有商品 显示提示内容
                $(".noData").show()
            }
            firstResult++
        }
    })
}

//一级列表 二级列表商品上拉加载时加载数据
// function productListLoadMore(UID,typeid,typeids,zhpx,regid,rregid){
function productListLoadMore(zhpx,regid,rregid){
    var info={
        pageSize:10,
        firstResult:firstResult,
        uid:UID,            //用户uid
        typeid:getUrlHash("typeid") || 0,       //一级种类id
        typeids:getUrlHash("typeids") || 0,    //二级种类id
        zhpx:zhpx,          //排序规则        1 综合排序 2人气最高 默认1综合排序
        regid:regid,       // 省地区id       省全部 regid和rregid传空字符串
        rregid:rregid      //市地区id      市全部 regid 对应的省级id和rregid传空字符串
    };

    $.ajax({
        url:nativeSearchTypeProductsUrl,
        data:getAuth()+"info="+JSON.stringify(info),
        success:function(data){
            //获取商品列表数据
            var goodsListArr = data.resultdata.list;
            productsListLoad(goodsListArr);
            setTimeout(function (){
                //重置上拉状态
                myScroll.refresh();
                if(goodsListArr.length < 10 ) {
                    //当前商品条数小于10 显示提示内容
                    $(".pullUpLabel").html("没有更多内容了喔~");
                }
            },500);
            firstResult++;
        },
        error:function(msg){
            console.log(msg.statusText);myScroll.refresh();
        }
    })
}

//选择排序和地区
function selSortAndArea(loadFun){
    var regid=$(".area").attr("regid"),     //获取省id
        rregid=$(".area").attr("rregid"),   //获取市id
        zhpx=$(".sort p").attr("zhpx");     //获取排序
    loadFun(zhpx,regid,rregid)
}

//----------------------------------数据重置方法-----------------------------------------
//清空排序和地区选择状态
function clearStatus(){
    pageSize=10;                                //分页大小重置
    firstResult=0;                              //分页重置
    $(".goTop").hide();                         //隐藏向上按钮
    $(".noData").hide();                        //隐藏没有数据提示信息
    $(".pullUpLabel").html("上拉加载更多...");  //重置上拉加载提示
    $(".area").css("color","#000").attr("regid","0").attr("rregid","0").html("地区"); //重置地区样式
    $(".productsListArr").empty();              //清空商品列表
    $(".select .sort").removeClass("active").children("ul").slideUp();        //重置排序样式
    $(".select .sort p").css("color","#000");        //重置排序样式
    $(".sort p").html("综合排序").attr("zhpx","1");     //重置排序状态
    $('#scroller').css({"padding":"0"});
}

//点击后发现重置页面
function findReset(){
    pageSize=10;                                //分页大小重置
    firstResult=0;                              //分页重置
    $(".goTop").hide();     //隐藏向上按钮
    $(".guan").empty();     //清空馆列表
    $(".baoKuanTuiJian").hide();    //隐藏爆款推荐
    $(".baoKuan").empty();     //清空爆款推荐商品列表
    $('#scroller').css({"padding":"0 0 4.4rem"});
    $(".pullUpLabel").html("上拉加载更多...");  //重置上拉加载提示

}

//----------------------------------下拉和上拉加载方法-----------------------------------------
//首页下拉刷新效果
function findDownAction() {
    //判断当前停留页面
    if(!getUrlHash("typeid")){
        //停留在发现页面
        findReset();         //清空发现页面原数据
        //首次进入发现页面请求数据
        findLoad(0);
    }else{
        //停留在一级菜单页面
        clearStatus();             //清除排序和地区选择状态
        //清除二级菜单选择效果
        // $(".typeList2 li").removeClass("active");
        indexProductListLoad(1,0,0)
    }
    //重置
    myScroll.refresh();
}

//首页上拉加载
function findUpAction(){
    //判断当前停留页面
    if(!getUrlHash("typeid")){
        //停留在发现页面
        $.ajax({
            url: findUrl,
            data:getAuth()+"info={pageSize:10,firstResult:'"+firstResult+"',uid:'"+UID+"',gSize:'"+$(".baoKuan li").length+"'}",
            success: function (data) {
                var pavilionListArr = data.resultdata.pavilionList;
                var goodsListArr = data.resultdata.goodsList;
                //馆的数量和爆款推荐数量共十个
                if(pavilionListArr.length ==10){
                    //当 品牌馆和主题馆 等于10个	加载品牌馆和主题馆
                    guanLoad(pavilionListArr);	//获取馆的数据
                    firstResult ++;
                    //myScroll.refresh();
                }else if(pavilionListArr.length < 10 && (goodsListArr.length+pavilionListArr.length) == 10) {
                    //馆的数量小于10并且爆款推荐等于10  加载品牌馆、主题馆、爆款推荐
                    $(".baoKuanTuiJian").fadeIn(500);
                    $(".baoKuan").fadeIn(500);
                    guanLoad(pavilionListArr);		//获取馆的数据
                    baoKuanLoad(goodsListArr);		//获取爆款推荐数据
                    firstResult++;
                }else if ((goodsListArr.length + pavilionListArr.length) < 10) {
                    //当馆的数量+爆款推荐小于10时 显示提示
                    guanLoad(pavilionListArr);	//获取馆的数据
                    $(".baoKuanTuiJian").fadeIn(500);
                    $(".baoKuan").fadeIn(500);
                    baoKuanLoad(goodsListArr);		//获取爆款推荐数据
                    //myScroll.refresh();
                    $(".pullUpLabel").html("没有更多内容了喔~"); //显示提示内容
                    //根据分页开关控制 分页只++一次 不会累加
                    if (firstResultOnce) {
                        firstResult++;
                        firstResultOnce = false;
                    }
                }

                myScroll.refresh();
            },
            error: function(xhr, type){
                console.log('Ajax error!');
                // 即使加载出错，也得重置
                myScroll.refresh();
            }
        });
    }else{
        //停留在一级菜单页面
        selSortAndArea(productListLoadMore);
    }

}




//ios QQ内置浏览器不能通过onhashchange事件监听hash改变
function hashHasChange(window,swiper,nativeNavData){
    var location = window.location,
        oldURL = location.href,
        oldHash = location.hash;
    // 每隔100ms检测一下location.hash是否发生变化
    setInterval(function() {
        var newURL = location.href,
            newHash = location.hash;

        // 如果hash发生了变化,且绑定了处理函数...
        if(newHash != oldHash) {
            indexLoad(swiper,nativeNavData);
            oldURL = newURL;
            oldHash = newHash;
        }
    }, 150);
}