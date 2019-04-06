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
    selectedproduct: '',        // 选中商品数组下标
    recordNumber: 1,            // 卖出数量
    user: app.globalData.user,
    scoreUserPhone: '',         // 积分用户电话
    scoreUserNumber: 0,         // 本次积分多少
    measureArray: [],           // 所有积分带选项
    selectedMeasureIndex: 0,    // 选中的积分项
    usingScore: true,           // 为用户使用积分
    usingScoreText: '不为用户使用积分'
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: this.data.shopName
    });
    // 获取所有商品
    this.getAllProduct();
    this.getAllMeasure();
  },
  // 提交
  formSubmit(e) {
    let _this = this;
    let currentProduct = this.data.productArray[this.data.selectedproduct];
    let params = {
      record_type: constant.RECORD_TYPE[0],
      record_number: Number.parseInt(e.detail.value.productNumber),
      record_date: String(new Date().getTime()),
      product_id: currentProduct.id,
      product_name: currentProduct.product_name,
      shop_id: currentProduct.shop_id,
      user_id: this.data.user.id,
      user_name: this.data.user.user_name
    };
    // 当前商品数量是否充足
    if (currentProduct.product_number < params.record_number) {
      util.showToast('库存不足');
      return;
    }
    // 积分
    if (this.data.scoreUserPhone === '') {
      this.setData({
        usingScore: false,
        usingScoreText: '不为用户使用积分'
      });
    } else {
      this.setData({
        usingScore: true,
        usingScoreText: ''
      });
    }
    wx.showModal({
      title: `${_this.data.usingScoreText}`,
      content: `是否已经卖出了${currentProduct.product_name},${params.record_number}件`,
      success(res) {
        if (res.confirm) {
          // 修改product表中库存数据,修改成功即新增记录,否则不新增
          let productObject = api.initTable('product');
          let product = productObject.getWithoutData(currentProduct.id);
          product.incrementBy('product_number', -(params.record_number));
          api.update(product).then(data => {
            _this.addRecord(params);
          });
        }
      }
    });
  },
  formReset() {
    this.setData({
      recordNumber: 1,
      selectedproduct: 0,
      scoreUserPhone: ''
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
  // 点击减少按钮
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
  },
  // 新增操作记录
  addRecord(params) {
    // 新增记录
    let recordObject = api.initTable('record');
    api.save(recordObject, params).then(data => {
      // 获取所有商品
      this.getAllProduct();
      if (this.data.usingScore) {
        this.getUserScore();
      } else {
        this.formReset();
      }
    });
  },
  // 积分待选项改变
  bindMeasureChange (e) {
    this.setData({
      selectedMeasureIndex: e.detail.value
    });
  },
  // 积分用户电话号码
  scoreUserPhoneChange (e) {
    this.setData({
      scoreUserPhone: e.detail.value
    });
  },
  // 获取所有积分待选项
  getAllMeasure () {
    let measureObject = api.initTable('measure');
    api.queryAll(measureObject).then(data => {
      this.setData({
        measureArray: data.objects
      });
    });
  },
  // 查询特定用户积分分数
  getUserScore() {
    let scoreObject = api.initTable('score');
    let queryObject = api.initQuery();
    queryObject.compare('score_phone', '=', this.data.scoreUserPhone);
    api.querySome(scoreObject, queryObject).then(data => {
      if (data.objects.length > 0) {
        this.updateScore(data.objects[0]);
      } else {
        this.addScore();
      }
    });
  },
  // 保存积分
  addScore () {
    let currentMeasure = this.data.measureArray[this.data.selectedMeasureIndex];
    let scoreObject = api.initTable('score');
    let params = {
      score_number: currentMeasure.measure_number,
      score_phone: this.data.scoreUserPhone,
      shop_id: app.globalData.shop.id
    };
    api.save(scoreObject, params).then(data => {
      wx.showModal({
        title: '提示',
        content: `${data.score_phone}用户积分${data.score_number}分; 本次增加积分${params.score_number}`,
      });
    });
  },
  // 老用户更新积分
  updateScore(data) {
    let currentMeasure = this.data.measureArray[this.data.selectedMeasureIndex];
    let scoreObject = api.initTable('score');
    let score = scoreObject.getWithoutData(data.id);
    score.incrementBy('score_number', currentMeasure.measure_number);
    api.update(score).then(data => {
      wx.showModal({
        title: '提示',
        content: `${data.score_phone}用户积分${data.score_number}分; 本次增加积分${currentMeasure.measure_number}`,
      });
    });
  }
})