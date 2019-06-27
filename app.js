//require the express module
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");

//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = process.env.PORT || 3000;

//bodyparser middleware
app.use(bodyParser.json());

//routes
app.use("/chats", chatRouter);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);

//database connection
const Chat = require("./models/Chat");
const connect = require("./dbconnect");

//setup event listener
socket.on("connection", socket => {
  console.log("user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  var timeout;

  //Someone is typing
  socket.on("typing", data => {
    if (data.user && data.message) socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });

  socket.on("chat message sentiment", function(msg, sentiment) {
    console.log("message: " + msg);
    console.log("sentiment: " + sentiment);
    socket.broadcast.emit("received", { message: msg, sentiment: sentiment });
    connect.then(db => {
      console.log("connected correctly to the server");
      let chatMessage = new Chat({ message: msg, sentiment: sentiment, sender: "Anonymous" });
      chatMessage.save();
    });
  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
