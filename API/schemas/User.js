const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  language: {
    type: String,
    default: "en"
  },
  firstname: String,
  lastname: String,
  img: String,
  token: String,
  activationKey: String,
  active: {
    type: Boolean,
    default: true
  },
  google: Object,
  twitter: Object,
  github: Object,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);