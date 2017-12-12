// pages/detail/detail.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    loadidngHidden: false,
    bookData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      id: option.id
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var id = this.data.id;
    var _this = this;
    request(API_BOOK_DETAIL.replace(':id', id),
      { fields: 'image,summary,publisher,title,rating,pubdate,author,author_intro,catalog' },
      (data) => {
        _this.setData({
          bookData: data
        });
      }, () => {
        wx.navigateBack();
      }, () => {
        _this.setData({
          loadidngHidden: true
        });
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
const API_BASE = "https://api.douban.com/v2/book";
const API_BOOK_DETAIL = "https://api.douban.com/v2/book/:id";
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