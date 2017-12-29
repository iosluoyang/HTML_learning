/*
包含关系
一些组件不能提前知道它们的子组件是什么。这对于 Sidebar 或 Dialog 这类通用容器尤其常见。
我们建议这些组件使用 children 属性将子元素直接传递到输出。
*/

function FancyBorder(props) {
    return (
        <div className={'FancyBorder FancyBorder-' + props.color}>
            {props.children}
        </div>
    );
}

function WelcomeDialog() {
    return (
        <FancyBorder color='blue'>
            <h1 className='Dialog-title'>
                Welcome
            </h1>
            <p className="Dialog-message">
                欢迎访问我的网站!
            </p>
        </FancyBorder>
    );
}

ReactDOM.render(
    <WelcomeDialog></WelcomeDialog>,document.getElementById('example1')
);



//虽然不太常见，但有时你可能需要在组件中有多个入口,这种情况下你可以使用自己约定的属性而不是 children

function Contacts() {
    const contactstyle = {backgroundColor:'pink',height:'100%'};
    return (
        <div style={contactstyle} className="Contacts"></div>
    );
}

function Chat() {
    const chatstyle = {backgroundColor:'blue',height:'100%'};
    return (
        <div style={chatstyle} className="Chat"></div>
    );
}

function SplitPane(props) {
    const splitpanestyle = {height:100};
    const splitleftstyle = {height:'100%',width:'30%',float:'left'};
    const splitrightstyle = {height:'100%',width:'70%',float:'right'};
    return (
        <div style={splitpanestyle} className="SplitPane">
            <div style={splitleftstyle} className="SplitPane-left">
                {props.left}
            </div>
            <div style={splitrightstyle} className="SplitPane-right">
                {props.right}
            </div>
        </div>
    );
}

function App() {
    return (
        <SplitPane left={<Contacts></Contacts>} right={<Chat></Chat>}></SplitPane>
    );
}

ReactDOM.render(
    <App></App>,document.getElementById('example2')
);


//混合组合
function Dialog(props) {
    return (
        <FancyBorder color='blue'>
            <h1 className='Dialog-title'>{props.title}</h1>
            <p className="Dialog-message">{props.message}</p>
            {props.children}
        </FancyBorder>
    );
}

class SignUpDialog extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.state = {login:''};
    }

    render(){
        return (
            <Dialog title='小海哥今日新闻' message='2017年12月29日早上9点钟,小海哥上市'>
                <input value={this.state.login} onChange={this.handleChange}/>
                <button onClick={this.handleSignUp}>点击登录</button>
            </Dialog>
        );
    }

    handleChange(e){
        this.setState({login:e.target.value});
    }

    handleSignUp(){
        alert('欢迎登录' + this.state.login);
    }
}

ReactDOM.render(
    <SignUpDialog></SignUpDialog>,document.getElementById('example3')
);


