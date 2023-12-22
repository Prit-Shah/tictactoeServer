const activeRoom = require("../models/activeRooms.models");

class ActiveRoomService {
  async add(id) {
    console.log("ADD ROOM", id);

    const newActiveRoom = new activeRoom({
      id: id,
    });
    await newActiveRoom.save((err) => {
      if (err) {
        console.log("err", err.code);
      }
    });
    return { id };
  }

  async getAllIds() {
    const rooms = await activeRoom.find({}, { id: 1 });
    return rooms.map((room) => room.id);
  }

  async delete(id) {
    const deleteRoom = await activeRoom.findOneAndDelete({ id });
    if (!deleteRoom) {
      return {
        type: "Error",
        message: "DeleteFailed",
        statusCode: 400,
      };
    }
    return {
      type: "Success",
      message: "Room Deleted",
      statusCode: 200,
    };
  }

  async getRoom(id) {
    const room = await activeRoom.findOne({ id });
    return room;
  }
}

module.exports = new ActiveRoomService();
