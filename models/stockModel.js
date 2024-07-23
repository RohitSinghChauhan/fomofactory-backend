const mongoose = require('mongoose');

const deltaSchema = new mongoose.Schema({
    hour: Number,
    day: Number,
    week: Number,
    month: Number,
    quarter: Number,
    year: Number,
}, { _id: false });

const stockSchema = mongoose.Schema({
    code: { type: String, required: true },
    rate: { type: Number, required: true },
    volume: { type: Number, required: true },
    cap: { type: Number, required: true },
    delta: { type: deltaSchema, required: true },
    timestamp: { type: Date, default: Date.now },
},
    {
        versionKey: false
    }
);

const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;