var name = GetQueryString("name") ? GetQueryString("name") : "";//搜索关键字
var id = GetQueryString("id");//促销模块id
//从链接获取uid,如果链接中没有uid则从本地取UID,如果还是空字符串的话那就说明没有用户信息
var uid = GetQueryString("uid") ? GetQueryString("uid") : UID ;



var mescroll;//上拉下拉全局控件


$(function () {
    //加载上拉下拉控件，自动获取数据
    setmyscroll();

    //设置一些点击事件

    //商品详情跳转
    $("body").off().on("click","li",function(){

        var _this = $(this),pid = _this.data('obj').pid,type=_this.data('obj').type;

        var currentplatform = getcurrentplatform();
        //如果是微信QQ微博等应用外，则打开为wab站链接,如果是应用内则打开为APP链接,注意此处不能根据iosbrowser和androidbrowser来区分是否是手机APP，需要排除QQ微博微信和PC端之后剩余的才是手机APP

        //跳转至wab站的相关商品详情
        if (currentplatform.wx || currentplatform.QQ||currentplatform.sina || currentplatform.PC){
            var ownjumpUrl = "";
            //原产优品详情:
            if (type == 4){
                ownjumpUrl = jumpUrl.productsDetail+pid;

            }
            //定制商品详情:
            else if (type == 5){
                ownjumpUrl = jumpUrl.clProDetail + pid;
            }
            location.href = ownjumpUrl;
        }

        //跳转至原生的产品详情链接
        else{
            var resonsedata ;
            //原产优品详情:
            if (type == 4){
                resonsedata = {jumpkind:"1",data:{pid:pid}};
            }
            //定制商品详情:
            else if (type == 5){
                resonsedata = {jumpkind:"2",data:{pid:pid}};
            }
            mutualAction(resonsedata);

        }
    });

    //收藏事件 注意此处的收藏事件点击不可以取消点击事件
    $("body").on("click",".shouCang",function (e) {
        e.stopPropagation();    //阻止事件冒泡 阻止点击跳转商品详情
        var _this = $(this),pid = _this.parent().data('obj').pid;

        //所需参数  pid	商品ID  uid 用户id   type 1收藏 2 取消收藏
        //  haveCalss 判断是否有需要的ClassName
        //  html    没有收藏或关注的html
        //  actHtml 已经关注的html
        //  idKey   接口需要的参数Key
        //  idVal   参数key的值
        //  idVal   参数key的值
        //  uid     用户id

        //判断用户是否已经登录,如果已经登录,则直接传uid即可,如果没有登录,则跳转到登录页先进行登录之后再跳转进入新的该页面

        sessionStorage.setItem("completeUrl",location.href);    //保存当前链接地址 登录完成后跳回
        isLogin(uid,function () {
            uid = UID;
            shouCangAction(_this,"yiShouCang","收藏","已收藏","pid",pid,uid);
        });
    });
})

//设置上拉加载和下拉刷新控件
function setmyscroll() {
    mescroll = new MeScroll("body", { //第一个参数"mescroll"对应上面布局结构div的id  如果body是滚动区域的话,则对应的应该为body
        //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
        //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
        down: {
            use: true, //是否初始化下拉刷新; 默认true
            isLock: true, //是否锁定下拉,默认false;
            auto:true,//是否在初始化完毕之后自动执行下拉刷新的回调 callback
            autoShowLoading:false,//如果设置auto=true ( 在初始化完毕之后自动执行下拉刷新的回调 ),那么是否显示下拉刷新的进度
            //callback: loadsearchresult //下拉刷新的回调,别写成downCallback(),多了括号就自动执行方法了
        },
        up: {
            page: {
                num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                size: 10, //每页数据条数
                time: '' //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
            },

            callback: loadsearchresult, //上拉加载的回调,别写成downCallback(),多了括号就自动执行方法了 此处可简写; 相当于 callback: function (page) { loadsearchresult(page); }
            noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            /*
                empty:
                列表第一页无任何数据时,显示的空布局
                需配置warpId或clearEmptyId才生效
                warpId : 父布局的id; 如果此项有值,将不使用clearEmptyId的值;
                icon : 空布局的图标路径
                tip : 提示文本
                btntext : 按钮文本
                btnClick : 点击按钮的回调
             */
            empty: {
                icon: jumpUrl.noData, //图标,默认null
                tip: "竭尽全力却也没有搜到相关商品~", //提示
                btntext: "返回继续搜索", //按钮,默认""
                btnClick: function(){//点击按钮的回调,默认null
                    history.back();
                }
            },
            clearEmptyId: "dataList",//相当于同时设置了clearId和empty.warpId; 简化写法;默认null

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
            }
        }
    });
}

