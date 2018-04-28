/**
 * Created by hasee on 2016/8/13.
 */


//网址对象
var jumpUrl={

    //--------------------登录页面链接--------------------
    login:publicUrl+"register/login/index.html",           //登录页面
    updatePWD:publicUrl+"register/updatePWD/index.html",           //忘记密码
    setPWD:publicUrl+"register/setPWD/index.html",           //设置密码
    xieYi:publicUrl + "register/xieYi/index.html",      //用户协议
    //--------------------原产地首页链接--------------------
    find:publicUrl+"native/find/index.html",       //原产地首页网址
    theme:publicUrl+"native/theme/index.html?id=",     //主题馆网址
    brand:publicUrl+"native/brand/index.html?id=",      //品牌馆网址
    //----------------------社区拼团链接--------------------
    groupList:publicUrl+"group/groupList/index.html?groupVid=",      //拼团列表
    //----------------------定制生活链接--------------------
    clProList:publicUrl+"customLife/proList/index.html",       //定制生活商品推荐列表
    clSubProList:publicUrl+"customLife/proSubList/index.html?typeid=",       //定制生活商品分类列表
    clProDetail:publicUrl+"products/clDetail/index.html?pid=",       //定制生活商品详情
    clEditSendType:publicUrl+"products/clDetail/editSendType.html?pid=",       //定制生活商品详情
    clMakeSureOrder:publicUrl+"pay/html/clMakeSureOrder.html?pid=",       //定制生活确认下单
    clFetchAdd:publicUrl+"personal/fetchAdd/list.html?pid=",       //定制生活确认下单选择自提点
    clFetchSearchAdd:publicUrl+"personal/fetchAdd/search.html?pid=",       //定制生活确认下单自提点搜索

    clOrderList:publicUrl+"pay/html/clOrderList.html",          //定制生活大订单列表
    clSubList:publicUrl+"personal/clOrder/clSubList/index.html?orderNum=",          //定制生活子订单列表
    clOrderDetail:publicUrl+"pay/html/clOrderDetail.html?orderNum=",          //定制生活订单详情

    clTuiKuanDetail:publicUrl+"personal/clOrder/tuiKuanDetail/index.html?orderNum=",          //定制生活退款详情

    //------------------商品详情相关链接--------------------
    productsDetail:publicUrl+"products/productsDetail/index.html?pid=", //原产优品商品详情页
    groupProductsDetail:publicUrl+"products/groupProductsDetail/index.html?gid=", //原产优品商品详情页

    //------------------支付相关链接--------------------
    makeSureOrder:publicUrl+"pay/html/makeSureOrder.html", //确认订单
    orderList:publicUrl+"pay/html/orderList.html#type=5&status=1", //我的订单列表
    orderDetail:publicUrl+"pay/html/orderDetail.html", //订单详情
    pay:publicUrl+"pay/html/yanQian.html", //支付宝验签

    //--------------------个人中心相关链接--------------------
    person:publicUrl+"personal/person/index.html",      //个人首页网址
    address:publicUrl + "personal/address/index.html",   //收货地址
    guanZhuList:publicUrl + "personal/guanZhuList/index.html",     //品牌馆关注列表
    stroeList:publicUrl + "personal/storeList/index.html",      //收藏商品列表
    setting:publicUrl + "personal/setting/index.html",      //设置

    //--------------------订单列表相关链接--------------------
    commendList:publicUrl + "personal/orderList/commendList/index.html?from=",      //评价列
    wuLiu:publicUrl + "personal/orderList/wuLiu/index.html",      //查看物流

    //-------------自提点订单-----------------
    fetchLogin:publicUrl+"fetch/login/index.html?fetchid=",    //登录自提订单列表
    fetchList:publicUrl+"fetch/list/index.html?fetchid=",    //自提订单列表
    fetchDetail:publicUrl+"fetch/detail/index.html?fetchid=",    //自提订单详情
    fetchSearch:publicUrl+"fetch/search/index.html?fetchid=",    //自提点订单搜索



    //--------------------默认图片--------------------
    moRenAvatar:publicUrl+"public/images/base/defaultAvatar.png",   //默认用户头像
    defaultShopAvatar:publicUrl+"public/images/base/defaultShopAvatar.png",   //默认商品头像
    noData:publicUrl+"public/images/base/noData.png",   //没有数据图片
    actXieYi:"https://userapi.icjsq.com/relief.html",   //快乐活动免责协议


    //--------------------艺术馆相关--------------------
    ArtisticHall:publicUrl + "artisticHall/index.html",
    Portfolios:publicUrl + "artisticHall/Portfolios.html",
    SearchResult:publicUrl + "artisticHall/searchresult.html?",//去往特定分类下的搜索页面 后面需要增加name 搜索关键字 firstType 一级分类id secondType 二级分类id

    //--------------------促销活动相关--------------------
    PromotionSearchResult:publicUrl + "promotions/searchresult.html?",//跳转促销的搜索页面,需要参数uid和搜索关键字name


    //--------------------拍卖相关相关--------------------
    AuctionHomePage:publicUrl + "auction/auctionhomepage/index.html",//跳转到拍卖首页
    MyAuctionHomepage:publicUrl + "auction/myauction/index.html",//我的拍卖首页
    AuctionTypeListPage:publicUrl + "auction/auctionhomepage/typelist.html",//拍卖分类列表
    AcutionSpecialperformancePage:publicUrl + "auction/auctionhomepage/specialperformance.html?",//拍卖专场页面
    AcutionProductLists:publicUrl + "auction/auctionhomepage/productlists.html?",//拍品列表以及搜索结果页面(具体参数参考对应的js文件头部说明)

};

