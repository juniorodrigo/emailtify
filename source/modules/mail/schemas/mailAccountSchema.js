const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    config: { type: Object, required: true },
});

module.exports = mailSchema;