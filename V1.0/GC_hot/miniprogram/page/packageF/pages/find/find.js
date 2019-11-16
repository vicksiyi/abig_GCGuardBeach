const {
  $Message
} = require('../../../../dist/base/index');
const Utils = require('../../../../utils/util');
const requests = require('../../../../utils/requests');
const utils = new Utils()
const app = getApp();
Page({
  data: {
    currentData: 0,
    max: 100,
    value: "",
    files: [],
    actions2: [{
      name: '删除',
      color: '#ed3f14'
    }],
    fileID: [],
    spinShow: false,
    percent: '',
    status: 'normal',
    submit: false,
    content: ''
  },
  //字数限制 
  inputs: function (e) {
    let _this = this
    // 获取输入框的内容
    let valueTemp = e.detail.value;
    var reg1 = /\s+/g;
    var reg2 = /[\r\n]/g;
    if (reg1.test(valueTemp)) {
      valueTemp = valueTemp.replace(/^ +| +$/g, '');
      _this.setData({
        value: valueTemp
      })
    };
    if (reg2.test(valueTemp)) {
      valueTemp = valueTemp.replace(/[\r\n]/g, '');
      _this.setData({
        value: valueTemp
      })
    };
    _this.setData({
      content: e.detail.value
    })
    // 获取输入框内容的长度
    var len = parseInt(valueTemp.length);
    //最多字数限制
    if (len > _this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    _this.setData({
      currentWordNumber: len //当前字数  
    });


  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 3 - this.data.files.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        console.log(res);
      }
    })
  },
  deleteImage: function (e) { //长按删除照片
    // var that = this;
    // var files = that.data.files;
    // var index = e.currentTarget.dataset.id; //获取当前长按图片下标
    // wx.showModal({
    //   title: '提示',
    //   content: '确定要删除此图片吗？',
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('点击确定,删除照片');
    //       files.splice(index, 1);
    //     } else if (res.cancel) {
    //       console.log('点击取消，不做操作');
    //       return false;
    //     }
    //     that.setData({
    //       files: files
    //     });
    //   }
    // })
    this.setData({
      visible2: true
    });
  },
  previewImage: function (e) { //点击预览图片
    var index = e.currentTarget.dataset.id; //获取当前长按图片下标
    var that = this;
    wx.previewImage({
      current: that.data.files[index],
      urls: that.data.files,
    })
  },
  handleCancel2() {
    this.setData({
      visible2: false
    });
  },
  handleClickItem2(e) {
    var that = this;
    var files = that.data.files;
    var index = e.currentTarget.dataset.id; //获取当前长按图片下标
    files.splice(index, 1);
    that.setData({
      files: files
    });
    const action = [...this.data.actions2];
    action[0].loading = true;
    this.setData({
      actions2: action
    });
    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible2: false,
        actions2: action
      });
      $Message({
        content: '删除成功！',
        type: 'success'
      });
    }, 2000);
  },
  handleClick: function () {
    let _this = this
    let cloudPath = ''
    let filePath = ''
    let fileIDTemp = []
    let tempNum = 1
    console.log(_this.data.content == '', _this.data.files.length == 0)
    if (_this.data.content == '' || _this.data.files.length == 0) {
      $Message({
        content: `文件和描述不可为空`,
        type: 'error'
      });
      return
    }
    this.setData({
      spinShow: true,
      submit: true
    })
    wx.getStorage({
      key: 'name',
      success(res) {
        for (let i = 0; i < _this.data.files.length; i++) {
          // 命名
          cloudPath = [(new Date()).getTime(), utils.randomNum()].concat().join('') + res.data + _this.data.files[i].match(/\.[^.]+?$/)[0]

          // 临时文件路径
          filePath = _this.data.files[i]
          // 文件上传
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: e => {
              fileIDTemp.push(e.fileID)
            },
            fail: e => {
              $Message({
                content: `第${i}个照片上传失败`,
                type: 'error'
              });
            },
            complete: () => {
              // wx.hideLoading()
              _this.setData({
                percent: parseInt((tempNum / _this.data.files.length)) * 100
              })
              if (parseInt((tempNum / _this.data.files.length)) * 100 == 100) {
                _this.setData({
                  fileID: fileIDTemp
                })
                _this.statusShow()
              }
              tempNum++
            }
          })
        }
      }
    })

  },
  // 图片上传状态
  statusShow: function () {
    this.setData({
      status: 'success'
    })
    $Message({
      content: `照片上传成功`,
      type: 'success'
    });
    this.submitForm()
  },
  // 表单提交
  submitForm: function () {
    console.log('开始提交表单')
    let _this = this
    let Token = ''
    let item = {}
    item.url = `http://${app.ip}:5001/mini/finds/add`;
    item.data = {
      picture: JSON.stringify(_this.data.fileID),
      content: _this.data.content
    }
    item.method = 'POST'
    wx.getStorage({
      key: 'Token',
      success(res) {
        Token = res.data
      },
      complete() {
        item.header = {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'Authorization': Token
        }
        wx.getLocation({
          success(res) {
            item.data.place = JSON.stringify({
              latitude: res.latitude,
              longitude: res.longitude
            });
            // 阻塞等待数据上传
            requests.requestUtils(item, result => {
              console.log(result);
              if (result.msg == 'Success') {
                $Message({
                  content: `已上传后台审核`,
                  type: 'success'
                });
                setTimeout(() => {
                  _this.setData({
                    spinShow: false
                  })
                  wx.switchTab({
                    url: '../../../../page/packageA/index/index'
                  })
                }, 1000);
              } else {
                $Message({
                  content: `上传后台审核失败`,
                  type: 'error'
                });
                setTimeout(() => {
                  wx.switchTab({
                    url: '../../../../page/packageA/index/index'
                  })
                }, 1000);
              }
            });
          },
          fail() {
            _this.modelLocation()
          }
        })
      }
    })
  },
  modelLocation: function () {
    let _this = this
    wx.showModal({
      title: '位置获取失败',
      content: '是否进入开启权限页面重新授权',
      confirmText: '确定',
      confirmColor: '#19be6b',
      success(res2) {
        if (res2.confirm) {
          wx.openSetting({
            success(data) {
              if (data.authSetting["scope.userLocation"]) {
                $Message({
                  content: '获取位置成功',
                  type: 'success'
                });
                // 重新提交
                _this.submitForm()
              } else {
                $Message({
                  content: '获取权限失败,发布失败',
                  type: 'error'
                });
                setTimeout(() => {
                  wx.switchTab({
                    url: '../../../packageA/index/index'
                  })
                }, 1000)
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
            content: '用户取消授权,发布失败',
            type: 'error'
          });
          setTimeout(() => {
            wx.switchTab({
              url: '../../../packageA/index/index'
            })
          }, 1000)
        }
      }
    })
  }
})