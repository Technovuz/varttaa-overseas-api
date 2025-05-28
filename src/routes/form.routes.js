const express = require('express');
const router = express.Router();
const { submitContact, submitEnquiry } = require('../controllers/form.controller');

router.post('/contact', submitContact);
router.post('/enquiry', submitEnquiry);

module.exports = router;