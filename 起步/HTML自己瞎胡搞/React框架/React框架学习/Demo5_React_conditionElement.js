function UserGreeting(props) {
    return  <h1>Welcome back !</h1>;
}

function GuestGreeting(props) {
    return <h1>Please sign up.</h1>;
}

function Greeting(props) {
    const isLoggedIn = props.isLoggedIn;
    if(isLoggedIn){
        return <UserGreeting></UserGreeting>;
    }
    return <GuestGreeting></GuestGreeting>;
}

function LoginButton(props) {
    var loginstyle = {
        backgroundColor:"#ff3b30"
    }
    return (
        <button style={loginstyle} onClick={props.onClick}>Login</button>
    );
}

function LogoutButton(props) {
    var logoutstyle = {
        backgroundColor:"#cdcdcd"
    }
    return (
        <button style={logoutstyle} onClick={props.onClick}>logout</button>
    );
}

class LoginControl extends React.Component{
    constructor(props){
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.state = {isLoggedIn:false};
    }

    handleLoginClick(){
        this.setState({isLoggedIn:true});
    }

    handleLogoutClick(){
        this.setState({isLoggedIn:false});
    }

    render(){
        const isLoggedIn = this.state.isLoggedIn;
        let button =  isLoggedIn ?  <LogoutButton onClick={this.handleLogoutClick}></LogoutButton> :
                                    <LoginButton onClick={this.handleLoginClick}></LoginButton>;

        return (
            <div>
                <Greeting isLoggedIn={isLoggedIn}></Greeting>
                <p>The user is <b>{isLoggedIn ? "currently" : "not"}</b> logged in.</p>
                {button}
            </div>
        );
    }

}

ReactDOM.render(
    <LoginControl></LoginControl>,document.getElementById('example1')
);


//阻止组件渲染(组件的 render 方法返回 null 并不会影响该组件生命周期方法的回调。例如，componentWillUpdate 和 componentDidUpdate 依然可以被调用。)

function WarningBanner(props) {
    if(!props.warn){
        return null;
    }
    return (
        <div className="warning">
            Warning!
        </div>
    );
}

class Page extends  React.Component{
    constructor(props){
        super(props);
        this.state = {showWarning:true};
        this.handleToggleClick = this.handleToggleClick.bind(this);
    }

    handleToggleClick(){
        this.setState(function (prevState) {
            return {showWarning:!prevState.showWarning};
        });
    }

    render(){
        return (
            <div>
                <WarningBanner warn={this.state.showWarning}></WarningBanner>
                <button onClick={this.handleToggleClick}>
                    {this.state.showWarning ? "Hide" : "Show"}
                </button>
            </div>
        );
    }
}

ReactDOM.render(
    <Page></Page>,document.getElementById('example2')
);