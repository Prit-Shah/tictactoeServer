class TempRoomJoined {
  roomIds = new Set();
  addRoom(id) {
    if (!this.roomIds.has(id)) {
      this.roomIds.add(id);
      return true;
    } else {
      return false;
    }
  }
  getRoom(id) {
    this.roomIds.has(id);
  }
  removeRoom(id) {
    this.roomIds.delete(id);
  }
}
module.exports = new TempRoomJoined();
