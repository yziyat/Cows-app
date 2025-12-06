// backend/src/routes/insemination.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const db = require('../config/database');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { cattle_id, result } = req.query;

        let query = `
      SELECT i.*, 
        c.ear_tag, c.name as cattle_name,
        u.username as performed_by_name
      FROM inseminations i
      JOIN cattle c ON i.cattle_id = c.id
      LEFT JOIN users u ON i.performed_by = u.id
      WHERE 1=1
    `;
        const params = [];
        let paramIndex = 1;

        if (cattle_id) {
            query += ` AND i.cattle_id = $${paramIndex}`;
            params.push(cattle_id);
            paramIndex++;
        }

        if (result) {
            query += ` AND i.result = $${paramIndex}`;
            params.push(result);
            paramIndex++;
        }

        query += ' ORDER BY i.insemination_date DESC';

        const queryResult = await db.query(query, params);
        res.json({ inseminations: queryResult.rows });
    } catch (error) {
        console.error('Get inseminations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticateToken, authorize('admin', 'editor'), async (req, res) => {
    try {
        const {
            cattle_id, insemination_date, heat_observation_id, cycle_id,
            bull_name, bull_registration, technician_name, straw_number, notes
        } = req.body;

        const expectedCalvingDate = new Date(insemination_date);
        expectedCalvingDate.setDate(expectedCalvingDate.getDate() + 283);

        const result = await db.query(
            `INSERT INTO inseminations 
       (cattle_id, insemination_date, heat_observation_id, cycle_id, bull_name, 
        bull_registration, technician_name, straw_number, result, expected_calving_date, notes, performed_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [cattle_id, insemination_date, heat_observation_id, cycle_id, bull_name,
                bull_registration, technician_name, straw_number, 'pending', expectedCalvingDate, notes, req.user.id]
        );

        res.status(201).json({
            message: 'Insemination recorded successfully',
            insemination: result.rows[0]
        });
    } catch (error) {
        console.error('Create insemination error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
