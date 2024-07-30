const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const campaignSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
    },
    name: { type: String, required: true },
    workspace: { type: String, default: '' },
})

module.exports = campaignSchema;