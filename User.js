const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
  isAdmin: { type: Boolean, default: false },
  searchHistory: [{ content: String, timestamp: Date }]
});

userSchema.pre('save', async function() { this.password = await bcrypt.hash(this.password, 10); });

module.exports = mongoose.model('User', userSchema);
