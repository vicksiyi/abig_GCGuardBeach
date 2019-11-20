const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 新闻
const NewSchema = new Schema({
    new_title: {         // 新闻名字
        type: String,
        required: true
    },
    new_time: {         // 新闻发布时间
        type: String,
        required: true
    },
    new_from: {         // 新闻来源
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
    new_content: {        // 正文
        type: String,
        required: true
    },
    new_from_url: {        // 来自
        type: String,
        required: true
    },
    new_iframe: {        // 视频来自
        type: String,
        required: true
    },
    time: {          // 加入时间
        type: Date,
        default: Date.now
    }
})
module.exports = New = mongoose.model('news', NewSchema);