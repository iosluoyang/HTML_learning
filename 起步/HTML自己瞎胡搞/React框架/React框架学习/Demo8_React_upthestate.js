function BoilingVerdict(props) {
    return props.celsius >= 100 ? <p>水会烧开</p> : <p>水不会烧开</p> ;
}

//单个输入框
class Calculator extends React.Component{
    constructor(props){
        super(props);
        this.state = {temperature:''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({temperature:event.target.value})
        event.preventDefault();
    }

    render(){
        const temperature = this.state.temperature;

        return (
            <fieldset>
                <legend>输入一个摄氏温度:</legend>
                <input value={temperature} onChange={this.handleChange}/>

                <BoilingVerdict celsius={parseFloat(temperature)}></BoilingVerdict>
            </fieldset>
        )
    }
}

ReactDOM.render(
    <Calculator></Calculator>,document.getElementById('example1')
);


//多个输入框
const scaleNames = {
    c:'摄氏度',
    f:'华氏温度'
};

//温度转换,如果输入的是无效数字,则返回空字符串
function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}
function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32 ;
}
function tryConvert(temperature,convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)){
        return '';
    }

    const output = convert(input);
    const rounded = Math.round(output * 1000) /1000;
    return rounded.toString();
}

class TemperatureInput extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        //我们将其自身的 state 从组件中移除，使用 this.props.temperature 替代 this.state.temperature
        // this.setState({temperature:e.target.value});

        //当我们想要响应数据改变时，使用父组件提供的 this.props.onTemperatureChange() 而不是this.setState() 方法：
        this.props.onTemperatureChange(e.target.value);
    }

    render(){
        const scale = this.props.scale;
        const temperature = this.props.temperature;

        return (
            <fieldset>
                <legend>请输入{scaleNames[scale]}:</legend>
                <input value={temperature} onChange={this.handleChange}/>
            </fieldset>
        );
    }
}

class Calculator1 extends React.Component{
    constructor(props){
        super(props);
        this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
        this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
        this.state = {temperature:'',scale:'c'};
    }

    handleCelsiusChange(temperature){
        this.setState({scale:'c',temperature});
    }

    handleFahrenheitChange(temperature){
        this.setState({scale:'f',temperature});
    }

    render(){
        const scale = this.state.scale;
        const temperature = this.state.temperature;
        const celsius = scale === "f" ?tryConvert(temperature,toCelsius) : temperature;
        const fahrenheit = scale === "c" ? tryConvert(temperature,toFahrenheit):temperature;

        return(
            <div>
                <TemperatureInput scale='c' temperature={celsius} onTemperatureChange={this.handleCelsiusChange}></TemperatureInput>
                <TemperatureInput scale='f' temperature={fahrenheit} onTemperatureChange={this.handleFahrenheitChange}></TemperatureInput>
                <BoilingVerdict celsius={parseFloat(celsius)}></BoilingVerdict>
            </div>
        );
    }
};


ReactDOM.render(
    <Calculator1></Calculator1>,document.getElementById('example2')
);