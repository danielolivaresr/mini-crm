const express  = require('express');
const cors     = require('cors');
require('dotenv').config();

const pool     = require('./db/connection');
const authRoutes = require('./routes/auth');
const clientRoutes  = require('./routes/clients');
const leadRoutes = require('./routes/leads');
const taskRoutes = require('./routes/tasks')
const dashboardRoutes = require('./routes/dashboard');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Rutas 
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// montar las rutas
app.use('/api/auth', authRoutes); 
app.use('/api/clients', clientRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);



// Arranca el servidor 
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  try {
    await pool.query('SELECT 1');
    console.log('Conexión a MySQL establecida');
  } catch (error) {
    console.error('Error conectando a MySQL ❌', error.message);
  }
});