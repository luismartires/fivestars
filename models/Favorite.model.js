const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const favoriteSchema = new Schema({
  objectId: String,
  title: String,
  poster: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Favorite", favoriteSchema);
