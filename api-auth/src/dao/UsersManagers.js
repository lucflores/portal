const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UsersManagers {
  async getAll() {
    return await User.find({}, '-password');
  }

  async create({ name, email, password, role = 'admin' }) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error('El email ya está registrado');

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });

    return await user.save();
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  async getByEmail(email) {
    return await User.findOne({ email });
  }
}

module.exports = new UsersManagers();

