const router = require('express').Router();
const campaignController = require('./campaignController');

router.get('/by-workspace/:workspaceId/all', campaignController.getAllCampaignsFromWorkspace);
router.get('/:campaignId', campaignController.getCampaignInfo);
router.post('/create', campaignController.createCampaign);

module.exports = router;