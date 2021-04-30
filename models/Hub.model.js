const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const hubSchema = new Schema(
  {
    objectId: String,
    title: String,
    poster: String,
    rating: { type: Schema.Types.ObjectId, ref: "Rating" },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = model("Hub", hubSchema);