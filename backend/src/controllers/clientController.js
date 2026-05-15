const pool = require('../db/connection');

// GET /api/clients
// Devuelve todos los clientes del usuario autenticado
const getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM clients WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]   // solo los del usuario logueado
    );
    res.json(rows);
  } catch (error) {
    console.error('Error en getAll clients:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /api/clients/:id
// Devuelve un cliente concreto
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM clients WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getById client:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /api/clients
// Crea un cliente nuevo
const create = async (req, res) => {
  const { name, email, phone, company, notes } = req.body;

  // Validación: el nombre es obligatorio
  if (!name) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO clients (user_id, name, email, phone, company, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, email || null, phone || null, company || null, notes || null]
    );

    // result.insertId contiene el id autogenerado por MySQL
    const [rows] = await pool.query(
      'SELECT * FROM clients WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);  // 201 = Created
  } catch (error) {
    console.error('Error en create client:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /api/clients/:id
// Actualiza un cliente existente
const update = async (req, res) => {
  const { name, email, phone, company, notes } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  try {
    // Primero verifica que el cliente existe y pertenece al usuario
    const [existing] = await pool.query(
      'SELECT id FROM clients WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await pool.query(
      `UPDATE clients
       SET name = ?, email = ?, phone = ?, company = ?, notes = ?
       WHERE id = ?`,
      [name, email || null, phone || null, company || null, notes || null, req.params.id]
    );

    const [rows] = await pool.query(
      'SELECT * FROM clients WHERE id = ?',
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en update client:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /api/clients/:id
// Elimina un cliente
const remove = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM clients WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error('Error en remove client:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, remove };