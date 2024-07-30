const router = require('express').Router();
const authnController = require('../controllers/authnController');

router.post('/register', authnController.registerUser);
router.post('/update', authnController.updateUser);
router.post('/update-password', authnController.updatePassword);
router.post('/update-plan', authnController.updatePlan);

module.exports = router;