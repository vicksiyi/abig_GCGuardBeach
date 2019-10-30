// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})


// 云函数入口函数
exports.main = async(event, context) => {
  // const fileStream = fs.createReadStream(path.join(__dirname, 'demo.jpg'))
  return await cloud.uploadFile({
    cloudPath: '/mp4/1.mp4',
    fileContent: event.srteam,
  })
}