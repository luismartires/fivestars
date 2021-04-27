const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: ''
  }
 /*  role: String, //Admin, Reader, Writer, Super */
}, {
  timestamps: true
});


module.exports = model("User", userSchema);
