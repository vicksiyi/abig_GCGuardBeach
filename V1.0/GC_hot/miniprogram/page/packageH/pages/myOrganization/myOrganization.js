const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.connectSocket({
      url: `ws://${app.ip}:5002`,
      header: {
        'content-type': 'application/json'
      },
      protocols: ['protocol1']
    })
    
    wx.onSocketMessage((res)=>{
      console.log(res)
    })
  },
  formSubmit: function (e) {
    let socketOpen = false
    const socketMsgQueue = []
    wx.onSocketOpen(function (res) {
      socketOpen = true
      sendSocketMessage('傻逼')
      console.log(res)
    })
    console.log("123")
    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }
  }
})