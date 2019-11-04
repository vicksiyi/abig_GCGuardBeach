const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 新闻
const VideoSchema = new Schema({
    video_title: {          // 视频名字
        type: String,
        required: true
    },
    video_id: {             //  视频id
        type: String,
        required: true
    },
    video_author: {         // 视频作者
        type: String,
        required: true
    },
    video_duration: {       // 视频时间
        type: String,
        required: true
    },
    video_image: {          // 视频图片
        type: String,
        required: true
    },
    video_read_num: {        // 阅读量
        type: Number,
        required: true
    },
    video_proto_url: {        // 原始链接
        type: String,
        required: true
    },
    video_url: {              // 视频链接
        type: String,
        required: true
    },
    time: {                   // 加入时间
        type: Date,
        default: Date.now
    }
})
module.exports = Video = mongoose.model('videos', VideoSchema);