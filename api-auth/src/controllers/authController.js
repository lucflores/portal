const UsersManagers = require('../dao/UsersManagers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 📝 Registro
exports.register = async (req, res) => {
  try {
    const user = await UsersManagers.create(req.body);
    res.status(201).json({ message: 'Usuario registrado con éxito.', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔐 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UsersManagers.getByEmail(email);
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta.' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 2
    });

    res.json({ message: 'Login exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión.', error });
  }
};

// 🔓 Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Sesión cerrada con éxito.' });
};

// 🔁 Cambio de contraseña
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  try {
    const dbUser = await UsersManagers.getByEmail(user.email);
    const match = await bcrypt.compare(currentPassword, dbUser.password);
    if (!match) return res.status(400).json({ message: 'Contraseña actual incorrecta' });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    dbUser.password = hashedNew;
    await dbUser.save();

    res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contraseña', error });
  }
};

// 📩 Solicitud de restablecimiento de contraseña
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await UsersManagers.getByEmail(email);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // En un entorno real: enviar por email
  console.log(`🔗 Enlace de recuperación: http://localhost:3000/reset-password?token=${token}`);

  res.status(200).json({ message: 'Instrucciones enviadas por email (simulado).' });
};

// 🔄 Restablecimiento de contraseña con token
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UsersManagers.getByEmail(decoded.email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado.' });
  }
};
