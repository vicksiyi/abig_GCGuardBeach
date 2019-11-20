const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    type:{
        type:String
    },
    desc :{
        type:String,
        required:true
    },
    income :{
        type:String,
        required:true
    },
    expend :{
        type:String,
        required:true
    },
    cash :{
        type:String,
        required:true
    },
    remark :{
        type:String
    },
    time :{
        type:Date,
        default:Date.now
    }
})

module.exports = Profile = mongoose.model('profiles',ProfileSchema);