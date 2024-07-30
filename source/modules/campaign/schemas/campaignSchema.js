const mongoose = require('mongoose');

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
})

module.exports = campaignSchema;