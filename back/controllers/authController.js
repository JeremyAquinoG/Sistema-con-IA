const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username: username,
      password: hashedPassword
    });
    res.status(201).send('Usuario registrado con éxito!');
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Contraseña incorrecta');
    }

    res.status(200).send('Login exitoso!');
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).send(error.message);
  }
};
