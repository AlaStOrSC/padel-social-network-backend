const express = require('express');
const router = express.Router();
const { uploadProfilePicture } = require('../controllers/fileController');
const authMiddleware = require('../middlewares/authMiddleware');
const { upload } = require('../services/fileService');

router.post('/upload-profile-picture', authMiddleware(), upload, uploadProfilePicture);

module.exports = router;