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
    sizeName: '',
    sizeArray: []
  },
  /**
   * 页面加载
   */
  onLoad () {
    this.getAllSize();
  },
  sizeNameChange (e) {
    this.setData({
      sizeName: e.detail.value
    });
  },
  submit () {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定添加此尺码吗?',
      success (res) {
        if (res.confirm) {
          _this.getSize(_this.data.sizeName);
        }
      }
    })
  },
  reset () {
    this.setData({
      sizeName: ''
    });
  },
  addSize () {
    if (this.data.sizeName === '' || app.globalData.shop.id === '') {
      util.showToast('请输入尺码名称');
      return;
    }
    let sizeObject = api.initTable('size');
    let params = {
      size_name: this.data.sizeName,
      shop_id: app.globalData.shop.id
    };
    api.save(sizeObject, params).then(data => {
      this.getAllSize();
      this.reset();
    });
  },
  // 获取所有size
  getAllSize () {
    let sizeObject = api.initTable('size');
    api.queryAll(sizeObject).then(data => {
      if (data.objects.length > 0) {
        this.setData({
          sizeArray: data.objects
        });
      }
    });
  },
  // 查询特定的size
  getSize (sizeName) {
    let sizeObject = api.initTable('size');
    let queryObject = api.initQuery();
    queryObject.compare('size_name', '=', sizeName);
    api.querySome(sizeObject, queryObject).then(data => {
      if (data.objects.length > 0) {
        util.showToast('该尺码已经存在');
      } else {
        this.addSize();
      }
    });
  }
})