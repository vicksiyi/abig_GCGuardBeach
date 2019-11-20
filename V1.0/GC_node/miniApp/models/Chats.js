const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序管理员端
const ChatSchema = new Schema({
    type: {             // 聊天类别
        type: String,
        required: true
    },
    name: {         // 用户名
        type: String,
        required: true
    },
    avatar: {        // 用户头像
        type: String,
        required: true
    },
    room: {             // 房间号
        type: String,
        required: true
    },
    str: {             // 正文
        type: String,
        required: true
    },
    time: {             // 加入时间
        type: Date,
        required: true
    }
})

module.exports = Chat = mongoose.model('chats', ChatSchema);  