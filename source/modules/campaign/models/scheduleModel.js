const mongoose = require('mongoose');
const scheduleSchema = require('../schemas/scheduleSchema');

const Schedule = mongoose.model('Campaign', scheduleSchema);

module.exports = Schedule;