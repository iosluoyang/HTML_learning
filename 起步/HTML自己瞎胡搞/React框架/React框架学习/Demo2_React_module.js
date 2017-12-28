
/*注意，原生 HTML 元素名以小写字母开头，而自定义的 React 类名以大写字母开头，比如 HelloMessage 不能写成 helloMessage。
除此之外还需要注意组件类只能包含一个顶层标签，否则也会报错。*/


/*单组件*/
class HelloMessage extends React.Component{
    render() {
        return (
            <h1>Hello World ! Hello {this.props.name}</h1>
        );
    }
};
/*注意，在添加属性时， class 属性需要写成 className ，for 属性需要写成 htmlFor
这是因为 class 和 for 是 JavaScript 的保留字。*/
ReactDOM.render(
    <HelloMessage name="小海哥"/>,
    document.getElementById('example1')
);



/*复合组件*/
class WebSite extends React.Component{
    render(){
        return (
            <div>
                <Name name={this.props.name}/>
                <Link site={this.props.site} sitename={this.props.sitename}/>
            </div>
        );
    }
}

class Name extends React.Component{
    render(){
        return (
            <h1>{this.props.name}</h1>
        );
    }
};

class Link extends React.Component{
    render(){
        return(
            <a href={this.props.site}>{this.props.sitename}</a>
        );
    }
}


ReactDOM.render(
    <WebSite name="小海哥" site="http://www.baidu.com" sitename="小海哥官方网站"/>,
    document.getElementById('example2')
);