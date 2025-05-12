const express = require('express');
const router = express.Router();
const { createMatch, getMatches, updateMatch, deleteMatch, saveMatch } = require('../controllers/matchController');
const {
  validateResult,
  createMatchValidations,
  updateMatchValidations,
  matchIdValidations,
  saveMatchValidations,
} = require('../validations/matchValidations');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware(), createMatchValidations, validateResult, createMatch);
router.get('/', authMiddleware(), getMatches);
router.delete('/:id', authMiddleware(), matchIdValidations, validateResult, deleteMatch);
router.put('/:id', authMiddleware()('admin'), updateMatchValidations, validateResult, updateMatch);
router.put('/savematches/:id', authMiddleware(), saveMatchValidations, validateResult, saveMatch);

module.exports = router;