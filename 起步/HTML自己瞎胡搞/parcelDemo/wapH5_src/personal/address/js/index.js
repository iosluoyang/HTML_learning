/**
 * Created by hasee on 2016/10/27.
 */




var indexAddress = $("#indexAddress"),receiverName=$("#receiverName"),
    receiverMobile = $("#receiverMobile"),detailAddress=$("#detailAddress"),
    addList = $(".addList"),
    addAddress = $(".addAddress"),
    setMoRen = $(".setMoRen"),
    del = $(".del");
$(function(){


    var from = GetQueryString("from"),pid=GetQueryString("pid") || "";

    isLogin(UID,function(){


        if(from == "clDetail"){   //定制生活


            //获取地址数据
            $.ajax({
                url:clReceAddreUrl,
                data:getAuth()+"info={pageSize:5000,firstResult:0,uid:'"+UID+"',pid:'"+pid+"'}",
                success:function(data){
                    if(data.errCode == 0){
                        //生成地址列表
                        addressIndex(data.resultdata.list)
                    }else {tip(data.msg)}

                }
            });

            //选择地址
            addList.on("click","li",function(){
                var _this = $(this);
                if(_this.hasClass("rangflag")){     //超出配送范围
                    tip("超出配送范围")
                }else{
                    if(_this.attr("isModify") == 0){    //没有修改过
                        tip("该地址需完善")
                    }else {
                        sessionStorage.setItem("clMrid", _this.attr("mrid"));
                        sessionStorage.setItem(pid+"fromFlag","addList");
                        //当前页面重置为确认下单页面
                        location.replace(jumpUrl.clMakeSureOrder+pid+"&from=addList")
                    }
                }

            });
        }else {

            //获取地址数据
            $.ajax({
                url:receAddreUrl,
                data:getAuth()+"info={pageSize:5000,firstResult:0,uid:'"+UID+"'}",
                success:function(data){
                    if(data.errCode == 0){
                        //生成地址列表
                        addressIndex(data.resultdata)
                    }else {tip(data.msg)}

                }
            });


            if(from == "group"){        //拼团的订单
                document.title = "社区拼团";
                //选择地址
                addList.on("click","li",function(){
                    var _this = $(this);
                    if(_this.attr("isModify") == 0){    //没有修改过
                        tip("该地址需完善")
                    }else {
                        var mrid = _this.attr("mrid");
                        //二次确认
                        confirmShow({
                            title:"提示",
                            content:"发起团购社区为："+getGroupVidName(sessionStorage.getItem("groupVid"))+"；请核对地址联系社长或到自提点自取！",
                            makeSure:function(){
                                sessionStorage.setItem("mrid",mrid);
                                history.back();
                            }
                        })
                    }

                });
            }else if(from =="native"){      //原产优品的订单
                //选择地址
                addList.on("click","li",function(){
                    var _this = $(this);
                    if(_this.attr("isModify") == 0){    //没有修改过
                        tip("该地址需完善")
                    }else {
                        var mrid = _this.attr("mrid");
                        sessionStorage.setItem("mrid",mrid);
                        history.back();
                    }

                });
            }

        }
    });








    //添加地址
    $(".add").click(function(){
        $("input").val("");                 //清空地址
        indexAddress.html("");        //清空地址
        addAddress.attr("mrid","");           //设置mrid
        setMoRen.parent().hide();     //隐藏设置默认
        del.parent().hide();          //隐藏删除
        tab();                               //显示编辑地址区域
    });


    //编辑地址
    addList.on("click",".edit",function(e){
        e.stopPropagation();
        var li = $(this).parent();
        addAddress.attr("mrid",li.attr("mrid"))              //设置mrid
            .attr("province_id",li.attr("province_id")|| "")      //设置省编码 默认为空
            .attr("city_id",li.attr("city_id")|| "")             //设置市编码 默认为空
            .attr("district_id",li.attr("district_id")||"");     //设置区编码 默认为空

        setMoRen.parent().show();     //显示设置默认
        del.parent().show();          //显示设置默认

        receiverName.val(li.children(".user").children().eq(0).html());       //获取用户名
        receiverMobile.val(li.children(".user").children().eq(1).html());     //获取联系方式
        var address = li.children(".address").html().split(",");
        if(address.length == 1){        //没有省市区 只有详细地址
            indexAddress.html("");                                        //获取地区
            detailAddress.val(address[0]);                                        //获取详细地址
        }else {
            indexAddress.html(address[0]);                                        //获取地区
            detailAddress.val(address[1]);                                        //获取详细地址
        }
        tab();                               //显示编辑地址区域
    });


    //设置为默认地址
    setMoRen.click(function () {
        setAdress({"uid": UID, "mrid": addAddress.attr("mrid")}, UpdateIsDefaultUrl)
    });

    //删除地址
    del.click(function () {
        setAdress({"mrid": addAddress.attr("mrid"),"uid":UID}, delAddressUrl)
    });

    //添加地址 编辑旧地址
    $(".save").click(function () {
        if(addAddress.attr("mrid")){         //存在地址编号 编辑旧地址
            changeAdress(addAddress.attr("mrid"), updateAddressUrl)
        }else {                             //不存在地址编号 编辑新地址
            changeAdress(null, addAddressUrl)
        }
    });

    //----------------------------------省市区选择效果--------------------------------------------
    var nameEl = document.getElementById('indexAddress');

    var first = []; /* 省，直辖市 */
    var second = []; /* 市 */
    var third = []; /* 镇 */

    var checked = [0, 0, 0]; /* 已选选项 */
    var city = "";
    $.ajax({
        type: "get",
        url: "address.json",
        async: false,
        success: function(data) {
            city = data.provinces
        }
    });


    //创建省市区
    creatList(city, first);

    if(city[0].hasOwnProperty('citys')) {
        creatList(city[0].citys, second);
    } else {
        second = [{
            text: '',
            value: 0
        }];
    }

    if(city[0].citys[0].hasOwnProperty('districts')) {
        creatList(city[0].citys[0].districts, third);
    } else {
        third = [{
            text: '',
            value: 0
        }];
    }

    var picker = new Picker({
        data: [first, second, third],
        selectedIndex: [0, 0, 0],
        title: '地址选择'
    });

    picker.on('picker.select', function(selectedVal, selectedIndex) {
        var text1 = first[selectedIndex[0]].text,
            id1 = first[selectedIndex[0]].value;
        var text2 = second[selectedIndex[1]].text,
            id2 = second[selectedIndex[1]].value;
        var text3="",id3="";
        if(third[selectedIndex[2]] ){
            text3 = third[selectedIndex[2]].text;
            id3 = third[selectedIndex[2]].value;
        }
        nameEl.innerHTML = text1 + ' ' + text2 + ' ' + text3;
        addAddress.attr("province_id",id1).attr("city_id",id2).attr("district_id",id3)
    });

    picker.on('picker.change', function(index, selectedIndex) {
        if(index === 0) {
            firstChange();
        } else if(index === 1) {
            secondChange();
        }

        function firstChange() {
            second = [];
            third = [];
            checked[0] = selectedIndex;
            var firstCity = city[selectedIndex];
            if(firstCity.hasOwnProperty('citys')) {
                creatList(firstCity.citys, second);
                var secondCity = city[selectedIndex].citys[0];
                if(secondCity.hasOwnProperty('districts')) {
                    creatList(secondCity.districts, third);
                } else {
                    third = [{
                        text: '',
                        value: 0
                    }];
                    checked[2] = 0;
                }

            } else {
                second = [{
                    text: '',
                    value: 0
                }];
                third = [{
                    text: '',
                    value: 0
                }];
                checked[1] = 0;
                checked[2] = 0;
            }

            picker.refillColumn(1, second);
            picker.refillColumn(2, third);
            picker.scrollColumn(1, 0);
            picker.scrollColumn(2, 0)
        }

        function secondChange() {
            third = [];
            checked[1] = selectedIndex;
            var first_index = checked[0];
            if(city[first_index].citys[selectedIndex].hasOwnProperty('districts')) {
                var secondCity = city[first_index].citys[selectedIndex];
                creatList(secondCity.districts, third);
                picker.refillColumn(2, third);
                picker.scrollColumn(2, 0)
            } else {
                third = [{
                    text: '',
                    value: 0
                }];
                checked[2] = 0;
                picker.refillColumn(2, third);
                picker.scrollColumn(2, 0)
            }
        }

    });

    //picker.on('picker.valuechange', function(selectedVal, selectedIndex) {
    //    console.log(selectedVal);
    //
    //});

    //显示省市区选择插件
    nameEl.addEventListener('click', function() {
        picker.show();
        //选择省市区时 回显省市区 为空时 默认选择第一项
        //var province_id = addAddress.attr("province_id") || 0,
        //    city_id = addAddress.attr("city_id") || 0,
        //    district_id = addAddress.attr("district_id") || 0;

        //picker.selectedIndex = [first.returnIndex(province_id),
        //    second.returnIndex(city_id),
        //    third.returnIndex(district_id)];

        //console.log(second.returnIndex(city_id)+","+third.returnIndex(district_id))
    });

    //Array.prototype.returnIndex = function(value){
    //    if(value == 0){
    //        return 0
    //    }else {
    //        for(var i=0;i<this.length;i++){
    //            if(this[i].value == value){
    //                return i;
    //                break
    //            }
    //        }
    //    }
    //}



});

