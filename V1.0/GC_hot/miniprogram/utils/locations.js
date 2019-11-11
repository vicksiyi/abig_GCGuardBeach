const QQMapWX = require('./qqmap-wx-jssdk.js');
const qqmapsdk = new QQMapWX({
    key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O'
});
function Location() { }

/**
 * 根据经纬度获取位置
 * @param {*} latitude 经度
 * @param {*} longitude 纬度
 */
Location.prototype.msg = (latitude, longitude) => {
    qqmapsdk.reverseGeocoder({
        location: {
            latitude: latitude,
            longitude: longitude
        },
        sig: '9DSDjJe92pgZIKGmupKUwiqYAZpjPnyQ',
        success: function (res) {
            console.log(res.result.address)
            return res.result.address
        },
        fail: function (error) {
            console.error(error);
        }
    });
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

module.exports = Location
