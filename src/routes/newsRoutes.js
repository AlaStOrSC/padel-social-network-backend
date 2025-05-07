const express = require('express');
const router = express.Router();
const { fetchPadelNews } = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(), fetchPadelNews);

module.exports = router;