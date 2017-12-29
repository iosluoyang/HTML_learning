//引入React相关的js

// //测试环境
// document.write(
//     "<script src='react.development.js'></script>" +
//     "<script src='react-dom.development.js'></script>" +
//
//     /*Babel 可以将 ES6 代码转为 ES5 代码，这样我们就能在目前不支持 ES6 浏览器上执行 React 代码。
//     Babel 内嵌了对 JSX 的支持*/
//     "<script src='https://cdn.bootcss.com/babel-standalone/6.22.1/babel.min.js'></script>"
//
// );


//生产环境
document.write(
    "<script src='react.production.min.js'></script>" +
    "<script src='react-dom.production.min.js'></script>" +

    /*Babel 可以将 ES6 代码转为 ES5 代码，这样我们就能在目前不支持 ES6 浏览器上执行 React 代码。
    Babel 内嵌了对 JSX 的支持*/
    "<script src='https://cdn.bootcss.com/babel-standalone/6.22.1/babel.min.js'></script>"

);

