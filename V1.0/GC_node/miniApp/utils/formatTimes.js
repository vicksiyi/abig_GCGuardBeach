const Time = function () { }


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
  * 格式化时间
  * @param {date} 当前时间戳
  * @return 返回的是已格式化的时间
  */
Time.prototype.formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

module.exports = Time