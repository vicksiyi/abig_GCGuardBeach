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

module.exports = {
  formatTime: formatTime,
  randomNum: randomNum
}
