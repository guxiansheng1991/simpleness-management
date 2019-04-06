const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// toast
const showToast = (title) => {
  wx.showToast({
    icon: 'none',
    title: title,
  });
}

// loading
const showLoading = (title) => {
  wx.showLoading({
    mask: false
  });
}
const hideLoading = (title) => {
  wx.hideLoading();
}

const timeFormat = (array) => {
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i];
    item.created_at = formatTime(new Date(item.created_at * 1000));
    item.updated_at = formatTime(new Date(item.updated_at * 1000));
  }
  return array;
}

module.exports = {
  formatTime: formatTime,
  showToast: showToast,
  showLoading: showLoading,
  hideLoading: hideLoading,
  timeFormat: timeFormat
}
