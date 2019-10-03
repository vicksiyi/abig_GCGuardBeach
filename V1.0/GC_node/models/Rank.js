const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const RankSchema = new Schema({
    num :{
        type:String,
        required:true
    },
    nikname :{
        type:String,
        required:true
    },
    title :{
        type:String,
        required:true
    },
    love :{
        type:String,
        required:true
    },
    time :{
        type:Date,
        default:Date.now
    }
})

module.exports = Rank = mongoose.model('ranks',RankSchema);