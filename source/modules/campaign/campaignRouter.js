const router = require('express').Router();
const campaignController = require('./campaignController');

router.get('/:campaignId', campaignController.getCampaignInfo);
router.post('/create', campaignController.createCampaign);
router.post('/create-schedule', campaignController.createSchedule);

router.post('/add-mail', campaignController.addMailAccountToCampaign);
router.get('/:campaignId/mail-accounts', campaignController.getCampaignMailAccounts);

router.post('/edit/basic-settings', campaignController.updateBasicSettings);
router.post('/edit/sending-pattern', campaignController.updateSendingPattern);
router.post('/edit/cc-bcc', campaignController.updateCcAndBcc);

// Lo mismo pero GETS
router.get('/:campaignId/basic-settings', campaignController.updateBasicSettings);
router.get('/:campaignId/sending-pattern', campaignController.updateSendingPattern);
router.get('/:campaignId/cc-bcc', campaignController.updateCcAndBcc);
router.get('/:campaignId/schedule', campaignController.createSchedule);

module.exports = router;