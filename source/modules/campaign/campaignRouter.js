const router = require('express').Router();
const campaignController = require('./campaignController');

router.get('/:campaignUID', campaignController.getCampaignDefaultValues);
router.post('/create', campaignController.createCampaign);

module.exports = router;