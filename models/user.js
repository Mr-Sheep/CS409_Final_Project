const { type } = require("express/lib/response");
var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joined_event: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Event",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
