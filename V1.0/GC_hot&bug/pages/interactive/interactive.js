var app = getApp();
Page({
  data: {
    currentData: 0,
    max: 60,
    value: "",
    files: [],
    array: [{
        id: 1,
        headportrait: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
        headname: '我是测试小熙',
        headgoodcount: '300',
        contenttext: '同志们，我现在正在茂名的中国第一滩，位于假日酒店门口对出的沙滩这边比较多的垃圾。在附近的同志们快来支援我。急急急急急急！！！！',
        contentpicture: [{
            id: 1,
            photo: 'https://i.loli.net/2017/08/21/599a521472424.jpg'
          },
          {
            id: 2,
            photo: 'https://i.loli.net/2017/08/21/599a521472424.jpg'
          }
        ]
      }, {
        id: 2,
        headportrait: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
        headname: '我是测试小纯66666',
        headgoodcount: '14',
        contenttext: '哈哈哈哈哈哈楼上的我在你旁边哦，我就来了。冲冲冲冲，捡垃圾',
        contentpicture: [{
          id: 1,
          photo: 'https://i.loli.net/2017/08/21/599a521472424.jpg'
        }]
      },
      {
        id: 3,
        headportrait: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
        headname: '我是测试小威',
        headgoodcount: '0',
        contenttext: '你们俩在哪里呀'
      }
    ],
    lifearray: [{
      id: 1,
      headportrait: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
      headname: '我是生活小熙',
      headgoodcount: '300',
      contenttext: '哈哈哈哈，最近我们这边实施了垃圾分类，感觉环境棒棒棒哦',
      contentpicture: [{
          id: 1,
          photo: 'https://i.loli.net/2017/08/21/599a521472424.jpg'
        },
        {
          id: 2,
          photo: 'https://i.loli.net/2017/08/21/599a521472424.jpg'
        }
      ]
    }, {
      id: 2,
      headportrait: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
      headname: '我是生活小纯66666',
      headgoodcount: '14',
      contenttext: '羡慕楼上滴，啥时候我们这边也可以呢',
      contentpicture: [{
        id: 1,
        photo: 'https://i.loli.net/2017/08/21/599a521472424.jpg'
      }]
    }],
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0 //tab标题的滚动条位置
  },
  //字数限制 
  inputs: function(e) {
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
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 3 - this.data.files.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  deleteImage: function (e) { //长按删除照片
    var that = this;
    var files = that.data.files;
    var index = e.currentTarget.dataset.id; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定,删除照片');
          files.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消，不做操作');
          return false;
        }
        that.setData({
          files: files
        });
      }
    })
  },
  previewImage: function (e) { //点击预览图片
    var index = e.currentTarget.dataset.id; //获取当前长按图片下标
    var that = this;
    wx.previewImage({
      current: that.data.files[index],
      urls: that.data.files,
    })
  },
  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function() {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  footerTap: app.footerTap
})