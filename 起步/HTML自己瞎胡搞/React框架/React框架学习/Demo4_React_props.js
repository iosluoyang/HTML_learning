/*单个的props值传递*/
class HelloMessage extends React.Component{

    //为属性指定默认值
    static defaultProps = {
        name:"小海哥",
    };

    render(){
        return (
            <h1>Hello {this.props.name}</h1>
        )
    };
};

ReactDOM.render(
    <HelloMessage></HelloMessage>,
    document.getElementById('example1')
);


/*state和props组合使用*/

//父组件
class WebSite extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name:"小海哥官方网站",
            site:"http://www.baidu.com"
        };

    }

    render(){
        return (
            <div>
                <Name name={this.state.name}></Name>
                <Link site={this.state.site} name={this.state.name}></Link>
            </div>
        );
    }
}

//子组件
class Name extends React.Component{
    //为属性指定默认值
    static defaultProps = {name:"小海哥"};
    render(){
        return (
            <h1>{this.props.name}</h1>
        );
    }
}

class Link extends React.Component{
    //为属性指定默认值
    static defaultProps = {site:"http://www.baidu.com",name:"小海哥官方网站"};
    render(){
        return (
            <a href={this.props.site}>
                {this.props.name}
            </a>
        );
    }
}


ReactDOM.render(
    <WebSite></WebSite>,document.getElementById('example2')

);



/*props验证*/

class Mytitle extends React.Component{
    //设置默认指定的属性值
    static defaultProps = {title:"小海哥"};

    render(){
        return (
            <h1>{this.props.title}</h1>
        );
    }
}

//进行属性验证(因为属性类型检查从16.0包之后就被FB单独剔除了出来,所以这里React其实没有属性检查的相关包)
// Mytitle.propTypes = {
//     name:React.PropTypes.string.isRequired
// }

ReactDOM.render(
    <Mytitle title={'哈哈'}></Mytitle>,
    document.getElementById('example3')
);
