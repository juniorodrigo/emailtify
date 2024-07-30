const mongoose = require('mongoose');
const workspaceSchema = require('../schemas/workspaceSchema');

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace;