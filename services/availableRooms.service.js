const availableRoom = require("../models/availableRooms.model");

class AvailableRoomService {
  async add(id) {
    // console.log("ADD ROOM", id);

    const newAvailableRoom = new availableRoom({
      id: id,
    });
    await newAvailableRoom.save((err) => {
      if (err) {
        console.log("err", err.code);
      }
    });
    return { id };
  }

  async getAllIds() {
    const rooms = await availableRoom.find({}, { id: 1 });
    return rooms.map((room) => room.id);
  }

  async delete(id) {
    const deleteRoom = await availableRoom.findOneAndDelete({ id });
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
    const found = await availableRoom.findOne({ id });
    return found;
  }
}

module.exports = new AvailableRoomService();
