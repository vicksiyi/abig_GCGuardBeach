const app = getApp()
const Utils = require('../../../../utils/util');
const utils = new Utils();
const { $Message } = require('../../../../dist/base/index');
var wxst = function () { }
const myUrl = `ws://${app.ip}:5002` // websocket链接

var ws // socket发送的消息队列
var socketMsgQueue = []
var socketOpen = true // 判断心跳变量
var heart = ''  // 心跳失败次数
var heartBeatFailCount = 0 // 终止心跳
var heartBeatTimeOut = null; // 终止重新连接
var connectSocketTimeOut = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    name: '',
    avatar: '',
    msgData: [],
    height: 0,
    classRoom: {},
    showClass: false,
    room: [],
    scrollTop: 0,
    showIcon: false,
    indicatorDots: true
  },
  onLoad: function (options) {
    let _this = this
    let nameTemp = ''
    let avatarTemp = ''

    wx.setNavigationBarTitle({ title: options.title })
    
    _this.setData({
      roomId: options.id
    })
    // 历史信息
    _this.history(1)

    // 获取姓名
    wx.getStorage({
      key: 'name',
      success(res) {
        nameTemp = res.data
        _this.setData({
          name: res.data
        })
      },
      fail(err) {
        console.log(err)
      },
      complete() {
        // 获取头像
        wx.getStorage({
          key: 'avatar',
          success(res) {
            avatarTemp = res.data
            _this.setData({
              avatar: res.data
            })
          },
          fail(err) {
            console.log(err)
          },
          complete() {
            // 开启连接
            _this.connectStart(nameTemp, avatarTemp)
          }
        })
      }
    })
    // 获取屏幕高度
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: res.windowHeight
        })
      }
    })

  },
  history: function (page) {
    console.log(`历史信息${page}`)
  },
  // 通过websocket发送数据
  formSubmit: function (e) {
    let _this = this
    if (!e.detail.value.msg) {
      $Message({
        content: '不能为空',
        type: 'warning'
      });
      return
    }
    // sendSocketMessage
    let data = JSON.stringify({
      type: 2,
      str: e.detail.value.msg,
      room: _this.data.roomId,
      name: _this.data.name,
      avatar: _this.data.avatar
    })
    _this.sendSocketMessage({
      msg: data,
      data: data,
      success: () => {
        console.log("客户端发送成功")
      },
      fail: function (err) {
        console.log('发送失败');
        $Message({
          content: '发送失败',
          type: 'error'
        });
      }
    })
    // 清空input
    _this.setData({
      value: ''
    })
  },
  //与socket建立连接
  connectStart: function (nameTemp, avatarTemp) {
    var _this = this
    ws = wx.connectSocket({
      url: myUrl,
      header: {
        // "Authorization": app.globalData.token,
        'content-type': 'application/json'
      },
      success: (res) => {
        // console.log("连接成功")
      },
      fail: (err) => {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      }
    })

    // 连接成功
    wx.onSocketOpen((res) => {
      console.log('WebSocket 成功连接', res)
      // 进入聊天
      _this.resMes(nameTemp, avatarTemp)
      // 开始心跳
      _this.startHeartBeat()
    })
    //连接失败
    wx.onSocketError((err) => {
      console.log('websocket连接失败', err);
      // twice = 0
      _this.connectStart(nameTemp, avatarTemp)
    })
    // deal
    _this.deal()
  },
  // 进入聊天
  resMes: function (nameTemp, avatarTemp) {
    var _this = this
    let data = JSON.stringify({
      type: 0,
      str: '',
      room: _this.data.roomId,
      name: nameTemp,
      avatar: avatarTemp
    })
    // console.log(joinData)
    _this.sendSocketMessage({
      msg: data,
      data: data,
      success: () => {
        $Message({
          content: '进入房间成功',
          type: 'success'
        });
      },
      fail: function (err) {
        console.log('进入房间失败');
        $Message({
          content: '进入房间失败',
          type: 'error'
        });
      },
    })
  },
  // 开始心跳
  startHeartBeat: function () {
    // console.log('socket开始心跳')
    var that = this;
    heart = 'heart';
    that.heartBeat();
  },
  // 心跳检测
  heartBeat: function () {
    var _this = this;
    if (!heart) {
      return;
    }
    var xtData = {
      type: 1,
      str: '心跳检测',
      name: _this.data.name,
      avatar: _this.data.avatar
    }
    // console.log(JSON.stringify({ xtData }))
    _this.sendSocketMessage({
      msg: JSON.stringify(xtData),
      data: JSON.stringify(xtData),
      success: function (res) {
        // console.log('socket心跳成功',res);
        if (heart) {
          heartBeatTimeOut = setTimeout(() => {
            _this.heartBeat();
          }, 5000);
        }
      },
      fail: function (res) {
        $Message({
          content: '重新连接中ing...',
          type: 'warning'
        });
        if (heartBeatFailCount > 2) {
          // 重连
          console.log('socket心跳失败')
          _this.connectStart(_this.data.name, _this.data.avatar);
        }
        if (heart) {
          heartBeatTimeOut = setTimeout(() => {
            _this.heartBeat();
          }, 5000);
        }
        heartBeatFailCount++;
      },
    });
  },
  // 通过 WebSocket 连接发送数据
  sendSocketMessage: function (options) {
    var _this = this
    if (socketOpen) {
      wx.sendSocketMessage({
        data: options.msg,
        success: function (res) {
          if (options) {
            options.success && options.success(res);
          }
        },
        fail: function (res) {
          if (options) {
            options.fail && options.fail(res);
          }
        }
      })
    } else {
      socketMsgQueue.push(options.msg)
    }
    // ws.closeSocket();
    // _this.deal()
  },
  // 监听socket
  deal: function () {
    ws.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
    })
    ws.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      // 防止退出找不到组件
      // $Message({
      //   content: '连接关闭',
      //   type: 'error'
      // });
      // socketOpen = false;
      // that.connectStart()
    })
    ws.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    ws.onMessage(onMessage => {
      var res = JSON.parse(onMessage.data)
      let _this = this
      let dataTemp = _this.data.msgData;
      let roomTemp = _this.data.room;
      if (res.room == _this.data.roomId) {
        if (res.type == 0) {
          roomTemp.push(res)
          _this.setData({
            room: roomTemp
          })
        } else {
          if (dataTemp.length > 100) {
            dataTemp.shift()
          }
          dataTemp.push(res)
          _this.setData({
            msgData: dataTemp,
            scrollTop: dataTemp.length * 1000
          })
        }
      }
      console.log(res, "接收到了消息")
    })
  },
  onUnload: function () {
    clearTimeout(heartBeatTimeOut)
    wx.closeSocket()
  },
  icon: function () {
    this.setData({
      showIcon: !this.data.showIcon
    })
  },
  // 表情包
  showFish: function () {
    this.setData({
      showFish: !this.data.showFish
    })
  },
  // 图片
  showPhoto: function () {
    console.log("图片")
  },
  // 发送表情包
  sendIcon: function (e) {
    let _this = this;
    let url = `cloud://kkworkspace-4sdw7.6b6b-kkworkspace-4sdw7-1300292448/Emotion/${e.currentTarget.dataset.index}.gif`


    let data = JSON.stringify({
      type: 3,
      str: url,
      room: _this.data.roomId,
      name: _this.data.name,
      avatar: _this.data.avatar
    })

    _this.setData({
      showFish: false,
      showIcon: false
    })
    _this.sendSocketMessage({
      msg: data,
      data: data,
      success: () => {
        console.log("客户端发送成功")
      },
      fail: function (err) {
        console.log('发送失败');
        $Message({
          content: '发送失败',
          type: 'error'
        });
      }
    })
  }
})