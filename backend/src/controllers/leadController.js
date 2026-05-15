const pool = require('../db/connection');

// Estados válidos definidos en el ENUM de la BD
const VALID_STATUSES = ['nuevo', 'en_progreso', 'ganado', 'perdido'];

// GET /api/leads
// GET /api/leads?status=nuevo
const getAll = async (req, res) => {
  try {
    const { status } = req.query;  // query params después del ?

    // Construcción dinámica de la query según haya filtro o no
    let sql = `
      SELECT
        leads.*,
        clients.name AS client_name
      FROM leads
      INNER JOIN clients ON leads.client_id = clients.id
      WHERE leads.user_id = ?
    `;
    const params = [req.user.id];

    if (status) {
      // Validamos que el estado sea uno de los permitidos
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`
        });
      }
      sql += ' AND leads.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY leads.created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAll leads:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /api/leads/:id
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         leads.*,
         clients.name AS client_name
       FROM leads
       INNER JOIN clients ON leads.client_id = clients.id
       WHERE leads.id = ? AND leads.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getById lead:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /api/leads
const create = async (req, res) => {
  const { client_id, title, value, status, notes } = req.body;

  // Validaciones de campos obligatorios
  if (!client_id || !title) {
    return res.status(400).json({ error: 'client_id y title son obligatorios' });
  }

  // Si se envía status, validar que sea uno permitido
  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`
    });
  }

  try {
    // Validar que el cliente existe Y pertenece al usuario
    const [clientCheck] = await pool.query(
      'SELECT id FROM clients WHERE id = ? AND user_id = ?',
      [client_id, req.user.id]
    );

    if (clientCheck.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const [result] = await pool.query(
      `INSERT INTO leads (client_id, user_id, title, value, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        client_id,
        req.user.id,
        title,
        value || 0,
        status || 'nuevo',
        notes || null
      ]
    );

    // Devolvemos el lead recién creado con el nombre del cliente
    const [rows] = await pool.query(
      `SELECT leads.*, clients.name AS client_name
       FROM leads
       INNER JOIN clients ON leads.client_id = clients.id
       WHERE leads.id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error en create lead:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /api/leads/:id
const update = async (req, res) => {
  const { client_id, title, value, status, notes } = req.body;

  if (!client_id || !title) {
    return res.status(400).json({ error: 'client_id y title son obligatorios' });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(', ')}`
    });
  }

  try {
    // Verificar que el lead existe y pertenece al usuario
    const [existing] = await pool.query(
      'SELECT id FROM leads WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }

    // Verificar que el cliente al que se asigna también es del usuario
    const [clientCheck] = await pool.query(
      'SELECT id FROM clients WHERE id = ? AND user_id = ?',
      [client_id, req.user.id]
    );

    if (clientCheck.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await pool.query(
      `UPDATE leads
       SET client_id = ?, title = ?, value = ?, status = ?, notes = ?
       WHERE id = ?`,
      [
        client_id,
        title,
        value || 0,
        status || 'nuevo',
        notes || null,
        req.params.id
      ]
    );

    const [rows] = await pool.query(
      `SELECT leads.*, clients.name AS client_name
       FROM leads
       INNER JOIN clients ON leads.client_id = clients.id
       WHERE leads.id = ?`,
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en update lead:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /api/leads/:id
const remove = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM leads WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Lead no encontrado' });
    }

    res.json({ message: 'Lead eliminado correctamente' });
  } catch (error) {
    console.error('Error en remove lead:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, remove };