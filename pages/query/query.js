const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const constant = require('../../utils/constant.js');
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '0',        // 当前tab
    barCode: '',            // 条码
    userPhone: '',          // 用户电话号码
    productArray: [],       // 商品数组
    userScoreArray: []      // 用户积分数组
  },
  onLoad () {
    api.checkLoginStatus();
  },
  // 获取商品库存
  getProductNumber () {
    if (this.data.barCode === '') {
      util.showToast('请先扫描条码');
      return;
    }
    let productObject = api.initTable('product');
    let queryObject = api.initQuery();
    queryObject.compare('product_bar_code', '=', this.data.barCode);
    api.querySome(productObject, queryObject).then(data => {
      if (data.objects.length <= 0) {
        util.showToast('未查到此商品');
      }
      this.setData({
        productArray: data.objects
      });
    });
  },

  // 获取用户积分
  getUserScoreNumber () {
    if (this.data.userPhone === '') {
      util.showToast('请先输入用户手机号码');
      return;
    }
    let scoreObject = api.initTable('score');
    let queryObject = api.initQuery();
    queryObject.compare('score_phone', '=', this.data.userPhone);
    api.querySome(scoreObject, queryObject).then(data => {
      if (data.objects.length <= 0) {
        util.showToast('未查到该用户');
      }
      this.setData({
        userScoreArray: data.objects
      });
    });
  },
  // 扫码
  scanCode () {
    let _this = this;
    wx.scanCode({
      success(res) {
        _this.setData({
          barCode: res.result
        });
      },
      fail(res) {
        util.showToast('扫码失败,请重试');
      }
    })
  },
  tabChange (e) {
    this.setData({
      currentTab: e.currentTarget.id === '0' ? '1' : '0',
      // userPhone: '',
      // barCode: '',
      // productArray: [],
      // userScoreArray:[]
    });
  },
  onUserPhoneChange (e) {
    this.setData({
      userPhone: e.detail.value
    });
  }
})