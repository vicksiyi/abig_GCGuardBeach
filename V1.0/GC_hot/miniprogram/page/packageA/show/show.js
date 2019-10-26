// page/packageA/show/show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: [
      {
        "picture": "https://img10.360buyimg.com/n7/jfs/t1/15698/19/11981/101342/5c94e772E57381273/4b3766ce92477b3f.jpg",
        "name": "茉莉套装",
        "content": "桌上摆饰洗手间卧室家用厨房香薰摆件儿童茶几墙面小饰品欧式浴D 鹅蛋 紫 茉莉套装",
        "price": "1260",
        "images": [
          "https://img11.360buyimg.com/n5/jfs/t1/23952/23/12222/99954/5c94e772E9065c135/76a763a6f702ce40.jpg",
          "https://img11.360buyimg.com/n5/jfs/t1/20099/8/11975/110111/5c94e772E89f378c8/7db7e55aab68406d.jpg",
          "https://img11.360buyimg.com/n5/jfs/t1/26023/28/11967/102052/5c94e772E9f830a8b/58d6ece375d02e4a.jpg",
          "https://img11.360buyimg.com/n5/jfs/t1/32300/2/7296/78339/5c94e771Edc2bcf0f/c9d70837125ede3e.jpg"
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type, options.name)
    let _this = this
    const db = wx.cloud.database()
    db.collection("abig_store").where({
      name: options.type
    }).get({
      success(res) {
        res.data[0].science.map((value, index) => {
          if (value.name == options.name) {
            _this.setData({
              value: value
            })
          }
        })
      }
    })
  }
})