/**
  * 格式化时间
  * @param {date} 当前时间戳
  * @return 返回的是已格式化的时间
  */
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


/**
  * 生成十个不重复的随机数
  * @return 返回的是十个随机数字符串
  */
const randomNum = () => {
  var arr1 = new Array();
  var arr2 = new Array();
  for (var i = 0; i < 20; i++) {

    arr1.push(i);

  }

  for (var k = 0; k < 10; k++) {

    var id = Math.ceil(Math.random() * 19);
    if (arr2.indexOf(arr1[id]) === -1) {
      arr2.push(arr1[id]);
    } else {
      k = k - 1;
      continue;
    }
  }
  return arr2.join("")
}


/**
  * 返回当周的时间
  * @return 周数
  * @example 当天：2019-10-05  return ["2019-09-30", "2019-10-01", "2019-10-02", "2019-10-03", "2019-10-04", "2019-10-05", "2019-10-06"]
  */
const thisWeek = () => {
  const dateOfToday = Date.now()
  const dayOfToday = (new Date().getDay() + 7 - 1) % 7
  const daysOfThisWeek = Array.from(new Array(7))
    .map((_, i) => {
      const date = new Date(dateOfToday + (i - dayOfToday) * 1000 * 60 * 60 * 24)
      return date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0')
    })
  return daysOfThisWeek
}

module.exports = {
  formatTime: formatTime,
  randomNum: randomNum,
  thisWeek: thisWeek
}
