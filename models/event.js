const { type } = require("express/lib/response");
var mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location_note: { type: String, required: false, default: "" },
  location: {
    address: { type: String, required: true },
    full_address: { type: String, required: true, default: "" },
    latitude: { type: Number, required: true, default: 0 },
    longitude: { type: Number, required: true, default: 0 },
    mapbox_id: { type: String, required: true, default: "" },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  creatorUsername: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      select: false, // https://stackoverflow.com/questions/12096262/how-to-protect-the-password-field-in-mongoose-mongodb-so-it-wont-return-in-a-qu
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
