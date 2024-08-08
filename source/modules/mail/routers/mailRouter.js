const router = require('express').Router();
const mailController = require('../controllers/mailAccountController')

router.post('/add-account/smtp', mailController.addSmtpMailAccount);
router.post('/add-account/gmail-simple', mailController.addGmailAccount);
router.post('/add-account/outlook-simple', mailController.addOutlookAccount);

router.post('/validate-imap', mailController.validateImapConnection);
router.post('/validate-smtp', mailController.validateSmtpConnection);

module.exports = router;