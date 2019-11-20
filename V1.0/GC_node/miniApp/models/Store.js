const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const StoreSchema = new Schema({
    name: {             // 商品名字
        type: String,
        required: true
    },
    imageBg: {          // 首页图片
        type: String,
        required: true
    },
    images: {
        type: Array,    //轮播图
        required: true
    },
    msg: {              // 详细
        type: String,
        required: true
    },
    money: {            // 运费
        type: Number,
        required: true
    },
    inventory: {        // 库存
        type: Number,
        required: true
    },
    type: {             // 类别
        type: String,
        required: true
    },
    price: {            // 爱心量
        type: Number,
        required: true
    },
    time: {             // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Store = mongoose.model('stores', StoreSchema);