const QQMapWX = require('./qqmap-wx-jssdk.js');
const qqmapsdk = new QQMapWX({
    key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O'
});
const sig = '9DSDjJe92pgZIKGmupKUwiqYAZpjPnyQ'
function Location() { }

/**
 * 根据经纬度获取位置
 * @param {*} latitude 经度
 * @param {*} longitude 纬度
 * @param {*} back 回调函数
 */
Location.prototype.LLToAddress = (latitude, longitude, back) => {
    qqmapsdk.reverseGeocoder({
        //位置坐标，默认获取当前位置，非必须参数 
        //Object格式
        location: {
            latitude: latitude,
            longitude: longitude
        },
        sig: sig,

        success: function (res) { //成功后的回调
            back(res)
        },
        fail: function (error) {
            console.error(error);
        },
        complete: function (res) {
            // console.log(res);
        }
    })
}
/**
 * 阻塞
 * @param {*} delay 毫秒
 */
Location.prototype.sleep = (delay) => {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}

/**
 * 根据经纬度返回地区
 * @param {*} latitude 经度
 * @param {*} longitude 纬度
 * @param {*} back 回调函数
 */
Location.prototype.LLToNear = (keyword, latitude, longitude, back) => {
    qqmapsdk.search({
        keyword: keyword,  //搜索关键词
        location: {
            latitude: latitude,
            longitude: longitude
        },  //设置周边搜索中心点
        sig: sig,
        success: function (res) { //搜索成功后的回调
            back(res)
        },
        fail: function (res) {
            console.log(res);
        },
        complete: function (res) {
            // console.log(res);
        }
    });
}

/**
 * 距离计算
 * @param {*} dest 经度&纬度
 * @param {*} back 回调函数
 */
Location.prototype.calculateDistance = (dest, back) => {
    // qqmapsdk = new QQMapWX({
    //   key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O' // 必填
    // });
    //调用距离计算接口
    qqmapsdk.calculateDistance({
        to: dest, //终点坐标
        sig: sig,
        success: function (res) {//成功后的回调
            back(res);
        },
        fail: function (error) {
            console.error(error);
        },
        complete: function (res) {
            // console.log(res);
        }
    });
}
module.exports = Location
