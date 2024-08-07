const router = require('express').Router();
const leadController = require('./leadController');

router.get('/find-by-filter', leadController.findLeadsByFilter);

module.exports = router;