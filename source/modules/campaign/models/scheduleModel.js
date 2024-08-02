const mongoose = require('mongoose');
const scheduleSchema = require('../schemas/scheduleSchema');

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;