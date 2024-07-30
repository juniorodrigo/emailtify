const mongoose = require('mongoose');
const mailAccountSchema = require('../schemas/mailAccountSchema');

const MailAccount = mongoose.model('MailAccount', mailAccountSchema);

module.exports = MailAccount;