if (environment == "product"){

    //--------------------微信正式环境授权链接--------------------
    jumpUrl.shouQuan = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2e9dfc9df26a5072" +
        "&redirect_uri="+jumpUrl.login+
        "&response_type=code" +
        "&scope=snsapi_userinfo" +
        "&state=Cjsq#wechat_redirect";

}
else if (environment == "yufabu"){

    //--------------------微信预发布授权链接--------------------
    jumpUrl.shouQuan = "https://m.icjsq.com/wapH5/getWXCode/index.html?appid=wx2e9dfc9df26a5072" +
        "&redirect_uri="+jumpUrl.login+
        "&response_type=code" +
        "&scope=snsapi_userinfo" +
        "&state=Cjsq";

}
else{
    //--------------------微信测试授权链接--------------------
    jumpUrl.shouQuan = "https://m.icjsq.com/wapH5/getWXCode/index.html?appid=wx2e9dfc9df26a5072" +
        "&redirect_uri="+jumpUrl.login+
        "&response_type=code" +
        "&scope=snsapi_userinfo" +
        "&state=Cjsq";

}






//----------------------多页面共用接口-------------------------
//商品收藏与取消接口
var shouCangUrl = apiIndexUrl+"tegong/collection123.do",

//品牌馆关注与取消关注接口
guanZhuUrl = apiIndexUrl +"tegong/brandPavilionGz123.do",

//获取客服电话接口
getItemsUrl =apiIndexUrl +"dict/getItems.do",

//----------------------原产优品选接口-------------------------
//发现列表接口
findUrl = apiIndexUrl +"tegong/findList123.do",

//原产地精选分类接口
nativeNavUrl = apiIndexUrl + "tegong/types123.do",

//原产地列表查询接口
nativeSearchTypeProductsUrl=apiIndexUrl + "tegong/list123.do",

//主题馆详情接口
themeUrl = apiIndexUrl+"tegong/themePavilion123.do",

//品牌馆详情接口
brandUrl = apiIndexUrl+"tegong/brandPavilion123.do",

//地区列表接口
selProvinceUrl= apiIndexUrl+"tegong/selectProvinces123.do",

//社长优选接口
userGetStoreUrl= apiIndexUrl+"convenience/userGetStore129.do",

