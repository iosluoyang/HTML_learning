$(document).ready(function () {




    /*开始加载数据*/
    load();

    /*回到顶部按钮*/

    //上拉加载
    window.onscroll = function(){
        if (getScrollTop()  > getClientHeight()){
            $(".goTop").show()
        }else {
            $(".goTop").hide()
        }
    };

    //返回顶部
    $(".goTop").click(function(){
        window.scrollTo(0,0)
    });

})


/*获取相应数据*/
function load() {
    $.ajax({
        url:artistshallUrl,
        data:getAuth(),
        success:function (data) {
            if (data.errCode == 0){
                //成功获取到数据
                var museum = data.resultdata.museum;


                //搜索框相关属性的设置和绑定
                $('#searchinput').on('input propertychange', function() {
                    //当前输入字数 有输入内容则显示搜索按钮，没有输入内容则不展示
                    var count = $(this).val().length;
                    if (count == 0){
                        $('.searchbtn').hide();
                    }
                    else{
                        $('.searchbtn').show();
                    }

                });

                //输入框获取焦点时显示蒙版，失去焦点时隐藏蒙版
                //获取焦点
                $('#searchinput').focus(function () {
                    //显示蒙版
                    $('.searchmask').show();
                    //让body不能滚动
                    $('body').css('overflow','hidden');

                });

                //点击蒙版让蒙版消失，并且输入框失去焦点,恢复body滚动事件
                $('.searchmask').click(function (event) {

                    /*阻止冒泡事件*/
                    event.stopPropagation();
                    /*阻止默认事件*/
                    event.preventDefault();
                    $(this).hide();
                    $('body').css('overflow','auto');/*让body可以滚动*/
                })



                //失去焦点
                $('#searchinput').blur(function () {
                    //隐藏蒙版
                    $('.searchmask').hide();
                    $('body').css('overflow','auto');/*让body可以滚动*/
                });


                //轮播图
                var carousels = museum.carousels;
                var listr = "";
                for(var i = 0;i<carousels.length;i++){
                    //图片
                    var img = imgIndexUrl +  carousels[i].img;
                    //pid
                    var pid = carousels[i].pid;
                    listr += "<li class='swiper-slide' style='background: url("+img+") no-repeat center;background-size: cover;' pid="+pid+"></li>"
                }
                $('.lunbo').append(listr);
                //初始化轮播图
                setupSwiper();
                //点击轮播图跳转至原产优品商品详情
                $('.lunbo').on('click','.swiper-slide',function () {
                    var pid = $(this).attr('pid');
                    location.href = jumpUrl.productsDetail + pid;
                })


                //根据后台数据设置多个banner
                var bannerArr = museum.banner;
                //如果有banner图配置，则有数据，没有数据的时候返回的是个空字典对象
                for ( index in bannerArr){
                    var bannerdic = bannerArr[index];
                    //如果存在banner图的话再进行设置
                    if(JSON.stringify(bannerdic) != '{}'){
                        var element;
                        //根据索引找到对应的banner图位置
                        if (index == 0){
                            element = $('#banner1');
                        }
                        else if (index == 1){
                            element = $('#banner2');
                        }

                        //背景图片
                        var imgUrl = imgIndexUrl + bannerdic.img;

                        //设置banner的背景图片(只有当有数据时banner图才有高度)

                        /*首先使用正则表达式获取图片的宽高*/
                        var truepicheight = $("body").width() * returnpicratewithUrl(bannerdic.img);

                        element.css({
                            "background-image":'url('+imgUrl+')',
                            "height":truepicheight,

                        });
                        //通过data(key,value)动态给元素赋值data属性
                        element.data("obj",JSON.stringify(bannerdic));


                    }
                }
                //设置banner的点击事件
                $('.banner').off().click(function () {
                    var ownbanndic = JSON.parse($(this).data('obj'));
                    //跳转类型  jumptype  跳转类型  1主题馆  2品牌馆   3 Url链接
                    var jumptype = ownbanndic.jumptype;
                    //jumpdata  跳转数据 依据jumptype不同代表不同意思： 馆id 或者  Url链接
                    jumpdata = ownbanndic.jumpdata;
                    switch (jumptype){
                        //跳转主题馆
                        case "1" :{
                            location.href = jumpUrl.theme + jumpdata;
                        }break;
                        //跳转品牌馆
                        case "2" :{
                            location.href = jumpUrl.brand + jumpdata;
                        }break;
                        //跳转url
                        case "3" :{
                            location.href = jumpdata;
                        }break;
                    }
                })



                //艺术家信息 本地写入艺术家数据
                var str = '';
                var artists = [
                    {
                        name:"于建嵘",
                        localimg :'images/42.jpg',
                        id:42
                    },
                    {
                        name:"李月领",
                        localimg :'images/43.jpg',
                        id:43
                    },
                    {
                        name:"龙微微",
                        localimg :'images/44.jpg',
                        id:44
                    },
                    {
                        name:"刘永贵",
                        localimg :'images/46.jpg',
                        id:46
                    },
                    {
                        name:"周海醄",
                        localimg :'images/45.jpg',
                        id:45
                    },
                    {
                        name:"张鉴墙",
                        localimg :'images/48.jpg',
                        id:48
                    },
                    {
                        name:"崔文哲",
                        localimg :'images/49.jpg',
                        id:49
                    },
                    {
                        name:"王兴杰",
                        localimg :'images/74.jpg',
                        id:74
                    },
                    {
                        name:"马鸣",
                        localimg :'images/75.jpg',
                        id:75
                    },
                    {
                        name:"刘懋廿",
                        localimg :'images/76.jpg',
                        id:76
                    },
                    {
                        name:"郭贵君",
                        localimg :'images/77.jpg',
                        id:77
                    },
                    {
                        name:"夏喜智",
                        localimg :'images/78.jpg',
                        id:78
                    },
                    {
                        name:"贾见罡",
                        localimg :'images/79.jpg',
                        id:79
                    },
                    {
                        name:"",
                        localimg :'images/checkmore.png',
                        id:'more'
                    },
                ];
                for (var i = 0 ;i <artists.length;i++){
                    //遍历每一位艺术家，除了最后一个没有蒙版以外，其余均相同
                    var artistname = artists[i].name;
                    var localimg = artists[i].localimg;//本地图片
                    var guanid = artists[i].id;
                    var tempstr = i == artists.length - 1 ?'':"<div class='mengban'><p class='artistname'>"+artistname+"</p><p class='zuopin'>作品</p></div>";

                    //设置每一个的宽高(第一个特殊，其余一样)
                    var widthclass = i == 0 ? 'bigone':'smallone';

                    str+= "<div class='artist "+widthclass+"'  guanid='"+guanid+"' style='background: url("+localimg+") no-repeat center;background-size: cover;'>"+tempstr+"</div>"
                }
                $('.artists').append(str);
                //设置每一个小样式的艺术家的宽高相同
                $('.smallone').width(parseInt(($('.artists').width() - 4*4)/4.0));//取整
                $('.smallone').height($('.smallone').width());
                $('.bigone').width($('.smallone').width()*2 + 4);
                $('.bigone').height($('.bigone').width());
                //点击每一个艺术家都跳转至相应的主题馆
                $('.artists').on('click','.artist',function () {
                    var guanid = $(this).attr('guanid');
                    //如果是更多则跳转至作品集页面(活动页面)，否则跳转至主题馆
                    location.href = guanid == 'more' ? publicUrl + 'promotions/index.html?id=6' : jumpUrl.theme + guanid;
                });


                //作品分类
                $('.productkind').height($('.productkind').width());
                $('.productkind').css({
                    "margin-bottom":"2rem",
                });
                //点击分类跳转至原产优品二级分类中
                $('.productions_kind').on('click','.productkind',function () {
                    var sortdic = $(this).data("obj");
                    //一级分类id
                    var sortid = sortdic.sortid;
                    //二级分类id
                    var secsortid = sortdic.secsortid;
                    ownjumpUrl = jumpUrl.find + "#" + "typeid="+sortid+"&"+"typeids="+secsortid;
                    location.href = ownjumpUrl;
                });


                //精品推荐
                var divstr = '';
                var refineds = museum.refineds;
                for (var i = 0 ; i< refineds.length;i++){
                    //图片
                    var img = imgIndexUrl +  refineds[i].img;
                    var rate = returnpicratewithUrl(img)//宽高比
                    var truepicwidth = ($('.products').width() - 13) /2 ;//实际图片宽度
                    var truepicheight = truepicwidth * rate;

                    //pid
                    var pid = refineds[i].pid;
                    //名称
                    var name = refineds[i].name;


                    divstr += "<div class='product' pid="+pid+" style='background-image: url("+img+"); padding-top:"+truepicheight+'px' +";background-size:"+truepicwidth + 'px'+" "+truepicheight + 'px' +"'><p class='productname'>"+name+"</p></div>";

                }

                $('.products').append(divstr);
                //设置每一个精品的宽度
                $('.product').width(($('.products').width() - 13) /2) ;

                //启动瀑布流布局
                var $container = $('#masonry');
                $container.masonry({
                    itemSelector : '.product',
                    // gutterWidth : 20,  /*该属性貌似不起作用*/
                    isAnimated: true,
                });

                //点击每一个精品推荐中的商品跳转至商品详情页中
                $('.sample_reels').on('click','.product',function () {
                    var pid = $(this).attr('pid');
                    location.href = jumpUrl.productsDetail + pid;
                });

                //构造分享参数:  注意设置微信分享参数最好放在最后，因为public.js里面有初始化的设置，在这里等页面加载完毕之后进行覆盖
                //设置微信分享效果
                if(isWeiXin()) {
                    //注入权限
                    wXConfig({
                        title:'东书房艺术馆',
                        desc:'原创平价,值得珍藏,将艺术品轻松带回家!',
                        imgUrl:publicUrl + 'artisticHall/images/shareicon.png'
                    });
                }

            }
        },
    })

}
/*初始化轮播图*/
function setupSwiper() {

    var myswiper = new Swiper('.swiper-container',{
        //是否循环滚动(如果只有一张图片则关闭循环滚动)
        loop:true,
        autoheight:true,//跟随slider的高度而改变高度
        effect:"coverflow",
        slidesPerView : 3,//同时显示的slider数目
        centeredSlides: true,
    })
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

    $('.searchmask').hide();//隐藏蒙版
    $('body').css('overflow','auto');/*让body可以滚动*/

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
/*点击搜索按钮进行的搜索操作*/
function clicksearch() {

    $('.searchmask').hide();//隐藏蒙版
    $('body').css('overflow','auto');/*让body可以滚动*/

    //获取输入框文本，如果是空的话则return
    var searchstr = $('.searchbar').val();
    if (searchstr){
        //有内容，先清空搜索框再进行搜索
        $('.searchbar').val('');
        location.href = jumpUrl.SearchResult + "name="+searchstr+"&firstType=84";//此处传递过去的字段为搜索关键字name 以及 原产优品一级分类id firstType 二级分类不传也可以
    }

}
/*点击了查看更多按钮跳转至原产优品艺术品分类下*/
function clickmore() {
    location.href = jumpUrl.find + '#typeid=84';
}