//地址列表逻辑
function addressIndex(addListArr) {
    addList.empty();
    var addListLi = "";
    for (var i = 0; i < addListArr.length; i++) {
        var isDefault = "",rangflag="",detailAddress = addListArr[i].detailAddress;
        if (addListArr[i].isDefault == 1) {  //是否为默认 1是默认 0否
            isDefault = "<img class='isDefault f_left'  src='../../public/images/personal/moRen.png'>"
        }

        if(addListArr[i].rangflag == 1){   //rangflag	是否超出配送范围0否1是
            rangflag = "rangflag"
        }

        if(addListArr[i].isModify == 0){     //是否修改，0未修改1修改
            //没有修改 不需要省市区 取详细地址
            detailAddress = addListArr[i].addressSuffix
        }

        addListLi += "<li class='"+rangflag+"' mrid='" + addListArr[i].mrid + "' isModify='"+addListArr[i].isModify+"'" +
            "province_id='" + addListArr[i].province_id + "' city_id='" + addListArr[i].city_id + "' district_id='" + addListArr[i].district_id + "'>" +
            "<div class='edit'></div>" +
            "<p class='oneClamp user'><span class='f15'>" + addListArr[i].receiver + "</span><span class='grey9 f14'>" + addListArr[i].receiverMobile + "</span></p>" +
            isDefault +"<p class='address grey9 f14'>" + detailAddress + "</p></li>"
    }
    addList.append(addListLi)
}

