const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 新闻
const NewSchema = new Schema({
    new_name: {         // 新闻名字
        type: String,
        required: true
    },
    new_time: {         // 新闻发布时间
        type: String,
        required: true
    },
    new_route: {         // 新闻来源
        type: String,
        required: true
    },
    new_type: {        // 类别
        type: String,
        required: true
    },
    new_image: {      // 图片
        type: String,
        required: true
    },
    content: {        // 常用邮箱
        type: String,
        required: true
    },
    time: {          // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('news', NewSchema);