const mongoose = require("mongoose");

class Mongo {
  connect() {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(
        "mongodb+srv://dcsprit:ItYwlknxVupjiHbf@cluster0.rdssz3x.mongodb.net/TicTacToe"
      )
      .then(() => console.log("Connected!"));
  }
}

module.exports = new Mongo();
