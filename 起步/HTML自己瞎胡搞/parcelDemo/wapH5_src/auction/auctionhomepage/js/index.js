//搜索框组件(绝对定位)
class SearchBardiv extends React.Component{


    // //为属性指定默认值
    // static defaultProps = {
    //     placeholder:'',
    // };

    constructor(props){
        super(props);
        this.state = {
            searchtext:"",//设置默认的搜索文本为空字符串
            ifshowmask:false,//是否显示蒙版
        };
    }

    componentDidMount(){
        //组件挂载时

        //由于增加了一个搜索框(fixed定位组件),所以这里根据不同环境设置搜索框距上的距离
        var pastbodypt = $('body').css('padding-top');

        //设置当前body的padding-top在原有基础上增加一个搜索框的高度(4.4rem)
        $('body').css({
            "padding-top":parseInt(pastbodypt) + $('.searchdiv').outerHeight(true),
        });
    }

    //输入框获取焦点的事件
    focusclick(event){

        //如果是APP环境的话,则当输入框获取焦点的时候跳转到APP的搜索页面
        if (ifApp){

            try{

                event.target.blur();//失去焦点
                //链接中的fromsign 1 从首页一级分类入口  2从分类列表中的二级分类入口 3从开拍预告入口  4从首页搜索入口 默认为空字符串

                //给原生的搜索页面链接
                var searchurl = jumpUrl.AcutionProductLists + "fromsign=4";
                jumptosearchpage({placeholdertext:this.state.searchtext,searchurl:searchurl});//传递给原生搜索框中的placeholder

            }
            catch(e) {
                //跳转APP搜搜页面失败
                console.log('跳转APP搜搜页面失败,使用wab站搜索机制');
                //让body不能滚动
                $('body').css('overflow','hidden');
                //wab站环境
                this.setState({
                    ifshowmask:true,
                });

            }
            finally {
                console.log('开始搜索');
            }



        }
        else {

            //让body不能滚动
            $('body').css('overflow','hidden');
            //wab站环境
            this.setState({
                ifshowmask:true,
            });

        }

    }

    //输入框失去焦点的事件
    blurclick(event){

        //让body可以滚动
        $('body').css('overflow','auto');
        this.setState({
            ifshowmask:false,
        });

    }

    clickmaskdiv(){
        //让body可以滚动
        $('body').css('overflow','auto');
        this.setState({
            ifshowmask:false,
        });
    }

    //输入搜索文本事件
    handleChange(event){
        //获取输入的文本:
        var value = event.target.value;
        console.log("输入时的文本为:" + value);

        this.setState({searchtext:value});
        event.preventDefault();

    }

    //点击搜索按钮的事件(APP中跳转至APP的搜索页面 其他环境中当前页面加蒙版的方式进行显示)
    clicksearchbtn(event){

        //此事件只可能出现在wab站环境中,APP环境获取焦点时跳转到APP搜索页面
        event.preventDefault();

        //跳转到搜索结果列表页面
        //链接中的fromsign 1 从首页一级分类入口  2从分类列表中的二级分类入口 3从开拍预告入口  4从首页搜索入口 默认为空字符串


        location.href = jumpUrl.AcutionProductLists + "fromsign=4&name=" + this.state.searchtext;

    }

    render(){

        //搜索框内的搜索文本
        const searchtext = this.state.searchtext;


        //当搜索文本为空的时候隐藏搜索按钮
        const searchbtnclass = searchtext.length == 0 ? "searchbtn hide" : "searchbtn";

        //搜索背景蒙版样式
        var searchbgmaskstyle = {
            background: "rgba(0,0,0,0.6)",//背景颜色及透明度
            width: "100%",
            height: "100%",
            position: "fixed",
            left: "0px",
            top: "0px",//注意搜索框距上的位置是看当前环境是否为wab站,有wab站则说明有导航栏,则距上应为4.4rem,否则为0
            zIndex: "2",/*将蒙版放在最前面但是放在头部和搜索框后面  注意轮播图z-index为1,所以这里设置为2*/
        };

        //搜索框样式
        var searchbarstyle = {
            position:"fixed",//绝对定位
            top:ifApp ? "0px" : ifopenApp ? "8.8rem" : "4.4rem",//搜索框距上的距离
            zIndex:"9",
            height:"4.4rem",//固定搜索框区域高度
        }


        var searchmaskclass = this.state.ifshowmask ? "" : "hide";




        return (
                    <div className='SearchBardiv'>

                        {/*搜索蒙版 fixed定位 zindex=2*/}
                        <div className={"searchbgmask "+searchmaskclass} style={searchbgmaskstyle} onClick={this.clickmaskdiv.bind(this)}></div>

                        {/*搜索框内容区域*/}
                        <div className="searchdiv" style={searchbarstyle}>

                            <input type="search" ref="searchinput" className="searchbar" placeholder={this.props.placeholder} value={searchtext}

                                   onChange={this.handleChange.bind(this)} onFocus={this.focusclick.bind(this)} onBlur={this.blurclick.bind(this)}/>

                            <button className={searchbtnclass} onClick={this.clicksearchbtn.bind(this)}>搜索</button>
                        </div>

                    </div>
        );
    }

}

