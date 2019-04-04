// 初始化表格
const initTable = tableName => {
  return new wx.BaaS.TableObject(tableName);
}

// 初始化query对象
const initQuery = () => {
  return new wx.BaaS.Query();
}

// 插入一条记录
const save = (tableObject, params) => {
  return new Promise((resolve, reject) => {
    let tableInstance = tableObject.create();
    tableInstance.set(params)
      .save()
      .then((res) => {
        resolve(res.data);
      }, err => {
        reject(err);
      });
  });
}

// 查询全部
const queryAll = (tableObject) => {
  return new Promise((resolve, reject) => {
    tableObject.find().then((res) => {
      resolve(res.data);
    }, err => {
      reject(err);
    });
  });
}

// 条件查询
const querySome = (tableObject, queryObject) => {
  return new Promise((resolve, reject) => {
    tableObject.setQuery(queryObject).find().then((res) => {
      resolve(res.data);
    }, err => {
      reject(err);
    });
  });
}

module.exports = {
  initTable: initTable,
  initQuery: initQuery,
  save: save,
  queryAll: queryAll,
  querySome: querySome
};