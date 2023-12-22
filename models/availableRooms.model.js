const mongoose = require("mongoose");

// Plugins
const { toJSON } = require("./plugins/toJSON.plugin");

const availableRoomsSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      trim: true,
      unique: true,
      required: [true, "room must have a id"],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
availableRoomsSchema.plugin(toJSON);

const AvailableRooms = mongoose.model("availableRooms", availableRoomsSchema);

module.exports = AvailableRooms;
