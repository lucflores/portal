const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro y login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

// Cambio de contraseña (requiere estar autenticado)
router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  authController.changePassword
);

// Solicitud de recuperación de contraseña
router.post('/request-reset', authController.requestPasswordReset);

// Restablecimiento de contraseña (desde token)
router.post('/reset-password', authController.resetPassword);

module.exports = router;

