var socket = io();
var messages = document.getElementById("messages");

function scrollToTop() {
  messages.scrollIntoView(true); // Top
}

function scrollToBottom() {
  messages.scrollIntoView(false); // Bottom
}

(function() {
  $("form").submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message sentiment", $("#message").val(), $('#sentiment').val());
    let div = document.createElement("div");
    let meta = document.createElement("div");
    div.className += "card-panel hoverable"
    meta.className += "subfont"
    messages.appendChild(div).append($("#message").val());
    div
      .appendChild(meta)
      .append(`${$('#sentiment').val()} posted: just now`);

    document.getElementById("form").reset();
    return false;
  });

  socket.on("received", data => {
      let div = document.createElement("div");
      let meta = document.createElement("div");
      div.className += "card-panel hoverable"
      meta.className += "subfont"
      messages.appendChild(div).append(data.message);
      div
        .appendChild(meta)
        .append(`${data.sentiment} posted: ${formatTimeAgo(data.createdAt)}`);
    });
  })();

// fetching initial chat messages from the database
(function() {
  fetch("/chats")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        let div = document.createElement("div");
        let meta = document.createElement("div");
        div.className += "card-panel hoverable"
        meta.className += "subfont"
        messages.appendChild(div).append(data.message);
        div
          .appendChild(meta)
          .append(`${data.sentiment} posted: ${formatTimeAgo(data.createdAt)}`);
      });
    });
})();

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});
});

let messageInput = document.getElementById("message");
let typing = document.getElementById("typing");
var timeout;

function timeoutFunction() {
  socket.emit("notifyStopTyping");
  socket.emit("typing", false);
  typing.innerText = "";
  timeout = setTimeout(timeoutFunction, 150)
}

//isTyping event
messageInput.addEventListener("keydown", () => {
  socket.emit("typing", { user: "Someone", message: "is typing..." });
  clearTimeout(timeout)
  timeout = setTimeout(timeoutFunction, 0)
});



socket.on("notifyTyping", data => {
  msg = data.user && data.message ? data.user + " " + data.message : '';
  typing.innerText = msg;
});

socket.on("notifyStopTyping", () => {
  typing.innerText = "";
});
