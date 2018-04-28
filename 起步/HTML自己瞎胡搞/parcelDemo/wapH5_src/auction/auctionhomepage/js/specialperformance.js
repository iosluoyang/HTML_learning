
class MybodyDiv extends React.Component{

    //设置默认参数
    static defaultProps = {

    };

    constructor(props){
        super(props);
        this.state = {
            ajaxrequest:null,//ajax请求实体
            id:GetQueryString("id") || "",//拍卖专场id
            date:"",//分页需要的日期
            pageSize:"10",//每页展示的条数
            firstResult:0,//页码数
            bean:null,//专场信息
            auctionList :[],//拍品列表
            mescroll:null,//上拉下拉控件
        };
    }

    //请求数据方法
    loadmoredata(){

        const _this = this;
        const mescroll =  this.state.mescroll;

        var info = {
            id:this.state.id,
            date:this.state.date,
            pageSize:this.state.pageSize,
            firstResult:this.state.firstResult
        };

        var ajaxrequest = $.ajax({
            url:auctionspecailperformancedetail,
            data:getAuth()+"info="+JSON.stringify(info),
            success:function (data) {
                if (data.errCode == 0){

                    var resultdata = data.resultdata;
                    var bean = resultdata.bean;

                    //如果是第0页的话改变浏览器标题,设置为专场名称
                    if (_this.state.firstResult == 0){
                        var name = bean.name;//专场名称
                        changewebtitle(name);
                    }

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

                        bean:bean,//专场信息
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

    //点击拍品列表进入拍品详情
    clickpro(pid){
        mainTip('点击进入拍品详情,该拍品id为:' + pid);
    }

    //挂载之后初始化mescroll
    componentDidMount(){

        //移除缓冲条
        $('.loader-inner').remove();


        const _this = this;
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
                noMoreSize: 3, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
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


    //如果是异步获取数据，则在componentWillUnmount中取消发送请求
    componentWillUnmount () {
        //取消发送请求
        var ajaxrequest = this.state.ajaxrequest;
        if (ajaxrequest){ajaxrequest.abort();}

    }


    render(){

        //专场基本信息
        var bean = this.state.bean;
        var bannerelement =  bean && bean.bannerimg ? <img src={imgIndexUrl + bean.bannerimg} style={{width:$('body').width()}} /> : null;

        var prosulstyle = {
            width:"100%",
            padding:"0 1rem",
            backgroundColor:"#f7f7f7",
            boxSizing:"border-box",
            WebkitBoxSizing:"border-box",
        };



        var productselementsArr = [];
        for (var index in this.state.auctionList){
            var auctiondict = this.state.auctionList[index];
            var pid = auctiondict.pid;//商品id
            var title = auctiondict.title;//商品名称
            var price = "起拍价&yen;" +  handlethepriceshow(auctiondict.price);//起拍价格
            var img = auctiondict.img;//图片地址
            var status = auctiondict.status;//拍品状态 0即将开始1进行中2已结束
            var tag = status == 0 ? "即将开始" : status == 1 ? "进行中" :"已结束" ;
            var otherPrice = status == 2 ? "成交价 &yen;" + handlethepriceshow(auctiondict.otherPrice) : "当前价 &yen;" + handlethepriceshow(auctiondict.otherPrice) ;//当前价,成交价
            var browseNum = auctiondict.browseNum + "人围观";//浏览次数



            var auctionlistyle = {
                position:"relative",
                width:"100%",
                marginTop:"1rem",
                boxShadow:"2px 2px 5px #888888",
                boxSizing:"border-box",
                WebkitBoxSizing:"border-box",
            };

            var tagstyle = {
                width:"9.15rem",
                height:"2.5rem",
                lineHeight:"2.5rem",
                background:"url("+publicUrl+"public/images/auction/ic_zcmark.png"+") no-repeat left top",
                backgroundSize:"100% 100%",
                fontSize:"1.4rem",
                color:"#ffffff",
                textAlign:"center",
                position:"absolute",
                left:"0px",
                top:"0.5rem",
                zIndex:2,//要比定位的img高一些
            };



            var imgdivstyle = {
                position:"relative",
                width:"100%",
                height:"21rem",
                background:"url("+imgIndexUrl+img+") no-repeat left top",
                backgroundSize:"cover",
            };


            var desdivstyle = {
                position:"absolute",
                left:"0px",
                right:"0px",
                bottom:"0px",
                height:"4.4rem",
                lineHeight:"4.4rem",
                backgroundColor:"rgba(0,0,0,0.5)",
                fontSize:"1.5rem",
                color:"#ffffff",

            };

            var pricediv = {
                fontSize:"1.5rem",
                color:"#202020",
                width:"100%",
                height:"4.4rem",
                lineHeight:"4.4rem",
                background:"url("+publicUrl+"public/images/auction/ic_zcline.png"+") no-repeat center",
                backgroundSize:" 1px 2.9rem",

            }


            var element = auctiondict ?
                <li className='auctionli' key={index.toString()} style={auctionlistyle} onClick={this.clickpro.bind(this,pid)}>

                    {/*拍品标签*/}
                    <span className="tag" style={tagstyle}>{tag}</span>

                    {/*拍品图片*/}
                    <div className="proimgdiv" style={imgdivstyle}>
                        { /*拍品名称及围观人数*/}
                        <div className="desdiv clearfix" style={desdivstyle}>
                            <span className="namespan f_left oneClamp t_left" style={{width:"70%",height:"100%",}}>{title}</span>
                            <span className="watchnumspan f_right oneClamp t_center" style={{width:"30%",height:"100%",}}>{browseNum}</span>
                        </div>

                    </div>

                    {/*价格展示区域*/}
                    <div className="pricediv clearfix" style={pricediv}>

                        <span className="leftdiv f_left t_center" style={{width:"50%",height:"100%",}} dangerouslySetInnerHTML={{__html: price}}></span>
                        <span className="rightdiv f_right t_center" style={{width:"50%",height:"100%",}} dangerouslySetInnerHTML={{__html:otherPrice}}></span>

                    </div>


                </li>
                : null;
            productselementsArr.push(element);
        }

        return (

            <div className="bodydiv">
                {/*如果是APP环境则没有导航栏,wab站有导航栏组件 注意此处wab站导航栏没有标题*/}
                {ifApp ? null : <Navdiv navtitle='' righttype="yipai"></Navdiv>}

                <div className="mescroll" id='mescrolldiv' style={{height:$('body').height(),}}>

                    {/*banner图元素*/}
                    {bannerelement}

                    {/*拍品列表元素*/}
                    <ul className="productlist" style={prosulstyle}>
                        {productselementsArr}
                    </ul>

                </div>
            </div>


        );
    }
}

//设置分享相关内容
var shareparameter;
function setSharepara(sharepara) {
    //share_img	分享文案图片地址
    var share_img = imgIndexUrl + sharepara.shareimg;
    //share_title	分享文案标题
    var share_title = "[超级拍卖]-" + sharepara.sharetitle;
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