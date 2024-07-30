const mongoose = require('mongoose');
const campaignSchema = require('../schemas/campaignSchema');

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;