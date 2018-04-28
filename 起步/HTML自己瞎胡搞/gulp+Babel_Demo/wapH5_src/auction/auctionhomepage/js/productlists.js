//全局参数
var fromsign = GetQueryString('fromsign') || '';//该链接的来源  1 从首页一级分类入口  2从分类列表中的二级分类入口 3从开拍预告入口  4从首页搜索入口 默认为空字符串 本页面无实质性用途,主要用于让原生标识区别不同界面
/*
注意: 关于该页面的所有指定地方的定向锚,通过下面的指定字段来获取,不根据上面的页面标识,标识只是起到区别不同拍品展示样式的作用
也就是说,标识和相应的字段均需要前端进行传递
*/
var name = GetQueryString("name") || '';//搜索列表中的搜索关键字
var firstTypeId = GetQueryString("firstTypeId") || '';//一级分类的ID
var reqType = GetQueryString("reqType") || '';//请求拍品列表的来源  1代表拍品预告 其他的不传即可
var sortType = GetQueryString("sortType") || '1';//当前选中的排序规则的id,默认为sortType = 1 表示选中默认排序
var subTypeId = GetQueryString("subTypeId") || '';//当前选中的二级类目的id,默认为subTypeId为空字符串 表示默认选中全部
var uid = GetQueryString("uid") || UID;//用户ID 如果未登录则为空字符串
var auctionstate = GetQueryString('auctionstate') || '';//当前选中的拍卖状态  0即将开始 1进行中 2已结束 空字符串未选择
var auctionstarttime = GetQueryString('auctionstarttime') || '';//当前的选中的开拍时间 1最近1天开拍 2最近3天开拍 3最近5天开拍 4最近7天开拍 空字符串带代表未选择




//筛选选项Table(包含排序规则,二级类目分类和更多一级四级分类的展示区域)
class FliterTable extends React.Component{
    //设置默认参数
    static defaultProps = {

        type:null,//筛选选项Table的类型  1代表默认排序  2代表二级类目  3代表更多  4代表四级分类页面
        selectId:"",//当前选中的筛选项的id 这里暂时使用排序筛选默认项
        auctionstate:auctionstate,//拍卖状态
        auctionstarttime:auctionstarttime,//开拍时间
        beginPrice:"",//最低价 默认空字符串
        endPrice:"",//最高价 默认空字符串
        dataArr:[],//当前筛选项的数据源

    };

    constructor(props){
        super(props);
        this.state = {
            auctionstate:this.props.auctionstate,//拍卖状态
            auctionstarttime:this.props.auctionstarttime,//开拍时间
            beginPrice:this.props.beginPrice,//最低价
            endPrice:this.props.endPrice,//最高价
        };
    }

    //点击了默认排序或者类目的蒙版
    clickmaskdiv(event){

        //阻止冒泡事件的传递
        event.stopPropagation();

        //点击了蒙版
        this.props.clicktablemask();
    }
    //点击了更多的空白区域
    clicktable3maskdiv(event){
        //阻止冒泡事件的传递
        event.stopPropagation();
        console.log('点击了更多选项的空白区域');
    }

    //点击排序选项
    clickfliteritembysorttype(infodic,event){
        //阻止冒泡事件的传递
        event.stopPropagation();

        //使用状态提升将选中的选项提升到父组件中进行全局控制
        this.props.fliteritemchange(infodic);

    }

    //点击二级分类选项
    clickfliteritembytypeId(infodic,event){
        //阻止冒泡事件的传递
        event.stopPropagation();

        //使用状态提升将选中的选项提升到父组件中进行全局控制
        this.props.fliteritemchange(infodic);
    }

    //点击四级参数分类中的选项
    clickfliteritembycontentId(infodic,event){
        //阻止冒泡事件的传递
        event.stopPropagation();

        //使用状态提升将选中的选项提升到父组件中进行全局控制
        this.props.fliteritemchange(infodic);
    }

    //点选拍卖状态的标签的时候
    clickstatustag(tagdic,event){

        //阻止冒泡事件的传递
        event.stopPropagation();

        //点击了某个拍卖状态标签
        var title = tagdic.title;//标签内容
        var pstatus = tagdic.pstatus;//标签id

        //当前选择的状态标签id
        var currentstateId = this.state.auctionstate;
        //如果当前点击的标签和当前已经选择的状态标签一致的话说明用户是想取消选中该标签,直接重置状态auctionstate为空字符串即可 注意这里的比较要先转化为字符串再进行比较,否则0和空字符串会相等
        var tostatus = currentstateId.toString() == pstatus.toString() ? "" : pstatus;
        //更新state
        this.setState({
            auctionstate:tostatus,
        });

    }
    //点选开始时间标签的时候
    clicktimetag(tagdic,event){
        //阻止冒泡事件的传递
        event.stopPropagation();


        //点击了某个开始时间标签
        var title = tagdic.title;//标签内容
        var dateNum = tagdic.dateNum;//标签id

        //当前选择的时间标签id
        var currentstarttime = this.state.auctionstarttime;
        //如果当前点击的标签和当前已经选择的时间标签一致的话说明用户是想取消选中该标签,直接重置状态auctionstarttime为空字符串即可 这里的比较要先转化为字符串再进行比较,否则0和空字符串会相等
        var tostarttime = currentstarttime.toString() == dateNum.toString() ? "" : dateNum;
        //更新state
        this.setState({
            auctionstarttime:tostarttime,
        });

    }

    //输入价格的时候
    handleprice(event){
        //阻止冒泡事件的传递
        event.stopPropagation();


        //根据当前的输入框获取到最低价和最高价
        var beginprice = this.refs.beginprice.value || "";
        var endprice = this.refs.endprice.value || "";

        this.setState({
            beginPrice:beginprice,//最低价
            endPrice:endprice,//最高价
        });

    }

    //点击重置按钮的事件
    clickreset(event){
        //阻止冒泡事件的传递
        event.stopPropagation();

        //将选择的状态id 开始时间id以及最低最高价全部重置为页面默认的即可
        this.setState({

            auctionstate:auctionstate,//拍卖状态
            auctionstarttime:auctionstarttime,//开拍时间
            beginPrice:'',//最低价
            endPrice:'',//最高价

        });
    }

    //点击确认按钮
    clicksurebtn(event){
        //阻止冒泡事件的传递
        event.stopPropagation();

        //首先判断价格区间中最高价是否低于最低价,如果低于,则弹出提示
        var beginprice = this.state.beginPrice;
        var endprice = this.state.endPrice;
        if (parseFloat(beginprice) > parseFloat(endprice)){
            mainTip("前置区间金额不可大于后置区间金额，请重新输入");
            return;
        }



        //点击了确定按钮 将该筛选面板上的数据提升至父组件中
        var currentstate = this.state.auctionstate;
        var currentstarttime = this.state.auctionstarttime;
        var currentbeginprice = this.state.beginPrice;
        var currentendprice = this.state.endPrice;

        //将参数提升状态进行函数回调
        this.props.clicksurebtn(currentstate,currentstarttime,currentbeginprice,currentendprice);

    }

    //当筛选table被挂载的时候设置body不可以滚动
    componentDidMount(){
        $('body').css('overflow','hidden');/*让body不可以滚动*/
    }
    //当组件被卸载的时候让body恢复滚动
    componentWillUnmount(){
        $('body').css('overflow','auto');/*让body可以滚动*/
    }



