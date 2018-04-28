var infoObj= {
    type: typeObj.native,//此处搜索的是原产优品的商品
    name: GetQueryString("name"),//搜索的关键字
    firstType:GetQueryString("firstType"),//一级分类商品
    secondType:GetQueryString("secondType"),//二级分类商品
    vid: GetQueryString("vid") || "",
    uid: GetQueryString("uid") || "",
    lat: GetQueryString("lat") || "",
    lng: GetQueryString("lng") || "",
    pageSize: 10,
    firstResult: 0
};

var mescroll;//上拉刷新下拉加载的控件

$(document).ready(function () {


    //暂时只写原产优品这一种情况的搜索
    if(infoObj.type == typeObj.native){


        //初始化上拉刷新下拉加载控件
        //加载完配置区域的数据之后开始设置上拉刷新和下拉加载
        mescroll = new MeScroll("nativeProductScrollDiv", { //第一个参数"mescrolldiv"对应布局结构中父容器div的id  如果body是滚动区域的话,则对应的应该为body
            //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
            //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
            down: {
                use: true, //是否初始化下拉刷新; 默认true
                isLock: true, //是否锁定下拉,默认false;
                auto:true,//是否在初始化完毕之后自动执行下拉刷新的回调 callback
                autoShowLoading:false,//如果设置auto=true ( 在初始化完毕之后自动执行下拉刷新的回调 ),那么是否显示下拉刷新的进度
                callback: searchproducts //下拉刷新的回调
            },
            up: {

                page: {
                    num: infoObj.firstResult, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: infoObj.pageSize, //每页数据条数
                    time: "" //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                },

                callback: searchproducts, //上拉加载的回调
                noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                scrollbar:{use : false},//设置不开启滚动条样式
                isBounce: false, //如果您的项目是在iOS的微信,QQ,Safari等浏览器访问的,建议配置此项
                /*
               toTop:
               回到顶部按钮的配置:
               src : 图片路径,必须配置src才会显示回到顶部按钮,不配置不显示
               offset : 列表滚动1000px显示回到顶部按钮
               warpClass : 按钮样式
               showClass : 显示样式
               hideClass : 隐藏样式
               duration : 回到顶部的动画时长
            */
                toTop:{
                    src : '../public/images/base/goTop.png' ,//注意是以html为目标的相对路径
                    offset : 1000 ,
                    warpClass : "mescroll-totop" ,
                    showClass : "mescroll-fade-in" ,
                    hideClass : "mescroll-fade-out" ,
                    duration : 300
                },
                htmlNodata:'<p class="upwarp-nodata">   -- 人家是有底线的 --   </p>',

            }
        });

        //收藏事件
        $(".nativeProducts").on("click",".shouCang",function (e) {

            e.stopPropagation();    //阻止事件冒泡 阻止点击跳转商品详情

            //首先判断有没有登录，没有登录去登录，登录之后再进行收藏操作
            sessionStorage.setItem("completeUrl",location.href); //该链接为当前链接
            isLogin(UID,function () {

                //登陆完成之后设置参数的uid,然后回来该页面进行收藏操作
                infoObj.uid = UID;
                var _this = $(this),pid = _this.parent().attr("pid");

                //所需参数  pid	商品ID  uid 用户id   type 1收藏 2 取消收藏
                //  haveCalss 判断是否有需要的ClassName
                //  html    没有收藏或关注的html
                //  actHtml 已经关注的html
                //  idKey   接口需要的参数Key
                //  idVal   参数key的值
                //  idVal   参数key的值
                //  uid     用户id

                shouCangAction(_this,"yiShouCang","收藏","已收藏","pid",pid,infoObj.uid);


            });

        });

        //详情跳转
        $(".nativeProducts").on("click","li",function(){
            var pid = $(this).attr("pid");
            location.href = jumpUrl.productsDetail + pid;
        });



    }


})

//搜索商品的接口实现
function searchproducts() {
    $.ajax({
        url:nativetypegoodsSearch,
        data:getAuth()+"info="+JSON.stringify(infoObj),
        success:function(data){
            if(data.errCode ==0){

                listArr=data.resultdata.goodsList;
                /*
                  隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用
                  dataSize : 当前页获取的数据量(注意是当前页)
                  hasNext : 是否有下一页数据true/false
                */
                mescroll.endSuccess(listArr.length,listArr.length == infoObj.pageSize);

                //根据获取数据布局,如果有数据则布局，没有数据则展示无数据页面,注意只是在第一页的时候
                if (infoObj.firstResult == 0 && listArr.length == 0){
                    $("body").append("<div  class='noData' style='display: block;margin-top: 4rem'><img src='"+jumpUrl.noData+"'></div>");
                }
                //有数据或者非第0页，则直接展示布局即可
                else{

                    getNativeProductsList($(".nativeProducts ul"),listArr);

                    //页码增加1
                    infoObj.firstResult++;

                }
            }
            else {
                mainTip(data.msg);
                mescroll.endErr();
            }
        },
        error:function (error) {
            mainTip(error.msg);
            mescroll.endErr();
        }
    })


}

//原产优品商品列表布局
function getNativeProductsList(listDom,goodsListArr){
    var productsListLi = "";
    for(var i = 0;i<goodsListArr.length;i++){
        //判断时候被收藏   0 没有收藏 1 已经收藏
        var shouCangNode = "";
        (goodsListArr[i].issc== "1")?
            shouCangNode = "<p class='f_right shouCang yiShouCang'>已收藏</p>"    //已经收藏
            :shouCangNode = "<p class='f_right shouCang'>收藏</p>";               //没有收藏
        //判断是否已售罄  quantityFlag 0已售罄 非0未售罄
        var quantityFlag = goodsListArr[i].quantityFlag == "0" ?"quantityFlag":"";

        //获取促销标签
        var promotionInfo = goodsListArr[i].promotionInfo;
        var promotionstr = returnpromotiontagstr(ifcustomlist = false,promotionInfo);

        var img= goodsListArr[i].img || goodsListArr[i].asmian;
        productsListLi += "<li class='clearfix' pid='"+goodsListArr[i].pid+"'>" +
            "<div class='img f_left "+quantityFlag+" ' style='background-image: url("+imgIndexUrl+img+")'></div>" +
            "<div class='title twoClamp'><h3>"+promotionstr+goodsListArr[i].title+"</div></h3>" +
            "<p class='price red'><span>&yen;</span>" +
            "<span class='bold'>"+goodsListArr[i].newprice+"</span>" +
            "<span class='grey9'>&yen;"+goodsListArr[i].marketprice+"</span></p>"+shouCangNode+"</li>"
    }
    listDom.append(productsListLi)
}




/*点击返回按钮*/
function clickback() {
    //首先尝试给APP进行交互，让APP返回
    try{
        backmyvc();//让APP返回
    }
        //如果APP不响应则说明是wab站，则自己back
    catch(err){
        history.back();
    }
}
/*点击订单按钮进行的操作*/
function clickorder() {

    //首先判断有没有登录，没有登录去登录，登录之后再进行跳转操作
    sessionStorage.setItem("completeUrl",jumpUrl.orderList); //该链接为跳转到订单页面的链接
    isLogin(UID,function () {
        try{
            //尝试打开APP端的响应:(建立连接之后均会走到这个方法,无论有没有注册这个方法名,在此处不考虑前端已经建立连接但未注册方法的情况)
            tonativeorderlist();
        }
        catch(err){
            //没有建立连接时走的方法，在此处默认为wab站或者浏览器等没有建立连接的地方打开的，故跳转到wab站对应的地方
            location.href = jumpUrl.orderList;//跳转到我的订单界面
        }
    });
}