/**
 * Created by haiyang on 2017/7/3.
 */

var shareparameter;//设置全局的分享参数字典对象
var mydata;//页面数据源

/*首先根据链接获取id字段的值*/
var myid =  GetQueryString("id");
/*页面刚一进来就进行加载获取标题，否则会造成标题栏不刷新显示的问题*/
$.ajax({
    url:getActivitydetail,
    data:getAuth()+"info={id:'"+myid+"'}",
    async:false,//注意设置为同步而非异步获取数据
    success:function (data) {
        if(data.errCode == 0){
            /*浏览器标题*/
            document.title = data.resultdata.activePage.title || "活动";

            //赋值页面数据源
            mydata = data;

        }
    }
});

/*当页面结构加载完毕之后*/
$(document).ready(function () {

    /*分享文案相关*/

    /*分享图片*/
    var share_img = mydata.resultdata.activePage.share_img;
    /*分享标题*/
    var share_title = mydata.resultdata.activePage.share_title;
    /*分享文案说明*/
    var share_explain = mydata.resultdata.activePage.share_explain;


    //构造分享参数:
    //如果是在微信中,则设置微信分享效果
    if(isWeiXin()) {
        //注入权限
        wXConfig({
            title:share_title,
            desc:share_explain,
            imgUrl:imgIndexUrl + share_img,

        })
    }
    //不在微信中，默认为在APP中，通过交互方法向原生发送分享参数
    else {
        //当点击分享按钮的时候原生APP会请求H5的分享数据，在这里将分享参数传递给原生
        //格式固定: sharetitle:分享标题 sharedescr:分享内容描述  shareimg:分享出去的图片  shareurl:分享出去的链接

        //在给APP分享参数之前需要对分享链接进行一定的处理,如果本地存在vid则将vid拼接到链接的后面
        var shareUrl = location.href;

        shareUrl = shareUrl.indexOf('?') < 0 ? shareUrl + "?vid=" + sessionStorage.getItem("vid") : shareUrl + "&vid=" + sessionStorage.getItem("vid");

        shareparameter = {"sharetitle":share_title,"sharedescr":share_explain,"shareimg":imgIndexUrl + share_img,"shareurl":shareUrl};
    }

    /*获取后台返回的对象数组*/
    var list = mydata.resultdata.activePage.list;
    var listr = "";
    var totalheight = 0;
    for (var i=0;i<list.length;i++){
        /*判断是否存在有图片地址再进行添加*/
        if (list[i].img){
            /*首先使用正则表达式获取图片的宽高*/
            var truepicheight = $("body").width() * returnpicratewithUrl(list[i].img);
            totalheight+=truepicheight;
            /*
                                    listr += "<li><img class='lazy' data-original= '"+imgIndexUrl+ picaddress +"' alt='超级社区' width= '100%' height='"+truepicheight+"' data-obj='"+JSON.stringify(list[i])+"'></li>"
            */


            listr += "<li><img src= '"+imgIndexUrl+ list[i].img +"' alt='超级社区' width= '100%' height='"+truepicheight+"' data-obj='"+JSON.stringify(list[i])+"'></li>"

        }
    }

    /*使用js追加元素*/
    $('ul').append(listr);


    /*文档加载完成之后给原生传页面高度*/
    if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())){
        //需要传递给iOS设备页面的高度：
        connectIosWebViewJavascriptBridge(function (bridge) {
            //1.传递高度
            bridge.callHandler('nearbyViewHeight',
                {'height':totalheight},
                function (responseData) {
                    console.log(responseData);
                }
            )

        });
    }

    /*因为在iOS用户端首页显示图片会有问题，故暂时不用懒加载*/

    /*/!*使用jQuery中的图片淡入效果*!/
    $("img.lazy").lazyload({
        placeholder : jumpUrl.noData,
        event : "click",
        skip_invisible : false,
        /!*effect : "fadeIn"*!/
    });
*/





    /*点击图片链接的跳转*/
    $('ul').on('click','img',function () {

        var datadic = $(this).data('obj');

        /*

                    根据不同情况下的分类跳转到不同的地方
                    targetType  跳转类型   1原产优品商品详情    2定制商品商品详情   3原产优品一级分类   4原产优品二级分类   5定制商品二级分类   6品牌馆    7主题馆    99其他外部链接
                    firstColumn  商品详情ID信息，一级分类信息，馆id信息，其他外部链接信息
                    secondColumn 二级分类信息
        */


        var resonsedata;//在APP能打开的前提下H5传递给原生的数据字典
        var ownjumpUrl;//在APP打不开的时候wab站跳转的链接

        switch (datadic.targetType){
            case "0":{
                //无链接，忽略跳转
                return;
            }
                break;
            //原产优品商品详情
            case "1":{
                //商品id
                var ownpid = datadic.firstColumn;
                resonsedata = {jumpkind:"1",data:{pid:ownpid}};
                ownjumpUrl = jumpUrl.productsDetail+ownpid;
            }
                break;
            //定制商品详情
            case "2":{
                //商品id
                var ownpid = datadic.firstColumn;
                resonsedata = {jumpkind:"2",data:{pid:ownpid}};
                ownjumpUrl = jumpUrl.clProDetail + ownpid;
            }
                break;
            //原产优品商品一级分类
            case "3":{
                //一级分类id
                var sortid = datadic.firstColumn;
                resonsedata = {jumpkind:"3",data:{sortid:sortid,secsortid:""}};
                ownjumpUrl = jumpUrl.find+"#"+"typeid="+sortid;
            }
                break;
            //原产优品商品二级分类
            case "4":{
                //一级分类id
                var sortid = datadic.firstColumn;
                //二级分类id
                var secsortid = datadic.secondColumn;
                resonsedata = {jumpkind:"4",data:{sortid:sortid,secsortid:secsortid}};
                ownjumpUrl = jumpUrl.find + "#" + "typeid="+sortid+"&"+"typeids="+secsortid;
            }
                break;
            //定制商品二级分类
            case "5":{
                //只有二级分类,故取定制生活二级分类
                var secsortid = datadic.secondColumn;
                //二级分类名称
                var sortname = datadic.name;
                resonsedata = {jumpkind:"5",data:{secsortid:secsortid,name:sortname}};
                ownjumpUrl = jumpUrl.clSubProList+secsortid + "&typename="+ sortname;
            }

                break;
            //品牌馆
            case "6":{
                //馆id
                var guanid = datadic.firstColumn;
                resonsedata = {jumpkind:"6",data:{"guanid":guanid}};
                ownjumpUrl = jumpUrl.brand + guanid;
            }
            break;
            //主题馆
            case "7":{
                //馆id
                var guanid = datadic.secondColumn;
                resonsedata = {jumpkind:"7",data:{"guanid":guanid}};
                ownjumpUrl = jumpUrl.theme + guanid;
            }
                break;
            //其他链接
            case "99":{
                var ownlinkurl = datadic.firstColumn;
                if (ownlinkurl){
                    /*判断链接是否存在http，如果存在则直接打开，如果不存在则在前面添加http://这个字符*/
                    var ifexist = ownlinkurl.search('http');
                    /*不存在，进行拼接*/
                    if (ifexist == -1){
                        ownlinkurl = 'http://' + ownlinkurl;
                    }

                    //如果是艺术馆的链接，则根据不同环境选择不同的艺术馆链接地址
                    if (ownlinkurl.indexOf("artisticHall/index.html") == -1){
                        //非艺术馆，直接跳转
                        location.href= ownlinkurl;
                    }
                    else{
                        //艺术馆链接，根据不同环境进行判断
                        var currentplatform = getcurrentplatform();


                        var wabartisticurl = jumpUrl.ArtisticHall;//wab站艺术馆链接
                        var APPartisticurl = APPpublicUrl + "newH5/inUserApp/artisticHall/index.html";//手机端艺术馆链接

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
                return;//打开链接之后直接return掉，因为这个不会和APP进行交互
            }
                break;
       }



        var currentplatform = getcurrentplatform();
        //如果是微信QQ微博等应用外，则打开为wab站链接,如果是应用内则进行交互,注意此处不能根据iosbrowser和androidbrowser来区分是否是手机APP，需要排除QQ微博微信和PC端之后剩余的才是手机APP
        if (currentplatform.wx || currentplatform.QQ||currentplatform.sina || currentplatform.PC){
            location.href = ownjumpUrl;
        }
        else{
            mutualAction(resonsedata);
        }


    })


})

/*设置该页面在手机app中的分享参数*/
function getshareparpmeter() {

    return shareparameter;

}