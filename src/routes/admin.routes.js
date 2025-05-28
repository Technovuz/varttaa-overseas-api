const express = require('express');
const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
module.exports = router;
