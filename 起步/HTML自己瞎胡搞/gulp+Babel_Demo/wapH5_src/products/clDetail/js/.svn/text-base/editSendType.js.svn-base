/**
 * Created by hasee on 2017/4/6.
 */
$(function(){
    //手动自动切换
    $("nav p").click(function(){
        var _this = $(this);
        if(!_this.hasClass("active")){
            _this.addClass("active").siblings().removeClass("active");
            $(".main div[deliveryType]").toggleClass("active")
        }
    });

    var pid = GetQueryString("pid"),pidInfo = JSON.parse(sessionStorage.getItem(pid+"pidInfo"));

    //获取定制计划及总量总价
    getSendPlan(pidInfo);

    if(pidInfo.deliveryType == 1){          //自动
        $("nav p[deliveryType=1]").addClass("active");
        $(".main .tabCont1").addClass("active");
    }else if(pidInfo.deliveryType == 2){    //手动
        $("nav p[deliveryType=2]").addClass("active");
        $(".main .tabCont2").addClass("active");
    }else {tip("deliveryType错误")}


    //周配时添加日期
    $(".main").on("click",".addMore",function(){
        var _this = $(this),li="", index =$(".main .active li").length,
            dateListLength = index+ 4,  //增加4组数据后datelist长度
            enddate=pidInfo.autoDateList[pidInfo.autoDateList.length-1].date;

        if(index == 53){    //超过一年
            tip("最多只能定制一年喔")
        }else {
            if(dateListLength >= pidInfo.autoDateList.length){   //最后一个数据的下标大于或者等于整个datelist的长度 继续请求接口 返回新的日期
                $.ajax({
                    url:clDatelistUrl,
                    async:false,
                    data:getAuth(pidInfo.uid)+"info={pid:"+pidInfo.pid+",type:"+pidInfo.deliveryCycleType+ //type 配送类型1周2月
                    ",deliveryCycle:'"+pidInfo.deliveryCycle+"',enddate:'"+enddate+"',count:12}",
                    success:function(data){
                        if(data.errCode == 0){
                            var list = data.resultdata.list;
                            for(var j=0;j<list.length;j++){
                                pidInfo.autoDateList.push({date:list[j].date,count:0})
                            }
                        }else {tip(data.msg)}
                    }
                });
            }
            for(var i=index;i<dateListLength;i++){
                if(pidInfo.autoDateList[i]){
                    console.log(pidInfo.autoDateList[i].date);9
                    li += "<li><div class='f_right'><span class='minus'></span>" +
                        "<input value='0' class='t_center' type='number' onpaste='return false;' pattern='[0-9]*'>" +
                        "<span class='plus'></span></div>" +
                        "<p><span>" +pidInfo.autoDateList[i].date +"</span><span class='grey6'>0</span>"+pidInfo.units+"</p></li>"
                }
            }
            _this.prev("ul").append(li)
        }
    });


    //---------------------------数量操作------------------------
    //数量输入
    $(".main").on("input propertychange","input",function() {
        var _this = $(this),val = Number(_this.val()),minus = _this.prev(),count = getCount(_this); //现在的总量

        if(val == 0){   //当数量为0 改变减号颜色
            minus.removeClass("canMinus")
        }else {
            minus.addClass("canMinus")
        }

        if(count >=  1 && count < 999){
            if(val > 999) {
                val= String(val).substr(0,3);
            }else if(val< 0 || val==""){
                val= 0;
            }
            _this.val(val);
            _this.parents("li").children("p").children("span").eq(1).html(val);
            getSumNumAndSumPrice(count,_this,pidInfo.priceList);
        }else if(count < 1){
            _this.val(1);
            tip("最少选择一个商品")
        }else{
            val =val + 999 - count;
            _this.val(val);
            _this.parents("li").children("p").children("span").eq(1).html(val);
            count = getCount(_this);
            getSumNumAndSumPrice(count,_this,pidInfo.priceList);
        }

    });

    //数量减
    $(".main").on("click",".minus",function() {
        var _this = $(this),val = Number(_this.next().val()),count = getCount(_this); //现在的总量
        if( count > 1){
            if(val > 0){
                val--;    //单个配送日期数量--
                count--; //总量--
                if(val == 0){   //当数量为1 改变减号颜色
                    _this.removeClass("canMinus")
                }
                _this.next().val(val);
                _this.parents("li").children("p").children("span").eq(1).html(val);
                getSumNumAndSumPrice(count,_this,pidInfo.priceList);
            }
        }else {
            tip("最少选择一个商品")
        }
    });

    //数量加
    $(".main").on("click",".plus",function() {
        var _this = $(this),val = Number(_this.prev().val()),minus =  _this.prev().prev(),count = getCount(_this); //现在的总量
        if(!minus.hasClass("canMinus")){    //改变减号的默认效果
            minus.addClass("canMinus")
        }
        if(count < 999 &&  val <999){
            val++;
            count++;
            _this.prev().val(val);
            _this.parents("li").children("p").children("span").eq(1).html(val);
            getSumNumAndSumPrice(count,_this,pidInfo.priceList);
        }else{tip("商品的数量太多了喔~")}
    });
    //----------------------------------------------------------------------

    //完成
    $(".bot").click(function(){
        var deliveryType = $("nav .active").attr("deliveryType"),//配送方式 1自动 2手动
            pDom = $(".main .active p"),pLength =pDom.length;
        if(deliveryType == 1){      //配送方式 1自动
            for(var i=0;i<pLength;i++){ //比对日期 修改数量
                if(pDom.eq(i).children().eq(0).html() == pidInfo.autoDateList[i].date){
                    pidInfo.autoDateList[i].count = pDom.eq(i).children().eq(1).html()
                }
            }
        }else if(deliveryType == 2){//配送方式 2手动

            //获取已配置手动配送数量
            //默认日期长度为已取配送日期的长度
            var dateLength = pidInfo.autoDateList.length,length = Math.floor(pidInfo.sumCount/dateLength);
            for(var k=0;k<dateLength;k++){
                pidInfo.autoDateList[k].count = length;
            }
            var yuShu = +pidInfo.sumCount%dateLength;
            for(var j=0;j<yuShu;j++){
                pidInfo.autoDateList[j].count ++;
            }

            //第一个日期的数量为选择的数量
            pidInfo.handleDateList.count = pDom.eq(0).children().eq(1).html()
        }

        pidInfo.deliveryType = $("nav .active").attr("deliveryType");
        pidInfo.sumCount =  $(".main .active h3 span:first").html();
        pidInfo.sumPrice =  $(".main .active h3 span:last").html();
        pidInfo.editFlag = true;
        sessionStorage.setItem(pid+"pidInfo",JSON.stringify(pidInfo));//设置配送方式
        history.back();
    });

});


