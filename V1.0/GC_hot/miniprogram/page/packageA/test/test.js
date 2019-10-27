Page({
  data: {
    showModal: false,
    // 顶部菜单切换
    navbar: ['全部', '代付款', "代发货", "待收货", "已完成"],
    // 默认选中菜单
    currentTab: 0,
    index: 0,
    pick_name: "",
    // GoodList数据
    GoodList: [{
      binahao: "3124356568797697978",
      start: "已发货",
      arry: [{
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "https://img12.360buyimg.com/n1/s200x200_jfs/t1/32714/10/12499/103693/5cb7dddfE29c0b339/a9f79cb56720796d.jpg",
        money: "56",
      },
      {
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "https://img12.360buyimg.com/n1/s200x200_jfs/t1/32714/10/12499/103693/5cb7dddfE29c0b339/a9f79cb56720796d.jpg",
        money: "56",
      },
      ],
      cont_count: "2",
      count_money: "112",
    }, {
      binahao: "3124356568797697978",
      start: "已发货",
      arry: [{
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "https://img12.360buyimg.com/n1/s200x200_jfs/t1/32714/10/12499/103693/5cb7dddfE29c0b339/a9f79cb56720796d.jpg",
        money: "56",
      },
      {
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "https://img12.360buyimg.com/n1/s200x200_jfs/t1/32714/10/12499/103693/5cb7dddfE29c0b339/a9f79cb56720796d.jpg",
        money: "56",
      },
      ],
      cont_count: "2",
      count_money: "112",
    }, {
      binahao: "3124356568797697978",
      start: "已发货",
      arry: [{
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "https://img12.360buyimg.com/n1/s200x200_jfs/t1/32714/10/12499/103693/5cb7dddfE29c0b339/a9f79cb56720796d.jpg",
        money: "56",
      },
      {
        name: "这里是昵称这里是昵称这里是昵称这里是昵称这里是昵称",
        image: "https://img12.360buyimg.com/n1/s200x200_jfs/t1/32714/10/12499/103693/5cb7dddfE29c0b339/a9f79cb56720796d.jpg",
        money: "56",
      },
      ],
      cont_count: "2",
      count_money: "112",
    },],
    // 列表数据    
    list: [{
      id: 0,
      name: "客户签收人:徐剑 已签收 感谢使用圆通快递",
      dates: "2016-08-30"
    }, {
      id: 1,
      name: "北京市通州区梨园公司北京市通州区梨园公司",
      dates: "2016-08-30"
    }, {
      id: 2,
      name: "【北京市通州区梨园公司】已收入【北京市通州区梨园公司】已收入",
      dates: "2016-08-30"
    }, {
      id: 3,
      name: "北京朝阳区十里堡公司】取件人：小四 已收件",
      dates: "2016-08-30"
    }]
  },
  logistics: function() {
    this.setData({
      showModal: true
    })
  },
  disappear: function() {
    this.setData({
      showModal: false
    })
  },
  // 初始化加载
  onLoad: function () {
    var that = this;

  },
  //顶部tab切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
})