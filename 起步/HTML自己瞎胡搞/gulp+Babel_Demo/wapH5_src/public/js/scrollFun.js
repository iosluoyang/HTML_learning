/**
 * Created by hasee on 2016/10/3.
 */


//-------------------------------------滑动加载逻辑-----------------------------------

//声明iscroll全局变量
var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset;
//声明全局变量
var goTop = $(".goTop");

//下拉刷新
function pullDownAction() {
    firstResult= 0;pageSize=10;  //重置分页
    location.reload();//刷新网页
    myScroll.refresh();
}

//滑动加载逻辑
function scrollFun(downAction,upAction) {
    pullDownEl = document.getElementById('pullDown');
    pullDownOffset = pullDownEl.offsetHeight;
    pullUpEl = document.getElementById('pullUp');
    pullUpOffset = pullUpEl.offsetHeight;
    myScroll = new iScroll('wrapper', {
        useTransition: true,
        topOffset: pullDownOffset,
        //监听dom的改变
        checkDOMChanges:true,
        vScrollbar:false,
        onRefresh: function () {
            if (pullDownEl.className.match('loading')){
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }

        },
        onScrollMove: function () {
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '可以松开了喔...';
                this.minScrollY = 0;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '可以松开了喔...';
                this.maxScrollY = this.maxScrollY;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '正在获取更多...';
                downAction();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '正在获取更多...';
                upAction();	// Execute custom function (ajax call?)
            } else if (this.y <= -40 && this.y >= -80) {
                goTop.hide(300);   //回到顶部隐藏返回向上按钮
            } else if (this.y < -window.innerHeight) {
                goTop.show(300);   //滑动结束超过两屏时 显示返回顶部按钮
            }
            //保存位移及分页
            sessionStorage.setItem(getOnlyPath(),JSON.stringify({top:this.y,firstResult:firstResult}));
            console.log(firstResult)
        }
    });


    //------------------------------返回顶部----------------------------------
    goTop.click(function(){
        myScroll.scrollTo(0,0);  //返回顶部
        $(this).hide(500);   //隐藏返回顶部按钮
    });

    $(function() {
        var pageStatus = sessionStorage.getItem(getOnlyPath()),top=0;
        if(pageStatus){
            top = JSON.parse(pageStatus).top;        //获取存储的位移值
        }
        myScroll.scrollTo(0,top);       //返回固定位置

    });
}


//上拉加载
var pullDownFun = function(option) {
    var defaults = {
        container: '',
        next: function() {}
    };
    var start,end, length,
        isLock = false, //是否锁定整个操作
        isCanDo = false, //是否移动滑块
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        hasTouch = 'ontouchstart' in window && !isTouchPad;
    var obj = document.querySelector(option.container);
    var loading = obj.firstElementChild;
    var offset = loading.clientHeight;
    var objparent = obj.parentElement;
    /*操作方法*/
    var fn = {
        //移动容器
        translate: function(diff) {
            obj.style.webkitTransform = 'translate3d(0,' + diff + 'px,0)';
            obj.style.transform = 'translate3d(0,' + diff + 'px,0)';
        },
        //设置效果时间
        setTransition: function(time) {
            obj.style.webkitTransition = 'all ' + time + 's';
            obj.style.transition = 'all ' + time + 's';
        },
        //返回到初始位置
        back: function() {
            fn.translate(0 - offset);
            //标识操作完成
            isLock = false;
        },
        addEvent: function(element, event_name, event_fn) {
            if(element.addEventListener) {
                element.addEventListener(event_name, event_fn, false);
            } else if(element.attachEvent) {
                element.attachEvent('on' + event_name, event_fn);
            } else {
                element['on' + event_name] = event_fn;
            }
        }
    };

    fn.translate(0 - offset);
    fn.addEvent(obj, 'touchstart', start);
    fn.addEvent(obj, 'touchmove', move);
    fn.addEvent(obj, 'touchend', end);
    fn.addEvent(obj, 'mousedown', start);
    fn.addEvent(obj, 'mousemove', move);
    fn.addEvent(obj, 'mouseup', end);

    //滑动开始
    function start(e) {
        if(objparent.scrollTop <= 0 && !isLock) {
            var even = typeof event == "undefined" ? e : event;
            //标识操作进行中
            isLock = true;
            isCanDo = true;
            //保存当前鼠标Y坐标
            start = hasTouch ? even.touches[0].pageY : even.pageY;
            //消除滑块动画时间
            fn.setTransition(0);
            loading.innerHTML = '下拉刷新数据';
        }
        return false;
    }

    //滑动中
    function move(e) {
        if(objparent.scrollTop <= 0 && isCanDo) {
            var even = typeof event == "undefined" ? e : event;
            //保存当前鼠标Y坐标
            end = hasTouch ? even.touches[0].pageY : even.pageY;
            if(start < end) {
                even.preventDefault();
                //消除滑块动画时间
                fn.setTransition(0);
                //移动滑块
                if((end - start - offset) / 2 <= 150) {
                    length = (end - start - offset) / 2;
                    fn.translate(length);
                } else {
                    length += 0.3;
                    fn.translate(length);
                }
            }
        }
    }
    //滑动结束
    function end(e) {
        if(isCanDo) {
            isCanDo = false;
            //判断滑动距离是否大于等于指定值
            if(end - start >= offset) {
                //设置滑块回弹时间
                fn.setTransition(0.5);
                //保留提示部分
                fn.translate(0);
                //执行回调函数
                loading.innerHTML = '正在刷新数据';
                if(typeof option.next == "function") {
                    option.next.call(fn, e);
                }
            } else {
                //返回初始状态
                fn.back();
            }
        }
    }
};