    render(){

        var type = this.props.type;
        var dataArr = this.props.dataArr;

        //如果是type为123则为顶部筛选table,该筛选table的距上距离为fliterheader的高度+fliterarea1距上的距离之和
        //如果是type为4则说明为四级分类参数的table,该筛选table的距上距离为fliterarea1的高度+fliterarea1距上的距离之和
        var tabletopvalue = type == '4' ? $('.fliterarea1').outerHeight(true) + parseInt($('.fliterarea1').css('top')) + 0.5 :  $('.fliterheader').outerHeight(true) + parseInt($('.fliterarea1').css('top')) + 0.5;
        var masktablestyle = {
            width:"100%",
            position:"fixed",
            zIndex:"9",//要比fliterheader的z-index高,这样才能保证在fliterheader的上面
            top:tabletopvalue,
            bottom:"0px",
            background: "rgba(0,0,0,0.6)",//背景颜色及透明度
        };

        //排序
        if (type == "1" && dataArr.length > 0){

            var elementsArr = [];
            for (var index in dataArr){

                //筛选项
                var infodic = dataArr[index];
                //名称
                var title = infodic.title;
                //对应id
                var sortType = infodic.sortType;

                //如果当前选中的sortType和该sortType相同,说明该选项要被选中
                var element = <p className={sortType == this.props.selectId ? "selectfliteritem" : "fliteritem"} key={sortType} onClick={this.clickfliteritembysorttype.bind(this,infodic)}>{title}</p>;

                elementsArr.push(element);

            }

            return (
                <div className="maskdiv" style={masktablestyle} onClick={this.clickmaskdiv.bind(this)}>
                    <div className="flitertable1div" style={{height:"22rem",overflow:"scroll",}}>
                        {elementsArr}
                    </div>
                </div>


            );

        }

        //二级类目
        else if (type == "2" && dataArr.length > 0){

            var elementsArr = [];
            for (var index in dataArr){

                //筛选项
                var infodic = dataArr[index];
                //名称
                var title = infodic.typeName;
                //对应id
                var typeId = infodic.typeId;

                //如果当前选中的sortType和该sortType相同,说明该选项要被选中
                var element = <p key={typeId} onClick={this.clickfliteritembytypeId.bind(this,infodic)} className={typeId == this.props.selectId ? "selectfliteritem" : "fliteritem"}>{title}</p>;

                elementsArr.push(element);

            }

            return (
                <div className="maskdiv" style={masktablestyle} onClick={this.clickmaskdiv.bind(this)}>
                    <div className="flitertable2div" style={{height:"22rem",overflow:"scroll",}}>
                        {elementsArr}
                    </div>
                </div>
            );

        }

        //更多
        else if(type == '3' && dataArr.length > 0){


            var sectionsArr = [];

            for (var index in dataArr){

                var sectiondic = dataArr[index];
                var tagsdiv = null;
                var sectiontitlestyle = {
                    width:"100%",
                    height:"5.3rem",
                    lineHeight:"5.3rem",
                }

                //section1区域  拍卖状态筛选区域
                if (index == 0){
                    var sectiontitle = sectiondic.title;
                    var statusArr = sectiondic.statusArr;
                    var auctionstate = this.state.auctionstate;//拍卖状态
                    var tagwidth = "7rem";//section1中的item固定宽度为7rem


                    var tagsArr = [];
                    for (var index1 in statusArr){
                        var tagdic = statusArr[index1];
                        //标签内容
                        var tagtitle = tagdic.title;
                        //标签状态
                        var pstatus = tagdic.pstatus;

                        //和当前选中的拍卖状态进行对比,如果相同则为选中状态
                        var tagstyle = {
                            width:tagwidth,
                            height:"3rem",
                            boxSizing:"border-box",
                            lineHeight:"3rem",
                            marginLeft:"20px",
                            borderRadius:"2px",
                            fontSize:"1.4rem",
                            textAlign:"center",
                            backgroundColor:pstatus.toString() == auctionstate.toString() ? "#ff3b30" : "#eeeeee",
                            color:pstatus.toString() == auctionstate.toString() ? "#ffffff" : "#202020",

                        };

                        //如果是第1个tag则没有margin-left
                        tagstyle.marginLeft = index1 == 0 ? "0px" : tagstyle.marginLeft;


                        var tagelement = <p key={pstatus} className='statustag' style={tagstyle} onClick={this.clickstatustag.bind(this,tagdic)}>{tagtitle}</p>;
                        tagsArr.push(tagelement);
                    }

                    tagsdiv = <div className="tagsdiv flexbox flexstart">{tagsArr}</div>;

                    var section1div =
                        <div className="section1" style={{marginLeft:"18px",paddingBottom:"2rem",borderBottom:"1px #ededed solid",}}>
                            <p className="sectiontitle" style={sectiontitlestyle}>{sectiontitle}</p>
                            {tagsdiv}
                        </div>;

                    sectionsArr.push(section1div);

                }
                //section2区域  开始时间筛选区域
                else if (index == 1){

                    var sectiontitle = sectiondic.title;
                    var statusArr = sectiondic.statusArr;
                    var auctionstarttime = this.state.auctionstarttime;//开拍时间
                    var tagwidth = ($('body').width() - 18 - 10 - 15*3)/statusArr.length;


                    var tagsArr = [];
                    for (var index1 in statusArr){
                        var tagdic = statusArr[index1];
                        //标签内容
                        var tagtitle = tagdic.title;
                        //标签状态
                        var dateNum = tagdic.dateNum;
                        //和当前选中的开始时间进行对比,如果相同则为选中状态,如果不相同则不为选中状态
                        var tagstyle = {
                            width:tagwidth,
                            height:"2.8rem",
                            boxSizing:"border-box",
                            lineHeight:"2.8rem",
                            borderRadius:"2px",
                            fontSize:"1.4rem",
                            textAlign:"center",
                            backgroundColor:dateNum.toString() == auctionstarttime.toString() ? "#ff3b30" : "#eeeeee",
                            color:dateNum.toString() == auctionstarttime.toString() ? "#ffffff" : "#202020",

                        };



                        var tagelement = <p key={dateNum} className='statustag' style={tagstyle} onClick={this.clicktimetag.bind(this,tagdic)}>{tagtitle}</p>;
                        tagsArr.push(tagelement);
                    }

                    var tagsdiv = <div className="tagsdiv flexbox flex-spacebetween">{tagsArr}</div>;

                    var section2div =
                        <div className="section2" style={{marginLeft:"18px",paddingRight:"10px",paddingBottom:"2rem",borderBottom:"1px #ededed solid",}}>
                            <p className="sectiontitle" style={sectiontitlestyle}>{sectiontitle}</p>
                            {tagsdiv}
                        </div>;

                    sectionsArr.push(section2div);

                }
                //section3区域  价格区间
                else if(index == 2){

                    var beginPrice = this.state.beginPrice;//最低价
                    var endPrice = this.state.endPrice;//最高价
                    var sectiontitle = sectiondic.title;

                    var inputstyle = {
                        display:"inline-block",
                        width:"10rem",
                        height:"2.75rem",
                        boxSizing:"border-box",
                        border:"1px #ededed solid",
                        font:"1.2rem",
                        color:"#999999",
                        paddingLeft:"1rem",
                    };
                    var linestyle = {
                        display:"inline-block",
                        width:"2rem",
                        height:"1px",
                        backgroundColor:"#ededed",
                        margin:"0 0.75rem",
                    };

                    var section3div =
                        <div className="section3" style={{marginLeft:"18px",}}>

                            <p className="sectiontitle" style={sectiontitlestyle}>{sectiontitle}</p>

                            <div className="pricediv">

                                <input className='minprice' ref='beginprice' placeholder='最低价' value={beginPrice} onChange={this.handleprice.bind(this)} style={inputstyle} type="number"/>
                                <span className="line" style={linestyle}></span>
                                <input className='maxprice' ref='endprice' placeholder='最高价' value={endPrice} onChange={this.handleprice.bind(this)} style={inputstyle} type="number"/>

                            </div>

                    </div>;

                    sectionsArr.push(section3div);

                }

            }

            //按钮区域的样式
            var btndivstyle = {

                width:"100%",
                position:"absolute",
                bottom:"0px",
                left:"0px",
                textAlign:"center",
                height:"4.4rem",
                lineHeight:"4.4rem",
                background:"url("+publicUrl+"public/images/auction/ic_zcline.png"+") no-repeat center",
                backgroundSize:"1px 2.5rem",
                backgroundColor:"#ff3b30",//注意如果background-image和background-color同时存在的话color要放在最后

            };
            //其中按钮的样式
            var btnstyle = {
                width:"50%",
                height:"100%",
                color:"#ffffff",
                fontSize:"1.7rem",//注意button不能直接设置font属性,应该设置font-size属性来设置button的文字大小
                backgroundColor:"transparent",
            };

            return (

                <div className="maskdiv" style={masktablestyle} onClick={this.clicktable3maskdiv.bind(this)}>
                    <div className="flitertable3div" style={{height:"100%",width:"100%",boxSizing:"border-box",overflow:"scroll",backgroundColor:"#ffffff",}}>

                        {/*3个section区域*/}
                        {sectionsArr}

                        {/*重置和选择按钮*/}
                        <div className="btndiv clearfix" style={btndivstyle}>
                            <button className="resetbtn f_left" style={btnstyle} onClick={this.clickreset.bind(this)}>重置</button>
                            <button className="surebtn f_right" style={btnstyle} onClick={this.clicksurebtn.bind(this)}>确认选择</button>

                        </div>

                    </div>
                </div>

            )
        }

        //四级分类参数
        else if(type == '4' && dataArr.length > 0){

            var elementsArr = [];
            var itemstyle = {

            };
            //首先判断有几个四级参数,计算出展示行数
            var linecount = dataArr.length % 2 == 0 ?parseInt(dataArr.length/2)/2 : parseInt(dataArr.length/2) + 1;
            var fourthlinedivstyle = {
                width:"100%",
                height:"4.3rem",
                lineHeight:"4.3rem",
                boxSizing:"border-box",
                color:"#666666",
                fontSize:"1.4rem",
                backgroundColor:"#ffffff",
                borderBottom:"1px #ededed solid",
            };
            var fourthitemstyle = {
                boxSizing:"border-box",
                height:"100%",
                paddingLeft:"2.3rem",
            };
            for (var i =0;i<linecount;i++){

                //每一行都展示一个div,div内最多展示两个参数
                var item1index = i*2 + 0;
                var item1dic = dataArr[item1index];
                var element1 = <p className="fourthitem flexitem1 oneClamp" style={fourthitemstyle} onClick={this.clickfliteritembycontentId.bind(this,item1dic)}>{item1dic.contentName}</p>;



                var item2index = i*2 + 1;
                var element2 = null;
                if (item2index < dataArr.length ){
                    var item2dic = dataArr[item2index];
                    element2 = <p className="fourthitem flexitem1 oneClamp" style={fourthitemstyle} onClick={this.clickfliteritembycontentId.bind(this,item2dic)}>{item2dic.contentName}</p>
                }

                var lineelement =
                    <div className="fourthlinediv flexbox flexboxwrap" style={fourthlinedivstyle}>
                        {element1}
                        {element2}
                    </div>;

                elementsArr.push(lineelement);

            }


            return (
                <div className="maskdiv" style={masktablestyle} onClick={this.clickmaskdiv.bind(this)}>
                    <div className="flitertable4div" style={{maxHeight:"21.5rem",overflow:"auto",}}>
                        {elementsArr}
                    </div>
                </div>
            );

        }


        return null;

    }


}

