/**
 * Created by hasee on 2016/10/8.
 */

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
    setTimeout(function () {scrollFun(pullDownAction,upAction)}, 200);
}, false);

////下拉刷新
//function downAction(){
//    firstResult= 0;pageSize=10;  //重置分页
//    location.reload()
//}

//上拉加载
function upAction(){
    $.ajax({
        url:goodsScListUrl,
        data:getAuth()+"info={pageSize:'10',firstResult:'"+firstResult+"',uid:'"+UID+"'}",
        success:function(data){
            var listArr = data.resultdata.list;
            setTimeout(function (){
                loadList(listArr);
                //重置上拉状态
                myScroll.refresh();
                if(listArr.length < 10 ) {
                    //当前商品条数小于10 显示提示内容
                    $(".pullUpLabel").html("没有更多内容了喔~");
                    //根据分页开关控制 分页只++一次 不会累加
                    if (firstResultOnce) {
                        firstResult++;
                        firstResultOnce = false;
                    }
                }else{firstResult++;}
            },500);
        },
        error:function(msg){console.log(msg.statusText);myScroll.refresh()}
    });
}

$(function(){
    //sessionStorage.setItem("completeUrl",jumpUrl.find);       //登录后跳转到首页
    isLogin(UID,function(){
        $.ajax({
            url:goodsScListUrl,
            data:getAuth()+"info={pageSize:'"+pageSize+"',firstResult:'0',uid:'"+UID+"'}",
            success:function(data){
                var listArr = data.resultdata.list;
                if(listArr.length==0){  //没有关注品牌
                    $(".noData").append("<img src='../../public/images/personal/noShouCang.png' alt=''>").show();
                    $(".pullUpLabel").html("")
                }else {
                    loadList(listArr);
                    firstResult++
                }
            }
        });
    });


    //跳转品牌馆
    $(".list").on("click","li",function(){
        var pid = $(this).attr("pid");    //获取馆id
        location.href=jumpUrl.productsDetail+pid
    })

});

function loadList(listArr){


    var li="";
    for(var i =0;i<listArr.length;i++){
        //商品信息
        var productdict = listArr[i];
        //促销的相关信息
        var promotionInfo = productdict.promotionInfo;

        //促销商品的标题展示(无促销时展示原标题,有促销时展示促销标题)
        var mytitle = promotionInfo && JSON.stringify(promotionInfo) != '{}' ? promotionInfo.title : productdict.title;

        //设置头像
        var img= productdict.img ? imgIndexUrl+listArr[i].img :img = "../../public/images/base/defaultShopAvatar.png";
        //判断是否已售罄  quantityFlag 0已售罄 非0未售罄
        var quantityFlag = productdict.quantityFlag == "0" ?"quantityFlag":"";
        //是否失效 1失效 因为失效的优先级比售罄优先级高,所以当商品为失效时则已售罄图标不展示 即class为""
        var shiXiao = productdict.issx==1 ? "shiXiao" : ""; //商品是否失效
        if (productdict.issx==1){quantityFlag = "";}

        //根据promotion字典对象返回对应的标签字符串(有促销 分订制列表和其他 不同促销类型不同展示 无促销不展示)
        var promotionstr = returnpromotiontagstr(ifcustomlist=false,promotionInfo);
        //关于价格的展示逻辑 有促销字典时红字展示促销价 灰字展示售价  无促销字典时红字展示售价,灰字展示市场价
        var redprice = "";
        var greyprice = "";
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

        li+="<li class='clearfix' pid ="+productdict.pid+" >" +
            "<div class='pic f_left "+shiXiao+" "+quantityFlag+"' style='background-image: url("+img+")'></div>" + //商品图片
            "<div class='twoClamp title'><h3 class='f16'>"+promotionstr+mytitle+"</h3></div>" +
            "<div class='price red f15'>&yen;<span class='bold'>"+redprice+"</span><span class='grey9 f13'>&yen;"+greyprice+"</span></div></li>"
    }
    $(".list").append(li);

}

