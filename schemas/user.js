const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save',
  async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  }
);
UserSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);