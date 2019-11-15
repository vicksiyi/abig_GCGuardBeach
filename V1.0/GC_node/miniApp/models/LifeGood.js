const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const LifeGoodSchema = new Schema({
    openId: {               // 点赞者
        type: String,
        required: true
    },
    nickName: {             // 点赞者昵称
        type: String,
        required: true
    },
    avatarUrl: {            // 点赞者头像
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

module.exports = LifeGood = mongoose.model('lifegoods', LifeGoodSchema);