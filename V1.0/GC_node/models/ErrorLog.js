const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序管理员端
const ErrorLogSchema = new Schema({
    url: {         // 操作
        type: String,
        required: true
    },
    log: {        // 日志数据
        type: String,
        required: false
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('errorLogs', ErrorLogSchema);