const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAll,
  getById,
  create,
  update,
  toggleCompleted,
  remove
} = require('../controllers/taskController');

router.use(authMiddleware);

router.get('/',             getAll);
router.get('/:id',          getById);
router.post('/',            create);
router.put('/:id',          update);
router.patch('/:id/toggle', toggleCompleted);
router.delete('/:id',       remove);

module.exports = router;