//筛选面板
class Fliterdiv extends React.Component{
    //设置默认参数
    static defaultProps = {

        firstTypeId:firstTypeId,//一级分类id
        subTypeId:subTypeId,//默认类目id为全局类目id
        contentIds:[],//三级四级分类数组
        sortType:sortType,//默认排序id为全局排序id
        auctionstate:auctionstate,//拍卖状态
        auctionstarttime:auctionstarttime,//开拍时间
        beginPrice:"",//最低价
        endPrice:"",//最高价

    };

    constructor(props){
        super(props);


        this.state = {
            currentselectindex:0,//当前选中的fliterheaderitem的索引 分别为1 2 3    0代表什么也没有选中
            fliterdataArr1:[],//排序筛选项中的筛选数据源
            fliterdataArr2:[],//二级类目筛选项中的筛选数据源
            fliterdataArr3:[],//更多筛选项中的筛选数据源
            currentsortType: this.props.sortType,//当前选中的排序id
            currentsubTypeId:this.props.subTypeId,//当前选中的二级类目id
            currentthirdparamlist:[],//当前根据选中的二级类目id获取到的三级参数数组
            currentparaId:"",//当前点击的三级分类id
            currentfourthparamlist:[],//当前根据选中的三级类目id获取到的四级参数数组
            contentIds:this.props.contentIds,//当前已经被选中的三级四级分类对象数组
            auctionstate:this.props.auctionstate,//拍卖状态
            auctionstarttime:this.props.auctionstarttime,//开拍时间
            beginPrice:this.props.beginPrice,//最低价
            endPrice:this.props.endPrice,//最高价
            ajaxrequest1:null,//ajax请求体 只是在获取二级分类类目的时候才会用到
            ajaxrequest2:null,//ajax请求体 只是在获取三级分类参数的时候才会用到
            ajaxrequest3:null,//ajax请求体 只是在获取四级分类参数的时候才会用到

        };
    }


    componentDidUpdate(){

        //组件更新完毕的时候根据最新的布局来设置body的padding-top
        var bodypaddingtopvalue = ifApp ? $('.fliterarea1').outerHeight(true) : $('.fliterarea1').outerHeight(true) + $('header').outerHeight(true);

        $('body').css('padding-top',bodypaddingtopvalue);

    }