//社长优选商品分页接口
userGetStoreGoodsUrl = apiIndexUrl+"convenience/userGetStoreGoods129.do",


//----------------------拼团列表接口-------------------------
//拼团列表
groupBuyUserListUrl = apiIndexUrl+"activity/groupBuyUserList119.do",

//通过vid获取社区名称
selectVillageNameUrl = apiIndexUrl+"village/selectVillageName.do",


//----------------------定制生活商品列表列表接口-------------------------
//定制生活轮播广告
adsenseUrl =  apiIndexUrl+"adsense/adsense128.do",

//定制生活产品列表
clListUrl = apiIndexUrl+"customlife/list129.do",

//定制生活分类接口
clTypeListUrl = apiIndexUrl+"customlife/typeList130.do",

//-------------------------收货地址-------------------------
//收货地址列表接口
receAddreUrl=apiIndexUrl+"address/receAddre126.do",

//添加收货地址接口
addAddressUrl=apiIndexUrl+"address/addAddress126.do",

//编辑收货地址接口
updateAddressUrl=apiIndexUrl+"address/updateAddress126.do",

//设置默认收货地址接口
UpdateIsDefaultUrl=apiIndexUrl+"address/UpdateIsDefault.do",

//删除收货地址接口
delAddressUrl=apiIndexUrl+"address/delAddress125.do",

//定制生活获取地址列表
clReceAddreUrl  = apiIndexUrl+"customlife/receAddre129.do",

//------------------------关注收藏----------------------
//关注品牌列表接口
brandPavilionGjListUrl = apiIndexUrl+"tegong/brandPavilionGjList123.do",

//收藏商品列表接口
goodsScListUrl = apiIndexUrl+"tegong/goodsScList123.do",

//-------------------------订单相关----------------------
//订单列表
orderUserListUrl = apiIndexUrl + "order/orderUserList123.do",

//原产优品订单详情页
tgOrderUrl = apiIndexUrl + "order/tgOrder124.do",

//拼团订单详情页
grouobuyOrderUrl =apiIndexUrl + "order/grouobuyOrder119.do",

//查看物流信息
selectOrderLogisticalUrl = apiIndexUrl + "Logistical/selectOrderLogistical125.do",

//检查订单状态 仅限下单未付款
checkOrderUrl =apiIndexUrl+"check/checkOrder119.do",

//改变原产优品订单状态
updateStatusUrl = apiIndexUrl + "tegong/updateStatus.do",

//改变拼团订单状态
updateOrderStausUrl =apiIndexUrl+ "activity/updateOrderStaus.do",

//订单评价商品列表接口
goodsDetails1Url = apiIndexUrl +"order/goodsDetails123.do",

//提交原产优品商品评价接口
addCommendUrl = apiIndexUrl+"tegong/addCommend123.do",

//提交拼团评价接口
submitCommentUrl = apiIndexUrl+"activity/submitComment.do",

//提交定制生活评价接口
clSubmitCommentUrl = apiIndexUrl+"customlife/submitComment129.do",

//检查订单库存信息
checkStockInfoUrl = apiIndexUrl + "order/checkStockInfo129.do",

//-------------------------定制生活订单相关----------------------
//定制生活订单列表
clOrderListUrl  = apiIndexUrl+"customlife/orderUserList129.do",

//定制生活用户端订单详情
clOrderDetailUrl  = apiIndexUrl+"customlife/orderDetail131.do",

//定制生活用户端子订单详情
clSubOrderDetailUrl  = apiIndexUrl+"customlife/subOrderDetail131.do",

//定制生活获取手动配送给我发货信息
clGetSendToMeInfoUrl  = apiIndexUrl+"customlife/getsendtomeinfo129.do",

//定制生活给我发货
clSendToMeUrl  = apiIndexUrl+"customlife/sendtome129.do",

//定制生活获取退款信息
clGetRefundInfoUrl  = apiIndexUrl+"customerrefundservice/getrefundinfo129.do",

