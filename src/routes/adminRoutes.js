const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.put('/users/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, role, phone, city } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'No puedes editarte a ti mismo desde el panel de administración' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.city = city || user.city;

    await user.save();
    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
});

router.delete('/users/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo desde el panel de administración' });
    }

    await User.deleteOne({ _id: userId });
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
});

module.exports = router;