    componentDidMount(){

        const _this = this;

        //获取二级分类的类目
        var parainfo = {
            name: name,//搜索关键字
            firstTypeId:firstTypeId,//一级分类id
            reqType:reqType,//请求拍品列表来源 1代表拍品预告 其他为空字符串
        };
        var ajaxrequest1 = $.ajax({
            url:auctionsubTypeList,
            data:getAuth() + "info=" + JSON.stringify(parainfo),
            success:function (data) {
                if (data.errCode == 0){

                    //排序筛选项数据源
                    var fliterdataArr1 = [
                        {sortType:'1',title:'默认排序'},
                        {sortType:'2',title:'当前价格由高到低'},
                        {sortType:'3',title:'当前价格由低到高'},
                        {sortType:'4',title:'出价次数由高到低'},
                        {sortType:'5',title:'最新发布'},
                    ];

                    var fliterdataArr2 = data.resultdata.typeList;
                    //手动增加一条全部的数据,设置其二级分类类目id为空字符串
                    var allsubType = {typeId:"",typeName:"全部"};
                    fliterdataArr2.unshift(allsubType);//向数组的开头添加手动添加的数据

                    //更多筛选项数据源  0即将开始 1进行中 2已结束
                    var fliterdataArr3 = [
                        {title:'拍卖状态',statusArr:[{title:'即将开始',pstatus:0},{title:'正在进行',pstatus:1},{title:'已结束',pstatus:2}]},
                        {title:'开始时间',statusArr:[{title:'最近1天',dateNum:1},{title:'最近3天',dateNum:2},{title:'最近5天',dateNum:3},{title:'最近7天',dateNum:4}]},
                        {title:'价格区间',}
                    ];

                    _this.setState({

                        fliterdataArr1:fliterdataArr1,//排序筛选项中的筛选数据源
                        fliterdataArr2:fliterdataArr2,//二级类目筛选项中的筛选数据源
                        fliterdataArr3:fliterdataArr3,//更多类目筛选项中的筛选数据源

                    });

                    //根据当前选择的二级分类进行接口请求,获取三级分类参数
                    _this.getthirdparamsbysubType(_this.state.currentsubTypeId);

                }
                else{
                    mainTip(data.msg);
                }
            },
            error:function (error) {
                //获取数据失败
                mainTip(error.msg);
            },
        });

        _this.setState({
            ajaxrequest1:ajaxrequest1,
        });

    }

    //如果是异步获取数据，则在componentWillUnmount中取消发送请求
    componentWillUnmount () {

        //取消发送请求
        var ajaxrequest1 = this.state.ajaxrequest1;
        if (ajaxrequest1){ajaxrequest1.abort();}


        var ajaxrequest2 = this.state.ajaxrequest2;
        if (ajaxrequest2){ajaxrequest2.abort();}

        var ajaxrequest3 = this.state.ajaxrequest3;
        if (ajaxrequest3){ajaxrequest3.abort();}

    }


    //点击筛选面板头部的每一个筛选项
    clickheaderitem(clickindex){

        //当前全局记录的选中索引
        var currentselectindex = this.state.currentselectindex;
        //获取当前点击的面板中的筛选index
        var clickindex = clickindex;

        //如果当前的全局选中索引和即将要点击的面板筛选index相同的话则说明已经处于筛选状态,将currentselectindex置为0即可,不相同的话则将全局记录的选中索引替换为当前点击的筛选index
        currentselectindex = currentselectindex == clickindex ? 0 : clickindex;
        //并且将当前fliter4Table的数据清空,以防止fliter4table将其覆盖掉
        this.setState({
            currentselectindex:currentselectindex,
            currentfourthparamlist:[],
        });


    }

    //点击某个三级分类,请求四级分类参数内容
    clickthirditem(thirditemid,itemclass){

        //根据传递过来的类名判断,如果是选中状态则进行取消即可,如果是非选中状态则加载四级分类数据
        if (itemclass == 'selectthirditem'){
            //已经是选中状态了,将当前的记录数组中的数据进行移除重新setState即可
            var contentIds = this.state.contentIds;
            for (var index in contentIds){
                var dict = contentIds[index];
                if (dict.hasOwnProperty(thirditemid)){
                    //进行移除
                    contentIds.splice(index,1);
                    break;
                }
            }

            this.setState({
                currentparaId:'',//当前点击的三级分类id 置空
                contentIds:contentIds,//当前记录的数据
            },function () {
                //将当前筛选面板中的所有参数字典传递给父组件进行数据请求
                this.props.beginloaddata(this.state);
            });
        }
        else{
            //未选中状态,请求相应的四级参数数据
            const _this = this;

            var parainfo = {
                paramId: thirditemid,//当前选中的三级分类ID
            };
            var ajaxrequest3 = $.ajax({
                url:auctiongetparamcontentList,
                data:getAuth() + "info=" + JSON.stringify(parainfo),
                success:function (data) {
                    if (data.errCode == 0){


                        var list = data.resultdata.list;


                        _this.setState({
                            currentparaId:thirditemid,//当前点击的三级分类id
                            currentfourthparamlist:list,//根据三级类目id获取到的四级参数数组

                        });

                    }
                    else{
                        mainTip(data.msg);
                    }
                },
                error:function (error) {
                    //获取数据失败
                    mainTip(error.msg);
                },
            });

            _this.setState({
                ajaxrequest3:ajaxrequest3,
            });

        }


    }


    //点击展开的筛选table的空白地方收回table的操作,只需更改当前点选header中的index为0即可
    clicktablemask(){
        this.setState({
            currentselectindex:0,
        });

    }

    //点击展开的四级参数区域的空白地方收回当前table,只需要更改当前的四级参数数据源数组为空数组即可
    clickfourthmask(){
        this.setState({
            currentfourthparamlist:[],
        });
    }

    //点击排序面板的每一个筛选项
    fliteritem1change(infodic){
        //首先重置当前筛选面板选中索引为0,然后将当前选中的排序id设置为点击的排序id
        this.setState({
            currentselectindex:0,
            currentsortType:infodic.sortType,
        },function () {
            //将当前筛选面板中的所有参数字典传递给父组件进行数据请求
            this.props.beginloaddata(this.state);
        });




    }

    //点击二级类目的每一个筛选选项
    fliteritem2change(infodic){
        //首先重置当前筛选面板选中索引为0,然后将当前选中的二级分类id设置为点击的分类id,需要注意的是这里也需要将记录数组中的数据清空
        this.setState({
            currentselectindex:0,//当前选择的筛选索引清空
            currentsubTypeId:infodic.typeId,//当前点击的二级类目id
            contentIds:[],//清空当前记录的三四级数组数据
        },function () {
            //根据当前选择的二级分类进行接口请求,获取三级分类参数 注意这里setState是异步操作,所以需要回调函数来调用
            this.getthirdparamsbysubType(this.state.currentsubTypeId);

            //将当前筛选面板中的所有参数字典传递给父组件进行数据请求
            this.props.beginloaddata(this.state);
        });


    }

    //根据当前选中的二级分类id获取三级参数
    getthirdparamsbysubType(subTypeId){
        const _this = this;

        var parainfo = {
            typeId: subTypeId,//当前选中的二级分类ID
        };
        var ajaxrequest2 = $.ajax({
            url:auctiongetparamTypeList,
            data:getAuth() + "info=" + JSON.stringify(parainfo),
            success:function (data) {
                if (data.errCode == 0){

                    var list = data.resultdata.list;

                    _this.setState({

                        currentthirdparamlist:list,//根据二级类目id获取到的三级参数数组

                    });

                }
                else{
                    mainTip(data.msg);
                }
            },
            error:function (error) {
                //获取数据失败
                mainTip(error.msg);
            },
        });

        _this.setState({
            ajaxrequest2:ajaxrequest2,
        });
    }