//拍卖一级分类组件
class TypeListdiv extends React.Component{

    // //为属性指定默认值
    // static defaultProps = {
    //     typeList:[],
    // };

    constructor(props){
        super(props);
    }

    //点击一级分类的方法
    clicktypeitem(typeId){

        //获取该分类的分类id(更多的分类id固定为-100)
        var typeid = typeId;
        //点击了更多分类,跳转到拍卖分类列表页
        if(typeid == '-100'){
            location.href = jumpUrl.AuctionTypeListPage;
        }
        //点击了指定的分类,跳转至拍品列表页将该分类id传递过去
        else{
            //跳转到一级分类列表页面 fromsign 1 从首页一级分类入口  2从分类列表中的二级分类入口 3从开拍预告入口  4从首页搜索入口 默认为空字符串
            location.href = jumpUrl.AcutionProductLists + "fromsign=1&firstTypeId=" + typeid;
        }


    }

    render(){
        //分类列表区域数据(将后台返回的图片根据数量平均分然后图片充满即可)
        var typelistArr = [];
        var typelists = this.props.typeList;
        for (var index in typelists){
            var typelist = typelists[index];
            var img = typelist.img;

            //计算每一个分类的图片宽高
            var trueheight = returnpicratewithUrl(img) * ($('body').width()/typelists.length);
            var itemstyle = {
                height:trueheight,
                background:"url("+imgIndexUrl+img+") no-repeat center",
                backgroundSize:"100% 100%",
            }
            var divelement = <div className='typeitem flexitem1' key={typelist.typeId}
                                  onClick={this.clicktypeitem.bind(this,typelist.typeId)} style={itemstyle}></div>;
            typelistArr.push(divelement);
        }

        return (
            <div className="typelistdiv flexbox">
                {typelistArr}
            </div>
        );
    }
}

//可配置样式组件 (包括配置样式1和2,根据参数showtype的值进行不同样式的选择 1 一上三下  2左一右二)
class Configpositiondiv extends React.Component{

    // //为属性指定默认值
    // static defaultProps = {
    //     showtype:1,
    //     dataArr:[]
    // };

    constructor(props){
        super(props);
    }

    //点击配置区域的item 根据不同的type跳转专场或者详情或者其他链接
    clickconfigitem(datadic){

        //区分不同的点击类型
        var targetType = datadic.targetType;//点击类型
        var firstColumn = datadic.firstColumn;//跳转参数
        //拍卖专场
        if (targetType == 0){
            location.href = jumpUrl.AcutionSpecialperformancePage + "id=" + firstColumn;
        }
        //拍卖商品详情
        else if(targetType == 1){
            mainTip("跳转到了拍卖商品详情,拍品id为:" + firstColumn);
        }
        //跳转其他链接
        else if(targetType == 2){
            location.href = firstColumn;
        }
    }