//申请退款
clRefundServiceUrl  = apiIndexUrl+"customerrefundservice/add129.do",

//再次发起退款申请
clRefundRestartUrl  = apiIndexUrl+"customerrefundservice/restart129.do",

//获取退款详情
clRefundDetailListUrl  = apiIndexUrl+"customerrefundservice/detailList129.do",

//取消退款
clRefundCancelUrl  = apiIndexUrl+"customerrefundservice/cancel129.do",

//取消订单
clCloseOrderUrl  = apiIndexUrl+"customlife/closeCustomLifeOrder129.do",

//催发货
cldeliveryUrl  = apiIndexUrl+"customerservice/delivery124.do",

//确认收货
clConfirmReceiptUrl  = apiIndexUrl+"customlife/confirmReceipt129.do",


//----------------------商品详情接口-------------------------

//-------原产优品-----
//原产地精选商品详情接口
nativeProductsDetailUrl = apiIndexUrl+"tegong/details123.do",

//原产优品商品评价接口    一次请求所有的评价信息
commendListUrl = apiIndexUrl+"tegong/commendList.do?",

//原产优品商品详情爆款列表  只显示二十条信息
baoKuanUrl = apiIndexUrl+"tegong/goodsTjList123.do",

//---------拼团-------
//拼团详情接口
groupBuyUserUrl =apiIndexUrl+"activity/groupBuyUser119.do",

//社区拼团商品详情评价接口
selectGroupbuyCommListUrl = apiIndexUrl+"activity/selectGroupbuyCommList119.do",

//---------定制生活-------
//定制生活详情页面接口
clDetailUrl = apiIndexUrl+"customlife/detail131.do",
//获取商品可配日期周期
clDatelistUrl = apiIndexUrl+"customlife/datelist129.do",

//定制生活评价列表
clCommendListUrl  = apiIndexUrl+"customlife/commendList129.do",

//--------共用-------
//获取卖家联系方式接口
mobileInfoUrl = apiIndexUrl + "user/mobileInfo.do",

//判断商品是否失效
checkProductUrl = apiIndexUrl+"check/checkProduct119.do",


//----------------------注册及登录所需接口-------------------------
//获取验证码接口
getCaptchaUrl = wXIndexUrl+"user/getCaptcha.do",

//手机验证及密码登录接口
loginUrl = wXIndexUrl + "user/login.do",

//注册设置密码接口
regeistUrl = wXIndexUrl+"user/regeist.do",

//忘记密码验证
checkCaptchaUrl = wXIndexUrl+"user/checkCaptcha.do",

//忘记密码重置密码
updatePwdUrl = wXIndexUrl+"user/updatePwd.do",

//----------------------微信所需接口-------------------------
//获取微信信息
wXUserUrl = wXIndexUrl+"weixin/user.do",

//通过openid获取app信息
appUserUrl= wXIndexUrl+"weixin/appUser.do",

//获取注入权限接口
getJsSdkSignatureUrl = wXIndexUrl+"weixin/getJsSdkSignature.do",

//检查token
checkAccessTokenUrl = wXIndexUrl+"weixin/checkAccessToken.do",

//----------------------下单所需接口-------------------------

//原产优品下单接口
addGoodsUrl = apiIndexUrl+"shoppingCart/addGoods123.do",

//拼团下单接口
addBuyOrderUserUrl = apiIndexUrl+"activity/addBuyOrderUser119.do",

//获取用户可配送地址信息
clGetaddressUrl  = apiIndexUrl+"customlife/getaddress129.do",

//下单选择自提点
clFetchlistUrl  = apiIndexUrl+"customlife/fetchlist131.do",

//定制生活下单
clOrderUrl  = apiIndexUrl+"customlife/order129.do",

//定制生活商品查询是否修改
clCheckCustomLifeUpdateUrl  = apiIndexUrl+"customlife/checkCustomLifeUpdate131.do",


