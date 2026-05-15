const express        = require('express');
const router         = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAll,
  getById,
  create,
  update,
  remove
} = require('../controllers/leadController');

router.use(authMiddleware);

router.get('/',       getAll);
router.get('/:id',    getById);
router.post('/',      create);
router.put('/:id',    update);
router.delete('/:id', remove);

module.exports = router;