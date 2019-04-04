//index.js
const api = require('../../utils/api.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    shopName: '大黄蜂童鞋',
    productArray: [],
    selectedproduct: '',
    recordNumber: 1,        // 卖出数量
    user: {}
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: this.data.shopName
    });
    // 获取所有商品
    let productObject = api.initTable('product');
    api.queryAll(productObject).then(data => {
      this.setData({
        productArray: data.objects
      });
      if (this.data.productArray.length > 0) {
        this.setData({
          selectedproduct: 0
        });
      }
    });

    // 获取user
    let userObject = api.initTable('user');
    let userPhone = '13027796721';
    let queryObject = api.initQuery();
    queryObject.compare('user_phone', '=', userPhone);
    api.querySome(userObject, queryObject).then(data => {
      if (data.objects.length > 0) {
        this.setData({
          user: data.objects[0]
        });
      }
    });
  },
  formSubmit(e) {
    let _this = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let currentProduct = this.data.productArray[this.data.selectedproduct];
    let params = {
      record_type: '1',
      record_number: Number.parseInt(e.detail.value.productNumber),
      record_date: String(new Date().getTime()),
      product_id: currentProduct.id,
      shop_id: currentProduct.shop_id,
      user_id: this.data.user.id
    };
    wx.showModal({
      title: '提示',
      content: `是否已经卖出了${currentProduct.product_name},${params.record_number}件`,
      success(res) {
        if (res.confirm) {
          let recordObject = api.initTable('record');
          api.save(recordObject, params).then(data => {
            _this.formReset();
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000
            })
          });
        }
      }
    });
  },
  formReset() {
    this.setData({
      recordNumber: 1,
      selectedproduct: 0
    });
  },
  // 尺码错误
  bindPickerChange(e) {
    this.setData({
      selectedproduct: e.detail.value
    });
  },
  // 点击增加按钮
  plus () {
    this.setData({
      recordNumber: this.data.recordNumber + 1
    });
  },
  // 点击增加按钮
  subtract () {
    if (this.data.recordNumber > 1) {
      this.setData({
        recordNumber: this.data.recordNumber - 1
      });
    }
  }
})