//开始加载搜索结果
function loadsearchresult(page) {
    var pageSize = page.size;
    var firstResult = page.num - 1;//因为num是从第1页开始,所以这里减一和服务器保持一致的页码数
    var DATE = page.time ? page.time : "" ;

    $.ajax({
        url:getpromotionsearchresult,
        data:getAuth()+"info={uid:'"+uid+"',name:'"+name+"',id:'"+id+"',pageSize:'"+pageSize.toString()+"',firstResult:'"+firstResult.toString()+"',date:'"+DATE+"'}",
        success:function(data){
            if(data.errCode == 0){

                //如果是第0页则保存后台返回的日期字段以便于后面查询分页使用 并且检测如果没有商品则展示缺省页
                if (firstResult == 0){
                    page.time = data.resultdata.date;
                }
                var goodsListArr = data.resultdata.goodsList ? data.resultdata.goodsList:[];
                var dataSize = goodsListArr.length;
                var hasNext = goodsListArr.length == page.size;
                var systime = page.time;
                /*
                    隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用
                    dataSize : 当前页获取的数据量(注意是当前页)
                    hasNext : 是否有下一页数据true/false
                    systime : 加载第一页数据的服务器时间 (可空);
                */
                mescroll.endSuccess(dataSize,hasNext,systime);


                //设置页面布局
                setProductsList($("body ul"),goodsListArr);


            }
            else {
                tip(data.msg);
                mescroll.endErr();
            }
        },
        error:function (err) {

            tip("发生错误,请重试");
            mescroll.endErr();

        }

    });



}



//获取商品列表
function setProductsList(listDom,goodsListArr){
    var productsListLi = "";
    /*
pid	商品id
type	商品类型4原产优品5定制商品
title	商品名称
newprice	售价
marketprice	市场价
color	规格
img	图片地址
quantityFlag	是否售罄0已售罄 ，非0未全部售罄
issc	是否收藏 1已收藏，非1未收藏
promotionInfo	促销信息

            promotionInfo 字典含义
            cid	促销id
            status	促销状态1未开始2促销中
            price	促销价
            pid	商品id
            ptype	商品类型4原产优品5定制商品
            title	促销商品名称
            tag	促销标签
            type	促销类型
            1自定义
            2限时
            3打折
            4特价
            5专享
            6买赠
            playbillImg	促销海报
            playbillDesc	海报文案
            userType	促销用户群
            1全部
            2新用户
            3老用户
            checkInvitationCode	1不限有无邀请码用户  2仅限有邀请码用户
            startTime	促销开始时间
            endTime	促销结束时间(空代表永久)
            nowTime	系统当前时间
*/
    for(var i = 0;i<goodsListArr.length;i++){
        //如果是原产商品则设置为原产的样式,如果是定制商品则设置为定制的样式
        //商品信息
        var productdict = goodsListArr[i];
        //促销的相关信息
        var promotionInfo = productdict.promotionInfo;
        //判断是否被收藏   1 已经收藏 非1未收藏  只有原产有收藏功能
        var shouCangNode = '';


        //关于价格的展示逻辑 原产商品有促销字典时红字展示促销价 灰字展示售价  无促销字典时红字展示售价,灰字展示市场价
        var redprice = "";
        var greyprice = "";
        //判断是否是定制商品,如果是的话则在图片左上角增加定制图标
        var clsignclass = "";
        if (productdict.type == "4"){
            //原产
            shouCangNode = productdict.issc == "1" ? "<p class='f_right shouCang yiShouCang'>已收藏</p>":"<p class='f_right shouCang'>收藏</p>";


            if (promotionInfo && JSON.stringify(promotionInfo) != '{}'){
                //有促销时 红字展示促销价 灰字展示售价
                redprice = promotionInfo.price;
                greyprice = productdict.newprice;
            }
            else{
                //无促销时 红字展示售价,灰字展示市场价
                redprice = productdict.newprice;
                greyprice = productdict.marketprice;
            }
        }
        else if (productdict.type == "5"){
            //定制
            clsignclass = "clsignclass";

            //红字展示售价,灰字展示市场价
            redprice = productdict.newprice;
            greyprice = productdict.marketprice;

        }


        //判断是否已售罄  quantityFlag 0已售罄 非0未售罄
        var quantityFlag = productdict.quantityFlag == "0" ?"quantityFlag":"";
        var img= productdict.img;
        //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
        var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);





        productsListLi += "<li class='clearfix product' data-obj='"+JSON.stringify(productdict)+"'>" +
            "<div class='img f_left "+clsignclass+" "+quantityFlag+" ' style='background-image: url("+imgIndexUrl+img+")'></div>" +//商品图片
            "<div class='title f_left twoClamp'><h3 class='bold' style='font-size: 1.5rem;'>"+productdict.title+"</div></h3>" +//商品标题
            "<p class='price red f_left'><span>&yen;</span><span class='bold'>"+redprice+"</span><span class='grey9'>&yen;"+greyprice+"</span></p>"+//商品价格
            promotionstr+//促销标签(有则传递过来元素str,没有则为空字符串)
            shouCangNode+//收藏按钮
            "</li>";
    }
    listDom.append(productsListLi);
    //计算标题的宽度
    var titlewidth =$('.product').width() - $('.img').width() - 10;
    $('.title').width(titlewidth);
    $('.price').width(titlewidth);

    //设置标签的位置(定制列表标签class为cllisttag 其他标签class为pmtag) 这里只有一种展现样式,即pmtag展现样式,所以只需要设置这一种即可
    $('.pmtag').css({
        "float":"left",
        "margin-top":"1rem",
    });



}




























