const app = getApp();
const request = require('../../../../utils/requests');
const { $Message } = require('../../../../dist/base/index');
const Num = require('../../resources/js/num');
const base64src = require('../../../../utils/base64src');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: {},
    spinShow: false,
    person: [],
    autoplay: true,
    interval: 2000,
    num: 2,
    key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O',
    markers: [],
    circular: true,
    token: '',
    addStatus: false,
    userNum: 0,
    show: false,  //防止滑动
    width: 0,
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      spinShow: true
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          width: res.screenWidth,
          height: res.screenHeight
        })
      }
    })
    // options.id
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });

        // 获取已加入的人数
        _this.getUserNum(options.id, res.data);
        // 检测是否已经加入
        _this.getUserStatus(options.id, res.data);
        // 获取活动的信息
        _this.getMsg(options.id, res.data);
      }
    })
    // _this.enjoy()
  },
  // 导航
  navMap: function () {
    let _this = this
    let key = "CWXBZ-JSM6U-KCJV5-2MKJ7-R6PO3-GZBA3"
    let referer = "GC海滩卫士"
    let sig = "urDytR73uaBhazdaVhHsk4j1NEDiP0"
    let endPoint = JSON.stringify({  //终点
      'name': _this.data.value.msg_address,
      'latitude': _this.data.value.msg_latitude,
      'longitude': _this.data.value.msg_longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + `&sign=${sig}`
    });
  },
  // 加入
  joinIn: async function () {
    let _this = this
    let result = {}
    $Message({
      content: '加载中...',
      type: 'warning',
      duration: 1
    });
    // 加入志愿者活动
    result = await _this.joinVolunteer()

    wx.hideLoading()
    _this.setData({
      spinShow: false,
      addStatus: true
    })
    if (result.msg == "Success") {
      $Message({
        content: '加入成功',
        type: 'success'
      });
    } else if (result.msg == "Existing") {
      $Message({
        content: '已加入',
        type: 'warning'
      });
    } else if (result.msg == "End") {
      $Message({
        content: '活动已结束',
        type: 'warning'
      });
    } else {
      $Message({
        content: '未知错误,请稍后重试...',
        type: 'error'
      });
    }
  },
  joinSuccess: function () {
    wx.navigateTo({
      url: '../../../packageH/pages/myVolunteer/myVolunteer'
    })
  },
  joinVolunteer: async function () {
    let _this = this
    let result = {}
    _this.setData({
      spinShow: true
    })
    wx.showLoading({
      title: '正在加入...',
      mask: true
    })
    let Item = {
      url: `http://${app.ip}:5001/mini/msgs/addMsgUser`,
      method: "POST",
      data: {
        msgId: _this.data.value._id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      }
    };
    result = await request.requestUtils(Item)
    return result
  },
  // 清洗time
  cleanTime: function (time) {
    return time.split("T")[0]
  },
  /**
   * 获取已加入的人数
   * @param {*} id 活动ID
   * @param {*} token token
   */
  getUserNum: async function (id, token) {
    let _this = this;
    let num = new Num();
    let userNumTemp = await num.userNum(id, token);
    // 格式化 时间
    userNumTemp.user.map((value, index) => {
      userNumTemp.user[index].time = _this.cleanTime(value.time)
    })

    _this.setData({
      userNum: userNumTemp.user.length,
      person: userNumTemp.user
    })
  },
  /**
   * 检测是否已经加入
   * @param {*} id 活动ID
   * @param {*} token token
   */
  getUserStatus: async function (id, token) {
    let _this = this;
    let num = new Num();
    let statusTemp = await num.userStatus(id, token)
    _this.setData({
      addStatus: statusTemp.status
    })
  },
  /**
   * 获取活动的信息
   * @param {*} id 活动ID
   * @param {*} token token
   */
  getMsg: async function (id, token) {
    let _this = this;
    let result = {};
    let Item = {
      url: `http://${app.ip}:5001/mini/msgs/showOne/${id}`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    // 加载信息
    result = await request.requestUtils(Item)
    let mks = []
    // 画地图logo
    mks.push({
      latitude: result.msg_latitude,
      longitude: result.msg_longitude,
      iconPath: "../../resources/images/location.png",
      width: 50,
      height: 50
    })
    wx.hideLoading()
    _this.setData({
      value: result,
      spinShow: false,
      markers: mks,
      show: true
    })
  },
  enjoy: async function (e) {
    let _this = this
    wx.showLoading({
      title: '生成中...',
      mask: true
    })
    setTimeout(() => {
      wx.hideLoading()
      _this.setData({
        canvasShow: true
      })
    }, 1000);
    let percentWidth = _this.data.width / 375
    let percentHeight = _this.data.height / 667
    wx.getImageInfo({ // 或者用wx.downloadFile
      src: _this.data.value.msg_image,
      success: re => {
        const ctx = wx.createCanvasContext('canvas-map')

        // 背景图片
        ctx.drawImage('../../resources/images/ma.jpg', 0, 0, 300 * percentWidth, 375 * percentHeight)

        // 活动图片
        // ctx.save();
        // ctx.arc(260, 160, 20, 0, 10)
        // ctx.clip();
        let str = 'GC海滩卫士~志愿者招募';
        ctx.setFontSize(15)
        ctx.setFillStyle('#1c2438')
        ctx.fillText(str, 150 - ctx.measureText(str).width * 0.5, 25 * percentHeight)
        ctx.drawImage(re.path, 20 * percentWidth, 40, 260 * percentHeight, 160)
        // 任务
        ctx.drawImage('../../resources/images/renwu.png', 30 * percentWidth, 210 * percentHeight, 12, 12)
        ctx.setFontSize(12)
        ctx.setFillStyle('#80848f')
        ctx.fillText(_this.data.value.msg_title, 50 * percentWidth, 220 * percentHeight)
        // 地址
        ctx.drawImage('../../resources/images/address.png', 30 * percentWidth, 230 * percentHeight, 12, 12)
        ctx.setFontSize(12)
        ctx.setFillStyle('#80848f')
        ctx.fillText(_this.data.value.msg_address, 50 * percentWidth, 240 * percentHeight)
        // 时间
        ctx.drawImage('../../resources/images/time.png', 30 * percentWidth, 250 * percentHeight, 12, 12)
        ctx.setFontSize(12)
        ctx.setFillStyle('#80848f')
        ctx.fillText(_this.data.value.msg_day, 50 * percentWidth, 260 * percentHeight)

        if (_this.data.value.msg_status == undefined) {
          // 加入
          ctx.rotate(20 * Math.PI / 60);
          ctx.drawImage('../../resources/images/joinSuc.png', 300 * percentWidth, -120 * percentHeight, 70, 70)
        } else {
          // 加入
          ctx.rotate(20 * Math.PI / 60);
          ctx.drawImage('../../resources/images/end.png', 300 * percentWidth, -120, 70, 70)
        }
        // ctx.draw(true, _this.saveImage())
        ctx.draw()
      }
    })
  },
  /**
   * 获取小程序码
   */
  getMode: function () {
    let result = {};
    (async () => {
      let Item = {
        url: `http://${app.ip}:5001/mini/chats/mode`,
        method: "GET",
        data: {
          path: '../../index'
        },
        header: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': _this.data.token
        }
      };
      // 加载信息
      result = await request.requestUtils(Item)
      console.log(result)
      console.log(`data:image/png;base64,${wx.arrayBufferToBase64(wx.base64ToArrayBuffer(result))}`)
    })()
  },
  // 保存图片
  saveImage() {
    let _this = this
    wx.showLoading({
      title: '保存中...',
      mask: true
    })
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'canvas-map',
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              wx.hideLoading()
              $Message({
                content: '图片已保存到相册',
                type: 'success'
              });
            },
            fail(err) {
              wx.hideLoading()
              if (err.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
                $Message({
                  content: '必须获取权限才可图片保存'
                });
                console.log("打开设置窗口");
                wx.showModal({
                  title: '跳转',
                  content: '是否进入开启权限页面',
                  confirmText: '确定',
                  confirmColor: '#19be6b',
                  success(res2) {
                    if (res2.confirm) {
                      wx.openSetting({
                        success(data) {
                          if (data.authSetting["scope.writePhotosAlbum"]) {
                            $Message({
                              content: '获取权限成功，再次点击图片保存到相册',
                              type: 'success'
                            });
                          } else {
                            $Message({
                              content: '获取权限失败',
                              type: 'error'
                            });
                          }
                        },
                        fail(err) {
                          console.log(err)
                          $Message({
                            content: '未知错误',
                            type: 'error'
                          });
                        }
                      })
                    } else {
                      $Message({
                        content: '用户取消选择'
                      });
                    }
                  }
                })
              }
            }
          });
        }
      });
    }, 3000)
  },
  closeCanvas: function () {
    this.setData({
      canvasShow: false
    })
  }
})