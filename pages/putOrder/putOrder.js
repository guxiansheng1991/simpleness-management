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
    page: 1,
    limit: 10,
    orderList: [],
    isLoadAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPutOrder();
  },
  onPullDownRefresh () {
    util.showToast('下拉');
    this.setData({
      page: 1,
      orderList: [],
      isLoadAll: false
    });
    this.getPutOrder();
  },
  onReachBottom () {
    if (this.data.isLoadAll) {
      return;
    }
    this.setData({
      page: this.data.page + 1
    });
    this.getPutOrder();
  },
  // 获取入库单
  getPutOrder () {
    let recordObject = api.initTable('record');
    let queryObject = api.initQuery();
    queryObject.compare('record_type', '=', constant.RECORD_TYPE[1]);
    queryObject.compare('shop_id', '=', app.globalData.shop.id);
    let offset = this.data.limit * (this.data.page - 1);
    api.queryPage(recordObject, queryObject, this.data.limit, offset).then(data => {
      wx.stopPullDownRefresh();
      if (data.objects.length > 0) {
        let arr = this.data.orderList.concat(data.objects);
        this.setData({
          orderList: arr
        });
      } else {
        this.setData({
          isLoadAll: true
        });
        util.showToast('数据已经加载完毕');
      }
    });
  }
});