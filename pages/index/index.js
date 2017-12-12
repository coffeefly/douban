//index.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/util.js');

var iconColor=[
  '#42bd56','#31a040'
];

Page({
  data: {
    scrollHeight: 0,
    pageIndex: 0, //页码
    totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    footerIconColor: iconColor[0], //下拉刷新球初始颜色
    pageData: [], //图书数据
    searchKey: null //搜索关键字
  },
  //事件处理函数
  
  onLoad: function () {
    
  },

  onShow:function(){
    wx.getSystemInfo({
      success:(res)=>{
        this.setData({
          scrollHeight: res.windowHeight - (100 * res.windowWidth / 750) //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
        })
      }
    })
  },

  //获取搜索狂输入值
  searchInputEvent:function(e){
    this.setData({ searchKey: e.detail.value });
  },

  //搜索按钮点击事件
  searchClickEvent:function(e){
    console.log(this.data.searchKey)
    if(!this.data.searchKey){
      return;
    }
    this.setData({
      pageIndex: 0, pageData: []
    });
    requestData.call(this);
  },

  //下拉请求数据
  scrollLowerEvent:function(e){
    if (this.data.loadingMore)
      return;
    requestData.call(this);
  },

  //跳转到详细页面
  toDetailPage: function (e) {
    var bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: '../detail/detail?id=' + bid
    });
  },
  
});
/**
 * 网路请求
 */
function request(url, data, successCb, errorCb, completeCb) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'Content-Type': 'json'
    },
    data: data,
    success: function (res) {
      if (res.statusCode == 200) {
        utils.isFunction(successCb) && successCb(res.data);
      } else
        console.log('请求异常', res);
    },
    error: function () {
      utils.isFunction(errorCb) && errorCb();
    },
    complete: function () {
      utils.isFunction(completeCb) && completeCb();
    }
  });
}

const API_BASE = "https://api.douban.com/v2/book";
const API_BOOK_SEARCH ="https://api.douban.com/v2/book/search";

/**
 * 请求图书信息
 */
function requestData() {
  var _this = this;
  var q = this.data.searchKey;
  var start = this.data.pageIndex;

  this.setData({ loadingMore: true, isInit: false });
  //updateRefreshBall.call(this);
  console.log(start)
  request(API_BOOK_SEARCH,{q: q, start: start }, (data) => {
    if (data.total == 0) {
      //没有记录
      _this.setData({ totalRecord: 0 });
    } else {
      _this.setData({
        pageData: _this.data.pageData.concat(data.books),
        pageIndex: start + 1,
        totalRecord: data.total
      });
    }
  }, () => {
    _this.setData({ totalRecord: 0 });
  }, () => {
    _this.setData({ loadingMore: false });
  });
}

/**
 * 刷新下拉效果变色球
 */
function updateRefreshBall(){
  var cIndex = 0;
  var _this = this;
  var timer = setInterval(function(){
    if (!_this.data['loadingMore']) {
      clearInterval(timer);
    }
    if (cIndex >= iconColor.length)
      cIndex = 0;
    _this.setData({ footerIconColor: iconColor[cIndex++] });
  }, 100);
}