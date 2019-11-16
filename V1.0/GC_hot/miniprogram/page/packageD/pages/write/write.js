const {
  $Message
} = require('../../../../dist/base/index');
const app = getApp();
const request = require("../../../../utils/requests");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    num: 0,
    picture: [],
    msg: '',
    visible2: false,
    actions2: [{
      name: '删除',
      color: '#ed3f14'
    }],
    id: 0,
    showPhoto: false,
    showStatus: false,
    tag: 'GC海滩卫士',
    token: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    if (options.type != undefined && options.type) {
      _this.setData({
        tag: options.type
      })
    }
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: res.windowHeight
        })
      }
    })
    wx.getStorage({
      key: 'picture',
      success(res) {
        _this.setData({
          picture: JSON.parse(res.data)
        })
      }
    })
    wx.getStorage({
      key: 'Token',
      success(res) {
        _this.setData({
          token: res.data
        })
      }
    })
    wx.getStorage({
      key: 'msg',
      success(res) {
        _this.setData({
          msg: res.data
        })
      }
    })
  },
  // 选择图片
  addImage: function () {
    let _this = this
    wx.chooseImage({
      count: 9 - _this.data.picture.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.setData({
          picture: _this.data.picture.concat(res.tempFilePaths)
        });
      }
    })
  },
  // 长按删除
  deleteImage: function (e) {
    this.setData({
      visible2: true,
      id: e.currentTarget.dataset.id
    });
  },
  handleClickItem2: function (e) {
    let _this = this;
    let picture = _this.data.picture;
    let index = _this.data.id; //获取当前长按图片下标
    picture.splice(index, 1);
    _this.setData({
      picture: picture
    });
    const action = [..._this.data.actions2];
    action[0].loading = true;
    _this.setData({
      actions2: action
    });
    action[0].loading = false;
    _this.setData({
      visible2: false,
      actions2: action
    });
    $Message({
      content: '删除成功！',
      type: 'success'
    });
  },
  handleCancel2() {
    this.setData({
      visible2: false
    });
  },
  // 放大浏览
  showImage: function (e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.image,
      current: e.currentTarget.dataset.url
    })
  },
  showPicture: function () {
    let _this = this
    _this.setData({
      showPhoto: !_this.data.showPhoto,
      showStatus: true
    })
  },
  selectTag: function () {
    wx.setStorage({
      key: "picture",
      data: JSON.stringify(this.data.picture)
    })
    wx.setStorage({
      key: "msg",
      data: this.data.msg
    })
    wx.navigateTo({
      url: '../selectTag/selectTag'
    })
  },
  onUnload: function () {
    wx.removeStorage({
      key: 'picture',
      success(res) {
        console.log(res)
      }
    })
    wx.removeStorage({
      key: 'msg',
      success(res) {
        console.log(res)
      }
    })
    wx.removeStorage({
      key: 'type',
      success(res) {
        console.log(res)
      }
    })
  },
  msgChange: function (e) {
    this.setData({
      msg: e.detail.value
    })
  },
  submit: function () {
    let _this = this
    let Item = {
      url: `http://${app.ip}:5001/mini/chats/send`,
      method: "POST",
      data: {
        picture: JSON.stringify(_this.data.picture),
        content: _this.data.msg,
        type: _this.data.tag
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      }
    };
    request.requestUtils(Item, res => {
      if (res.msg == "Success") {
        $Message({
          content: '发布成功！',
          type: 'success'
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000);
      }
    })
  },
  onShow: function () {
    let _this = this
    wx.getStorage({
      key: 'type',
      success(res) {
        _this.setData({
          tag: res.data
        })
      }
    })
  }
})