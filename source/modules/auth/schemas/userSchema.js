const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const workspaceSubSchema = new Schema({
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    defaultWorkspace: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: {
        city: { type: String },
        country: { type: String },
    },
    workspaces: [workspaceSubSchema],
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
});
userSchema.index({ email: 1 }, { unique: true });

userSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.hash;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.modifiedAt;
        delete ret.updatedAt;
        // delete ret.workspaces;
        return ret;
    }
});

// Middleware to update modifiedAt only if changes detected
userSchema.pre('findOneAndUpdate', function (next) {
    this.set({ modifiedAt: Date.now() });
    next();
});

module.exports = userSchema;