const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer'); // Для аватаров
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Юзер есть' });

    const user = new User({ name, email, password, avatar: req.file ? `/uploads/${req.file.filename}` : '' });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, name, avatar: user.avatar } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) return res.status(400).json({ error: 'Неправильно' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
});

module.exports = router;
