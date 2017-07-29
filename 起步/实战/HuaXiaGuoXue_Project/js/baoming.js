/**
 * Created by haiyang on 2017/7/26.
 */

/*将默认提示中文化start*/
jQuery.extend(jQuery.validator.messages, {
    required   : "必选字段",
    remote     : "请修正该字段",
    email      : "请输入正确格式的电子邮件",
    url        : "请输入合法的网址",
    date       : "请输入合法的日期",
    dateISO    : "请输入合法的日期 (ISO).",
    number     : "请输入合法的数字",
    digits     : "只能输入整数",
    creditcard : "请输入合法的信用卡号",
    equalTo    : "请再次输入相同的值",
    accept     : "请输入拥有合法后缀名的字符串",
    maxlength  : jQuery.validator.format("请输入一个长度最多是{0}的字符串"),
    minlength  : jQuery.validator.format("请输入一个长度最少是{0}的字符串"),
    rangelength: jQuery.validator.format("请输入一个长度介于{0}和{1}之间的字符串"),
    range      : jQuery.validator.format("请输入一个介于{0}和{1}之间的值"),
    max        : jQuery.validator.format("请输入一个最大为{0}的值"),
    min        : jQuery.validator.format("请输入一个最小为{0}的值")
});
/*将默认提示中文化end*/

$(document).ready(function () {

  /*初始化swiper*/
    new Swiper('.swiper-container', {
        mousewheelControl: false,
        effect: 'coverflow',    // slide, fade, coverflow or flip
        speed: 300,
        direction: 'vertical',
        allowSwipeToPrev : false,/*禁止向前滚动*/
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




   /*使用vaidate插件来验证表单*/

   /*单独验证手机号码*/
    jQuery.validator.addMethod('tel',function(value,element){
        var telmatch = /^1[0-9]{10}$/;
        return this.optional(element) || (telmatch.test(value));
    },'请输入正确的手机号码');

    $('#demo').validate({
        errorElement: 'span',
        errorClass: 'false',
        validClass: 'right',
        onfocusout: function(element){
            $(element).valid();
        },
        errorPlacement: function(error,element){
            element.parent().next().append(error);
        },
        highlight: function(element, errorClass, validClass) {
            $(element).removeClass('right').addClass('false');
            $(element).parent().next().removeClass('right').addClass('false').find('i').html('亲,');
        },
        success: function(span){
            span.parent().removeClass('false').addClass('right');
            span.prev('.iconfont').html('验证通过');
        },
        rules: {
            username: {
                required: true
            },
            tel: {
                required: true,
                minlength: 11,
                maxlength: 11,
                digits: true
            },

            password: {
                required: true,
                minlength: 8,
                maxlength: 16
            },
            password2: {
                required: true,
                equalTo: '#password',
                minlength: 8,
                maxlength: 16
            },

            sex: {
                required: true
            },

        },
        messages: {
            username: {
                required: '请设置一个用户名'
            },
            email: {
                required: '请输入邮箱'
            },
            password: {
                required: '请设置一个密码',
                minlength: '密码长度不小于8个字符',
                maxlength: '密码长度不大于16个字符'
            },
            password2: {
                required: '请再次确认密码',
                equalTo: '两次输入密码不相同',
                minlength: '密码长度不小于8个字符',
                maxlength: '密码长度不大于16个字符'
            },
            tel: {
                required: '请输入您的常用手机号码',
                minlength: '手机号码长度为11位',
                maxlength: '手机号码长度为11位',
                digits: '手机号码只能输入数字'
            },
            sex: {
                required: '请选择您的性别'
            }
        },
        submitHandler:function(form){
            alert("提交事件!");
            form.submit();
        }
    });

})