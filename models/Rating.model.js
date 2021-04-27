const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ratingSchema = new Schema({
  objectId: String,
  rating: { type: Number, min: 1, max: 5 },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Rating", ratingSchema);