//----------------------支付所需接口-------------------------
//支付宝支付接口
getSignDataUrl = wXIndexUrl+"alipay/getSignData.do",

//支付宝支付成功验签
verifyUrl = wXIndexUrl+"alipay/verify.do",

//微信支付接口
wXgetSignDataUrl = wXIndexUrl+"weixin/getSignData.do",

//修改支付方式
modifyPayTypeUrl = apiIndexUrl+"commprpt/modifyPayType125.do",


//----------------------活动(明星社长,促销等)页面所需接口-------------------------
//活动(明星社长,促销等)页面接口
getActivitydetail = apiIndexUrl+"activePage/detail132.do",


//-------------------------------1.3.1定制生活自提点------------------------------
//自提点订单列表
fetchOrderListUrl = apiIndexUrl+"customlife/fetchOrderList131.do",
//获取自提点订单详情
getFetchOrderInfoUrl = apiIndexUrl+"customlife/getFetchOrderInfo131.do",
//确认到站
confirmArrivedUrl = apiIndexUrl+"customlife/confirmArrived131.do",
//获取待取货订单
getFetchOrderDetailUrl = apiIndexUrl+"customlife/getFetchOrderDetail131.do",
//确认取货
confirmPickupUrl = apiIndexUrl+"customlife/confirmPickup131.do",
//自提点登录
loginFetchAddressUrl = apiIndexUrl+"customlife/loginFetchAddress131.do",
//获取自提点详情
getFetchInfoByIdUrl = apiIndexUrl+"customlife/getFetchInfoById131.do",



//-------------------------------1.3.2艺术馆增加的接口------------------------------
artistshallUrl = apiIndexUrl + "activePavilion/museum132.do",

//原产优品特定分类下的商品搜索
nativetypegoodsSearch = apiIndexUrl+"tegong/typeGoodsSearch132.do",

//-------------------------------1.3.3抽奖活动增加的接口------------------------------
//获取奖品
lottery_turntable_getprizes = apiIndexUrl + "lottery/getprizes.do",

//获取获奖结果
lottery_turntable_getresults = apiIndexUrl + "lottery/getLotteryResult.do",

//-------------------------------1.3.3促销页面增加的接口------------------------------
//获取促销页面信息
getpromotionmsg = apiIndexUrl + "promotion/detail133.do",

//促销页面搜索商品接口
getpromotionsearchresult = apiIndexUrl + "promotion/goodsSearch133.do",

//检查更多促销商品是否失效的接口
checkifhasmorepromotion = apiIndexUrl + "promotion/getPageUrl133.do",

//检查用户是否能够享受促销的接口
checkifusercanusepromotion = apiIndexUrl + "promotion/getCheapFlag.do",

//待付款订单促销信息改变之后的订单检查
checkpayorderforpromotion = apiIndexUrl + "promotion/checkPromotionInfo133.do",

//-------------------------------1.3.4拍卖系统增加的接口------------------------------

//首页配置
auctionhomepage = apiIndexUrl + "auction/index134.do",

//首页拍品预告
auctionnotice = apiIndexUrl + "auction/notice134.do",

//获取正在拍卖的商品列表
acutioning = apiIndexUrl + "auction/inProgressList134.do",

//拍卖商品分类列表
auctiontypelist = apiIndexUrl + "auction/typeList134.do",

//拍卖专场详情
auctionspecailperformancedetail = apiIndexUrl + "auction/specialDetail134.do",

//拍卖搜索结果、开拍预告、分类列表中获取对应的二级类目参数
auctionsubTypeList = apiIndexUrl + "auction/subTypeList134.do",

//拍卖筛选根据二级类目id获取三级参数
auctiongetparamTypeList = apiIndexUrl + "auction/paramTypeList134.do",

//拍卖筛选根据三级类目Id获取四级参数
auctiongetparamcontentList = apiIndexUrl + "auction/paramContentList134.do",

//拍卖列表根据不同参数获取拍品列表或搜索结果列表
auctionproductList = apiIndexUrl + "auction/productList134.do";

