const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Busca el token en la cabecera Authorization
  const authHeader = req.headers['authorization'];

  // La cabecera tiene el formato: "Bearer eyJhbGci..."
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado' });
  }

  try {
    // 2. Verifica y decodifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Añade los datos del usuario al objeto req
    //    para que los controladores puedan usarlos
    req.user = decoded; // { id: 1, role: "admin" }

    next(); // continúa al siguiente middleware o controlador

  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;