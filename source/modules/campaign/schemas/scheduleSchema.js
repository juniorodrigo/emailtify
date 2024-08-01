const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timing: {
        type: {
            // Todo está expresado en minutos desde las 00:00
            from: { type: Number, default: 540 },
            to: { type: Number, default: 1080 },
            timezone: { type: String, default: 'UTC' },
            startDate: { type: Date, default: Date.now },
            endDate: { type: Date, default: Date.now },
            noEndDate: { type: Boolean, default: false },
        }, default: {
            from: 540,
            to: 1080,
            timezone: 'UTC',
            startDate: Date.now,
            endDate: Date.now,
            noEndDate: false,
        }
    },
});

module.exports = scheduleSchema;