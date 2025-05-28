const express = require('express');
const router = express.Router();
// const multer = require('multer');
const upload = require('../middlewares/multer'); // Multer middleware
const authenticateJWT = require("../middlewares/authenticateJWT"); 

const path = require('path');
const {
  createMachine,
  getMachines,
  getMachineById,
  updateMachine,
  deleteMachine
} = require('../controllers/machine.controller'); // adjust path if needed


// Routes
router.post('/add', authenticateJWT,upload.array('images', 5), createMachine);
router.get('/all', getMachines);
router.get('/:id', getMachineById);
router.put('/update/:id',authenticateJWT, upload.array('images', 5), updateMachine);
router.delete('/delete/:id',authenticateJWT, deleteMachine);

module.exports = router;
