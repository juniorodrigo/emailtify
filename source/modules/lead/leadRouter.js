const router = require('express').Router();
const leadController = require('./leadController');
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/find-by-filter', leadController.findLeadsByFilter);
router.post('/upload-csv', upload.single('file'), leadController.uploadAndProcessCSV);

module.exports = router;