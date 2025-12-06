// backend/src/routes/cattle.routes.js
const express = require('express');
const router = express.Router();
const {
    getAllCattle,
    getCattleById,
    createCattle,
    updateCattle,
    deleteCattle
} = require('../controllers/cattle.controller');
const { authenticateToken, authorize } = require('../middleware/auth');

router.get('/', authenticateToken, getAllCattle);
router.get('/:id', authenticateToken, getCattleById);
router.post('/', authenticateToken, authorize('admin', 'editor'), createCattle);
router.put('/:id', authenticateToken, authorize('admin', 'editor'), updateCattle);
router.delete('/:id', authenticateToken, authorize('admin'), deleteCattle);

module.exports = router;
