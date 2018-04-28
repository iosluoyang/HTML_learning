//环境配置文件

var environment = "development";

// var environment = "yufabu";

// var environment = "product";




if (environment == "product"){

    //正式环境
    
    var imgIndexUrl = "https://pecdn.icjsq.com/";                         //图片地址前缀
    var apiIndexUrl = "https://userapi.icjsq.com/app/";                   //接口链接前缀
    var wXIndexUrl = "https://m.icjsq.com/wap/app/";                      //微信接口前缀
    var publicUrl="https://m.icjsq.com/wapH5/";                           //网址链接前缀
    var APPpublicUrl = "https://h5.icjsq.com/app/";                 //手机APP网址链接前缀

    //根据不同的环境引入不同的js
    document.write(

        "<script src='"+publicUrl+"public/js/jquery-3.2.1.min.js'></script>" +
        "<script src='"+publicUrl+"public/js/jsencrypt.js'></script>" +
        "<script src='"+publicUrl+"public/js/base64.js'></script>" +
        "<script src='"+publicUrl+"public/js/jweixin-1.0.0.js'></script>" +
        "<script src='"+publicUrl+"public/js/baseRegjs.js'></script>"+
        "<script src='"+publicUrl+"libs/react/react.production.min.js'></script>"+
        "<script src='"+publicUrl+"libs/react/react-dom.production.min.js'></script>"+
        "<script src='"+publicUrl+"libs/react/babel.min.js'></script>"+
        "<script type='text/babel' src='"+publicUrl+"public/js/public_react.js'></script>"

    );
 
}
else if (environment == "yufabu"){
 
    //预发布
    var imgIndexUrl = "https://yfbcdn.icjsq.com/";                         //图片地址前缀
    var apiIndexUrl = "https://yufabussl.icjsq.com/chaojishequ/app/";      //接口链接前缀
    var wXIndexUrl = "https://yufabussl.icjsq.com/wap/app/";               //微信接口前缀
    var publicUrl="https://yufabussl.icjsq.com/wapH5/";                    //网址链接前缀
    var APPpublicUrl = "https://yufabussl.icjsq.com/app/";                 //手机APP网址链接前缀

    //根据不同的环境引入不同的js
    document.write(

        "<script src='"+publicUrl+"public/js/jquery-3.2.1.min.js'></script>" +
        "<script src='"+publicUrl+"public/js/jsencrypt.js'></script>" +
        "<script src='"+publicUrl+"public/js/base64.js'></script>" +
        "<script src='"+publicUrl+"public/js/jweixin-1.0.0.js'></script>" +
        "<script src='"+publicUrl+"public/js/baseRegjs.js'></script>"+
        "<script src='"+publicUrl+"libs/react/react.production.min.js'></script>"+
        "<script src='"+publicUrl+"libs/react/react-dom.production.min.js'></script>"+
        "<script src='"+publicUrl+"libs/react/babel.min.js'></script>"+
        "<script type='text/babel' src='"+publicUrl+"public/js/public_react.js'></script>"

    );

}
else{

    //8083
    var imgIndexUrl = "http://cjsq-test.oss-cn-beijing.aliyuncs.com/";      //图片地址前缀
    var apiIndexUrl = "https://devtestssl.icjsq.com/chaojishequ/app/";      //接口链接前缀
    var wXIndexUrl = "https://devtestssl.icjsq.com/wap/app/";               //微信接口前缀
    var publicUrl="https://devtestssl.icjsq.com/wapH5/";                    //wab站网址链接前缀
    var APPpublicUrl = "https://devtestssl.icjsq.com/app/";                 //手机APP网址链接前缀

    //根据不同的环境引入不同的js
    document.write(
        "<script src='"+publicUrl+"public/js/jquery-3.2.1.min.js'></script>" +
        "<script src='"+publicUrl+"public/js/jsencrypt.js'></script>" +
        "<script src='"+publicUrl+"public/js/base64.js'></script>" +
        "<script src='"+publicUrl+"public/js/jweixin-1.0.0.js'></script>" +
        "<script src='"+publicUrl+"public/js/baseRegjs.js'></script>"+


        // "<script src='"+publicUrl+"libs/react/react.production.min.js'></script>"+
        // "<script src='"+publicUrl+"libs/react/react-dom.production.min.js'></script>"+
        // "<script src='"+publicUrl+"libs/react/babel.min.js'></script>"+


        // "<script src='"+publicUrl+"libs/react/react.development.js'></script>"+
        // "<script src='"+publicUrl+"libs/react/react-dom.development.js'></script>"+
        // "<script src='"+publicUrl+"libs/react/babel.min.js'></script>"+


        // "<script src='https://unpkg.com/react@15/dist/react.min.js'></script>"+
        // "<script src='https://unpkg.com/react-dom@15/dist/react-dom.min.js'></script>"+
        // "<script src='https://cdn.bootcss.com/babel-standalone/6.22.1/babel.min.js'></script>"+


        "<script type='text/babel' src='"+publicUrl+"public/js/public_react.js'></script>"

    );
    
}





























