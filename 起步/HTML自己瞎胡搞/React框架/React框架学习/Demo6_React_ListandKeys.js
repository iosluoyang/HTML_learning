
//渲染列表组件
function NumberList(props) {
    const numbers = props.numbers;
    //当你在map()方法的内部调用元素时，你最好随时记得为每一个元素加上一个独一无二的key
    const listItems = numbers.map(
        (number) => <li key={number.toString()}>{number}</li>
    );
    return (
        <ul>
            {listItems}
        </ul>
    );
}
const numbers = [1,2,3,4,5];
ReactDOM.render(
    <NumberList numbers={numbers}></NumberList>,document.getElementById('example1')
);


function Blog(props) {
    const sidebar = (
        <ul>
            {props.posts.map(
                (post) => (
                    <li key={post.id}>{post.title}</li>
                )
            )}
        </ul>
    );

    const content = props.posts.map(
        (post) =>(
            <div key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
            </div>
        )
    );
    return (
        <div>
            {sidebar}
            <hr/>
            {content}
        </div>
    )
};

const posts = [{id: 1, title: '用户1', content: '这是用户1的评论内容!'},
    {id: 2, title: '用户2', content: '这是用户2的评论内容!'}];


ReactDOM.render(
    <Blog posts={posts}></Blog>,document.getElementById('example2')
);
