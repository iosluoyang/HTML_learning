/**
 * Created by hasee on 2016/9/6.
 */
var t1=null;//全局
$(function () {
    //商品列表点击收藏和取消收藏效果
    $(".productsListArr").on("click",".shouCang",function (e) {
        e.stopPropagation();    //阻止事件冒泡 阻止点击跳转商品详情
        var _this = $(this);    //获取当前发生事件的对象
        var pid = _this.parent().attr("pid");
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
        //所需参数  pid	商品ID  uid 用户id   type 1收藏 2 取消收藏
        //  haveCalss 判断是否有需要的ClassName
        //  html    没有收藏或关注的html
        //  actHtml 已经关注的html
        //  idKey   接口需要的参数Key
        //  idVal   参数key的值
        //  idVal   参数key的值
        //  uid     用户id
        sessionStorage.setItem("completeUrl",location.href);    //保存当前地址 登录完成后跳回
        isLogin(UID,function(){shouCangAction(_this,"yiShouCang","收藏","已收藏","pid",pid,UID)});
    });
});

//获取商品列表
//品牌馆 主题馆 社长优选等发现一级二级商品列表通用
function productsListLoad(goodsListArr){
    var productsListLi = "";
    for(var i = 0;i<goodsListArr.length;i++){
        //商品信息
        var productdict = goodsListArr[i];
        //促销的相关信息
        var promotionInfo = productdict.promotionInfo;

        //促销商品的标题展示(无促销时展示原标题,有促销时展示促销标题)
        var mytitle = promotionInfo && JSON.stringify(promotionInfo) != '{}' ? promotionInfo.title : productdict.title;


        //判断时候被收藏   0 没有收藏 1 已经收藏
        var shouCangNode = "";
        (productdict.issc== "1")?
            shouCangNode = "<p class='f_right shouCang yiShouCang'>已收藏</p>"    //已经收藏
            :shouCangNode = "<p class='f_right shouCang'>收藏</p>";               //没有收藏
        //品牌馆 主题馆图片 社长优选 为goodsListArr[i].img
        //发现一级二级商品列表图片 为oodsListArr[i].asmian
        var img = productdict.img ? imgIndexUrl + productdict.img :  productdict.asmian ? imgIndexUrl + productdict.asmian : jumpUrl.defaultShopAvatar;

        //判断是否已经售罄 quantityFlag 0 已售罄  非0 未全部售罄
        var quantityFlag = productdict.quantityFlag == "0" ? "quantityFlag" : "";

        //关于价格的展示逻辑 原产有促销字典时红字展示促销价 灰字展示售价  无促销字典时红字展示售价,灰字展示市场价  定制红字展示平台售价,灰字展示市场价
        var redprice = "";
        var greyprice = "";


        //区分不同的商品类型进行不同的设置
        var clFlag = "";//是否是定制商品 默认为否

        //定制商品 则促销标签展示在商品图片的右上角  注意增加的元素结构也不相同
        if (productdict.type == 5){

            redprice = productdict.newprice;
            greyprice = productdict.marketprice;

            clFlag = "clFlag";
            //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
            var promotionstr = returnpromotiontagstr(ifcustomlist=true,promotionInfo);
            //定制商品 促销标签增加在商品图片右上角
            productsListLi += "<li class='clearfix product' pid='"+productdict.pid+"' type='"+productdict.type+"'>" +
                "<div class='img f_left "+clFlag+" "+quantityFlag+"' style='background-image: url("+img+")'>"+promotionstr+"</div>" +//图片(包含定制促销标签)
                "<div class='title f_left twoClamp'><h3>"+mytitle+"</div></h3>" +//商品标题
                "<p class='price f_left red'><span>&yen;</span><span class='bold'>"+redprice+"</span><span class='grey9'>&yen;"+greyprice+"</span></p>"+//价格
                shouCangNode+ //收藏按钮
                "</li>";

        }
        //其他商品(原产优品等其他商品)
        else{

            if (promotionInfo && JSON.stringify(promotionInfo) != '{}'){
                //有促销时 红字展示促销价 灰字展示售价
                redprice = promotionInfo.price;
                greyprice = productdict.newprice;
            }
            else{
                //无促销时 红字展示售价,灰字展示市场价
                redprice = productdict.newprice;
                greyprice = productdict.marketprice
            }

            //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
            var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);
            //原产优品  促销标签增加在价格旁边
            productsListLi += "<li class='clearfix product' pid='"+productdict.pid+"' type='"+productdict.type+"'>" +
                "<div class='img f_left "+clFlag+" "+quantityFlag+"' style='background-image: url("+img+")'></div>" +//图片
                "<div class='title f_left twoClamp'><h3>"+mytitle+"</div></h3>" +//商品标题
                "<p class='price f_left red'><span>&yen;</span><span class='bold'>"+redprice+"</span><span class='grey9'>&yen;"+greyprice+"</span></p>"+//价格
                promotionstr+//促销标签(有则传递过来元素str,没有则为空字符串)
                shouCangNode+ //收藏按钮
                "</li>";
        }
    }
    $(".productsListArr").append(productsListLi);

    //计算标题的宽度
    var titlewidth =$('.product').width() - $('.img').width() - 10;
    $('.product .title').width(titlewidth);
    $('.product .price').width(titlewidth);

    //设置标签的位置(定制列表标签class为cllisttag 其他标签class为pmtag) 这里只有一种展现样式,即pmtag展现样式,所以只需要设置这一种即可
    $('.pmtag').css({
        "float":"left",
        "margin-top":"1rem",
    });
}


