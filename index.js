//const http = require('http');
//const express = require('express');
//const socketio = require('socket.io');
//const cors = require('cors');
//const app = express();
//const server = http.createServer(app);
//console.log(server);
//const io = socketio(server, {
//                              cors: {
//                                origin: "http://localhost:3000",
//                              },
//                            });

const io = require("socket.io")(8900, {
    cors: {
      origin: "https://jazzy-bonbon-7f0eba.netlify.app",
    },
  });

  let users = []
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user?.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user?.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user?.userId === userId);
  };
  
  io.on("connection", (socket) => {


    //when ceonnect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket?.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ fromId, toId, message }) => {
      const user = getUser(toId);
      io.to(user?.socketId).emit("getMessage", {
        fromId,
        message,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket?.id);
      io.emit("getUsers", users);
    });
    });