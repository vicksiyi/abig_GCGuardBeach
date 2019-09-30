const { $Message } = require('../../dist/base/index');
Page({
  data: {
    currentData: 0,
    max: 100,
    value: "",
    files: [],
    actions2: [
      {
        name: '删除',
        color: '#ed3f14'
      }
    ],
  },
  //字数限制 
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    var reg1 = /\s+/g;
    var reg2 = /[\r\n]/g;
    if (reg1.test(value)) {
      value = value.replace(/^ +| +$/g, '');
      this.setData({
        value: value
      })
    };
    if (reg2.test(value)) {
      value = value.replace(/[\r\n]/g, '');
      this.setData({
        value: value
      })
    };
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
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
  }
})