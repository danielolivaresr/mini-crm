const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAll,
  getById,
  create,
  update,
  remove
} = require('../controllers/clientController');

// TODAS las rutas requieren estar autenticado
// router.use(middleware) aplica el middleware a todas las rutas siguientes
router.use(authMiddleware);

router.get('/',       getAll);
router.get('/:id',    getById);
router.post('/',      create);
router.put('/:id',    update);
router.delete('/:id', remove);

module.exports = router;