const mongoose = require('mongoose');
const { Schema } = mongoose;

const basicSettingsSubSchema = new Schema({
    stopSendingOnReply: {
        type: new Schema({
            enabled: { type: Boolean, default: true },
            stopOnAutoReply: { type: Boolean, default: true },
        }, { _id: false }), default: {
            enabled: true,
            stopOnAutoReply: true
        }
    },
    openTracking: {
        type: new Schema({
            enabled: { type: Boolean, default: true },
            linkTracking: { type: Boolean, default: true },
        }, { _id: false }), default: {
            enabled: true,
            linkTracking: false
        }
    },
    deliveryOptimization: { type: Boolean, default: false },
    dailyLimit: { type: Number, default: 1000000, min: 0 },
}, { _id: false });

const sendingPatternSubSchema = new Schema({
    timeGapBetweenEmails: {
        type: new Schema({
            fixed: { type: Number, default: 0 },
            random: { type: Number, default: 0 },
        }, { _id: false }), default: { fixed: 7, random: 0 }
    },
    maxNewLeads: { type: Number, default: 1000000, min: 0 },
    allowRiskyEmails: {
        type: new Schema({
            enabled: { type: Boolean, default: true },
            disableBounceProtect: { type: Boolean, default: false },
        }, { _id: false }), default: {
            enabled: false,
            disableBounceProtect: false
        }
    },
}, { _id: false });

const ccAndBccSubSchema = new Schema({
    cc: { type: [String], default: [] },
    bcc: { type: [String], default: [] },
}, { _id: false });


const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', default: '' },
    status: { type: String, default: 'draft' },
    progress: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    click: { type: Number, default: 0 },
    replied: { type: Number, default: 0 },
    opportunities: { type: Number, default: 0 },
    mailAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MailAccount' }],
    basicSettings: basicSettingsSubSchema,
    sendingPattern: sendingPatternSubSchema,
    ccAndBcc: ccAndBccSubSchema,
    schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
}, { timestamps: true });

module.exports = campaignSchema;