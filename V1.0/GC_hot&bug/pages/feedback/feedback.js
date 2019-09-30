Page({
  data: {
    value1: '比如在()情况下，小程序出现了()异常',
    content: '',
    max: 200,
    items: [{
      name: 'question',
      value: '遇到问题',
      checked: 'true'
    },
    {
      name: 'advice',
      value: '功能建议'
    },
    ]
  },
  //字数限制 
  inputs: function (e) {
    // 获取输入框的内容
    var content = e.detail.value;
    var reg1 = /\s+/g;
    var reg2 = /[\r\n]/g;
    if (reg1.test(content)) {
      content = content.replace(/^ +| +$/g, '');
      this.setData({
        content: content
      })
    };
    if (reg2.test(content)) {
      content = content.replace(/[\r\n]/g, '');
      this.setData({
        content: content
      })
    };
    // 获取输入框内容的长度
    var len = parseInt(content.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
  radioChange: function (e) {
    if (e.detail.value == 'question') {
      this.setData({
        value1: '比如在( )情况下，小程序出现了( )异常',
        content: ''
      });
    } else {
      this.setData({
        value1: '比如我希望加入/完善( )功能，因为( )',
        content: ''
      });
    }
  }
})