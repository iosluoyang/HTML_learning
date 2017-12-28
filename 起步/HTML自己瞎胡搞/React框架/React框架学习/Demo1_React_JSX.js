
/*基本语法*/
ReactDOM.render(
<h1>Hello , World !</h1>,
document.getElementById('example1')
);



/*JavaScript表达式写在花括号中*/
ReactDOM.render(
    <div>
        <h1>小海哥1+1={1+1}</h1>
        <h2>开始学习React</h2>
        <p data-myattribute = 'somevalue'>这是一个很不错的JavaScript库</p>
    </div>,
    document.getElementById('example2')
);



/*在JSX中不能使用 if else 语句 但可以使用conditional(三元运算)表达式来替代*/
var i = 1;
ReactDOM.render(
    <div>
        <h2>i值是否等于1呢?</h2>
        <h1>{i == 1 ? "i=1" : "i!=1"}</h1>
    </div>,
    document.getElementById('example3')
)



/*React推荐使用内联样式  可以使用camelCase语法来设置内联样式 React会在指定元素数字后自动添加px*/
var myStyle = {
    fontSize:100,
    color:'#FF0000'
};
ReactDOM.render(
    <h1 style={myStyle}>小海哥{/*我是注释哦*/}</h1>,
    document.getElementById('example4')
)



/*JSX允许在模板中插入数组,数组会自动展开所有成员*/
var myStyle1 = {
    fontSize:50,
    color:'#cccddd'
};
var myStyle2 = {
    fontSize:80,
    color:'#0bdddd'
};
var arr = [
    <h1 style={myStyle1}>小海哥</h1>,
    <h2 style={myStyle2}>就是牛逼!</h2>
];
ReactDOM.render(
    <div>{arr}</div>,
    document.getElementById('example5')
)



/*渲染HTML标签,只需在JSX里使用小写字母的标签名*/
var myDivElement = <div className={"foo"}>我是JSX渲染的div</div>;
ReactDOM.render(
    myDivElement,document.getElementById('example6')
)



/*渲染React元素,只需创建一个大写子字母开头的本地变量*/
class Mycomponent extends React.Component{
    render(){
        return <h1>我是React渲染的组件</h1>;
    }
};
ReactDOM.render(
    <Mycomponent someProperty={true}></Mycomponent>,document.getElementById('example7')
)
