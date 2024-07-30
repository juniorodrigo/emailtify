const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: {
        type: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            role: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceMemberRole', required: true }
        }], required: true
    },
    clients: {
        type: [{
            clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
            role: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkspaceClientRole', required: true }
        }], default: []
    },
    campaigns: { type: [mongoose.Schema.Types.ObjectId], ref: 'Campaign' },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    mailAccounts: {
        type: [mongoose.Schema.Types.ObjectId], ref: 'MailAccount'
    },
    settings: { required: true, type: Object, default: {} }, // TODO: Definir el default de settings
    labels: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    logo: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    modifiedAt: { type: Date, required: true, default: Date.now },
});

workspaceSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.__v;
        delete ret._id;
    }
});

module.exports = workspaceSchema;
