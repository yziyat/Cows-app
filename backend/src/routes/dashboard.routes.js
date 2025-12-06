// backend/src/routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const totalCattle = await db.query('SELECT COUNT(*) FROM cattle WHERE status = $1', ['active']);
        const activeCycles = await db.query('SELECT COUNT(*) FROM synchronization_cycles WHERE status IN ($1, $2)', ['planned', 'in_progress']);
        const pendingInseminations = await db.query('SELECT COUNT(*) FROM inseminations WHERE result = $1', ['pending']);
        const pregnantCattle = await db.query('SELECT COUNT(*) FROM inseminations WHERE result = $1', ['pregnant']);

        res.json({
            stats: {
                total_cattle: parseInt(totalCattle.rows[0].count),
                active_cycles: parseInt(activeCycles.rows[0].count),
                pending_inseminations: parseInt(pendingInseminations.rows[0].count),
                pregnant_cattle: parseInt(pregnantCattle.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
