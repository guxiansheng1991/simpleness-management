//app.js
const api = require('./utils/api.js');

App({
  globalData: {
    userInfo: null,
    shop: {},
    user: {}
  },
  onLaunch: function() {

    wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init('67cf78f9f7d9093dea8e')

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });

    // 获取店铺信息
    const shop = wx.getStorageSync('shop');
    if (shop) {
      this.globalData.shop = shop;
    } else {
      this.getShopInfo('5ca446b08c374f56a8a80465');
    }

    // 获取信息
    const user = wx.getStorageSync('user');
    if (user) {
      this.globalData.user = user;
    }
  },
  // 获取店铺信息
  getShopInfo (userId) {
    let shopObject = api.initTable('shop');
    let queryObject = api.initQuery();
    queryObject.compare('shop_owner', '=', userId);
    api.querySome(shopObject, queryObject).then(data => {
      if (data.objects.length > 0) {
        this.globalData.shop = data.objects[0];
        wx.setStorageSync('shop', this.globalData.shop);
      }
    });
  },
  // 获取用户信息
  getUserInfo(userPhone) {
    let userObject = api.initTable('user');
    let queryObject = api.initQuery();
    queryObject.compare('user_phone', '=', userPhone);
    api.querySome(userObject, queryObject).then(data => {
      console.log(data);
    });
  },
})