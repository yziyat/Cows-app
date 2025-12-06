// backend/src/routes/protocol.routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const db = require('../config/database');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(`
      SELECT p.*, 
        COUNT(ps.id) as steps_count,
        u.username as created_by_name
      FROM synchronization_protocols p
      LEFT JOIN protocol_steps ps ON p.id = ps.protocol_id
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.is_active = true
      GROUP BY p.id, u.username
      ORDER BY p.created_at DESC
    `);
        res.json({ protocols: result.rows });
    } catch (error) {
        console.error('Get protocols error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const protocolResult = await db.query(
            'SELECT * FROM synchronization_protocols WHERE id = $1',
            [req.params.id]
        );

        if (protocolResult.rows.length === 0) {
            return res.status(404).json({ error: 'Protocol not found' });
        }

        const stepsResult = await db.query(
            'SELECT * FROM protocol_steps WHERE protocol_id = $1 ORDER BY step_number',
            [req.params.id]
        );

        res.json({
            protocol: protocolResult.rows[0],
            steps: stepsResult.rows
        });
    } catch (error) {
        console.error('Get protocol error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticateToken, authorize('admin', 'editor'), async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        const { name, description, duration_days, steps } = req.body;

        const protocolResult = await client.query(
            `INSERT INTO synchronization_protocols (name, description, duration_days, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, description, duration_days, req.user.id]
        );

        const protocol = protocolResult.rows[0];

        if (steps && steps.length > 0) {
            for (const step of steps) {
                await client.query(
                    `INSERT INTO protocol_steps (protocol_id, step_number, day_number, action, product, dosage, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [protocol.id, step.step_number, step.day_number, step.action, step.product, step.dosage, step.notes]
                );
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Protocol created successfully', protocol });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create protocol error:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

module.exports = router;
