/**
 * Created by hasee on 2017/2/9.
 */

//获取社区vid
var vid = GetQueryString("vid"),DATE="";

$(function(){
    //--------------------------------立即打开----------------------------------------
    openApp($("header"),$("#wrapper"));

    if(vid !=null && vid.toString().length>0){
        $.ajax({
            url:userGetStoreUrl,
            data:getAuth()+"info={uid:'"+UID+"',vid:'"+vid+"',firstResult:0,pageSize:'"+pageSize+"',date:'"+DATE+"'}",
            success:function(data){
                if(data.errCode == 0){  //请求成功
                    //首次进入获取数据
                    var brandPavilion = data.resultdata.brandPavilion;
                    DATE =  data.resultdata.date;
                    //社长优选标题
                    $(".mid .title").html(brandPavilion.name);
                    sessionStorage.setItem("title",brandPavilion.name);   //缓存分享标题
                    sessionStorage.setItem("asmian",brandPavilion.logoimg);//缓存分享图片
                    switch (brandPavilion.status){
                        case 0:             //店关闭中
                            $(".noData").show();
                            break;
                        case 1:             //店开启中
                            $("#wrapper").show();
                            //社长优选顶部头图
                            $(".banner").css("background-image","url("+imgIndexUrl+brandPavilion.frontimg+")");
                            //社长优选logo图
                            $(".mid .logo").css("background-image","url("+imgIndexUrl+brandPavilion.logoimg+")");
                            //设置等级
                            //0实习社长 1初级社长 2中级社长 3高级社长 4超级社长
                            var level="";
                            switch (brandPavilion.level){
                                case 0:
                                    $(".level").css("display","none");
                                    break;
                                case 1:
                                    level="LV1";
                                    break;
                                case 2:
                                    level="LV2";
                                    break;
                                case 3:
                                    level="LV3";
                                    break;
                                case 4:
                                    level="LV4";
                                    break;
                            }
                            $(".level").html(level);



                            //获取社长优选商品列表数据
                            var goodsListArr = data.resultdata.goodsList;
                            //获取社长优选商品列表
                            productsListLoad(goodsListArr);
                            //小于十个商品 显示提示
                            if(goodsListArr.length<10){ $(".pullUpLabel").html("没有更多内容了喔~");}
                            //增加分页
                            firstResult++;
                            break
                    }
                }else{
                    console.log(data.msg)
                }
            }
        });

    }

    //社长优选点击跳转商品详情
    $(".productsListArr").on("click","li",function() {
        var _this = $(this), pid = _this.attr("pid"), type = _this.attr("type");
        if (type == 5) {  //跳转定制生活商品详情
            location.href = jumpUrl.clProDetail + pid
        } else {//跳转原产优品商品详情
            location.href = jumpUrl.productsDetail + pid;
        }
    })
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
        scrollFun(pullDownAction,comShopUpAction)
    }, 200); }, false);

//社长优选上拉加载
function comShopUpAction(){
    var id = GetQueryString("id");      //获取社长优选id
    if(id){
        $.ajax({
            url: userGetStoreGoodsUrl,
            data:getAuth()+"info={uid:'"+UID+"',id:'"+id+"',firstResult:'"+firstResult+"',pageSize:'10',date:'"+DATE+"'}",
            success: function (data) {
                //获取社长优选商品列表数据
                var goodsListArr = data.resultdata.goodsList;
                DATE =  data.resultdata.date;
                //获取社长优选商品列表
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
            error: function(xhr, type){
                console.log('Ajax error!');
                // 即使加载出错，也得重置
                myScroll.refresh();
            }
        });
    }else {
        tip("获取参数失败")
    }

}