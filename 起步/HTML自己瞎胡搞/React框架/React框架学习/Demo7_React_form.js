class NameForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {content:''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.setState({
            content:event.target.value
        });
        console.log("当前用户输入的内容为:---" + event.target.value)
    }

    handleSubmit(event){
        alert ('用户输入内容被提交:' + this.state.content);
        event.preventDefault();
    }

    render(){
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <input type="submit" value='Submit'/>
            </form>
        );
    }
}


ReactDOM.render(
    <NameForm></NameForm>,document.getElementById('example1')
);


class EssayForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value:'请填写你的备注'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event){
        this.setState({
            value:event.target.value
        });

    }

    handleSubmit(event){
        alert('用户备注被提交:' + this.state.value);
        event.preventDefault();
    }

    render(){
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    备注:
                    <textarea value={this.state.value} onChange={this.handleChange}></textarea>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        );
    }


}

ReactDOM.render(
    <EssayForm></EssayForm>,document.getElementById('example2')
);


class FlavorForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {value:'篮球'};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
        this.setState({
            value:event.target.value
        });
    }

    handleSubmit(event){
        alert ('你选中了该选项:' + this.state.value);
        event.preventDefault();
    }

    render(){
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    分类:
                    <select value={this.state.value} onChange={this.handleChange}>
                        <option value="足球">足球</option>
                        <option value="篮球">篮球</option>
                        <option value="排球">排球</option>
                        <option value="网球">网球</option>
                    </select>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        )
    }
}

ReactDOM.render(
    <FlavorForm></FlavorForm>,document.getElementById('example3')
);



class Reservation extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isGoing:true,
            numberOfGuests:2
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]:value
        });
    }

    render(){
        return (
            <form>
                <label>
                    Is going:
                    <input type="checkbox" name='isGoing' checked={this.state.isGoing} onChange={this.handleInputChange}/>
                </label>
                <br/>
                <label>
                    Number of guests:
                    <input type='number' name='numberOfGuests' value={this.state.numberOfGuests} onChange={this.handleInputChange}/>
                </label>
            </form>
        )
    }
}

ReactDOM.render(
    <Reservation></Reservation>,document.getElementById('example4')
);