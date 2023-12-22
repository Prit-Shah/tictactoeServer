const mongoose = require("mongoose");

// Plugins
const { toJSON } = require("./plugins/toJSON.plugin");

const activeRoomsSchema = mongoose.Schema(
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
activeRoomsSchema.plugin(toJSON);

const ActiveRooms = mongoose.model("activeRooms", activeRoomsSchema);

module.exports = ActiveRooms;
