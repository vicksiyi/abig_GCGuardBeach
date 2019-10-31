// 云函数入口文件
const cloud = require('wx-server-sdk')
const QcloudSms = require("qcloudsms_js")
const appid = 1400162619 // 替换成您申请的云短信 AppID 以及 AppKey
const appkey = "badf72b1a33d22ac24d1a05409687763"
const templateId = 458912 // 替换成您所申请模板 ID
const smsSign = "无名赞" // 替换成您所申请的签名

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  /*单发短信示例为完整示例，更多功能请直接替换以下代码*/
  var qcloudsms = QcloudSms(appid, appkey);
  var ssender = qcloudsms.SmsSingleSender();
  var params = [event.num];
  // 获取发送短信的手机号码
  var mobile = event.mobile
  // 获取手机号国家/地区码
  var nationcode = event.nationcode
  ssender.sendWithParam(nationcode, mobile, templateId, params, smsSign, "", "", (err, res, resData) => {
    if (err) {
      console.log("err: ", err);
      reject({ err })
    } else {
      resolve({ res: res.req, resData })
    }
  }
  );

})