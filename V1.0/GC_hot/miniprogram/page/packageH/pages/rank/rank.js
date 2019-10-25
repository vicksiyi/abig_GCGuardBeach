Page({
  data: {
    delBtnWidth: 180,
    // 数据
    list: [{
      id: 0,
      ranking: "../../resources/images/firsttitle.png",
      userName: '孔孔',
      title: '大白鲨',
    },
    {
      id: 1,
      ranking: "../../resources/images/secondtitle.png",
      userName: '孔孔',
      title: '逆戟鲸',
    },
    {
      id: 2,
      ranking: "../../resources/images/thirdtitle.png",
      userName: '孔孔',
      title: '刺豚',
    },
    {
      id: 3,
      ranking: "../../resources/images/fourtitle.png",
      userName: '孔孔',
      title: '金枪鱼',
    },
    {
      id: 4,
      ranking: "../../resources/images/fivetitle.png",
      userName: '孔孔',
      title: '安鱇鱼',
    },
    {
      id: 5,
      ranking: "../../resources/images/sixtitle.png",
      userName: '孔孔',
      title: '蝴蝶鱼',
    },
    {
      id: 6,
      ranking: "../../resources/images/seventitle.png",
      userName: '孔孔',
      title: '梭子鱼',
    },
    {
      id: 7,
      ranking: "../../resources/images/eighttitle.png",
      userName: '孔孔',
      title: '狮子鱼',
    },
    {
      id: 8,
      ranking: "../../resources/images/ninetitle.png",
      userName: '孔孔',
      title: '小鲤鱼',
    }
    ],
    scorllHeight: 0
  },
  onLoad: function () {
    let _this = this
    wx.getSystemInfo({
      success(res) {
        console.log(res)
        _this.setData({
          scorllHeight: res.windowHeight
        })
      }
    })
  }
})