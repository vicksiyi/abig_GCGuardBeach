const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const MyinfoSchema = new Schema({
    nikname :{
        type:String,
        required:true
    },
    realname :{
        type:String,
        required:true
    },
    telphone :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    address :{
        type:String,
        required:true
    },
    time :{
        type:Date,
        default:Date.now
    }
})

module.exports = Myinfo = mongoose.model('myinfos',MyinfoSchema);