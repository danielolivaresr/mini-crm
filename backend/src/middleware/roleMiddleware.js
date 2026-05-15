// Devuelve un middleware que comprueba si el usuario tiene el rol requerido.
// Se usa as: router.delete('/users/:id', authMiddleware, requireRole('admin'), controller)
const requireRole = (role) => {
  return (req, res, next) => {
    // authMiddleware ya añadió req.user antes de llegar aquí
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

module.exports = requireRole;