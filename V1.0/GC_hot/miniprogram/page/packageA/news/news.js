Page({
    data: {
      current: 0,
      currentTabsIndex: 0,
      windowHeight: '',
      playBtn:false,
      fullscreen:true,
      show_pro:true,
      dir: 'horizontal',
      push: [
        {
          name: '社会',
          checked: false,
          color: 'default'
        },
        {
          name: '财经',
          checked: false,
          color: 'red'
        },
        {
          name: '美食',
          checked: true,
          color: 'blue'
        },
        {
          name: '科普',
          checked: true,
          color: 'green'
        },
        {
          name: '艺术',
          checked: true,
          color: 'yellow'
        }
      ],
     video: [
        {
         id:1,
         title:'7岁女孩身手矫健 把150斤父亲抱摔在沙滩上',
         src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
         time:'2019/10/31 21：58',
         source:'快手'
        },
       {
         id: 2,
         title: '7岁女孩身手矫健 把150斤父亲抱摔在沙滩上',
         src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
         time: '2019/10/31 21：58',
         source: '快手'
       }
      ],
      hot: [
        {
          id: 1,
          title: '7岁女孩身手矫健 把150斤父亲抱摔在沙滩上',
          photo: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3929301733,913756252&fm=26&gp=0.jpg',
          time: '2019/10/31',
          source: '快手'
        },
        {
          id: 2,
          title: '7岁女孩身手矫健 把150斤父亲抱摔在沙滩上',
          photo: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3929301733,913756252&fm=26&gp=0.jpg',
          time: '2019/10/31',
          source: '快手'
        }
      ],
    },
    handleChange({ detail }) {
      this.setData({
        current: detail.key
      });
    },
  screenChange(e) {
    let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
    if (!fullScreen) { //退出全屏
      this.setData({
        controls: false
      })
    } else { //进入全屏
      this.setData({
        controls: true
      })
    }
  },
  onTabsItemTap: function (event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      currentTabsIndex: index
    });
  },
  godetail:function(){
    wx.navigateTo({
      url: '../../packageC/pages/NewsDetail/NewsDetail',
    })
  },
  /**
   *  加载过程
   */
  onLoad: function () {
    let _this = this
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  })