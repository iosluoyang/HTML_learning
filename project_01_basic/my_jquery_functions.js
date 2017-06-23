/**
 * Created by haiyang on 2017/6/20.
 */
$(document).ready(function () {

    /*点击所有的P标签，P标签自己隐藏起来*/
    /* $('p').click(function () {
        $(this).hide();
    })*/

    /*点击class为imgbg的div时隐藏对应的元素*/
    /*$('div.imgbg').click(function () {
        $(this).hide(1000);
    })*/

    /*点击小海哥浮标事件*/
    $('div#drogue').click(function () {
        //获取当前的标题
        var currenttitle = $('div#drogue').text();
        //设置为小海妹
        if (currenttitle == '小海哥'){
            $('div#drogue').text('小海妹');
            $('div#drogue').css('background-color','pink');
        }
        //设置为小海哥
        else{
            $('div#drogue').text('小海哥');
            $('div#drogue').css('background-color','coral');
        }

        var presentstr = '知道你舍不得科比退役，知道你看到老大在最后一场比赛拿了60分泪流满脸，知道你看的不仅仅是球，更是你的青春，那些篮球场上挥汗如雨的瞬间，' +
            '那些无忧无虑，只要踏上篮球场就可以肆无忌惮的时光~~~可是，当蜗壳说出那句Mamba Out的时候，我想你也一定是心怀祝福，勇敢前行吧。少年，无论如何,'+
            '收拾起你的行囊，带着勇气，继续往前走吧，少年路，莫回头！';
        alert(presentstr)
    })
    /**/
    //点击查看/隐藏获奖记录的按钮时来回切换显示和隐藏获奖内容的div
    $('button.loadallarticles').click(function () {
        //来回切换显示和隐藏获奖内容的div
       /* $('div.imgbg').toggle(1000);*/
        //来回切换淡入或淡出获奖内容的div
       /*$('div.imgbg').fadeToggle(1000);*/
        //来回切换向上滑动和向下滑动获奖内容的div
        $('div.imgbg').slideToggle(1000);
        var btntitle = $("button.loadallarticles").text();
        if (btntitle == '点击展开'){
            $('button.loadallarticles').text("合起");
        }
        else{
            $('button.loadallarticles').text('点击展开');
        }

    })

    //检查昵称是否正确，如果正确，则右侧显示相应文本
    $('button.checknicknamebtn').click(function () {
        //拿到昵称对应的输入值
      var nickname =  $('input#name').val();
      if (nickname != null && nickname != ""){
          $('b#shownickname').text('恭喜,昵称:' + "'" + nickname + "'" + '可以使用!');
      }
      else{
          $('input#name').val('狂拽炫酷屌炸天');
          $('b#shownickname').text('知道你懒得写，就帮你想了一个好名字-狂拽炫酷屌炸天');
      }
    })

    //检查手机号码是否正确，如果正确，则右侧显示相应文本
    $('button.checkphonenumbtn').click(function () {
        //拿到手机号对应的输入值
        var phonenum = $('input#phonenum').val();
        //进行判断
        if(phonenum ==""||isNaN(x))
        {
            $('input#phonenum').val('18818881888');
            $('b#showphonenum').text('哎，就知道你懒得写手机号，还写个错的，这样吧，我帮你想一个，18818881888，这个厉害吧');
        }
        else{
            $('b#showphonenum').text('厉害了,这个:' + phonenum + '手机号厉害了！！');
        }

    })

    /*根据选择的颜色改变表单的背景颜色*/
    $('button#changebgcolor').click(function () {
        //选择的颜色
        var selectcolor = $('input#likecolor').val();
        //设置背景颜色
        $('div#mambaask').css('background-color',selectcolor);
    })

    /*点击添加或删除元素*/
    $('button#addordeleteelement').click(function () {

        //首先判断添加的P标签的个数
        var addparr = $('p.addp');
        //如果数量等于1个则进行删除，否则进行添加
        if (addparr.length == 1 ){
            //删除元素
            $('p.addp').remove();
            //删除完之后再进行一次判断，如果数量 == 0 则变按钮标题
            var addparr1 = $('p.addp');
            if (addparr1.length == 0){
                $('button#addordeleteelement').text('点击发现更多惊喜');
            }
        }
        else {
            //在黑曼巴之问内的最后面添加新的元素（P标签）
            /*$('div#mambaask').append('<p class="addp">哈哈，惊喜吧，我是用JS追加的元素哦</p>')*/

            //在黑曼巴之问元素后面添加新的元素（P标签）
            $('div#mambaask').after('<p class="addp">哈哈，惊喜吧，我是用JQ追加的元素哦</p>')

            //添加完之后再进行一次判断，如果数量 == 1 则变按钮标题
            var addparr2 = $('p.addp');
            if (addparr2.length == 1){
                $('button#addordeleteelement').text('点击隐藏惊喜');
            }
        }






    })

    /*点击删除页面内的P标签元素*/
    $('button#deletePelement').click(function () {

        var r = confirm("万水千山总是情，给点活路行不行?" + '\n' + "你确定要把我给删了?")
        if (r == true){
            //删除P标签
            $('p').remove();
        }
        else{
            //点击了取消
            var name = prompt("大侠可否告知我你的名字?","炫酷屌炸天的我~~")
            if (name != null && name != ""){
                alert("多谢" + name +"手下留情" + '\n' + "我们萍水相逢!")
            }
            else{
                alert("多谢无名大侠手下留情" + '\n' + "我们萍水相逢!")
            }

        }
    })

})