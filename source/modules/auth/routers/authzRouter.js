const express = require('express');
const router = express.Router();
const authzController = require('../controllers/authzController');

// Rutas de autenticación y autorización
router.post('/login', authzController.authenticate);

// TODO: en el refresco de los tokens normales, evaluar si es necesario refrescar también el refresh token
router.post('/token/refresh', authzController.refreshAccessToken);

// Ejemplo de ruta protegida
router.get('/protected', authzController.validateToken, (req, res) => {
    res.success('This is a protected route');
});

module.exports = router;
