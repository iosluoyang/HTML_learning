/**
 * Created by haiyang on 2017/7/13.
 */


/*全局变量*/
var aid;//活动id
var isgouxuan = false;/*默认未勾选免责协议*/


$(document).ready(function () {
    //结构加载完成
    openApp();

    //加载数据
    //解析传入的参数
    aid=GetQueryString("aid");
    if(aid){
        /*传如当前用户的uid，如果未登录则为空字符串*/
        UID?load({aid:aid,uid:UID}) : load({aid:aid})
    }

});

/*获取相应数据*/
function load(info) {
    $.ajax({
        url:apiIndexUrl + "activity/activity119.do",
        data:getAuth()+"info="+JSON.stringify(info),
        success:function (data) {
            if (data.errCode == 0){
                //成功获取到数据
                var dataActivity = data.resultdata.activity;
                var lunBoImg = dataActivity.imgs.split(",");
                var li = "";
                for (var i = 0;i<lunBoImg.length;i++){
                    if (lunBoImg[i]){
                        li += "<li class='swiper-slide' style='background-image: url("+imgIndexUrl+lunBoImg[i]+") ;'></li>"
                    }
                }
                $('.lunbo').append(li);
                //设置轮播图
                setupSwiper();
                //设置活动详情的其他信息
                //活动名称
                sessionStorage.setItem("title",dataActivity.aname); //设置分享名称
                sessionStorage.setItem("asmian",lunBoImg[0]);//设置分享图片
                $('.activityname').html(dataActivity.aname);
                //活动时间
                //返回的时间 是携带着毫秒的 2016-07-08 16:28:52.0
                //只需要毫秒前面的部分
                var activityTime = dataActivity.activityTime.split('.')[0];
                $('.activitytime').append(activityTime);

                //活动地址:
                $('.activityaddress').append(dataActivity.aAddress);
                //活动详情
                var detail = dataActivity.adetail.replace(/\r\n/g,"<br>");
                $('.activitydetail').html(detail);

                //报名成员
                var baomingnum = dataActivity.bmCount;
                //如果报名成员不为空且不为0的时候才增加右侧报名人数和箭头
                if (baomingnum != '' && baomingnum != 0){
                    $('.baomingnum').html(baomingnum);
                }


                //参加人数数组
                var bmListArr = dataActivity.bmList;
                var bmli = "";
                for (var i = 0 ; i<bmListArr.length;i++){
                    //头像（增加容错）
                    var uimg = bmListArr[i].uimg;
                    uimg = uimg ? imgIndexUrl + uimg : jumpUrl.moRenAvatar ;

                    //姓名:
                    var uname = bmListArr[i].uname;
                    uname = uname ? uname : '超级小超';

                    //签到状态 isqd 0为未签到 1为已签到
                    var qiandaostate = bmListArr[i].isqd == 1 ? '已签到' :'' ;

                    //赋值
/*
                    该方法无法将背景图片设置为圆形，故舍弃该方法
                    bmli += '<li><p style="background: url('+uimg+') no-repeat 10px center; background-size: 30px;">'+uname+'</p></li>';
*/
                    bmli += '<li><img class="lazy" data-original='+uimg+'><span class="uname">'
                        +uname+'</span><span class="qiandaostate">'+qiandaostate+'</span></li>'
                }
                $('.baominglist').append(bmli);

                /*使用jQuery中的图片淡入效果*/
                $("img.lazy").lazyload({
                    threshold : 200
                });

                //设置报名或者取消报名或者活动结束的按钮(逻辑如下)
                /*
                * 1.如果活动已经结束，则展示为活动已结束按钮
                * 2.如果活动没有结束，未登陆状态下为报名按钮 已登录状态下根据报名状态区分是报名按钮还是取消报名按钮
                * astatus 1活动进行中 2已结束
                * */
                var btnbgcolor;
                var btntitle;
                var btnclickevent;

                    //已经结束了，显示灰色活动结束按钮
                if (dataActivity.astatus == 2){
                    btnbgcolor = 'lightgray';
                    btntitle = '活动已结束';
                }
                    //活动未结束
                else{
                    //用户未登陆,展示红色报名按钮
                    if (!UID){
                        btnbgcolor = '#ff3b30';
                        btntitle = '报名';
                        btnclickevent = 'baoming()';
                    }
                    //已经登录，根据报名状态选择是报名还是取消报名
                    else{
                        /*
                        * 报名状态:
                        * atype 1立即报名  2报名人数已满  3已签到  4活动已结束  5取消报名
                        *
                        *
                        * */
                        var baomingstate = dataActivity.atype;

                        if (baomingstate == 1){
                            //立即报名状态
                            btnbgcolor = '#ff3b30';
                            btntitle = '报名';
                            btnclickevent = 'baoming()';

                        }
                        else if (baomingstate == 2){
                            //报名人数已满状态
                            btnbgcolor = 'lightgray';
                            btntitle = '报名人数已满';
                        }
                        else if (baomingstate == 3){
                            //已签到状态
                            btnbgcolor = 'lightgray';
                            btntitle = '已签到';
                        }
                        else if (baomingstate == 4){
                            //活动已结束状态
                            btnbgcolor = 'lightgray';
                            btntitle = '活动已结束';
                        }
                        else if (baomingstate == 5){
                            //取消报名状态
                            btnbgcolor = 'lightgray';
                            btntitle = '取消报名';
                            btnclickevent = 'cancelbaoming()';
                        }
                    }
                }

                var addbtnstr = '<div class="baomingbtn" style="background-color: '
                    +btnbgcolor+'" onclick="'+btnclickevent+'">'+btntitle+'</div>';
                $('body').append(addbtnstr);



                /*设置蒙版的点击事件*/
                $('.baomingmask').click(function () {
                    $('.baomingmask').hide();/*隐藏蒙版*/
                    $('body').css('overflow','auto');/*让body可以滚动*/
                    $('.baomingcontent').css('bottom','-36rem');

                });
                /*是否勾选免责协议*/
                $('.agreement').click(function (e) {
                    e.stopPropagation();/*阻止冒泡事件*/
                    /*更改全局变量属性*/
                    isgouxuan = !isgouxuan;
                    $(this).toggleClass('active');
                });
                /*设置免责协议的点击事件*/
                // $('.mianzexieyi').click(function (e) {
                //     e.stopPropagation();/*阻止冒泡事件*/
                //     location.href = 'http://www.baidu.com';
                // })
            }

        }
    })

}
/*初始化轮播图*/

