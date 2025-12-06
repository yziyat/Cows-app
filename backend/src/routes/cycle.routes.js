// backend/src/routes/cycle.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const db = require('../config/database');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status, cattle_id } = req.query;

        let query = `
      SELECT sc.*, 
        c.ear_tag, c.name as cattle_name,
        p.name as protocol_name,
        u.username as created_by_name
      FROM synchronization_cycles sc
      JOIN cattle c ON sc.cattle_id = c.id
      JOIN synchronization_protocols p ON sc.protocol_id = p.id
      LEFT JOIN users u ON sc.created_by = u.id
      WHERE 1=1
    `;
        const params = [];
        let paramIndex = 1;

        if (status) {
            query += ` AND sc.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (cattle_id) {
            query += ` AND sc.cattle_id = $${paramIndex}`;
            params.push(cattle_id);
            paramIndex++;
        }

        query += ' ORDER BY sc.start_date DESC';

        const result = await db.query(query, params);
        res.json({ cycles: result.rows });
    } catch (error) {
        console.error('Get cycles error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticateToken, authorize('admin', 'editor'), async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const { cattle_id, protocol_id, start_date, notes } = req.body;

        const protocolResult = await client.query(
            'SELECT * FROM synchronization_protocols WHERE id = $1',
            [protocol_id]
        );

        if (protocolResult.rows.length === 0) {
            throw new Error('Protocol not found');
        }

        const protocol = protocolResult.rows[0];
        const expectedHeatDate = new Date(start_date);
        expectedHeatDate.setDate(expectedHeatDate.getDate() + protocol.duration_days);

        const cycleResult = await client.query(
            `INSERT INTO synchronization_cycles (cattle_id, protocol_id, start_date, expected_heat_date, status, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [cattle_id, protocol_id, start_date, expectedHeatDate, 'planned', notes, req.user.id]
        );

        const cycle = cycleResult.rows[0];

        const stepsResult = await client.query(
            'SELECT * FROM protocol_steps WHERE protocol_id = $1 ORDER BY step_number',
            [protocol_id]
        );

        for (const step of stepsResult.rows) {
            const scheduledDate = new Date(start_date);
            scheduledDate.setDate(scheduledDate.getDate() + step.day_number);

            await client.query(
                `INSERT INTO cycle_actions (cycle_id, step_id, scheduled_date)
         VALUES ($1, $2, $3)`,
                [cycle.id, step.id, scheduledDate]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Cycle created successfully', cycle });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create cycle error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

module.exports = router;
