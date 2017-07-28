/**
 * Created by haiyang on 2017/7/26.
 */

$(document).ready(function () {

  /*初始化swiper*/
    new Swiper('.swiper-container', {
        mousewheelControl: false,
        effect: 'coverflow',    // slide, fade, coverflow or flip
        speed: 300,
        direction: 'vertical',
        autoplay:false,
        loop:false,
        autoplayStopOnLast : true,
        onlyExternal : false,
        fade: {
            crossFade: false
        },
        coverflow: {
            rotate: 100,
            stretch: 0,
            depth: 300,
            modifier: 1,
            slideShadows: false     // do disable shadows for better performance
        },
        flip: {
            limitRotation: true,
            slideShadows: false     // do disable shadows for better performance
        },
        onInit: function(swiper){ //Swiper2.x的初始化是onFirstInit
            swiperAnimateCache(swiper); //隐藏动画元素
            swiperAnimate(swiper); //初始化完成开始动画
        },
        onSlideChangeEnd: function(swiper){
            swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
        }


        /*onInit: function (swiper) {
            animationControl.initAnimationItems();  // get items ready for animations
            animationControl.playAnimation(swiper); // play animations of the first slide
        },
        onTransitionStart: function (swiper) {     // on the last slide, hide .btn-swipe
            if (swiper.activeIndex === swiper.slides.length - 1) {
                $upArrow.hide();
            } else {
                $upArrow.show();
            }
        },
        onTransitionEnd: function (swiper) {       // play animations of the current slide
            animationControl.playAnimation(swiper);
        },
        onTouchStart: function (swiper, event) {    // mobile devices don't allow audios to play automatically, it has to be triggered by a user event(click / touch).
            if (!$btnMusic.hasClass('paused') && bgMusic.paused) {
                bgMusic.play();
            }
        }*/
    });


    $('.submit').click(function () {
        //姓名:
        var name = $('#name').val();

        if (!name || name.length < 2 || name.length >4){
            alert('亲,请再检查一下名字');
            return;
        }

        //性别:
        var gender = $('#gender').val();

        //手机号码:
        var phonenum = $('#phonenum').val();

        if (!phonenum || phonenum.length != 11){
            alert('亲,请再检查一下手机号码');
            return;
        }

        //邮箱:
        var e_mail = $('#e-mail').val();

        alert('提交成功:' + name + gender + phonenum + e_mail);
    })




   /*使用插件进行表单校验*/
   /* $('form').validate({
       /!* debug:false,*!/
        rules: {
            name: {
                required: true,
                minlength: 2,
                maxlength:4
            },
            tel:{
                required:true,
                minlength: 11,
                maxlength:11

            }
        },
        messages: {
            name: "仔细检查一下名字哦",
            tel: {
                required: "请输入手机号码",
                minlength:'请检查您的手机号码是否正确',
                maxlength:'请检查您的手机号码是否正确'
            },
            email: "请输入一个正确的邮箱"
        },
        submitHandle:function(form){
            //姓名:
            var name = $('#name').val();

            if (!name){
                return;
            }

            //性别:
            var gender = $('#gender').val();

            //手机号码:
            var phonenum = $('#phonenum').val();

            if (!phonenum){
                return;
            }

            //邮箱:
            var e_mail = $('#e-mail').val();

            alert('提交成功:' + name + gender + phonenum + e_mail);
    }

    })*/
})