    //点击更多筛选面板的确认选择
    clicksurebtn(currentstate,currentstarttime,currentbeginprice,currentendprice){

        //获取面板中选择的参数
        var currentstate = currentstate;
        var currentstarttime = currentstarttime;
        var currentbeginprice = currentbeginprice;
        var currentendprice = currentendprice;

        //重置当前筛选面板选中索引为0,然后根据当前选择的筛选条件设置相关的state 设置完毕之后调用回调方法将最新数据传递至父组件
        this.setState({
            currentselectindex:0,
            auctionstate:currentstate,//拍卖状态
            auctionstarttime:currentstarttime,//开拍时间
            beginPrice:currentbeginprice,//最低价
            endPrice:currentendprice,//最高价
        },function () {
            //将当前筛选面板中的所有参数字典传递给父组件进行数据请求
            this.props.beginloaddata(this.state);
        });



    }

    //点击四级参数的区域中的某每一个筛选选项
    fliteritem4change(infodic){

        var itemname = infodic.contentName;
        var itemid = infodic.contentId;

        var currentparaId = this.state.currentparaId;

        //eg:
        // [
        // {'1':{'fourthId':'11',fourthname:'于建嵘'}},
        // {'2':{'fourthId':'22',fourthname:'国画'}}
        // ]

        //首先将当前的四级数据源清空为空数组 然后将点选的四级分类加入到当前的三四级记录状态数组中

        var contentIds = this.state.contentIds;


        //如果记录数组为空则直接加入即可
        if (contentIds.length == 0){
            var dic = {};
            dic[currentparaId] = {'fourthId':itemid,fourthname:itemname};
            contentIds.push(dic);
        }
        else{
            //如果记录数组不为空,说明之前记录过,这个时候需要数组中的每一项进行比较,如果找到对应的则进行替换,如果没有找对应的则新增即可
            for (var index in contentIds){
                //根据当前的三级参数看在记录字典数组中能否找到对应的key,如果能则直接替换,如果不能,等到最后一个也还找不到的时候就进行替换

                var thirddic = contentIds[index];//{'1':{'fourthId':'11',fourthname:'于建嵘'}}
                if (thirddic.hasOwnProperty(currentparaId)){
                    //有当前的三级参数,则直接进行替换其对应的四级分类即可
                    thirddic[currentparaId].fourthId = itemid;
                    thirddic[currentparaId].fourthname = itemname;
                    break;
                }

                //如果找到最后一个也还是没有找到说明压根就没有存过,这个时候只需要存一下就好了(能走到这一步说明压根就没有存在过,直接增加即可)
                if (index == contentIds.length - 1){
                    var dic = {};
                    dic[currentparaId] = {'fourthId':itemid,fourthname:itemname};
                    contentIds.push(dic);
                }
            }
        }


        this.setState({
            currentfourthparamlist:[],//清空当前数据,使四级参数table消失
            contentIds:contentIds,//更新当前的三四级选项对象数组
        },function () {
            //将当前筛选面板中的所有参数字典传递给父组件进行数据请求
            this.props.beginloaddata(this.state);
        });

    }


    render(){

        //当前选中的索引
        var currentselectindex = this.state.currentselectindex;


        {
            //设置排序筛选面板

            //排序筛选数据源
            var fliterdataArr1 = this.state.fliterdataArr1;
            //设置排序筛选面板的展示标题
            var title1show = "";
            for (var index1 in fliterdataArr1) {
                var infodic1 = fliterdataArr1[index1];
                var sortType = infodic1.sortType;
                var title = infodic1.title;
                title1show = this.state.currentsortType == sortType ? title : title1show;
            }


            //设置二级类目筛选面板

            //二级分类数据源
            var fliterdataArr2 = this.state.fliterdataArr2;
            //设置二级分类筛选面板的展示标题
            var title2show = "";
            for (var index2 in fliterdataArr2) {
                var infodic2 = fliterdataArr2[index2];
                var typeId = infodic2.typeId;
                var typeName = infodic2.typeName;
                title2show = this.state.currentsubTypeId == typeId ? typeName : title2show;
            }


            //设置更多筛选面板

            //设置更多筛选的数据源
            var fliterdataArr3 = this.state.fliterdataArr3;
            //设置更多面板的展示标题
            var title3show = "更多";

        }



        //显示的筛选头部元素
        var fliterheaderitemsArr = [

            <p onClick={this.clickheaderitem.bind(this,1)} className={currentselectindex == 1 ? "selectfliterheaderitem oneClamp flexitem1" : "normalfliterheaderitem oneClamp flexitem1"}>{title1show}<span></span></p>,
            <p onClick={this.clickheaderitem.bind(this,2)} className={currentselectindex == 2 ? "selectfliterheaderitem oneClamp flexitem1" : "normalfliterheaderitem oneClamp flexitem1"}>{title2show}<span></span></p>,
            <p onClick={this.clickheaderitem.bind(this,3)} className={currentselectindex == 3 ? "selectfliterheaderitem oneClamp flexitem1" : "normalfliterheaderitem oneClamp flexitem1"}>{title3show}<span></span></p>

        ];




        //设置显示的筛选Table
        var showflitertable = null;
        //选中的是排序筛选面板
        if (currentselectindex == 1){

            //显示的筛选面板Table
            showflitertable = <FliterTable type={currentselectindex.toString()} dataArr={fliterdataArr1} selectId={this.state.currentsortType} fliteritemchange={this.fliteritem1change.bind(this)} clicktablemask={this.clicktablemask.bind(this)}></FliterTable>;

        }
        //选中的是二级类目筛选面板
        else if(currentselectindex == 2){

            //显示的筛选面板Table
            showflitertable = <FliterTable type={currentselectindex.toString()} dataArr={fliterdataArr2} selectId={this.state.currentsubTypeId} fliteritemchange={this.fliteritem2change.bind(this)} clicktablemask={this.clicktablemask.bind(this)}></FliterTable>;

        }
        //选中的是更多筛选面板
        else if(currentselectindex == 3){

            //显示的筛选面板Table
            showflitertable = <FliterTable type={currentselectindex.toString()} dataArr={fliterdataArr3} clicktablemask={this.clicktablemask.bind(this)} clicksurebtn={this.clicksurebtn.bind(this)}

                                           auctionstate={this.props.auctionstate} /*拍卖状态*/
                                           auctionstarttime={this.props.auctionstarttime} /*开拍时间*/
                                           beginPrice={this.props.beginPrice} /*最低价*/
                                           endPrice={this.props.endPrice} /*最高价*/>>
                              </FliterTable>;


        }
        else{
            //容错
        }

        //设置三级参数区域
        var thirdparamslist = this.state.currentthirdparamlist;
        var contentIds = this.state.contentIds;
        //eg:
        // [
        // {'1':{'fourthId':'11',fourthname:'于建嵘'}},
        // {'2':{'fourthId':'22',fourthname:'国画'}}
        // ]

        //计算每一个三级参数的宽度  item与item之间的间距固定为25 第一个item距左10px 首屏展示4个半
        var itemwidth = ($('body').width() - 10 -3*25)/4.5;

        var thirdelementsArr = [];
        for (var index in thirdparamslist){
            var paradic = thirdparamslist[index];
            var paramId = paradic.paramId;//参数id
            var paramName = paradic.paramName;//参数名称

            var itemclass = "normalthirditem";//默认为正常样式
            //在初始化三级参数区域的时候对此做一个比较,如果在contentIds中有对应的三级参数,则应该显示的是对应的四级参数的名称和选中样式
            for (var index2 in contentIds){
                var contentIddic = contentIds[index2];
                //如果该三级参数在记录数组中
                if (contentIddic.hasOwnProperty(paramId)){
                    //该三级分类已经被选中了
                    itemclass = "selectthirditem";//选中样式
                    //显示的应该是对应的四级参数的名称
                    var fourthname = contentIddic[paramId].fourthname;
                    paramName = fourthname;//替换为四级参数的名称
                    break;
                }

            }

            var element = <p className={itemclass + ' oneClamp'} style={{width:itemwidth+"px"}} onClick={this.clickthirditem.bind(this,paramId,itemclass)}>{paramName}</p>
            thirdelementsArr.push(element);
        }

        //筛选头部及三级参数的区域样式
        var fliterarea1style = {

            position:"fixed",
            zIndex:"6",/*设置的zindex要比flitertable要低(8),这样才能保证显示在flitertable的下面*/
            top:ifApp ? "0px" :"4.4rem",/*根据当前是否是APP环境设置筛选面板的定位距上属性*/
            left:"0px",
            width:"100%",

        };

        //四级参数区域
        var fourthparamlist = this.state.currentfourthparamlist;
        var fourthtablediv = fourthparamlist.length > 0 ?
            <FliterTable type='4' dataArr={fourthparamlist} clicktablemask={this.clickfourthmask.bind(this)} fliteritemchange={this.fliteritem4change.bind(this)}></FliterTable> : null;


        return (

            <div className="fliterdiv">

                <div className='fliterarea1' style={fliterarea1style}>

                    {/*筛选头部区域(包含排序区域 二级类目分类区域 更多区域)*/}
                    <div className="fliterheader flexbox">

                        {/*三个筛选item*/}
                        {fliterheaderitemsArr}

                    </div>

                    {/*三级分类参数区域*/}
                    <div className="fliterthirdparadiv">
                        {thirdelementsArr}
                    </div>

                </div>


                {/*头部三种筛选面板Table*/}
                {showflitertable}

                {/*四级参数筛选面板Table*/}
                {fourthtablediv}


            </div>

        );
    }

}

