class database {
  roomIDs = [];
  addRoom(roomId) {
    this.roomIDs.push(roomId);
    console.log("AFTER ADD ", this.roomIDs);
  }
  getRoomIDs() {
    return this.roomIDs;
  }
}

const db = new database();
module.exports = db;
