//var fs = require('fs'),
//express = require('express'),
// socketio = require('socket.io'),
// config = require('./config');
//
//var serverPort = config.port || 8900, // Listen port
// secure = config.secure || false; // use HTTPS/SSL
//
//var app = express();
//if (secure)
//{
// var options = {
// key: fs.readFileSync(config.secure_key),
// cert: fs.readFileSync(config.secure_cert)
//};
// var server = require('https').createServer(options, app);
//} else
//{
// var server = require('http').createServer(app);
//}
//
//server.listen(serverPort, function() {
// var addr = server.address();
// console.log(' app listening on ' + (secure ? 'https://' : 'http://') + addr.address + ':' + addr.port);
//});
//
//var io = socketio(server, {
//    cors: {
//      origin: "https://jazzy-bonbon-7f0eba.netlify.app",
//    },
//  });


//const CORS_fn = (req, res) => {
//    res.setHeader( "Access-Control-Allow-Origin"     , "*"    );
//    res.setHeader( "Access-Control-Allow-Credentials", "true" );
//    res.setHeader( "Access-Control-Allow-Methods"    , "*"    );
//    res.setHeader( "Access-Control-Allow-Headers"    , "*"    );
//    if ( req.method === "OPTIONS" ) {
//        res.writeHead(200);
//        res.end();
//        return;
//    }
//};



const express = require('express');
const serverPort = 8900;
const app=express();
const server = require('https').createServer(app);
server.listen(serverPort);
const io = require("socket.io")(server, {
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