const express       = require('express');
const router        = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { login, me } = require('../controllers/authController');


// Ruta pública: no necesita token
router.post('/login', login);

// Ruta protegida: authMiddleware verifica el token antes de llamar a "me"
router.get('/me', authMiddleware, me);

// Ruta admin
router.get('/admin-only', authMiddleware, requireRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenido al panel de administración.'})
});



module.exports = router;