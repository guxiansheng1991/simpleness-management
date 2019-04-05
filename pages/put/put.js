const api = require('../../utils/api.js');
const util = require('../../utils/util.js');
const constant = require('../../utils/constant.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productName: '',
    productNumber: 1,
    productOriginalNumber: 0,   // 原库存
    productSizeId: '',
    productSizeName: '',
    productBarCode: '',
    originalProduct: {},        // 已经存在的商品
    sizeArray: [],              // 所有尺码
    selectedIndex: 0,           // 选中尺码数组下标
    isAdd: true                 // 是否是新增商品,有可能只是更新一下库存
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAllSize();
  },
  // 调起微信扫码
  handleScanCode() {
    let _this = this;
    wx.scanCode({
      success(res) {
        _this.setData({
          productBarCode: res.result
        });
        _this.getProduct(res.result);
      },
      fail(res) {
        util.showToast('扫码失败,请重试');
      }
    })
  },
  // 新增库存
  handleAdd () {
    if (this.data.productBarCode === '' || this.data.productName === '' || this.data.productNumber === '') {
      util.showToast('请将入库单填写完整');
      return;
    }
    // 新增一个商品,或者更新一个商品的状态
    if (this.data.isAdd) {
      this.addProduct();
    } else {
      this.updateProduct();
    }
  },
  // 重置
  handleReset () {
    this.setData({
      productName: '',
      productNumber: 1,
      productSizeId: '',
      productSizeName: '',
      productBarCode: '',
      productOriginalNumber: 0
    });
  },
  // 新增一个商品
  addProduct () {
    let productObject = api.initTable('product');
    let currentSize = this.data.sizeArray[this.data.selectedIndex];
    let params = {
      product_name: this.data.productName,
      product_number: this.data.productNumber + this.data.productOriginalNumber,
      product_bar_code: this.data.productBarCode,
      size_id: currentSize.id,
      size_name: currentSize.size_name,
      shop_id: app.globalData.shop.id
    };
    api.save(productObject, params).then(data => {
      // 新增一个库存单
      this.addRecord(data);
    });
  },
  // 更新一个商品
  updateProduct() {
    let productObject = api.initTable('product');
    let product = productObject.getWithoutData(this.data.originalProduct.id);
    product.incrementBy('product_number', Number.parseInt(this.data.productNumber));
    api.update(product).then(data => {
      // 新增一个库存单
      this.addRecord(data);
    });
  },
  // 新增一个操作记录
  addRecord (product) {
    let recordObject = api.initTable('record');
    let params = {
      record_type: constant.RECORD_TYPE[1],
      record_number: Number.parseInt(this.data.productNumber),
      record_date: String(new Date().getTime()),
      product_id: product.id,
      product_name: product.product_name,
      shop_id: app.globalData.shop.id,
      user_id: app.globalData.user.id,
      user_name: app.globalData.user.user_name
    };
    api.save(recordObject, params).then(data => {
      // 提示操作成功.并清空页面数据
      util.showToast('入库成功');
      this.handleReset();
    });
  },
  // 尺码选择改变
  bindSizeChange (e) {
    this.setData({
      selectedIndex: e.detail.value
    });
  },
  handleProducrtBarCodeChange (e) {
    this.setData({
      productBarCode: e.detail.value
    });
  },
  handleProducrtNameChange(e) {
    this.setData({
      productName: e.detail.value
    });
  },
  handleProducrtNumberChange(e) {
    this.setData({
      productNumber: e.detail.value
    });
  },
  // 查询商品是否存在
  getProduct(productBarCode) {
    let productObject = api.initTable('product');
    let queryObject = api.initQuery();
    queryObject.compare('product_bar_code', '=', productBarCode);
    api.querySome(productObject, queryObject).then(data => {
      if (data.objects.length > 0) {
        let currentProduct = data.objects[0];
        this.setData({
          originalProduct: currentProduct,
          productName: currentProduct.product_name,
          productOriginalNumber: currentProduct.product_number,
          productSizeId: currentProduct.size_id,
          productSizeName: currentProduct.size_name,
          isAdd: false
        });
      } else {
        this.setData({
          isAdd: true
        });
      }
    });
  },
  // 获取所有商品尺寸
  getAllSize () {
    let sizeObject = api.initTable('size');
    api.queryAll(sizeObject).then(data => {
      if (data.objects.length > 0) {
        this.setData({
          sizeArray: data.objects,
          selectedIndex: 0
        });
      } else {
        util.showToast('请先添加尺码再进行入库操作');
      }
    });
  }
})