    render(){
        //首先获取显示的类型
        var showtype = this.props.showtype;
        //数据源(已经排好序的)
        var dataArr = this.props.dataArr;
        var elementsArr = [];
        //左一右二样式下第一张图片的高度
        var thefirstheight = '';
        //左一右二下的外层容器的高度(必须设置)
        var configpositiondivstyle ={};

        for (var index in dataArr){
            var datadic = dataArr[index];
            var img = datadic.img;

            //根据不同的展示设置不同的样式
            var mystyle = {
                background:"url("+imgIndexUrl+img+") no-repeat center",
                backgroundSize:"100% 100%",
            };

            //左一右二样式

            if (showtype == 1){

                if (index == 0){

                    mystyle.width = "50%";
                    thefirstheight = returnpicratewithUrl(img) * ($('body').width()/2);
                    mystyle.height = thefirstheight;
                    configpositiondivstyle.height = thefirstheight;

                }
                else if (index == 1){
                    mystyle.width = "50%";
                    mystyle.height = thefirstheight/2;
                }
                else if (index == 2){
                    mystyle.width = "50%";
                    mystyle.height = thefirstheight/2;
                }
            }

            //一上三下样式
            else if(showtype == 2){

                if (index == 0){

                    mystyle.width = "100%";
                    mystyle.height = returnpicratewithUrl(img) * ($('body').width());

                }
                else if (index == 1){
                    mystyle.width = $('body').width()/3;
                    mystyle.height = returnpicratewithUrl(img) * ($('body').width()/3);


                }
                else if (index == 2){
                    mystyle.width = $('body').width()/3;
                    mystyle.height = returnpicratewithUrl(img) * ($('body').width()/3);

                }
                else if (index == 3){
                    mystyle.width = $('body').width()/3;
                    mystyle.height = returnpicratewithUrl(img) * ($('body').width()/3);

                }


            }

            var divelement = <div className='configitem' key={datadic.itemPosition}
                                  onClick={this.clickconfigitem.bind(this,datadic)} style={mystyle}></div>;
            elementsArr.push(divelement);

        }

        return (
            <div className={showtype == 1 ? 'flexbox flexboxwrap flex-direction-column' : 'flexbox flexboxwrap '} style={configpositiondivstyle}>
                {elementsArr}
            </div>
        );
    }
}

//轮播组件(公共public_react.js文件中)

//整体配置区域组件  包含(搜索区域 分类 轮播 配置区域等集合)
class ConfigDiv extends React.Component{
    // static defaultProps = {
    //    //因为这里牵扯到轮播图的数据,所以不设置默认的参数数据
    // };

    constructor(props){
        super(props);
    }


    render(){

        //当有轮播数据时才进行加载轮播控件,没有数据的时候不会进行加载(因为后面轮播图的初始化需要用到轮播数据)

        var lunboelement = this.props.carouselfigureList ? <LunBodiv dataArr={this.props.carouselfigureList} sign="auctionhomepagedanzhang" type="danzhang"></LunBodiv> : null;{/*轮播图组件*/}

        //根据配置区域的指定展示顺序来返回对应的元素 1代表区域1在前  2代表区域2在前
        var configdivarr = this.props.index == 2 ?
            [
            <Configpositiondiv key={2} showtype={2} dataArr={this.props.positionSecondList} ></Configpositiondiv>,/*一上三下的配置区域组件*/
            <Configpositiondiv key={1} showtype={1} dataArr={this.props.positionFirstList} ></Configpositiondiv>/*左一右二的配置区域组件*/
            ]
            :
            [
                <Configpositiondiv key={1} showtype={1} dataArr={this.props.positionFirstList} ></Configpositiondiv>,/*左一右二的配置区域组件*/
                <Configpositiondiv key={2} showtype={2} dataArr={this.props.positionSecondList} ></Configpositiondiv>/*一上三下的配置区域组件*/
            ];




        return (
            <div className='configdiv'>

                <TypeListdiv typeList={this.props.typeList}></TypeListdiv>{/*拍卖一级分类列表组件*/}
                {configdivarr}{/*配置区域的展示数组*/}
                {lunboelement}{/*注意轮播图必须是有完整数据之后再进行初始化,否则不会再次走componentdidmount方法,也就不会再初始化轮播图了*/}

            </div>
        );
    }
}

//对一级分类数据数据源做处理,分类数据大于4个则取数组的前四个,最后一个拼接上更多的数据源
function handletypelistsArr(typelistsArr,moreImg) {

    //规则: 如果数量typelistsArr数量超过4个则只取数据中的前4条数据,手动拼接最后一条数据为更多
    if (typelistsArr.length > 4){
        typelistsArr = typelistsArr.slice(0,4);//取出前4条数据
        var itemdic = {typeId:-100,img:moreImg};
        typelistsArr.push(itemdic);//手动添加一条更多的数据,更多的固定typeid为-100
    }
    return typelistsArr;
}

//开拍预告组件
class AdvanceAuctiondiv extends React.Component{

    // //为属性指定默认值
    // static defaultProps = {
    //
    // };

    constructor(props){
        super(props);
        this.state = {
            auctionList:[],//预告商品列表
            ajaxrequest:null,//ajax请求实体
        };

    }

    //点击了查看更多 进入特定时间线下的拍品列表页面
    clickmore(){

        //跳转到即将开始以及最近7天的拍品筛选列表页面 fromsign 1 从首页一级分类入口  2从分类列表中的二级分类入口 3从开拍预告入口  4从首页搜索入口 默认为空字符串
        location.href = jumpUrl.AcutionProductLists + "fromsign=3&auctionstate=0&auctionstarttime=4reqType=1";//这里注意需要多传一个reqType的标识

    }