function setupSwiper() {
    /*首先设置轮播图宽高比为1:1*/
    $('.swiper-slide').height($('.swiper-slide').width());
    var myswiper = new Swiper('.swiper-container',{
        //是否循环滚动(如果只有一张图片则关闭循环滚动)
        loop:$(".lunbo li").length > 1 ? true : false,

        //如果需要分页器
        pagination:$(".lunbo li").length > 1 ?'.swiper-pagination':'null',

        //如果只有一张图片，则切换模式变为fade
        effect:$(".lunbo li").length > 1 ? 'slide':'fade',

        // 此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换
        paginationClickable :true,

        //如果需要前进后退按钮
        //nextButton: '.swiper-button-next',
        //prevButton: '.swiper-button-prev',

        //如果需要滚动条
        //scrollbar:'.swiper-scrollbar',

        //自动滚动
        autoplay: 3000,

        //滑动速度
        //speed:300,

        //设置初始化时候的索引
        //initialSlide:1,

        //设置是否在用户打断之后继续自动轮播
        autoplayDisableOnInteraction : false

        //autoplayStopOnLast  如果设置为true，当切换到最后一个slide时停止自动切换。（loop模式下无效）
        //autoplayStopOnLast : true,

        //设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
        //grabCursor : true,

        //如需要开启视差效果（相对父元素移动），设置为true并在所需要的元素上增加data-swiper-parallax属性。

        //parallax : true,

        //如需为每个slide增加散列导航（有点像锚链接）。将hashnav设置为true，并在每个slide处增加data-hash属性。
        //这样当你的swiper切换时你的页面url就会加上这个属性的值了，你也可以通过进入页面时修改页面url让swiper在初始化时切换到指定的slide。
        //hashnav:true,

        //开启后当URL的锚链接发生变化时控制slide切换（hashnav也要在开启状态）
        //hashnavWatchState:true,

        /*设为任意string则开启history并以这个string为URL前缀。
        在slide切换时无刷新更换URL和浏览器的history.state(pushState)。这样每个slide都会拥有一个自己的URL。
        使用history还必需在slide上增加一个属性data-history，例<div class="swiper-slide" data-history="slide1"></div>
        开启history会取消hashnav。*/
        //history: 'any words',

       /* 使用replaceState（window.history.replaceState）
        方法代替hashnav的hash方法（document.location.hash）或者history的pushState（window.history.replaceState）方法。*/
        //replaceState:true,

        //Swiper从3.0开始使用flexbox布局(display: flex)，开启这个设定会在Wrapper上添加等于slides相加的宽高，在对flexbox布局的支持不是很好的浏览器中可能需要用到。
        //setWrapperSize :true,

        //虚拟位移。当你启用这个参数，Swiper除了不会移动外其他的都像平时一样运行，仅仅是不会在Wrapper上设置位移。当你想自定义一些slide切换效果时可以用。
        //启用这个选项时onSlideChange和onTransition事件失效。
        //virtualTranslate : true,

        //设定为true将slide的宽和高取整(四舍五入)以防止某些分辨率的屏幕上文字或边界(border)模糊。
        //例如在1440宽度设备上，当你设定slide宽为76%时，则计算出来结果为1094.4，开启后宽度取整数1094。
        //roundLengths : true,

        //自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化。
        //autoHeight: true,

        /*
         用于嵌套相同方向的swiper时，当切换到子swiper时停止父swiper的切换。
         请将子swiper的nested设置为true。
         由于需要在slideChangeEnd时判断作用块，因此快速滑动时这个选项无效。
         */
        /*
         var mySwiper = new Swiper('#swiper-container1')//父swiper
         var mySwiper2 = new Swiper('#swiper-container2',{//子swiper
         nested:true,
         resistanceRatio: 0,
         })
        */

        //设置为true则点击slide会过渡到这个slide
        //slideToClickedSlide:true,







})
}



