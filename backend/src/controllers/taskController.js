const pool = require('../db/connection');

// ─────────────────────────────────────
// GET /api/tasks
const getAll = async (req, res) => {
  try {
    const { completed, client_id, lead_id } = req.query;

    let sql = `
      SELECT
        tasks.*,
        clients.name AS client_name,
        leads.title   AS lead_title
      FROM tasks
      LEFT JOIN clients ON tasks.client_id = clients.id
      LEFT JOIN leads   ON tasks.lead_id   = leads.id
      WHERE tasks.user_id = ?
    `;
    const params = [req.user.id];

    // Filtro: completadas o pendientes
    if (completed !== undefined) {
      sql += ' AND tasks.completed = ?';
      params.push(completed === 'true' ? 1 : 0);
    }

    // Filtro: tareas de un cliente
    if (client_id) {
      sql += ' AND tasks.client_id = ?';
      params.push(client_id);
    }

    // Filtro: tareas de un lead
    if (lead_id) {
      sql += ' AND tasks.lead_id = ?';
      params.push(lead_id);
    }

    sql += ' ORDER BY tasks.due_date ASC, tasks.created_at DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('Error en getAll tasks:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /api/tasks/:id
const getById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         tasks.*,
         clients.name AS client_name,
         leads.title   AS lead_title
       FROM tasks
       LEFT JOIN clients ON tasks.client_id = clients.id
       LEFT JOIN leads   ON tasks.lead_id   = leads.id
       WHERE tasks.id = ? AND tasks.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getById task:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /api/tasks
const create = async (req, res) => {
  const { client_id, lead_id, title, description, due_date, completed } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  try {
    // Si se especifica un cliente, debe pertenecer al usuario
    if (client_id) {
      const [check] = await pool.query(
        'SELECT id FROM clients WHERE id = ? AND user_id = ?',
        [client_id, req.user.id]
      );
      if (check.length === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
    }

    // Si se especifica un lead, debe pertenecer al usuario
    if (lead_id) {
      const [check] = await pool.query(
        'SELECT id FROM leads WHERE id = ? AND user_id = ?',
        [lead_id, req.user.id]
      );
      if (check.length === 0) {
        return res.status(404).json({ error: 'Lead no encontrado' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO tasks (user_id, client_id, lead_id, title, description, due_date, completed)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        client_id || null,
        lead_id   || null,
        title,
        description || null,
        due_date    || null,
        completed ? 1 : 0
      ]
    );

    const [rows] = await pool.query(
      `SELECT tasks.*, clients.name AS client_name, leads.title AS lead_title
       FROM tasks
       LEFT JOIN clients ON tasks.client_id = clients.id
       LEFT JOIN leads   ON tasks.lead_id   = leads.id
       WHERE tasks.id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error en create task:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PUT /api/tasks/:id
const update = async (req, res) => {
  const { client_id, lead_id, title, description, due_date, completed } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  try {
    // Verificar que la tarea existe y es del usuario
    const [existing] = await pool.query(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Validar cliente si se asigna
    if (client_id) {
      const [check] = await pool.query(
        'SELECT id FROM clients WHERE id = ? AND user_id = ?',
        [client_id, req.user.id]
      );
      if (check.length === 0) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
    }

    // Validar lead si se asigna
    if (lead_id) {
      const [check] = await pool.query(
        'SELECT id FROM leads WHERE id = ? AND user_id = ?',
        [lead_id, req.user.id]
      );
      if (check.length === 0) {
        return res.status(404).json({ error: 'Lead no encontrado' });
      }
    }

    await pool.query(
      `UPDATE tasks
       SET client_id = ?, lead_id = ?, title = ?, description = ?, due_date = ?, completed = ?
       WHERE id = ?`,
      [
        client_id || null,
        lead_id   || null,
        title,
        description || null,
        due_date    || null,
        completed ? 1 : 0,
        req.params.id
      ]
    );

    const [rows] = await pool.query(
      `SELECT tasks.*, clients.name AS client_name, leads.title AS lead_title
       FROM tasks
       LEFT JOIN clients ON tasks.client_id = clients.id
       LEFT JOIN leads   ON tasks.lead_id   = leads.id
       WHERE tasks.id = ?`,
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en update task:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// PATCH /api/tasks/:id/toggle
// Alterna el estado completada/pendiente
const toggleCompleted = async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT completed FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const newValue = existing[0].completed ? 0 : 1;

    await pool.query(
      'UPDATE tasks SET completed = ? WHERE id = ?',
      [newValue, req.params.id]
    );

    res.json({ id: parseInt(req.params.id), completed: !!newValue });
  } catch (error) {
    console.error('Error en toggleCompleted:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// DELETE /api/tasks/:id
const remove = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error en remove task:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getAll, getById, create, update, toggleCompleted, remove };