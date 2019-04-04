//index.js
const api = require('../../utils/api.js');
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone: '',
    userPassword: ''
  },
  // 登录
  submit () {
    if (this.data.userPhone === '' || this.data.userPassword === '') {
      wx.showToast({
        icon: 'none',
        title: '请填写完整用户名或密码',
      });
      return;
    }
    let userObject = api.initTable('user', true);
    let queryObject = api.initQuery();
    queryObject.compare('user_phone', '=', this.data.userPhone);
    queryObject.compare('user_password', '=', this.data.userPassword);
    api.querySome(userObject, queryObject).then(data => {
      if (data.objects.length > 0) {
        app.globalData.user = data.objects[0];
        wx.setStorageSync('user', data.objects[0]);
        wx.navigateBack({});
      } else {
        wx.showToast({
          icon: 'none',
          title: '用户名密码不匹配,请重新输入',
        });
        this.setData({
          userPhone: '',
          userPassword: ''
        });
      }
    });
  },
  // 取消
  cancel () {
    wx.navigateBack({});
  },
  userPhoneChange (e) {
    this.setData({
      userPhone: e.detail.value
    });
  },
  userPasswordChange (e) {
    this.setData({
      userPassword: e.detail.value
    });
  }
})