/*点击了报名按钮报名*/
function baoming() {
    /*
    * 首先判断是否已经登录，如果已经登录则直接弹出报名框，如果未登录则使用封装的登录方法
    * */

    // /*显示蒙版*/
    // $('.baomingmask').css('display','block');
    // /*将报名内容页移上来*/
    // $('.baomingcontent').css('bottom','0');
    // /*让body不能滚动*/
    // $('body').css('overflow','hidden');

    sessionStorage.setItem("completeUrl",location.href);
    isLogin(UID,function () {
        // /!*显示蒙版*!/
        $('.baomingmask').show();
        // /!*将报名内容页移上来*!/
        $('.baomingcontent').css('bottom','0');
        // /!*让body不能滚动*!/
        $('body').css('overflow','hidden');
    });

}

/*确定报名*/
function surebaoming(event) {
    /*阻止冒泡事件*/
    event.stopPropagation();
    /*阻止默认事件*/
    event.preventDefault();
    /*点击确定报名之后所做的表单验证*/

    /*验证姓名是否超过10个字符*/
    var name = $('#name').val();
    if (name.length == 0){
        mainTip('请输入姓名');
        return;
    }
    if (name.length > 10){
        mainTip('姓名最大长度为10');
        return;
    }

    /*验证手机号是否正确*/
    var phonenum = $('#phonenum').val();
    if (!isPhoneNum(phonenum)){
        mainTip('请输入正确的手机号');
        return;
    }

    /*验证备注的长度*/
    var memo = $('#memo').val();
    if (memo.length > 50){
        mainTip('备注最大长度为50');
        return;
    }

    /*验证是否点击了免责协议*/
    if (!isgouxuan){
        mainTip('您尚未同意免责协议');
        return;
    }

    /*全部验证通过，收起报名界面之后调用报名接口*/
    $('.baomingmask').css('display','none');/*隐藏蒙版*/
    $('body').css('overflow','auto');/*让body可以滚动*/
    $('.baomingcontent').css('bottom','-36rem');


    $.ajax({
        url:apiIndexUrl + 'activity/activityEnrol119.do',
        /*  atype   1立即报名   5取消报名*/
        data:getAuth() + "info={aid:'"+aid+"',uid:'"+UID+"',uname:'"+name+"',uphone:'"+phonenum+"',bz:'"+memo+"',atype:'1'}",
        success:function (data) {
            if (data.errCode == 0){
                //报名成功,刷新当前页面数据
                mainTip('报名成功');
                setTimeout(function () {
                    locationReload();
                },1000);
            }else{
                tip(data.msg);
                setTimeout(function () {
                    locationReload();
                },1000);
            }
        }
    })

}


/*取消报名*/
function cancelbaoming() {

    //取消报名肯定是已经登录的状态了，此时弹出二次提示框

    confirmShow({
        title:'提示',
        content:"确定取消报名吗？",
        makeSure:function () {
            $.ajax({
                url:apiIndexUrl + 'activity/activityEnrol119.do',
                /*  atype   1立即报名   5取消报名*/
                data:getAuth() + "info={aid:'"+aid+"',uid:'"+UID+"',atype:'5'}",
                success:function (data) {
                    if (data.errCode == 0){
                        //取消报名成功,刷新当前页面数据
                        mainTip('取消报名成功');
                        setTimeout(function () {
                            locationReload();
                        },1000);
                    }else {
                        tip(data.msg);
                        setTimeout(function () {
                            locationReload();
                        },1000);
                    }
                }
            })
        }
    })
}

//由于安卓内微信页面缓存机制问题，location.reload()在微信中会不生效
// 解决方案：采用通过url加时间戳的方式
function locationReload() {
    var timestamp = GetQueryString("timestamp") || "";
    if(timestamp){      //存在时间戳
        location.replace(funcUrlDel("timestamp"))
    }else{
        var date_obj = new Date();
        location.replace(location.href + '&timestamp=' + date_obj.getTime())
    }
}

