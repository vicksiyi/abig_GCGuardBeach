Page({
    data: {
      current: 0,
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
    push_onChange(event) {
      const detail = event.detail;
      if(detailname=="社会"){
      this.setData({
        ['push[' + event.detail.name + '].checked']: detail.checked,
        ['push["财经"].checked']: false
      })
      }
    },
    hot_onChange(event) {
      const detail = event.detail;
      this.setData({
        ['hot[' + event.detail.name + '].checked']: detail.checked
      })
    }
  })