const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const FindSchema = new Schema({
    picture :{
        type:String,
        required:true
    },
    content :{
        type:String,
        required:true
    },
    price :{
        type:String,
        required:true
    },
    time :{
        type:Date,
        default:Date.now
    }
})

module.exports = Find = mongoose.model('finds',FindSchema);