//整体的Mybodydiv
class Mybodydiv extends React.Component{

    //设置默认参数(能作为外部参数的)
    static defaultProps = {

    };

    constructor(props){
        super(props);

        this.state = {

            name:name,//商品名称
            firstTypeId:firstTypeId,//一级分类id
            subTypeId:subTypeId,//二级分类id
            //三级和四级分类数组,默认为空数组 里面是对象,包含该三级分类信息以及对应的该四级分类信息
            //形如:[{'1':{'fourthId':'11',fourthname:'于建嵘'}},{'2':{'fourthId':'22',fourthname:'国画'}}]这样的数组
            contentIds:[],
            uid:uid,//用户uid
            sortType:sortType,//排序类型
            auctionstate:auctionstate,//拍品状态
            auctionstarttime:auctionstarttime,//开拍时间
            beginPrice:"",//最低价
            endPrice:"",//最高价
            pageSize:"10",//每页显示的条数
            firstResult:0,//页码
            date:"",//分页用时间字符串
            ajaxrequest:null,//ajax请求体
            mescroll:null,//下拉刷新上拉加载控件

            auctionList:[],//获取到的拍品列表数组

        };
    }


    //点击排序选项
    clicksorttype(sorttype){
        //点击了排序选项中的某一项
        var currentsorttype = sorttype;

        //因为setState是异步的,所以这里使用setState的第二个参数在更新完state之后进行加载数据的回调
        this.setState({
            sortType:currentsorttype,
        },()=>this.loadmoredata());
    }

    //点击二级分类选项
    clicksubtype(subtype){
        //点击了二级分类选项中的某一项
        var currentsubtype = subtype;

        //因为setState是异步的,所以这里使用setState的第二个参数在更新完state之后进行加载数据的回调
        this.setState({
            subTypeId:currentsubtype,
        },()=>this.loadmoredata());
    }

    //点击更多筛选面板的确认选择
    clicksurebtn(currentstate,currentstarttime,currentbeginprice,currentendprice){
        //获取面板中选择的参数
        var currentstate = currentstate;
        var currentstarttime = currentstarttime;
        var currentbeginprice = currentbeginprice;
        var currentendprice = currentendprice;


        //更新自身的state来更新组件样式 因为setState是异步的,所以这里使用setState的第二个参数在更新完state之后进行加载数据的回调
        this.setState({
            auctionstate:currentstate,//拍品状态
            auctionstarttime:currentstarttime,//开拍时间
            beginPrice:currentbeginprice,//最低价
            endPrice:currentendprice,//最高价
        },()=>this.loadmoredata());



    }

    //筛选面板中的数据发生了变化,需要重新请求拍品列表的回调函数
    beginloaddata(fliterstatedict){
        //获取筛选面板中的所有状态信息和自身组件中的一些信息拼接进行后台请求数据请求

        var currentsortType = fliterstatedict.currentsortType;//当前选中的排序id
        var currentsubTypeId = fliterstatedict.currentsubTypeId;//当前选中的二级分类id
        var currentcontentIds = fliterstatedict.contentIds;//记录三四级字典对象的数组,该数组中是当前选中的三级和对应的四级参数对象的集合
        var currentauctionstate = fliterstatedict.auctionstate;//拍卖状态
        var currentauctionstarttime = fliterstatedict.auctionstarttime;//开拍时间
        var currentbeginPrice = fliterstatedict.beginPrice;//最低价
        var currentendPrice = fliterstatedict.endPrice;//最高价




        //将当前组件的state字典对象赋值为最新的数据,然后进行数据请求
        this.setState({

            subTypeId:currentsubTypeId,//二级分类id
            sortType:currentsortType,//排序类型
            auctionstate:currentauctionstate,//拍品状态
            auctionstarttime:currentauctionstarttime,//开拍时间
            beginPrice:currentbeginPrice,//最低价
            endPrice:currentendPrice,//最高价
            contentIds:currentcontentIds,//当前选择的三四级字典对象
            pageSize:"10",//每页显示的条数
            firstResult:0,//页码(重新将页码数清零) 请求的时间date参数不变
            auctionList:[],//获取到的拍品列表数据源 这个时候清空当前的拍品列表数据

        },function () {
            this.loadmoredata();
        });
    }

