const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    leadSearchLimit: {
        type: Number,
        required: true
    }
});

module.exports = planSchema; 