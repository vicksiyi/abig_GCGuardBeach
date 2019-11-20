const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const LifeMsgSchema = new Schema({
    openId: {               // 评论者
        type: String,
        required: true
    },
    nickName: {             // 评论者昵称
        type: String,
        required: true
    },
    avatarUrl: {            // 评论者头像
        type: String,
        required: true
    },
    msg: {                  // 评论内容
        type: String,
        required: true
    },
    lifeId: {               // 生活id
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = LifeMsg = mongoose.model('lifemsgs', LifeMsgSchema);