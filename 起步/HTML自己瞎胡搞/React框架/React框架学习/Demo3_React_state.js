
class LikeButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            liked:true,
            name:"小海哥"
        };
        //需要在类继承方法的初始化属性方法中进行绑定点击事件的操作,否则this为undefined
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        e.preventDefault();

        //注意这里因为setState是异步更新的,所以很可能在此处得到的this.state.liked并不是真正的值
        //所以这里需要通过传入一个函数作为参数来调用setState方法
        this.setState(
            function (prevState, props) {
                return {
                    liked:!prevState.liked,
                    /*注意这里是先修改state的属性值然后再进行取反操作,即这里是否喜欢还保留着最初的状态*/
                    name : prevState.liked ? "小海妹":"小海哥"
                }
            }
        )

    }

    render(){
        var text = this.state.liked ? "喜欢":"不喜欢";
        var name = this.state.name;
        var mystyle = {
            fontSize:50,
            color:'#FF3B30'
        }
        return (
            <p style={mystyle} onClick={this.handleClick}>
                你<b>{text}</b>了<b>{name}</b>
            </p>
        );
    }
}

ReactDOM.render(
    <LikeButton></LikeButton>,
    document.getElementById('example1')
);





class Clock extends React.Component{

    constructor(props){
        super(props);
        this.state = {date:new Date()};

    }

    //组件被输出到DOM后会执行此方法,这里是建立定时器的好地方
    componentDidMount(){
        this.timerID = setInterval(
            () => this.tick(),1000
        );
    }
    //组件即将从DOM中卸载的时候会执行此方法,这里是卸载定时器的好地方
    componentWillUnmount(){
        clearInterval(this.timerID);
    }
    //实现每秒钟执行的tick()方法用于定时器的函数响应
    tick(){
        //使用 this.setState() 来更新组件局部状态
        this.setState({
            date:new Date()
        });
    }

    render(){
        return (
            <div>
                <h1>Hello World !</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}</h2>
            </div>
        );
    }
}

ReactDOM.render(
    <Clock></Clock>,document.getElementById('example2')
);










