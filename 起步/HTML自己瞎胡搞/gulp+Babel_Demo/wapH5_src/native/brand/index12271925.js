/**
 * Created by hasee on 2016/9/12.
 */

//解析传入参数 获取用户uid和馆id
var id = GetQueryString("id");

$(function(){
    //--------------------------------立即打开----------------------------------------
    openApp($("header"),$("#wrapper"));

    if(id !=null && id.toString().length>0){
        $.ajax({
            url:brandUrl,
            data:getAuth()+"info={uid:'"+UID+"',id:'"+id+"',firstResult:0,pageSize:'"+pageSize+"'}",
            success:function(data){
                if(data.errCode == 0){  //请求成功
                    //首次进入获取数据
                    var brandPavilion = data.resultdata.brandPavilion;
                    //设置页面标题
                    document.title = brandPavilion.name;
                    sessionStorage.setItem("title",brandPavilion.name);   //缓存分享标题
                    sessionStorage.setItem("asmian",brandPavilion.logoimg);//缓存分享图片
                    //设置导航标题
                    $("header h2").html(document.title);
                    //馆的关闭开启状态
                    switch (brandPavilion.status){
                        case "0":         //店关闭中
                            $(".noData").show();
                            break;
                        case "1":         //店开启中
                            $("#wrapper").show();
                            //品牌馆顶部头图
                            $(".banner").css("background-image","url("+imgIndexUrl+brandPavilion.frontimg+")");
                            //设置馆id 为了关注获取馆id
                            $(".mid").attr("guanId",brandPavilion.id);
                            //品牌馆logo图
                            $(".mid .logo").css("background-image","url("+imgIndexUrl+brandPavilion.logoimg+")");
                            //判断是否关注    0 没有关注  1 已关注
                            if(brandPavilion.isgz == "1" ){$(".mid .guanZhu").addClass("yiGuanZhu").html("已关注")}
                            //品牌馆标题
                            $(".mid .title").html(brandPavilion.name);
                            //关注人数  为空或0时 显示0
                            var guanZhuNumSpan = $(".mid .num span");
                            brandPavilion.gzCount ? guanZhuNumSpan.html(brandPavilion.gzCount) :guanZhuNumSpan.html(0);

                            //设置完品牌馆的标题之后设置其宽度(mid的宽度<content内容宽度> -  logo的宽度<包含内边距 边框> - 8的外边距 - 关注的宽度<包含内边距 边框>)
                            var titlewidth = $('.mid').width() - $('.logo').outerWidth(true) - 8  - $('.guanZhu').outerWidth(true) - 5;
                            $('.mid .title').width(titlewidth);

                            //获取品牌馆商品列表数据
                            var goodsListArr = data.resultdata.goodsList;
                            //获取品牌馆商品列表
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


    //点击关注和取消关注效果
    $(".mid").on("click",".guanZhu",function () {
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
        var _this = $(this),
            guanId = _this.parent().attr("guanId"),
            numDom =    $(".mid .num span");
        //  haveCalss 判断是否有需要的ClassName
        //  html    没有收藏或关注的html
        //  actHtml 已经关注的html
        //  idKey   接口需要的参数Key
        //  idVal   参数key的值
        //  uid     用户id
        //  numDom  需要更换关注人数的dom
        //  type    需要在关注dom上显示关注人数 1 不需要 0
        sessionStorage.setItem("completeUrl",location.href);    //保存当前地址 登录完成后跳回
        isLogin(UID,function(){guanZhuAction(_this,"yiGuanZhu","关注","已关注",guanId,UID,numDom,0)});

    });

    //品牌馆点击跳转native详情
    $(".productsListArr").on("click","li",function(){
        var pid = $(this).attr("pid");  //获取商品id
        location.href=jumpUrl.productsDetail+pid;

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
        scrollFun(pullDownAction,brandUpAction)
    }, 200); }, false);

//品牌馆上拉加载
function brandUpAction(){
    $.ajax({
        url: brandUrl,
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
        error: function(xhr, type){
            console.log('Ajax error!');
            // 即使加载出错，也得重置
            myScroll.refresh();
        }
    });
}