/**
 * Created by hasee on 2016/9/12.
 */

//解析传入参数 获取用户uid和馆id
var id = GetQueryString("id");

$(function() {

    //--------------------------------立即打开----------------------------------------
    openApp($("header"),$("#wrapper"));

    if(id !=null && id.toString().length>0){
        $.ajax({
            url: themeUrl,
            data:getAuth()+"info={uid:'"+UID+"',id:'"+id+"',firstResult:0,pageSize:'"+pageSize+"'}",
            success: function (data) {
                if(data.errCode == 0){
                    var themePavilion = data.resultdata.themePavilion;
                    //替换页面title
                    document.title = themePavilion.name;
                    sessionStorage.setItem("title",themePavilion.name);   //缓存分享标题
                    sessionStorage.setItem("asmian",themePavilion.img);//缓存分享图片
                    //设置导航标题
                    $("header h2").html(document.title);
                    switch (themePavilion.status){
                        case "0":         //店关闭中
                            $(".noData").show();
                            break;
                        case "1":         //店开启中
                            $("#wrapper").show();
                            //主题馆顶部banner图
                            $(".banner").css("background-image", "url(" + imgIndexUrl + themePavilion.img + ")");
                            //获取品牌馆商品列表数据
                            var goodsListArr = data.resultdata.goodsList;
                            //获取品牌馆商品列表
                            productsListLoad(goodsListArr);
                            //小于十个商品 显示提示
                            if(goodsListArr.length<10){ $(".pullUpLabel").html("没有更多内容了喔~");}
                            //主题馆商品列表点击跳转native详情
                            $(".productsListArr").on("click","li",function(){
                                var pid = $(this).attr("pid");  //获取商品id
                                location.href=jumpUrl.productsDetail+pid
                            });
                            firstResult ++;
                            break
                    }


                }else {
                    console.log(data.msg)
                }

            }
        })
    }

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
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function(){
        scrollFun(pullDownAction,themeUpAction)
    }, 200); }, false);


//主题馆页面上拉加载
function themeUpAction(){
    $.ajax({
        url: themeUrl,
        data:getAuth()+"info={uid:'"+UID+"',id:'"+id+"',firstResult:'"+firstResult+"',pageSize:'10'}",
        success: function (data) {
            //获取品牌馆商品列表数据
            var goodsListArr = data.resultdata.goodsList;
            //获取品牌馆商品列表
            productsListLoad(goodsListArr);
            setTimeout(function (){
                //重置上拉状态
                myScroll.refresh();
                if(goodsListArr.length < 10 ) {
                    //当前便签条数小于10 显示提示内容
                    $(".pullUpLabel").html("没有更多内容了喔~");
                    //当没有更多内容时 根据分页开关控制 分页只++一次 不会累加
                    if(firstResultOnce){
                        firstResult ++;
                        firstResultOnce = false;
                    }
                }else{
                    //当前便签条数大于10 分页++
                    firstResult ++;
                }
            },500)
        },
        error: function(xhr, type,msg){
            console.log(msg.statusText);
            // 即使加载出错，也得重置
            myScroll.refresh();
        }
    });
}


