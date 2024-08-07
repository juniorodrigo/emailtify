const mongoose = require('mongoose');
const workspaceMemberRoleSchema = require('../schemas/workspaceSchema');

const WorkspaceMemberRole = mongoose.model('WorkspaceMemberRole', workspaceMemberRoleSchema);

module.exports = WorkspaceMemberRole;