$(document).ready(function () {
    /*手动创建数据源*/
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
            name:"夏令涛",
            localimg :'images/50.jpg',
            id:50
        },
        {
            name:"魏国松",
            localimg :'images/51.jpg',
            id:51
        },
        {
            name:"陈牧春",
            localimg :'images/52.jpg',
            id:52
        },
        {
            name:"刘春润",
            localimg :'images/53.jpg',
            id:53
        },
        {
            name:"金光新",
            localimg :'images/54.jpg',
            id:54
        },
        {
            name:"王国伟",
            localimg :'images/55.jpg',
            id:55
        },
        {
            name:"周云龙",
            localimg :'images/56.jpg',
            id:56
        },
        {
            name:"沈勇斐",
            localimg :'images/57.jpg',
            id:57
        },
        {
            name:"韩俊洋",
            localimg :'images/58.jpg',
            id:58
        },
        {
            name:"徐雁强",
            localimg :'images/59.jpg',
            id:59
        },
        {
            name:"刘士嶙",
            localimg :'images/60.jpg',
            id:60
        },
        {
            name:"刘路喜",
            localimg :'images/61.jpg',
            id:61
        },
        {
            name:"刘玉芬",
            localimg :'images/62.jpg',
            id:62
        },
        {
            name:"王涛",
            localimg :'images/63.jpg',
            id:63
        },
        {
            name:"商朝",
            localimg :'images/64.jpg',
            id:64
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
            name:"黄雁",
            localimg :'images/80.jpg',
            id:80
        },
        {
            name:"龄子",
            localimg :'images/81.jpg',
            id:81
        },
        {
            name:"蔺洪丹",
            localimg :'images/82.jpg',
            id:82
        },
        {
            name:"张一兵",
            localimg :'images/83.jpg',
            id:83
        },
        {
            name:"王存玉",
            localimg :'images/84.jpg',
            id:84
        },
        {
            name:"孟庆胜",
            localimg :'images/85.jpg',
            id:85
        },
        {
            name:"余留群",
            localimg :'images/86.jpg',
            id:86
        },
        {
            name:"王威",
            localimg :'images/87.jpg',
            id:87
        },
        {
            name:"孙光华",
            localimg :'images/88.jpg',
            id:88
        },
        {
            name:"方清龙",
            localimg :'images/89.jpg',
            id:89
        },
        {
            name:"左道",
            localimg :'images/91.jpg',
            id:91
        },
        {
            name:"肖千",
            localimg :'images/92.jpg',
            id:92
        },
        {
            name:"王淑芹",
            localimg :'images/94.jpg',
            id:94
        },
        {
            name:"许峰",
            localimg :'images/95.jpg',
            id:95
        },
        {
            name:"刘闯",
            localimg :'images/108.jpg',
            id:108
        },


    ];
    var str='';
    for (var i = 0 ;i <artists.length;i++){
        //遍历每一位艺术家
        var artistname = artists[i].name;
        var localimg = artists[i].localimg;//本地图片
        var guanid = artists[i].id;
        var tempstr = "<div class='mengban'><p class='artistname'>"+artistname+"</p><p class='zuopin'>作品</p></div>";

        //设置每一个的宽高(在这里都是小样式)
        var width =  parseInt(($('.content').width() - 2 * 15)/3);//此处宽度取整
        var height = width;
        str+= "<div class='artist'  guanid='"+guanid+"' style='background: url("+localimg+") no-repeat center;background-size: cover; width: "+width +'px' +"; height: "+height +'px' +"'>"+tempstr+"</div>"
    }
    $('.content').append(str);

    //点击每一个艺术家都跳转至相应的主题馆
    $('.content').on('click','.artist',function () {
        var guanid = $(this).attr('guanid');
        //如果是更多则跳转至作品集页面，否则跳转至主题馆
        location.href = jumpUrl.theme + guanid;
    });

})