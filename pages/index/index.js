//index.js
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const constant = require('../../utils/constant.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    shopName: '大黄蜂童鞋',
    productArray: [],
    selectedproduct: '', // 选中商品数组下标
    recordNumber: 1, // 卖出数量
    user: app.globalData.user
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: this.data.shopName
    });
    // 获取所有商品
    this.getAllProduct();
  },
  formSubmit(e) {
    let _this = this;
    let currentProduct = this.data.productArray[this.data.selectedproduct];
    let params = {
      record_type: constant.RECORD_TYPE[0],
      record_number: Number.parseInt(e.detail.value.productNumber),
      record_date: String(new Date().getTime()),
      product_id: currentProduct.id,
      shop_id: currentProduct.shop_id,
      user_id: this.data.user.id
    };
    // 当前商品数量是否充足
    if (currentProduct.product_number < params.record_number) {
      util.showToast('库存不足');
      return;
    }
    wx.showModal({
      title: '提示',
      content: `是否已经卖出了${currentProduct.product_name},${params.record_number}件`,
      success(res) {
        if (res.confirm) {
          // 修改product表中库存数据,修改成功即新增记录,否则不新增
          let productObject = api.initTable('product');
          let product = productObject.getWithoutData(currentProduct.id);
          product.incrementBy('product_number', -(params.record_number));
          api.update(product).then(data => {
            // 新增记录
            let recordObject = api.initTable('record');
            api.save(recordObject, params).then(data => {
              _this.formReset();
              // 获取所有商品
              _this.getAllProduct();
              wx.showToast({
                title: '操作成功',
                icon: 'success',
                duration: 2000
              })
            });
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
  plus() {
    this.setData({
      recordNumber: this.data.recordNumber + 1
    });
  },
  // 点击增加按钮
  subtract() {
    if (this.data.recordNumber > 1) {
      this.setData({
        recordNumber: this.data.recordNumber - 1
      });
    }
  },
  // 获取所有商品
  getAllProduct() {
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
  }
})