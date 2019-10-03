const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdviceSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = Advice = mongoose.model('advices', AdviceSchema);