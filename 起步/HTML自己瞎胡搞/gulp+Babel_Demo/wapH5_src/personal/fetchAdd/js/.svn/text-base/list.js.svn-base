/**
 * Created by hasee on 2017/7/10.
 */


$(function () {
    isLogin(UID,function () {
        //选择自提点
        $(".fetchAddList").on("click","li",function (){
            sessionStorage.setItem(pid+"fromFlag","fetchAdd");
            pidInfo.fetchid = $(this).attr("fetchid");
            pidInfo.fetchName = $(this).find("h3").html();
            sessionStorage.setItem(pid+"pidInfo",JSON.stringify(pidInfo));
            // mainTip(pidInfo.fetchName);
            if(location.href.indexOf("list")>0){      //在列表页面选择后返回确认下单页面
                history.back()
            }else {         //搜索页面 选择地址后返回确认下单页面
                history.go(-2)
            }

        });

        //点击拨打电话
        $(".fetchAddList").on("click",".tel a",function (e){
            e.stopPropagation();
        })
    })

});
var pid =GetQueryString("pid"),pidInfo = JSON.parse(sessionStorage.getItem(pid+"pidInfo")),
    fetchAddList = JSON.parse(sessionStorage.getItem(pidInfo.clMrid+"fetchAdd"));

//获取自提点数据
function getFetchAddData() {
    var fetchAddList = JSON.parse(sessionStorage.getItem(pidInfo.clMrid+"fetchAdd"));
    if(!fetchAddList){         //没有自提地址的缓存 通过后台获取并且缓存
        $.ajax({
            url:clFetchlistUrl,
            data:getAuth()+"info={pid:"+pidInfo.pid+",mrid:"+pidInfo.clMrid+"}",
            async:false,
            success:function (data) {
                if(data.errCode ===0){
                    fetchAddList = data.resultdata.list;
                    //缓存自提地址列表
                    sessionStorage.setItem(pidInfo.mrid+"fetchAdd",fetchAddList);
                }else {tip(data.msg)}
            }
        });
    }
    return fetchAddList
}

//获取自提点列表
function getFetchAddList(pidInfo) {
    var fetchAddList = getFetchAddData(),li = "";
    if(fetchAddList.length>0){
        for(var i=0;i<fetchAddList.length;i++){
            var active="";
            if(fetchAddList[i].id == pidInfo.fetchid){ //有自提点选择过的自提点id一样 需要展现选中的效果
                active="active"
            }
            li+="<li class='"+active+"' fetchid='"+fetchAddList[i].id+"'><h3 class='f16'>"+fetchAddList[i].name+"</h3>" +
                "<p class='address'>"+fetchAddList[i].detailAddress+"</p>" +
                "<p class='time'>"+fetchAddList[i].serviceOntime+"-"+fetchAddList[i].serviceStoptime+"</p>" +
                "<p class='tel'><a class='blue' href='tel:"+fetchAddList[i].mobile+"'>"+fetchAddList[i].mobile+"</a></p></li>"
        }
        $(".fetchAddList").html(li);
    }else {

    }
}

//获取搜索列表
function getFetchAddSearchList(pidInfo,searchStr) {
    var fetchAddList = getFetchAddData(),li = "";
    if(fetchAddList.length>0){  //有地址列表
        for(var i=0;i<fetchAddList.length;i++){
            if(fetchAddList[i].detailAddress.indexOf(searchStr) !== -1){    //搜索只比对详细地址
                var active="";
                if(fetchAddList[i].id == pidInfo.fetchid){ //有自提点选择过的自提点id一样 需要展现选中的效果
                    active="active"
                }
                li+="<li class='"+active+"' fetchid='"+fetchAddList[i].id+"'><h3 class='f16'>"+fetchAddList[i].name+"</h3>" +
                    "<p class='address'>"+fetchAddList[i].detailAddress+"</p>" +
                    "<p class='time'>"+fetchAddList[i].serviceOntime+"-"+fetchAddList[i].serviceStoptime+"</p>" +
                    "<p class='tel'><a class='blue' href='tel:"+fetchAddList[i].mobile+"'>"+fetchAddList[i].mobile+"</a></p></li>"
            }
        }
        if(li.length > 0){          //有搜索结果
            $(".fetchAddList").html(li);
            $(".noData").hide()
        }else {     //没有搜索结果
            $(".fetchAddList").html("");
            $(".noData").show()
        }
    }
}
