const {
  $Message
} = require('../../../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    num: 0,
    picture: [
      "https://f10.baidu.com/it/u=752933719,2910359121&fm=72",
      "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1791756207,2978103232&fm=26&gp=0.jpg",
      "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2827671765,2134146140&fm=26&gp=0.jpg",
      "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3018012401,1671622766&fm=26&gp=0.jpg",
      "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2720935957,2361862842&fm=26&gp=0.jpg",
      "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3965504300,834220496&fm=26&gp=0.jpg"
    ],
    msg: '',
    visible2: false,
    actions2: [{
      name: '删除',
      color: '#ed3f14'
    }],
    id: 0,
    showPhoto: false,
    showStatus: false,
    tag: '我家有猫'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: res.windowHeight
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
    wx.navigateTo({
      url: '../selectTag/selectTag'
    })
  }
})