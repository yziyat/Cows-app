// backend/src/controllers/cattle.controller.js
const db = require('../config/database');

const getAllCattle = async (req, res) => {
  try {
    const { status, sex, search, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT c.*, 
        m.ear_tag as mother_tag, 
        f.ear_tag as father_tag
      FROM cattle c
      LEFT JOIN cattle m ON c.mother_id = m.id
      LEFT JOIN cattle f ON c.father_id = f.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND c.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (sex) {
      query += ` AND c.sex = $${paramIndex}`;
      params.push(sex);
      paramIndex++;
    }

    if (search) {
      query += ` AND (c.ear_tag ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    const countResult = await db.query('SELECT COUNT(*) FROM cattle WHERE status = $1', [status || 'active']);

    res.json({
      cattle: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get cattle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCattleById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT c.*, 
        m.ear_tag as mother_tag, m.name as mother_name,
        f.ear_tag as father_tag, f.name as father_name
      FROM cattle c
      LEFT JOIN cattle m ON c.mother_id = m.id
      LEFT JOIN cattle f ON c.father_id = f.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    res.json({ cattle: result.rows[0] });

  } catch (error) {
    console.error('Get cattle by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createCattle = async (req, res) => {
  try {
    const {
      ear_tag, name, breed, birth_date, sex,
      mother_id, father_id, weight, notes
    } = req.body;

    if (!ear_tag || !sex) {
      return res.status(400).json({ error: 'Ear tag and sex are required' });
    }

    const existingTag = await db.query('SELECT id FROM cattle WHERE ear_tag = $1', [ear_tag]);
    if (existingTag.rows.length > 0) {
      return res.status(409).json({ error: 'Ear tag already exists' });
    }

    const result = await db.query(`
      INSERT INTO cattle (ear_tag, name, breed, birth_date, sex, mother_id, father_id, weight, notes, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [ear_tag, name, breed, birth_date, sex, mother_id, father_id, weight, notes, req.user.id]);

    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'CREATE', 'cattle', result.rows[0].id]
    );

    res.status(201).json({
      message: 'Cattle created successfully',
      cattle: result.rows[0]
    });

  } catch (error) {
    console.error('Create cattle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCattle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ear_tag, name, breed, birth_date, sex, status,
      mother_id, father_id, weight, notes
    } = req.body;

    const existing = await db.query('SELECT id FROM cattle WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    const result = await db.query(`
      UPDATE cattle 
      SET ear_tag = COALESCE($1, ear_tag),
          name = COALESCE($2, name),
          breed = COALESCE($3, breed),
          birth_date = COALESCE($4, birth_date),
          sex = COALESCE($5, sex),
          status = COALESCE($6, status),
          mother_id = $7,
          father_id = $8,
          weight = COALESCE($9, weight),
          notes = COALESCE($10, notes)
      WHERE id = $11
      RETURNING *
    `, [ear_tag, name, breed, birth_date, sex, status, mother_id, father_id, weight, notes, id]);

    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'UPDATE', 'cattle', id]
    );

    res.json({
      message: 'Cattle updated successfully',
      cattle: result.rows[0]
    });

  } catch (error) {
    console.error('Update cattle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCattle = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM cattle WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cattle not found' });
    }

    await db.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, 'DELETE', 'cattle', id]
    );

    res.json({ message: 'Cattle deleted successfully' });

  } catch (error) {
    console.error('Delete cattle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllCattle,
  getCattleById,
  createCattle,
  updateCattle,
  deleteCattle
};
