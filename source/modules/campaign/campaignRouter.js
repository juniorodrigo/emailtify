const router = require('express').Router();
const campaignController = require('./campaignController');

router.get('/:campaignId', campaignController.getCampaignInfo);
router.post('/create', campaignController.createCampaign);

router.post('/add-mail', campaignController.addMailAccountToCampaign);
router.get('/:campaignId/mail-accounts', campaignController.getCampaignMailAccounts);

module.exports = router;