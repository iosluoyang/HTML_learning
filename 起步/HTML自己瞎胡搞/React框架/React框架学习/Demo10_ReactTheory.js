//自上而下的层级组件划分顺序

//整体的过滤商品搜索区域框
class FilterableProductTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filterText:'',
            inStockOnly:false
        };

        this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
        this.handleInStockInput = this.handleInStockInput.bind(this);

    }

    handleFilterTextInput(filterText){
        this.setState({
                filterText:filterText
            });
    }
    handleInStockInput(inStockOnly){
        this.setState({
            inStockOnly:inStockOnly
        });
    }

    render(){
        return (
            <div>
                <SearchBar filterText={this.state.filterText} inStockOnly={this.state.inStockOnly} onFilterTextInput={this.handleFilterTextInput} onInStockInput={this.handleInStockInput}></SearchBar>

                <ProductTable filterText={this.state.filterText} inStockOnly={this.state.inStockOnly} products={this.props.products}></ProductTable>
            </div>
        );
    }
}

//搜索框
class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this);
        this.handleInStockInputChange = this.handleInStockInputChange.bind(this);
    }
    handleFilterTextInputChange(e){
        this.props.onFilterTextInput(e.target.value);
    }

    handleInStockInputChange(e){
        this.props.onInStockInput(e.target.checked);
    }

    render(){
        return (
            <form>
                <input type="text" placeholder="搜索商品" value={this.props.filterText} onChange={this.handleFilterTextInputChange}/>
                <p>
                    <input type="checkbox" checked={this.props.inStockOnly} onChange={this.handleInStockInputChange}/>
                    {' '}
                    只显示有库存的商品
                </p>
            </form>
        );
    }
}

//搜索结果列表展示区域
class ProductTable extends React.Component{

    render(){
        var rows = [];
        var lastCategory = null;

        this.props.products.forEach((product) => {

            //根据props属性的值来进行商品名称的筛选

            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)){
                //如果该商品和搜索文本不匹配或者在只显示有库存的条件下该商品没有库存的时候,直接返回空
                return;
            }


            if (product.category !== lastCategory){
                rows.push(
                    <ProductCategoryRow category={product.category} key={product.category}></ProductCategoryRow>
                );
            }
            rows.push(
                <ProductRow product={product} key={product.name}></ProductRow>
            );
            lastCategory = product.category;//记录上一个分类名称
        })

        //！！！重点注意,在这里如果使用forEach遍历每一个商品的时候不能直接使用回调函数的方式直接访问this.props
        //应该使用ES6的语法进行链式回调才能直接访问,以下为错误代码
        // this.props.products.forEach(function (product) {
        //
        //     //根据props属性的值来进行商品名称的筛选
        //
        //     if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)){
        //         //如果该商品和搜索文本不匹配或者在只显示有库存的条件下该商品没有库存的时候,直接返回空
        //         return;
        //     }
        //
        //
        //     if (product.category !== lastCategory){
        //         rows.push(
        //             <ProductCategoryRow category={product.category} key={product.category}></ProductCategoryRow>
        //         );
        //     }
        //     rows.push(
        //         <ProductRow product={product} key={product.name}></ProductRow>
        //     );
        //     lastCategory = product.category;//记录上一个分类名称
        // });
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

//分类展示行
class ProductCategoryRow extends React.Component{
    render(){
        return (
            <tr>
                <th colSpan='2'>
                    {this.props.category}
                </th>
            </tr>
        );
    }
}

//商品展示行
class ProductRow extends React.Component{
    render(){
        var name = this.props.product.stocked ? this.props.product.name:
            <span style={{color:'red'}}>
                {this.props.product.name}
            </span>;

         return (
             <tr>
                 <td>{name}</td>
                 <td>{this.props.product.price}</td>
             </tr>
         );
    }
}

//数据源
var PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

//更新界面
ReactDOM.render(
    <FilterableProductTable products={PRODUCTS}></FilterableProductTable>,document.getElementById('container')
);