    //加载更多数据
    loadmoredata(){


        //根据当前的state获取当前选择的所有参数,然后进行数据请求
        var name = this.state.name;//商品名称
        var firstTypeId = this.state.firstTypeId;//一级分类id
        var subTypeId = this.state.subTypeId;//二级分类id
        var contentIds = this.state.contentIds;//三级和四级分类数组,默认为空数组 里面是对象,包含该三级分类信息以及对应的该四级分类信息
        //参数内容id数组中放置的是选中的四级分类id集合
        var contentIdArr = [];
        for (var index in contentIds){

            var selectdict = contentIds[index];
            //eg: {'1':{'fourthId':'11',fourthname:'于建嵘'}}
            for (var dictkey in selectdict){
                var fourthId = selectdict[dictkey].fourthId;
                var contentdict = {'contentId':fourthId};
                contentIdArr.push(contentdict);
            }

        }

        var uid = this.state.uid;//用户uid
        var sortType = this.state.sortType;//排序类型
        var auctionstate = this.state.auctionstate;//拍品状态
        var auctionstarttime = this.state.auctionstarttime;//开拍时间
        var beginPrice = this.state.beginPrice;//最低价
        var endPrice = this.state.endPrice;//
        var pageSize = this.state.pageSize;//每页显示的条数
        var firstResult = this.state.firstResult;//页码
        var date = this.state.date;//分页用时间字符串


        console.log(

            '开始加载拍品列表的数据：'+
            '\n' +
            '一级分类id为:' + firstTypeId +
            '\n' +
            '获取到的排序id为:' + sortType +
            '\n' +
            '获取到的二级分类id为:' + subTypeId +
            '\n' +
            '获取到的拍品状态id为:' + auctionstate +
            '\n' +
            '获取到的拍品时间id为:' + auctionstarttime +
            '\n' +
            '获取到的最低价为:' + beginPrice +
            '\n' +
            '获取到的最高价为:' + endPrice +
            '\n' +
            '获取到的三四级对象字典为:' + JSON.stringify(contentIds) +
            '\n' +
            '整理之后即将传递给后台的四级分类参数id对象数组为:' + JSON.stringify(contentIdArr) +
            '\n' +
            '当前的页数为:' + firstResult
        );


        const _this = this;
        const mescroll =  this.state.mescroll;


        //这是请求拍品列表的所有参数
        var info = {
            name:name,//商品名称
            firstTypeId:firstTypeId,//一级分类id
            subTypeId:subTypeId,//二级分类id
            contentIds:contentIdArr,//记录的四级对象id对象数组
            uid:uid,//用户uid
            sortType:sortType,//排序类型
            pstatus:auctionstate,//拍品状态
            dateNum:auctionstarttime,//开拍时间
            beginPrice:beginPrice,//最低价
            endPrice:endPrice,//最高价
            pageSize:pageSize,//每页显示的条数
            firstResult:firstResult,//页码
            date:date,//分页用时间字符串
        };



        var ajaxrequest = $.ajax({
            url:auctionproductList,
            data:getAuth()+"info="+JSON.stringify(info),
            success:function (data) {
                if (data.errCode == 0){

                    var resultdata = data.resultdata;
                    var auctionList = resultdata.auctionList || [];
                    var dataSize = auctionList.length;

                    var date = resultdata.date;
                    var pageSize = parseInt(_this.state.pageSize);

                    var hasNext = dataSize == pageSize;
                    /*
                        隐藏下拉刷新和上拉加载的状态, 在联网获取数据成功后调用
                        dataSize : 当前页获取的数据量(注意是当前页)
                        hasNext : 是否有下一页数据true/false
                    */
                    mescroll.endSuccess(dataSize,hasNext);

                    _this.setState({

                        auctionList:_this.state.auctionList.concat(auctionList),//在原有数据源基础之上再增加新数据
                        date:date,
                        firstResult:_this.state.firstResult + 1,//页码数

                    });

                }
                else{
                    mainTip(data.msg);
                    mescroll.endErr();
                }
            },
            error:function (error) {
                //获取数据失败
                mainTip(error.msg);
                mescroll.endErr();

            },
        });

        _this.setState({
            ajaxrequest:ajaxrequest,//ajax请求实体
        });


    }

    //点击拍品提醒的事件
    clickremind(pid,index,event){

        //阻止冒泡事件的传递
        event.stopPropagation();

        mainTip('点击提醒按钮--拍品id为:' + pid + "当前选中的拍品索引为:" + index.toString());
        console.log('点击提醒按钮--拍品id为:' + pid + "当前选中的拍品索引为:" + index.toString());

        //在this.state中找到对应的数据源,将对应的提醒flag更改即可
        var auctionList = this.state.auctionList;
        var auctiondict = auctionList[index];
        auctiondict.remindFlag = auctiondict.remindFlag == 1 ? 0 : 1;
        //更改当前提醒状态
        this.setState({
            auctionList:auctionList,
        });
    }

    //点击拍品进入拍卖大厅事件
    clickprodetail(pid,event){

        //阻止冒泡事件的传递
        event.stopPropagation();

        mainTip('点击进入拍卖大厅--拍品id为:' + pid);


    }

