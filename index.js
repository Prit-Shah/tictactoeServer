const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const roomStatus = require("./statusMessages.js");
const mongo = require("./mongoose.js");
const io = new Server(server, {
  cors: { origin: "*" },
});
const cors = require("cors");
const databse = require("./database.js");
const tempRoomIds = require("./services/tempJoinedIds.set");
//Rooms services
const activeRoom = require("./services/activeRooms.service.js");
const availableRoom = require("./services/availableRooms.service.js");

app.use(cors());
mongo.connect();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId, name) => {
    console.log("JOINED ROOM ", roomId);
    activeRoom.getRoom(Number(roomId)).then((room) => {
      if (room) {
        socket.join(Number(roomId));
        io.to(Number(roomId)).emit(
          "roomStatus",
          roomStatus.playerJoined,
          roomId,
          name
        );
      } else {
        socket.emit("roomStatus", roomStatus.notFound);
      }
    });
  });

  socket.on("createRoom", (roomId) => {
    console.log("CREATE ROOM ", roomId);
    Promise.all([activeRoom.getRoom(Number(roomId))]).then((activeRooms) => {
      console.log(" availableRoom", activeRooms);
      if (!activeRooms[0]) {
        socket.join(Number(roomId));
        io.to(Number(roomId)).emit("roomStatus", roomStatus.success, roomId);
        activeRoom.add(Number(roomId));
      } else {
        socket.emit("roomStatus", "ROOM NOT CREATED");
      }
    });
  });

  socket.on("playX", (roomId, i, j) => {
    console.log("PLAY X ", roomId, i, j);
    io.to(Number(roomId)).emit("playedX", i, j);
  });

  socket.on("playO", (roomId, i, j) => {
    console.log("PLAY O ", roomId, i, j);
    io.to(Number(roomId)).emit("playedO", i, j);
  });

  socket.on("creatorName", (roomId, name) => {
    io.to(Number(roomId)).emit("creatorName", name);
  });

  socket.on("playerLeft", (roomId) => {
    console.log("PLAYER LEFT ", roomId);
    io.to(Number(roomId)).emit("roomStatus", roomStatus.playerLeft);
    activeRoom.delete(Number(roomId));
    availableRoom.delete(Number(roomId));
    tempRoomIds.removeRoom(Number(roomId));
  });

  socket.on("joinRandom", (name) => {
    availableRoom.getAllIds().then((ids) => {
      console.log("IDS we have", ids);
      if (ids.length) {
        if (!tempRoomIds.getRoom(ids.length)) {
          if (tempRoomIds.addRoom(ids[0])) {
            availableRoom.delete(ids[0]).then(() => {
              socket.join(Number(ids[0]));
              io.to(Number(Number(ids[0]))).emit(
                "roomStatus",
                roomStatus.playerJoinedRandom,
                ids[0],
                name
              );
            });
          } else {
            const roomId = Math.floor(100000000 + Math.random() * 90000000);
            console.log("DONT HAVE ID SO CREATED", roomId);
            availableRoom.add(roomId).then(() => {
              socket.join(Number(roomId));
              io.to(Number(roomId)).emit(
                "roomStatus",
                roomStatus.success,
                roomId
              );
            });
          }
        } else {
          const roomId = Math.floor(100000000 + Math.random() * 90000000);
          console.log("DONT HAVE ID SO CREATED", roomId);
          availableRoom.add(roomId).then(() => {
            socket.join(Number(roomId));
            io.to(Number(roomId)).emit(
              "roomStatus",
              roomStatus.success,
              roomId
            );
          });
        }
      } else {
        const roomId = Math.floor(100000000 + Math.random() * 90000000);
        console.log("DONT HAVE ID SO CREATED", roomId);
        availableRoom.add(roomId).then(() => {
          socket.join(Number(roomId));
          io.to(Number(roomId)).emit("roomStatus", roomStatus.success, roomId);
        });
      }
    });
  });

  socket.on("emoteO", (roomId, code) => {
    io.to(roomId).emit("playEmoteO", code);
  });

  socket.on("emoteX", (roomId, code) => {
    io.to(roomId).emit("playEmoteX", code);
  });
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
