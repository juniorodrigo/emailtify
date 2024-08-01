const router = require('express').Router();
const campaignController = require('./campaignController');

router.get('/:campaignId', campaignController.getCampaignInfo);
router.post('/create', campaignController.createCampaign);

router.post('/add-mail', campaignController.addMailAccountToCampaign);
router.get('/:campaignId/mail-accounts', campaignController.getCampaignMailAccounts);

router.post('/:campaignId/basic-settings', campaignController.updateBasicSettings);
router.post('/:campaignId/sending-pattern', campaignController.updateSendingPattern);
router.post('/:campaignId/cc-bcc', campaignController.updateCcAndBcc);
router.post('/:campaignId/schedule', campaignController.createSchedule);

module.exports = router;