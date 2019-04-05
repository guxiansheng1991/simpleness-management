const util = require('./util.js');

// 初始化表格
const initTable = (tableName, needCheckLoginStatusFlag) => {
  // 只有needCheckLoginStatusFlag明确传入true,才不会验证用户状态
  if (!needCheckLoginStatusFlag) {
    if (!checkLoginStatus()) {
      wx.showModal({
        title: '提示',
        content: '请登录',
      });
      wx.navigateTo({
        url: '../login/login',
      });
    }
  }
  return new wx.BaaS.TableObject(tableName);
}

// 初始化query对象
const initQuery = () => {
  return new wx.BaaS.Query();
}

// 插入一条记录
const save = (tableObject, params) => {
  util.showLoading();
  return new Promise((resolve, reject) => {
    let tableInstance = tableObject.create();
    tableInstance.set(params)
      .save()
      .then((res) => {
        resolve(res.data);
        util.hideLoading();
      }, err => {
        reject(err);
        util.hideLoading();
      });
  });
}

// 查询全部
const queryAll = (tableObject) => {
  util.showLoading();
  return new Promise((resolve, reject) => {
    tableObject.find().then((res) => {
      resolve(res.data);
      util.hideLoading();
    }, err => {
      reject(err);
      util.hideLoading();
    });
  });
}

// 条件查询
const querySome = (tableObject, queryObject) => {
  util.showLoading();
  return new Promise((resolve, reject) => {
    tableObject.setQuery(queryObject).find().then((res) => {
      resolve(res.data);
      util.hideLoading();
    }, err => {
      reject(err);
      util.hideLoading();
    });
  });
}

// 分页查询
const queryPage = (tableObject, queryObject, limit, offset) => {
  util.showLoading();
  return new Promise((resolve, reject) => {
    tableObject.setQuery(queryObject).limit(limit).offset(offset).find().then((res) => {
      resolve(res.data);
      util.hideLoading();
    }, err => {
      reject(err);
      util.hideLoading();
    });
  });
}

// 更新数据
const update = (recordObject) => {
  util.showLoading();
  return new Promise((resolve, reject) => {
    recordObject.update().then((res) => {
      resolve(res.data);
      util.hideLoading();
    }, err => {
      reject(err);
      util.hideLoading();
    });
  });
}

// 检查本地登录信息是否存在
const checkLoginStatus = () => {
  let flag = false;
  let user = wx.getStorageSync('user');
  if (user && user.id) {
    flag = true;
  } else {
    flag = false;
  }
  return flag;
}

module.exports = {
  initTable: initTable,
  initQuery: initQuery,
  save: save,
  queryAll: queryAll,
  querySome: querySome,
  update: update,
  queryPage: queryPage
};