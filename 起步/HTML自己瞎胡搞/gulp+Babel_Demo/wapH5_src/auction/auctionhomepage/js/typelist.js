//左右两侧拍卖分类列表
class Mybodydiv extends React.Component{

    //设置默认参数
    static defaultProps = {

    };

    constructor(props){
        super(props);

        $('body').css({
            overflow:"hidden",//让div滚动的时候body不跟随滚动
        });


        this.state = {
            typeList:[],//分类数组
            currenttypeId:"",//当前选中的一级分类id
            ajaxrequest:null,//ajax请求实体
        };
    }

    //挂载之后开始ajax请求
    componentDidMount(){
        //移除缓冲条
        $('.loader-inner').remove();

        const _this = this;
        var ajaxrequest = $.ajax({
            url:auctiontypelist,
            data:getAuth(),
            success:function (data) {

                if (data.errCode == 0){

                    var resultdata = data.resultdata;
                    //一级分类列表
                    var typeList = resultdata.typeList;

                    //默认设置当前选中的一级分类id为数组第0个的id
                    if (typeList.length > 0){
                        _this.setState({
                            typeList:typeList,
                            currenttypeId:typeList[0].typeId,
                        });
                    }

                }
                else{
                    mainTip("数据加载失败");
                }
            },
            error:function (error) {

                mainTip("网络似乎离你而去了");

            },
        });
        this.setState({
            ajaxrequest:ajaxrequest,
        });
    }

    //即将卸载的时候取消ajax请求
    componentWillUnmount(){
        var ajaxrequest = this.state.ajaxrequest;
        if (ajaxrequest){ajaxrequest.abort();}
    }

    //点击了一级分类
    clickfirsttype(typeId){

        //点击的一级分类id
        var currenttypeId = typeId;
        this.setState({
            currenttypeId:currenttypeId,
        });
    }

    //点击了二级分类
    clicksecondtype(secondtypeId){
        //跳转到指定的一级分类下的二级分类列表页面
        var firstTypeId = this.state.currenttypeId;//当前选中的一级分类的id
        location.href = jumpUrl.AcutionProductLists + "firstTypeId=" + firstTypeId + "&subTypeId=" + secondtypeId;
    }

    render(){


        //当前的分类数据源
        var typeList = this.state.typeList;
        //当前选中的一级分类id
        var currenttypeId = this.state.currenttypeId;


        //左侧分类列表
        var leftelementsArr = [];
        var righttypeList = [];
        for (var index in typeList){

            var typedic = typeList[index];
            var typeId = typedic.typeId;//一级分类的id
            var typeName = typedic.typeName;//一级分类的名称
            var img = typedic.img;//一级分类的图片

            //根据选中的一级分类id找到对应的二级分类数据源
            righttypeList = typeId == currenttypeId ? typedic.subTypeList : righttypeList;

            var leftsinglestyle = {
                width:"100%",
                height:"68px",
                borderBottom: index == typeList.length - 1 ? "none" : "1px #ededed solid",
                background: "url("+imgIndexUrl+img+") no-repeat center 10px",
                backgroundColor:typeId == currenttypeId ? "#ffffff" : "#f7f7f7",
                backgroundSize:"25px 25px",
                paddingTop:"45px",
                boxSizing:"border-box",
                WebkitBoxSizing:"border-box",
                fontSize:"13px",
                color:"#202020",
                textAlign:"center",

            };

            var element = <div className="lefttype" key={typeId} style={leftsinglestyle} onClick={this.clickfirsttype.bind(this,typeId)}>{typeName}</div>;

            leftelementsArr.push(element);
        }


        //当前右侧的分类列表
        var rightelementsArr = [];
        for (var index in righttypeList){
            var secondtypedic = righttypeList[index];
            var typeId = secondtypedic.typeId;//二级分类的id
            var typeName = secondtypedic.typeName;//二级分类的名称
            var img = secondtypedic.img;//二级分类的图片


            var rightsinglestyle = {
                width:"100%",
                height:"50px",
                lineHeight:"50px",
                borderBottom: index == righttypeList.length - 1 ? "none" : "1px #ededed solid",
                background: " url("+imgIndexUrl+img+") no-repeat 28px center",
                backgroundSize:"25px 25px",
                paddingLeft:"83px",
                textAlign:"left",
                fontSize:"13px",
                color:"#202020",
                boxSizing:"border-box",
                WebkitBoxSizing:"border-box",

            };

            var element = <div className="righttype" key={typeId} style={rightsinglestyle} onClick={this.clicksecondtype.bind(this,typeId)}>{typeName}</div>;
            rightelementsArr.push(element);

        }



        var divheight = document.documentElement.clientHeight - parseInt($('body').css('padding-top'));
        //divheight = $('body').height() -  parseInt($('body').css('padding-top'));

        var leftdivstyle = {
            backgroundColor:"#f7f7f7",
            width:"78px",
            height:divheight,
            overflow:"auto",

        };
        var rightdivwidth = $('body').width() - 78;
        var rightdivstyle = {
            backgroundColor:"#ffffff",
            width:rightdivwidth,
            padding:"0 32px",
            boxSizing:"border-box",
            WebkitBoxSizing:"border-box",
            height:divheight,
            overflow:"auto",

        };

        return (

            <div className="mybodydiv clearfix">

                {/*如果是APP环境则没有导航栏,wab站有导航栏组件*/}
                {ifApp ? null : <Navdiv navtitle="分类列表" righttype="yipai"></Navdiv>}


                {/*左侧一级分类div*/}
                <ul className="firsttypelist f_left" style={leftdivstyle}>
                    {leftelementsArr}
                </ul>

                {/*右侧二级分类div*/}
                <ul className="secondtypelist f_right" style={rightdivstyle}>
                    {rightelementsArr}
                </ul>

            </div>

        );
    }
}

ReactDOM.render(
    <Mybodydiv></Mybodydiv>,document.getElementById('reactdiv')
)

