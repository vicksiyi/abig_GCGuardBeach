const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const OauthUserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = OauthUser = mongoose.model('oauthUsers', OauthUserSchema);