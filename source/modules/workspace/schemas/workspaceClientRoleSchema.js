const mongoose = require('mongoose');

const workspaceMemberRoleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = workspaceMemberRoleSchema;