//删除、设置默认地址
function setAdress(info,url){
    $.ajax({
        url:url,
        data:getAuth()+"info="+JSON.stringify(info),
        success:function(data){
            if(data.errCode == 0){  //添加或者成功
                //获取地址数据
                $.ajax({
                    url:receAddreUrl,
                    data:getAuth()+"info={pageSize:5000,firstResult:0,uid:'"+UID+"'}",
                    success:function(data){
                        //生成地址列表
                        location.reload();
                        //addressIndex(data.resultdata);
                        //
                        //addList.show();
                        //addAddress.hide();
                        //$(".add").show();
                        //$(".save").hide();

                    }
                });
            }else{mainTip(data.msg)}          //添加失败
        }
    })
}

//保存或者修改地址
function changeAdress(mrid,url){
    //获取填写数据
    var province_id = addAddress.attr("province_id"),
        city_id=addAddress.attr("city_id"),
        district_id=addAddress.attr("district_id"),
        reg = /^1[34578]\d{9}$/;     //验证手机格式
    //验证
    if(!receiverName.val()){   //姓名为空
        mainTip("请填写收货人");
    }else if(!receiverMobile.val()){    //手机号码为空
        mainTip("请填写手机号码");
    }else if(!indexAddress.html()){    //小区地址为空
        tip("请填写小区地址")
    }else if(!detailAddress.val()){    //详细地址为空
        mainTip("请填写详细地址")
    }else{   //都不为空
        if(!reg.test(receiverMobile.val())){   //验证手机号码
            mainTip("请填写正确的手机号码");
        }else{   //添加地址
            var info = {
                uid:UID,
                receiver: receiverName.val(),                            //名字
                mobile: receiverMobile.val(),                            //电话
                address_prefix: indexAddress.html(),                  //省市区
                address_suffix: detailAddress.val(),                  //详细地址
                address: indexAddress.html()+","+ detailAddress.val(),         //地址
                province_id:province_id,                    //省编号
                city_id:city_id,                            //市编号
                district_id:district_id,                    //区编号
                isDefault:""                                //是否默认:0 不是 1是 空为非默认
            };
            if(mrid){   //存在mrid   是编辑地址  需要mrid
                info.mrid = mrid
            }
            console.log(info);
            setAdress(info,url)
        }
    }
}

//切换地址列表及编辑地址区域
function tab(){
    addList.hide();
    addAddress.show();
    $(".add").hide();
    $(".save").show();
}

function creatList(obj, list) {
    obj.forEach(function(item, index, arr){
        var temp ={
            text :item.provinceName || item.cityName || item.dictrictName,
            value : item.districtId || item.cityId || item.provinceId
        };
        list.push(temp);
    })
}


//function getClAddList(addListArr){
//    addList.empty();
//    var addListLi = "";
//    for(var i=0;i<addListArr.length;i++){
//        var isDefault = "";
//        if (addListArr[i].isDefault == 1) {  //是否为默认 1是默认 0否
//            isDefault = "<img class='isDefault f_left'  src='../../public/images/personal/moRen.png'>"
//        }
//        addListLi += "<li mrid='" + addListArr[i].mrid + "' province_id='" + addListArr[i].province_id + "' " +
//            "city_id='" + addListArr[i].city_id + "' district_id='" + addListArr[i].district_id + "'>" +
//            "<div class='edit f_right'></div>" +
//            "<p class='oneClamp user'><span class='f15'>" + addListArr[i].receiver + "</span><span class='grey9 f14'>" + addListArr[i].receiverMobile + "</span></p>" +
//            isDefault +"<p class='address grey9 f14'>" + addListArr[i].detailAddress + "</p></li>"
//    }
//    addList.append(addListLi)
//}