    //处理后台数据,返回设置好的元素组件
    creatlistelement(dataArr){
        //如果是空数组则返回null,否则根据数组数据装载不同的界面元素


        var elementsArr = [];

        for (var index in dataArr){
            var auctionproductdict = dataArr[index];
            var pid = auctionproductdict.pid;//商品id
            var title = auctionproductdict.title;//商品名称
            var price = auctionproductdict.price;//价格
            var startTime = auctionproductdict.startTime;//拍卖开始时间（yyyy-MM-dd hh:mm:ss）
            var endTime = auctionproductdict.endTime;//拍卖结束时间（yyyy-MM-dd hh:mm:ss）
            var img = auctionproductdict.img;//图片地址
            var bidNum = auctionproductdict.bidNum;//出价次数
            var nowTime = auctionproductdict.nowTime;//系统当前时间
            var status = auctionproductdict.status;//拍卖状态 0即将开始 1进行中  2已结束
            var browseNum = auctionproductdict.browseNum;//浏览次数
            var remindFlag = auctionproductdict.remindFlag;//是否提醒 1已提醒 0未提醒

            //整体区域样式
            var productstyle = {
                width:"100%",
                height:"19.25rem",
                backgroundColor:"#ffffff",
            };

            //拍品图片样式
            var proimgstyle = {
                width:"45%",
                height:$('body').width() * 0.45 * 0.66 ,
                background:'url('+imgIndexUrl + img+') no-repeat center',
                backgroundSize:"cover",
            };

            //右侧拍品内容区域样式
            var procontentstyle = {
                width:"55%",
                height:"100%",
                boxSizing:"border-box",
                padding:"2rem 1rem 2.75rem 1rem",
                position:"relative",
            };

            //拍品标题样式
            var protitlestyle = {
                width:"100%",
                height:"3rem",
                lineHeight:"1.5rem",
                fontSize:"1.4rem",
                color:"#202020",
                fontFamily:"PingFang SC",
                marginBottom:"4rem",
            };

            //拍品价格样式
            var propricestyle = {
                width:"100%",
                height:"2.4rem",
                lineHeight:"2.4rem",
                fontSize:"2.3rem",
                color:"#ff3b30",
                marginBottom:"1.5rem",
            };

            //拍品详情样式
            var prodetailstyle = {
                width:"100%",
                background:"url('../../public/images/auction/ic_zcline.png') no-repeat 73% center",//注意这里是写在html中的,所以层级应为2层
                backgroundSize:"1px 100%",
            };

            //拍品详情右边区域样式  根据不同状态选择不同的图标和文字以及点击事件
            var currentpricestr = "";//价格说明文字
            var countstr = "";//围观或者出价次数的文字
            var numvalue;//围观或者出价次数的具体值
            var timestr = "";//开始时间或者预计结束时间或者已经结束的时间文字
            var righticonPath = "";//不同状态下的icon选择
            var righticonstr = "";//不同状态下的文字显示
            var clickfunction = null;//不同状态下右侧icon区域的点击事件


            //即将开始 展示“起拍价”，围观次数（进入商品详情页的浏览次数），开始时间
            if (status == 0){

                currentpricestr = "起拍价";
                countstr = "围观";
                numvalue = browseNum;
                timestr = "预计今天22:00开始";
                //注意这里根据是否已经提醒选择已提醒或者是未提醒  1已提醒 2未提醒
                righticonPath = remindFlag == 1 ? "../../public/images/auction/ic_ytx.png" : "../../public/images/auction/ic_tx.png";//提醒我icon
                righticonstr = remindFlag == 1 ? "已提醒" : "提醒我";
                clickfunction = this.clickremind.bind(this,pid,index);

            }
            //进行中 展示“当前价”，出价次数，预计结束时间
            else if (status == 1){

                currentpricestr = "当前价";
                countstr = "出价";
                numvalue = bidNum;
                timestr = "预计今天22:00结束";
                righticonPath = "../../public/images/auction/ic_ljp.png";//立即拍icon
                righticonstr = "立即拍";

            }

            //已结束 展示“成交价”，出价次数，实际结束时间
            else if (status == 2){

                currentpricestr = "成交价";
                countstr = "出价";
                numvalue = bidNum;
                timestr = "预计今天22:00结束";
                righticonPath = "../../public/images/auction/ic_yjs.png";//已结束icon
                righticonstr = "已结束";


            }



            var detailrightstyle = {
                width:"27%",
                height:"3rem",//和左侧的区域高度保持一致
                boxSizing:"border-box",
                //注意react.js中直接这样设置background后面设置background-size会在状态改变时失效,故采用分开的方式设置
                // background:'url('+righticonPath+') no-repeat center top',
                backgroundImage:'url('+righticonPath+')',
                backgroundRepeat:"no-repeat",
                backgroundPosition:"center top",
                backgroundSize:"1.6rem",
                textAlign:"center",
                color:"#202020",
                fontSize:"1.1rem",
                lineHeight:"1.2rem",
                paddingTop:"1.8rem",
            };

            var element =

                <div className="auctionproduct flexbox flex-align-center" style={productstyle} onClick={this.clickprodetail.bind(this,pid)}>

                    {/*拍品图片*/}
                    <div className="proimg" style={proimgstyle}></div>

                    {/*拍品内容区域*/}
                    <div className="procontent" style={procontentstyle}>

                        {/*拍品标题*/}
                        <p className="protitle twoClamp" style={protitlestyle}>{title}</p>

                        {/*拍品价格*/}
                        <p className="proprice" style={propricestyle}>
                            <span style={{fontSize:"1rem",}}>当前价</span>{price}
                        </p>

                        {/*拍品详情区域*/}
                        <div className="prodetail flexbox" style={prodetailstyle}>

                            {/*详情左区域*/}
                            <div className="detailleft" style={{width:"73%",height:"3rem",}}>

                                {/*出价或者围观次数*/}
                                <p className="procount" style={{color:"#999999",fontSize:"1.4rem",height:"1.6rem",lineHeight:"1.6rem",}}>{countstr}<span className="number" style={{color:"#202020",}}>{numvalue}</span>次</p>

                                {/*拍卖时间*/}
                                <p className="protime" style={{color:"#999999",fontSize:"1.2rem",height:"1.4rem",lineHeight:"1.4rem",}}>{timestr}</p>

                            </div>

                            {/*详情右区域*/}
                            <div className="detailright" style={detailrightstyle} onClick={clickfunction}>{righticonstr}</div>

                        </div>

                        {/*内容分割线 使用定位移至最下面*/}
                        <span className="line" style={{position:"absolute",bottom:"0px",left:"1rem",right:"1rem",height:"1px",backgroundColor:"#ededed",}}></span>


                    </div>

                </div>;

            elementsArr.push(element);

        }

        return elementsArr;

    }

    //加载完毕之后初始化mescroll控件
    componentDidMount(){

        //移除缓冲条
        $('.loader-inner').remove();


        var _this = this;
        //加载完配置区域的数据之后开始设置上拉刷新和下拉加载
        var mescroll = new MeScroll("mescrolldiv", { //第一个参数"mescrolldiv"对应布局结构中父容器div的id  如果body是滚动区域的话,则对应的应该为body
            //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
            //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
            down: {
                use: true, //是否初始化下拉刷新; 默认true
                isLock: true, //是否锁定下拉,默认false;
                auto:true,//是否在初始化完毕之后自动执行下拉刷新的回调 callback
                autoShowLoading:false,//如果设置auto=true ( 在初始化完毕之后自动执行下拉刷新的回调 ),那么是否显示下拉刷新的进度
                callback: _this.loadmoredata.bind(_this) //下拉刷新的回调
            },
            up: {

                page: {
                    num: _this.state.firstResult, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: _this.state.pageSize, //每页数据条数
                    time: _this.state.date //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                },

                callback: _this.loadmoredata.bind(_this), //上拉加载的回调
                noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                scrollbar:{use : false},//设置不开启滚动条样式
                isBounce: false, //如果您的项目是在iOS的微信,QQ,Safari等浏览器访问的,建议配置此项
                /*
               toTop:
               回到顶部按钮的配置:
               src : 图片路径,必须配置src才会显示回到顶部按钮,不配置不显示
               offset : 列表滚动1000px显示回到顶部按钮
               warpClass : 按钮样式
               showClass : 显示样式
               hideClass : 隐藏样式
               duration : 回到顶部的动画时长
            */
                toTop:{
                    src : '../../public/images/base/goTop.png' ,//注意是以html为目标的相对路径
                    offset : 1000 ,
                    warpClass : "mescroll-totop" ,
                    showClass : "mescroll-fade-in" ,
                    hideClass : "mescroll-fade-out" ,
                    duration : 300
                },
                htmlNodata:'<p class="upwarp-nodata">   -- 人家是有底线的 --   </p>',

            }
        });

        this.setState({
            mescroll:mescroll,
        });

    }

    render(){

        //获取当前的拍品列表数据源
        var auctionList = this.state.auctionList;
        var productlistelements = this.creatlistelement(auctionList);


        return (

            <div className="mybodydiv">

                {/*如果是APP环境则没有导航栏,wab站有导航栏组件*/}
                {ifApp ? null : <Navdiv navtitle="我是网页标题" righttype="yipai"></Navdiv>}

                {/*筛选面板区域*/}
                <Fliterdiv
                            firstTypeId={this.state.firstTypeId} /*一级分类id*/
                            subTypeId={this.state.subTypeId} /*二级分类id*/
                            contentIds={this.state.contentIds} /*当前选中的多个三级以及对应的其四级的参数*/
                            sortType={this.state.sortType} /*排序类型*/
                            auctionstate={this.state.auctionstate} /*拍卖状态*/
                            auctionstarttime={this.state.auctionstarttime} /*开拍时间*/
                            beginPrice={this.state.beginPrice} /*最低价*/
                            endPrice={this.state.endPrice} /*最高价*/


                    /*开始加载拍品列表数据的函数方法(筛选面板中的所有需要重新加载数据的方法回调均放在这个函数中)*/
                            beginloaddata={this.beginloaddata.bind(this)}
                >

                </Fliterdiv>

                {/*上拉刷新下拉加载控件区域*/}
                <div className='mescrolldiv mescroll' id='mescrolldiv' style={{height:$('body').height(),backgroundColor:"#ededed",}} >

                    {productlistelements}

                </div>

            </div>

        );
    }

}



ReactDOM.render(<Mybodydiv/>, document.getElementById('reactdiv'));