    //元素加载到Dom中之后进行ajax请求
    componentDidMount(){
        const _this = this;
        var ajaxrequest = $.ajax({
            url:auctionnotice,
            data:getAuth(),
            success:function (data) {
                if (data.errCode == 0){

                    var resultdata = data.resultdata;
                    var auctionList = resultdata.auctionList;
                    _this.setState({
                        auctionList:auctionList,
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
            ajaxrequest:ajaxrequest,//ajax请求实体
        });

    }


    //如果是异步获取数据，则在componentWillUnmount中取消发送请求
    componentWillUnmount () {
        //取消发送请求
        var ajaxrequest = this.state.ajaxrequest;
        if (ajaxrequest){ajaxrequest.abort();}
    }

    render(){

        var titleareaheight = (($("body").width() - 20 - 3* 20)/3.5/2).toString() + "px";
        var titleareastyle1 = {
            width:"50%",
            height:titleareaheight,
            lineHeight:titleareaheight,
            color:"#202020",
            fontSize:"1.4rem",
            textAlign:"left",
            float:"left",
        };
        var titleareastyle2 = {
            width:"50%",
            height:titleareaheight,
            lineHeight:titleareaheight,
            color:"#cdcdcd",
            fontSize:"1.4rem",
            textAlign:"right",
            float:"right",
            background:"url('../../public/images/base/goArr.png') no-repeat right center",//注意这里是写在html中的,所以层级应为2层
            backgroundSize:"3rem",
            paddingRight:"3rem",
            boxSizing:"border-box",
            WebkitBoxSizing:"border-box",
        }

        // 注意要在componentDidUpdate方法中进行初始化swiper
        var elementsArr = [];
        //遍历数据源中的商品列表数据
        var auctionList = this.state.auctionList;

        //增加一个判断  数量少于4个不展示整个预告区域,直接返回false(即没有数据时也是返回null而不会重新加载轮播图组件)
        if (auctionList.length < 4){
            return false;
        }

        var lunboelement = auctionList.length == 0 ? null : <LunBodiv sign="auctionhomepageduozhang" type="duozhang" dataArr={auctionList}></LunBodiv>;

        return (
            <div className='auctionadvancediv' style={{marginTop:"10px",marginBottom:"10px",}}>

                <div className="titlearea clearfix" style={{marginLeft:"25px"}} >

                    <p className='titlearea1' style={titleareastyle1}>开拍预告</p>
                    <p className='titlearea2' style={titleareastyle2} onClick={this.clickmore.bind(this)}>查看更多</p>

                </div>{/*预告导航*/}
                {lunboelement}{/*全屏多张轮播组件*/}

            </div>
        );
    }


}

//开拍中的倒计时样式
class TimeCountdiv extends React.Component{

    // static defaultProps = {
    //     miaocount : 0,
    // };

    constructor(props){
        super(props);


        this.state = {
            miaocount : this.props.miaocount || 0,//倒计时的总秒数 int类型
        };

    }

    //元素加载到DOM中之后设置倒计时
    componentDidMount(){

        const _this = this;
        //设置倒计时
        _this.timerID = setInterval(function () {
            //设置this.state中的倒计时总秒数
            _this.setState({
                miaocount:_this.state.miaocount - 1,
            });
        },1000);

    }

    //组件即将卸载的时候清除定时器
    componentWillUnmount(){
        clearInterval(this.timerID);
    }

    render(){

        //倒计时展示区域

        var time_distance = this.state.miaocount;
        var int_hour,int_minute,int_second;
        if(time_distance>0){

            int_hour=Math.floor(time_distance/3600);
            var left1 = Math.floor(time_distance%3600);
            int_minute=Math.floor(left1/60);
            var left2 = Math.floor(left1%60);
            int_second=Math.floor(left2);
            if(int_hour<10)
                int_hour="0"+int_hour;
            if(int_minute<10)
                int_minute="0"+int_minute;
            if(int_second<10)
                int_second="0"+int_second;

        }

        var leftsidewidth = $('body').width() - 12.5 - 12.5 - 65;//倒计时区域在左侧不遮挡右侧出价次数的按钮显示区域

        var countdownstyle = {
            marginTop:"1rem",
            fontSize:"1.3rem",
            textAlign:"left",
            width:leftsidewidth,
            height:"1.3rem",
            lineHeight:"1.3rem",
            color:"#666666",
        };
        var countstyle = {
            color:"#ff3b30",
        };
        var countdowndiv = <p className="countdowndiv oneClamp" style={countdownstyle}>

            {"距结束 "}
            <span className="count" style={countstyle}>{int_hour}</span>
            {"时"}
            <span className="count" style={countstyle}>{int_minute}</span>
            {"分"}
            <span className="count" style={countstyle}>{int_second}</span>
            {"秒"}

        </p>;

        return (
            countdowndiv
        );
    }

}

//开拍进行中商品列表的样式
class AuctionIngproduct extends React.Component{
    // static defaultProps = {
    //     auctiondic : {},
    // };

    constructor(props){
        super(props);

    }


    //点击每一个拍品的操作
    clickproduct(pid){
        mainTip("点击的拍品pid为:" + pid);
    }

    render(){
        var auctiondic = this.props.auctiondic;

        var pid = auctiondic.pid;//商品id
        var title = auctiondic.title;//商品名称
        var orgName = auctiondic.orgName;//送拍机构名称
        var carouselImg = auctiondic.carouselImg;//轮播图片名称多个“,”号分隔
        var carouselImgs = carouselImg.split(',');//轮播图片数组
        var endTime = auctiondic.endTime;//拍卖结束时间（yyyy-MM-dd hh:mm:ss）
        var nowTime = auctiondic.nowTime;//系统当前时间
        //计算差值秒数
        var miaocount = counttimewithstr(nowTime,endTime);

        //出价次数(大于999显示999+)
        var bidNum = parseInt(auctiondic.bidNum) > 999 ? "999+" : auctiondic.bidNum;

        //拍品区域样
        var productstyle = {
            borderBottom:"1px solid #ededed",
            padding:"10px 12.5px 19px 12.5px",
            position:"relative",
        };

        //拍品图片区域
        var imgsArr = [];
        for (var index in carouselImgs){
            if  (carouselImgs[index]){

                //计算拍品图片的宽度(屏幕宽度-左右间距- 2个图片间隔12之后平分三份)
                const picwidth = ($('body').width() - 12.5 -12.5 - 6*(carouselImgs.length - 1))/(carouselImgs.length);
                console.log('当前图片的宽度为:' + picwidth);
                const picheight = picwidth;

                //拍品图片区域样式
                var productpicstyle = {
                    width:picwidth,
                    height:picheight,
                };

                var Url = imgIndexUrl + carouselImgs[index];
                var productimgelement = <img key={index.toString()} style={productpicstyle} src = {Url}  className="productimg"/>;
                imgsArr.push(productimgelement);
            }
        }

        var leftsidewidth = $('body').width() - 12.5 - 12.5 - 65;
        //拍品名称样式
        var titlestyle = {
            marginTop:"0.75rem",
            fontSize:"1.7rem",
            width:leftsidewidth,
            height:"1.7rem",
            lineHeight:"1.7rem",
            color:"#202020",
            textAlign:"left",
        };



        //送拍机构样式
        var orgnamestyle = {

            marginTop:"1.5rem",
            width:leftsidewidth,
            height:"1.1rem",
            lineHeight:"1.1rem",
            fontSize:"1.1rem",
            color:"#666666",

        };

        //竞拍次数区域
        var auctioncountdivstyle = {
            backgroundColor:"#ff3b30",
            width:"65px",
            height:"65px",
            padding:"10px 0 10px 0",
            boxSizing:"border-box",
            WebkitBoxSizing:"border-box",
            borderRadius:"32.5px",
            position:"absolute",
            right:"12.5px",
            bottom:"15px",
        };

        var title1style = {
            width:"100%",
            textAlign:"center",
            height:"12.5px",
            lineHeight:"12.5px",
            fontSize:"11px",
            color:"#ffffff",
        };

        var countstyle = {
            width:"100%",
            textAlign:"center",
            height:"20px",
            lineHeight:"20px",
            fontSize:"17px",
            color:"#ffffff",

        };

        var title2style = {
            width:"100%",
            textAlign:"center",
            height:"12.5px",
            lineHeight:"12.5px",
            fontSize:"11px",
            color:"#ffafad",
        };

        var auctioncountdiv =
            <div className="auctioncountdiv" style={auctioncountdivstyle}>
                <p className="title1" style={title1style}>竞拍中</p>
                <p className="count" style={countstyle}>{bidNum}</p>
                <p className="title2" style={title2style}>次出价</p>
            </div>;

        return (
            <div className="auctionproduct" style={productstyle} onClick={this.clickproduct.bind(this,pid)}>

                <div className="flexbox flex-spacebetween">
                    {imgsArr}
                </div>{/*拍品图片区域*/}
                <p className="productname oneClamp" style={titlestyle}>{title}</p>{/*拍品标题区域*/}
                <TimeCountdiv miaocount={miaocount}></TimeCountdiv>{/*拍品倒计时区域*/}
                <p className="orgname oneClamp" style={orgnamestyle}><span style={{color:"#999999"}}>送拍机构/</span>{orgName}</p>{/*送拍机构区域*/}
                {auctioncountdiv}{/*出价次数展示区域*/}

            </div>

        );
    }

}

//开拍进行中组件
class AuctionIngdiv extends React.Component{

    // //为属性指定默认值
    // static defaultProps = {
    //     dataArr:[],
    // };

    constructor(props){
        super(props);
    }

    render(){

        var titleareaheight = (($("body").width() - 20 - 3* 20)/3.5/2).toString() + "px";//和上面的开拍预告中的标题区域保持一致
        var titleareastyle1 = {
            marginLeft:'25px',
            height:titleareaheight,
            lineHeight:titleareaheight,
            color:"#202020",
            fontSize:"1.4rem",
            textAlign:"left",
        };

        var sectitlestyle = {
            height:titleareaheight,
            lineHeight:titleareaheight,
            color:"#cdcdcd",
            fontSize:"1rem",
            textAlign:"left",
        }

        var elementsArr = [];
        //遍历数据源中的商品列表数据
        var auctionList = this.props.dataArr;

        for (var index in auctionList){

            var auctiondic = auctionList[index];

            var element = <AuctionIngproduct key={index.toString()} auctiondic={auctiondic}></AuctionIngproduct>;

            elementsArr.push(element);

        }

        return (
            <div className="auctioningdiv">
                <p className="titleareastyle1" style={titleareastyle1}>
                    开拍进行中
                    <span className="sectitle" style={sectitlestyle}>   手快有手慢无</span>
                </p>{/*开拍进行中标题栏*/}

                <ul className="productslist">
                    {elementsArr}
                </ul>{/*进行中商品列表*/}
            </div>
        );

    }
}

//根展示控件(加载页面所有的数据)
class MybodyDiv extends React.Component{

    // //为属性指定默认值
    // static defaultProps = {
    //
    // };

    constructor(props){
        super(props);

        //设置微信分享参数
        setSharepara();

        this.state = {

            ajaxrequest1:null,//第一个ajax请求实体
            searchText:"",//搜索框搜索文本
            typeList:null,//一级分类列表
            index:1,//配置区域的展示顺序 1代表区域1在前  2代表区域2在前 默认区域1在前
            positionFirstList:null,//配置区域1
            positionSecondList:null,//配置区域2
            carouselfigureList:null,//轮播图区域

            ajaxrequest2:null,//第二个ajax请求实体
            date:"",//分页需要的日期
            pageSize:"10",//每页展示的条数
            firstResult:0,//页码数
            auctionList:[],//正在进行中商品列表
            mescroll:null,//上拉下拉控件

        };


    };

    //由于该页面有fixed的搜索框元素,故在点击关闭打开APP的div之后要告知当前父组件以改变搜索框距上的距离
    clickcloseopenApp(){

        //点击了关闭打开APP时 设置搜索框距上的间距

        $('.searchdiv').css({
            "top": ifApp ? "0px" : ifopenApp ? "8.8rem" : "4.4rem",
        });

        //设置关联的滚动区域距上的距离
        $('.mescroll').css({
            "top": ifApp ? "4.4rem" : ifopenApp ? "13.2rem" : "8.8rem",
        });



    }

    //加载数据
    loaddata(ifdownrefresh){
        const _this = this;
        const mescroll =  this.state.mescroll;

        var info = {
            date:this.state.date,
            pageSize:this.state.pageSize,
            firstResult: ifdownrefresh ? 0 :this.state.firstResult,//如果是下拉刷新则页码数为0
        };


        var ajaxrequest2 = $.ajax({
            url:acutioning,
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

                        auctionList: ifdownrefresh ? auctionList : _this.state.auctionList.concat(auctionList),//如果是下拉刷新则重置数据源为当前数据,如果是上拉加载则在原有数据源基础之上再增加新数据
                        date:date,
                        firstResult: ifdownrefresh ? 0+1 : _this.state.firstResult + 1,//区分下拉刷新和上拉加载的页码数

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
            ajaxrequest2:ajaxrequest2,//ajax请求实体
        });
    }


    //元素加载到Dom中之后
    componentDidMount(){

        //移除缓冲条
        $('.loader-inner').remove();

        const _this = this;

        var ajaxrequest1 = $.ajax({
            url:auctionhomepage,
            data:getAuth(),
            success:function (data) {
                if (data.errCode == 0){

                    var resultdata = data.resultdata;
                    //搜索框的搜索文本
                    var searchText = resultdata.searchText || "";
                    //更多的图片地址
                    var moreImg =  resultdata.moreImg || "";
                    //一级分类列表
                    var typeList = resultdata.typeList;
                    //对一级分类列表数据源做相关的处理
                    typeList = handletypelistsArr(typeList,moreImg);
                    //首页配置区域顺序
                    var index = resultdata.index;//配置区域的展示顺序 1代表区域1在前  2代表区域2在前
                    //首页配置区域1(按照itemPosition属性<int>值进行升序排序)
                    var positionFirstList = resultdata.positionFirstList.sort(dicArrsortby('itemPosition',true));
                    //首页配置区域2(按照itemPosition属性<int>值进行升序排序)
                    var positionSecondList = resultdata.positionSecondList.sort(dicArrsortby('itemPosition',true));
                    //轮播图列表
                    var carouselfigureList = resultdata.carouselfigureList;


                    //加载完配置区域的数据之后开始设置上拉刷新和下拉加载
                    var mescroll = new MeScroll("mescrolldiv", { //第一个参数"mescrolldiv"对应布局结构中父容器div的id  如果body是滚动区域的话,则对应的应该为body
                        //如果您的下拉刷新是重置列表数据,那么down完全可以不用配置,具体用法参考第一个基础案例
                        //解析: down.callback默认调用mescroll.resetUpScroll(),而resetUpScroll会将page.num=1,再触发up.callback
                        down: {
                            use: true, //是否初始化下拉刷新; 默认true
                            auto:true,//是否在初始化完毕之后自动执行下拉刷新的回调 callback
                            autoShowLoading:false,//如果设置auto=true ( 在初始化完毕之后自动执行下拉刷新的回调 ),那么是否显示下拉刷新的进度
                            isLock: true, //是否锁定下拉,默认false; 如果配置true,则会锁定不可下拉,可通过调用mescroll.lockDownScroll(false)解锁
                            callback: _this.loaddata.bind(_this,true) //下拉刷新的回调
                        },
                        up: {
                            use: true, //是否初始化上拉加载; 默认true
                            auto:false,//是否在初始化完毕之后自动执行一次上拉加载的回调  1.3.1以前版本默认false  1.3.1版本默认true
                            isLock: false, //是否锁定上拉加载 如果配置true,则会锁定不可上拉,可通过调用mescroll.lockUpScroll(false)解锁
                            isBounce: false, //是否允许ios的bounce回弹;默认true,允许回弹 (v 1.3.0新增) 如果您的项目是在iOS的微信,QQ,Safari等浏览器访问的,建议配置此项
                            offset:100,//列表滚动到距离底部小于100px,即可触发上拉加载的回调
                            noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
                            /*
                            回到顶部按钮的配置:
                            warpId: 父布局的id; 默认添加在body中 (v 1.2.8 新增)
                            src : 图片路径,必须配置src才会显示回到顶部按钮,不配置不显示
                            html: 标签内容,默认null; 如果同时设置了src,则优先取src (2017/12/10新增)
                            offset : 列表滚动1000px显示回到顶部按钮
                            warpClass : 按钮样式
                            showClass : 显示样式
                            hideClass : 隐藏样式
                            duration : 回到顶部的动画时长, 默认300ms
                            supportTap: 如果您的运行环境支持tap,则可配置true,可减少点击延时,快速响应事件;默认false,通过onclick添加点击事件; (v 1.3.0 新增) (注:微信和PC无法响应tap事件)
                            */
                            toTop:{
                                src : '../../public/images/base/goTop.png' ,//注意是以html为目标的相对路径
                                offset : 1000,
                                warpClass : "mescroll-totop" ,
                                showClass : "mescroll-fade-in" ,
                                hideClass : "mescroll-fade-out" ,
                                duration : 300,
                            },
                            htmlLoading:'<p class="upwarp-progress mescroll-rotate"></p><p class="upwarp-tip">玩儿命加载中...</p>',//上拉加载中的布局
                            htmlNodata:'<p class="upwarp-nodata">   -- 人家是有底线的 --   </p>',//无数据的布局
                            page: {
                                num: _this.state.firstResult, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                                size: _this.state.pageSize, //每页数据条数
                                time: _this.state.date //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
                            },
                            callback: _this.loaddata.bind(_this,false), //上拉加载的回调
                            scrollbar:{use : false},//设置不开启滚动条样式

                        }
                    });

                    console.log('当前mescroll的版本号为:' + mescroll.version);

                    //成功获取所有数据之后进行设置
                    _this.setState({
                        searchText:searchText,//搜索框搜索文本
                        typeList:typeList,//一级分类列表
                        index:index,//配置区域顺序
                        positionFirstList:positionFirstList,//配置区域1
                        positionSecondList:positionSecondList,//配置区域2
                        carouselfigureList:carouselfigureList,//轮播图区域
                        mescroll:mescroll,//上拉刷新下拉加载控件
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

        this.setState({
            ajaxrequest1:ajaxrequest1,
        });

    }

    //如果是异步获取数据，则在componentWillUnmount中取消发送请求
    componentWillUnmount () {
        //取消发送请求
        var ajaxrequest1 = this.state.ajaxrequest1;
        if (ajaxrequest1){ajaxrequest1.abort();}

        var ajaxrequest2 = this.state.ajaxrequest2;
        if (ajaxrequest2){ajaxrequest2.abort();}    }

    render(){

        //可滑动区域的样式设置

        var mescrollstyle = {
            width:"100%",
            height:"auto",//需要重写样式以覆盖mescroll中的height=100%的样式
            position:"fixed",//绝对定位
            top:ifApp ? "4.4rem" : ifopenApp ? "13.2rem" : "8.8rem",//距上的距离  需要加上搜索框的高度
            bottom:"0px",
            left:"0px",
            zIndex:"1",/*因为搜索蒙版的zindex是2 所以要小于搜索蒙版*/

        }


        return (

            <div className="bodydiv">

                {/*如果是APP环境则没有导航栏,wab站有导航栏组件*/}
                {ifApp ? null : <Navdiv navtitle="超级拍卖" righttype="yipai" clickcloseopenApp={this.clickcloseopenApp.bind(this)}/*点击打开APP中的关闭按钮的函数回调*/ ></Navdiv>}

                {/*搜索框组件 fixed定位*/}
                <SearchBardiv placeholder={this.state.searchText}></SearchBardiv>

                {/*上拉刷新下拉加载控件区域*/}
                <div className='mescrolldiv mescroll' id='mescrolldiv' style={mescrollstyle}>

                    {/*分类 轮播 配置区域等集合区域*/}
                    <ConfigDiv typeList={this.state.typeList} index={this.state.index} positionFirstList={this.state.positionFirstList} positionSecondList={this.state.positionSecondList} carouselfigureList={this.state.carouselfigureList}></ConfigDiv>

                    {/*拍卖预告区域*/}
                    <AdvanceAuctiondiv></AdvanceAuctiondiv>

                    {/*拍卖进行中区域*/}
                    <AuctionIngdiv dataArr={this.state.auctionList}></AuctionIngdiv>

                </div>

            </div>

        );
    }

}




//设置分享相关内容
var shareparameter;
function setSharepara() {
    //share_img	分享文案图片地址
    var share_img = publicUrl + "public/images/auction/ic_pmshare.png";
    //share_title	分享文案标题
    var share_title = "[超级拍卖]";
    //share_explain	分享文案说明
    var share_explain = "玩赚拍卖，出价即赚，投资收藏美，捡漏淘宝贝，尽在公平开放的超级拍卖。";

    //构造分享参数:
    //如果是在微信中,则设置微信分享效果
    if(isWeiXin()) {
        //注入权限
        wXConfig({
            title:share_title,
            desc:share_explain,
            imgUrl:share_img,
        });
    }
    //不在微信中，默认为在APP中，通过交互方法向原生发送分享参数
    else {
        //当点击分享按钮的时候原生APP会请求H5的分享数据，在这里将分享参数传递给原生
        //格式固定: sharetitle:分享标题 sharedescr:分享内容描述  shareimg:分享出去的图片  shareurl:分享出去的链接

        shareparameter = {"sharetitle":share_title,"sharedescr":share_explain,"shareimg": share_img,"shareurl":location.href};
    }

}
/*设置该页面在手机app中的分享参数*/
function getshareparpmeter() {
    return shareparameter;
}

ReactDOM.render(
    <MybodyDiv></MybodyDiv>,document.getElementById('reactdiv')
)








