const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序管理员端
const AdminSchema = new Schema({
    name: {         // 微信名字
        type: String,
        required: true
    },
    phone: {        // 手机号码
        type: String,
        required: false
    },
    email: {        // 常用邮箱
        type: String,
        required: true
    },
    password: {     // 用户登录密码
        type: String,
        required: true
    },
    identity: {     // 身份 
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('admins', AdminSchema);