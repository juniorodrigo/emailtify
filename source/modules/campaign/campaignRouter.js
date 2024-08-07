const router = require('express').Router();
const campaignController = require('./campaignController');

router.get('/:campaignId', campaignController.getCampaignInfo);
router.post('/create', campaignController.createCampaign);
router.post('/create-schedule', campaignController.createSchedule);

router.post('/delete-schedule', campaignController.deleteSchedule);
router.post('/delete', campaignController.deleteCampaign);

router.post('/add-mail', campaignController.addMailAccountToCampaign);
router.get('/:campaignId/mail-accounts', campaignController.getCampaignMailAccounts);

router.post('/edit/basic-settings', campaignController.updateBasicSettings);
router.post('/edit/sending-pattern', campaignController.updateSendingPattern);
router.post('/edit/cc-bcc', campaignController.updateCcAndBcc);
router.post('/edit/schedule', campaignController.updateSchedule);

// LEADS
router.get('/leads/:campaignId', campaignController.getLeadsByCampaign);


module.exports = router;