//获取定制计划及总量总价
function  getSendPlan(pidInfo){
    //获取总量总价
    $(".main h3").html("总量 <span>"+pidInfo.sumCount+"</span>"+pidInfo.units+" 合计：<span>"+pidInfo.sumPrice+"</span>元");
    //自动配送
    var li="",dateLength = pidInfo.autoDateList.length;//默认日期长度为已取配送日期的长度

    if(pidInfo.deliveryType == 1 && pidInfo.deliveryCycleType == 1 ){//deliveryCycleType 1周配 2月配  //deliveryType 1自动 2手动 当自动配送时 日期长度取最后一个有数据的日期下标
        dateLength = pidInfo.dateIndex+1;//dateIndex 详情页面最后一个数据的下标
    }


    if(pidInfo.deliveryCycleType == 1 ){//deliveryCycleType 1周配 2月配
        $(".main .tabCont1").append("<div class='addMore red'>新增配货日期</div>");

    }else if(pidInfo.deliveryCycleType == 2 ){  //月配

    }

    if(pidInfo.deliveryType == 1 ){//自动

    }else if(pidInfo.deliveryType == 2){//手动
        var length = Math.floor(pidInfo.sumCount/dateLength);
        for(var k=0;k<dateLength;k++){
            pidInfo.autoDateList[k].count = length;
        }
        var yuShu = +pidInfo.sumCount%dateLength;
        for(var j=0;j<yuShu;j++){
            pidInfo.autoDateList[j].count ++;
        }
    }


    for(var i=0;i<dateLength;i++){
        li += "<li><div class='f_right'><span class='minus canMinus'></span>" +
            "<input value='"+pidInfo.autoDateList[i].count+"' class='t_center' type='number' onpaste='return false;' pattern='[0-9]*'>" +
            "<span class='plus'></span></div>" +
            "<p><span>" +pidInfo.autoDateList[i].date +"</span><span class='grey6'>"+pidInfo.autoDateList[i].count+"</span>"+pidInfo.units+"</p></li>"
    }
    $(".main .tabCont1 ul").append(li);

    //手动配送
    $(".main .tabCont2 li:first input").val(pidInfo.handleDateList.count);
    $(".main .tabCont2 li:first p").html("<span>"+pidInfo.handleDateList.date +"</span><span class='grey6'>"+pidInfo.handleDateList.count+"</span>"+pidInfo.units);
    $(".main .tabCont2 li:last input").val(pidInfo.sumCount-pidInfo.handleDateList.count);
    $(".main .tabCont2 li:last p").html("<span>未指定配货日期</span><span class='grey6'>"+(pidInfo.sumCount-pidInfo.handleDateList.count)+"</span>"+pidInfo.units)

}

//修改数量后获取总量总价
function getSumNumAndSumPrice(count,_this,priceList){
    var sumNumDom = _this.parents("div").children("h3").children("span").eq(0),
        sumPriceDom = _this.parents("div").children("h3").children("span").eq(1);
        sumNumDom.html(count);
        sumPriceDom.html((count*getPrice(count,priceList)).toFixed(2))
}

//获取总量
function getCount(_this){
    var sumNum=0,inputArr= _this.parents("ul").find("input");
    for(var i=0;i<inputArr.length;i++){
        sumNum += Number(inputArr.eq(i).val())
    }
    return sumNum
}

//根据数量获取单价
function getPrice(count,priceList){
    var price;
    count = Number(count);
    var priceListLength = priceList.length;
    if(priceListLength > 1){    //多个价格
        for(var i=1;i<priceListLength;i++){
            if(count > priceList[priceListLength-1].count){
                price = priceList[priceListLength-1].price;
                break
            }else if(count <= priceList[i].count){
                price = priceList[i-1].price;
                break
            }
        }
    }else{
        price = priceList[0].price;
    }
    return price
}



