Page({
  data: {
    current: 0,
    hot: [
      {
        name: '浏览最多',
        checked: false,
        color: 'default'
      },
      {
        name: '评论最多',
        checked: false,
        color: 'red'
      },
      {
        name: '点赞最多',
        checked: true,
        color: 'blue'
      },
      {
        name: '收藏最多',
        checked: true,
        color: 'green'
      }
    ]
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      ['hot[' + event.detail.name + '].checked']: detail.checked
    })
  }
})