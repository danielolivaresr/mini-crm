// backend/src/controllers/dashboardController.js

const pool = require('../db/connection');

// ─────────────────────────────────────
// GET /api/dashboard/stats
// Devuelve todas las métricas en una sola petición
// ─────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lanzamos todas las queries en paralelo con Promise.all
    const [
      [totalClientsRows],
      [leadsByStatusRows],
      [pipelineValueRows],
      [pendingTasksRows],
      [overdueTasksRows],
      [recentLeadsRows],
      [upcomingTasksRows],
    ] = await Promise.all([
      // Total de clientes
      pool.query(
        'SELECT COUNT(*) AS total FROM clients WHERE user_id = ?',
        [userId]
      ),

      // Oportunidades agrupadas por estado
      pool.query(
        `SELECT status, COUNT(*) AS total
         FROM leads
         WHERE user_id = ?
         GROUP BY status`,
        [userId]
      ),

      // Valor total del pipeline (oportunidades abiertas)
      pool.query(
        `SELECT COALESCE(SUM(value), 0) AS total
         FROM leads
         WHERE user_id = ?
         AND status IN ('nuevo', 'en_progreso')`,
        [userId]
      ),

      // Tareas pendientes
      pool.query(
        'SELECT COUNT(*) AS total FROM tasks WHERE user_id = ? AND completed = 0',
        [userId]
      ),

      // Tareas vencidas (pendientes con fecha pasada)
      pool.query(
        `SELECT COUNT(*) AS total
         FROM tasks
         WHERE user_id = ? AND completed = 0
         AND due_date IS NOT NULL AND due_date < CURDATE()`,
        [userId]
      ),

      // Últimas 5 oportunidades creadas
      pool.query(
        `SELECT leads.id, leads.title, leads.value, leads.status, leads.created_at,
                clients.name AS client_name
         FROM leads
         INNER JOIN clients ON leads.client_id = clients.id
         WHERE leads.user_id = ?
         ORDER BY leads.created_at DESC
         LIMIT 5`,
        [userId]
      ),

      // Próximas 5 tareas con fecha
      pool.query(
        `SELECT id, title, due_date
         FROM tasks
         WHERE user_id = ? AND completed = 0 AND due_date IS NOT NULL
         ORDER BY due_date ASC
         LIMIT 5`,
        [userId]
      ),
    ]);

    // Transformamos leadsByStatus a un objeto para fácil acceso desde React
    const leadsByStatus = { nuevo: 0, en_progreso: 0, ganado: 0, perdido: 0 };
    leadsByStatusRows.forEach(row => {
      leadsByStatus[row.status] = row.total;
    });

    res.json({
      totalClients:   totalClientsRows[0].total,
      leadsByStatus,
      pipelineValue:  parseFloat(pipelineValueRows[0].total),
      pendingTasks:   pendingTasksRows[0].total,
      overdueTasks:   overdueTasksRows[0].total,
      recentLeads:    recentLeadsRows,
      upcomingTasks:  upcomingTasksRows,
    });
  } catch (error) {
    console.error('Error en dashboard stats:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { getStats };