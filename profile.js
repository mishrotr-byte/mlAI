const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ChatHistory = require('../models/ChatHistory'); // Создай модель аналогично

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Нет токена' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  next();
};

router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

router.post('/history/:userId', auth, async (req, res) => {
  if (req.params.userId !== req.userId.toString()) return res.status(403).json({ error: 'Не твой' });
  await ChatHistory.findOneAndUpdate({ userId: req.userId }, { history: req.body }, { upsert: true });
  res.json({ success: true });
});

module.exports = router;
