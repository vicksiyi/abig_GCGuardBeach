const request = require("../../../../utils/requests");
const app = getApp();
const Location = require('../../../../utils/locations');
const { $Message } = require('../../../../dist/base/index');
const locations = new Location();
const QQMapWX = require('../../../../utils/qqmap-wx-jssdk');
const qqmapsdk = new QQMapWX({
  key: 'RLLBZ-M3BR4-NTZUE-XDWN4-LIFB7-VKB4O'
});
var upShowSc = false; // 飞机状态
var tempSc = 0; // 上一次高度 
var status = 0;  //防止异步问题再添加一个
Page({

  data: {
    value: [],
    token: '',
    load: false,
    height: 0,
    page: 0,
    endLoad: false,
    widthTemp: 0,
    heightTemp: 0,
    scollTop:0
  },
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      load: true
    })
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          widthTemp: res.screenWidth,
          heightTemp: res.screenHeight
        })
      }
    })
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: res.windowHeight
        })
      }
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        });
        (async () => {
          let result = await _this.getFindData(0, res.data)
          _this.setData({
            load: false,
            value: result
          })
        })()
      }
    })
  },
  /**
   * 获取发现信息
   * @param {*} page 第几页
   * @param {*} token token
   */
  getFindData: async function (page, token) {
    let _this = this;
    let Item = {
      url: `http://${app.ip}:5001/mini/finds?page=${page}`,
      method: "GET",
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      }
    };
    try {
      let result = await request.requestUtils(Item)
      let tempPlace = {};
      let temp = ''
      result.map((value, index) => {
        result[index].time = value.time.split("T")[0]
        result[index].picture = JSON.parse(value.picture)
        tempPlace = JSON.parse(value.place)
        // 阻塞
        locations.sleep(300);
        // 获取位置
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: tempPlace.latitude,
            longitude: tempPlace.longitude
          },
          sig: '9DSDjJe92pgZIKGmupKUwiqYAZpjPnyQ',
          success: function (res) {
            temp = 'value[' + (index + page * 10) + '].str';
            _this.setData({
              [temp]: res.result.address
            })
          },
          fail: function (error) {
            console.error(error);
          }
        });
      })
      return result
    } catch (err) {
      console.log(err)
    }
  },
  // 放大浏览
  showImage: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url]
    })
  },
  // 评论
  msgMode: function () {

  },
  // 号召
  zhaoMode: function () {
    console.log('号召')
  },
  // 分享
  enjoyMode: function (e) {
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
    let data = _this.data.value[e.currentTarget.dataset.index];
    let percentWidth = _this.data.widthTemp / 375
    let percentHeight = _this.data.heightTemp / 667
    // 图片
    wx.getImageInfo({
      src: data.picture[0],
      success: res => {
        wx.getImageInfo({ // 或者用wx.downloadFile
          src: data.avatarUrl,
          success: re => {
            const ctx = wx.createCanvasContext('canvas-map')

            // 背景图片
            ctx.drawImage('../../resources/images/ma.jpg', 0, 0, 300 * percentWidth, 375 * percentHeight)

            // 昵称
            ctx.setFontSize(12)
            ctx.setFillStyle('#5cadff')
            ctx.fillText(data.nickName, 50 * percentWidth, 25 * percentHeight)
            // 时间
            ctx.setFontSize(12)
            ctx.setFillStyle('#bbbec4')
            ctx.fillText(data.time, (60 + ctx.measureText(data.nickName).width * 0.5 + ctx.measureText(data.time).width * 0.3) * percentWidth, 25 * percentHeight)

            // 正文
            let temp = data.content.split("")
            if (temp.length <= 20) {
              ctx.setFontSize(11)
              ctx.setFillStyle('#495060')
              ctx.fillText(data.content, 50, 45 * percentHeight)
            } else if (temp.length > 60) {
              for (let i = 0; i < 2; i++) {
                ctx.setFontSize(11)
                ctx.setFillStyle('#495060')
                ctx.fillText(data.content.slice(20 * i, 20 * i + 20), 50, (45 + i * 15) * percentHeight)
              }
              ctx.setFontSize(11)
              ctx.setFillStyle('#495060')
              ctx.fillText(data.content.slice(40, 60) + '...', 50, 75 * percentHeight)
            } else {
              for (let i = 0; i < Math.trunc(temp.length / 20); i++) {
                ctx.setFontSize(11)
                ctx.setFillStyle('#495060')
                ctx.fillText(data.content.slice(20 * i, 20 * i + 20), 50, (45 + i * 15) * percentHeight)
              }
              ctx.setFontSize(11)
              ctx.setFillStyle('#495060')
              ctx.fillText(data.content.slice(20 * Math.trunc(temp.length / 20), 20 + 20 * Math.trunc(temp.length / 20)), 50, (45 + Math.trunc(temp.length / 20) * 15) * percentHeight)
            }
            // 图片
            ctx.drawImage(res.path, 20, 80, 260 * percentWidth, 160 * percentHeight)

            // 头像
            // ctx.save();
            ctx.arc(30, 30, 15, 0, 2 * Math.PI);
            // 从画布上裁剪出这个圆形
            ctx.clip();
            ctx.drawImage(re.path, 15, 15, 30 * percentWidth, 30 * percentHeight)
            // // 号召
            // ctx.rotate(Math.PI / 3);
            // ctx.drawImage('../../resources/images/zhaohuan.png', 200, 160, 60 * percentWidth, 60 * percentHeight)
            ctx.draw()
          }
        })
      }
    })
  },
  // 导航
  map: function (e) {
    let _this = this
    let res = JSON.parse(_this.data.value[e.currentTarget.dataset.index].place)

    let key = "CWXBZ-JSM6U-KCJV5-2MKJ7-R6PO3-GZBA3"
    let referer = "GC海滩卫士"
    let sig = "urDytR73uaBhazdaVhHsk4j1NEDiP0"

    let endPoint = JSON.stringify({  //终点
      'latitude': res.latitude,
      'longitude': res.longitude,
      'name': e.currentTarget.dataset.str
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + `&sign=${sig}`
    });
  },
  // 到底部时候触发
  bottomChange: function () {
    let _this = this;
    // 到底了就不添加了
    if (!_this.data.endLoad) {
      (async () => {
        // 加载
        _this.setData({
          endShow: true
        });
        // 获取数据
        let result = await _this.getFindData(_this.data.page + 1, _this.data.token)

        let valueTemp = _this.data.value;
        if (result.length < 10) {
          _this.setData({
            endLoad: true,
            endShow: false
          })
          status++
        } else {
          _this.setData({
            page: _this.data.page + 1
          })
        }
        console.log(result)
        if (status < 2) {
          // 添加
          valueTemp.push(...result)
          _this.setData({
            value: valueTemp,
            endShow: false
          })
        }
      })()
    }
  },
  closeCanvas: function () {
    this.setData({
      canvasShow: false
    })
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
              // if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
              //   console.log("打开设置窗口");
              //   wx.openSetting({
              //     success(settingdata) {
              //       console.log(settingdata)
              //       if (settingdata.authSetting["scope.writePhotosAlbum"]) {
              //         console.log("获取权限成功，再次点击图片保存到相册")
              //       } else {
              //         console.log("获取权限失败")
              //       }
              //     }
              //   })
              // }
            }
          });
        }
      });
    }, 3000)
  },
  // 火箭效果
  scrollChange: function (e) {
    let _this = this
    if (e.detail.scrollTop > 100) {
      _this.setData({
        upShowTemp: true
      })

      if (tempSc > e.detail.scrollTop) {
        upShowSc = true
      } else {
        upShowSc = false
      }
      _this.setData({
        upShow: upShowSc
      })
    } else {
      _this.setData({
        upShowTemp: false
      })
    }
    tempSc = e.detail.scrollTop
  },
  feiUp: function () {
    let _this = this
    _this.setData({
      fei: true,
    })

    setTimeout(() => {
      _this.setData({
        fei: false,
        scollTop: 0
      })
    }, 1000);
  }
})