const mongoose = require('mongoose');
const planSchema = require('../schemas/planSchema');

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;