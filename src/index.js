const express = require("express");

var http = require("http");
var bodyParser = require("body-parser");
const request = require("request");

const viewEngine = require("./configs/viewEngine");

const app = express();
const port = 3000;

const APP_SECRET = "b9454ba4c9fff5249a1192f6349c6a97";
const VALIDATION_TOKEN = "TokenTuyChon";
const PAGE_ACCESS_TOKEN =
  "EACC5TeW1tyMBABMWiLlZBCeLfElQWtswJBjSpMAZCkexz6GkYhIbEoi4kIBSbMeiB7dWmDUZBh0X4c98izqbScIN9rrZCbruxXWKLvZAtq6IheENMuvpZAeuqwpj11aGrbTBnYV5cJIaJzluDFqK2iqkrD8PkoqzQQ1WZA9ZC2urlOUcsMBBCoEP";

viewEngine(app);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/home", (req, res) => {
  res.render("homepage.ejs");
});

app.get("/webhook", function (req, res) {
  // Đây là path để validate tooken bên app facebook gửi qua
  if (req.query["hub.verify_token"] === VALIDATION_TOKEN) {
    res.send(req.query["hub.challenge"]);
  }
  res.send("Error, wrong validation token");
});

app.post("/webhook", function (req, res) {
  // Phần sử lý tin nhắn của người dùng gửi đến
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        if (message.message.text) {
          var text = message.message.text;
          sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
        }
      }
    }
  }
  res.status(200).send("OK");
});

// Đây là function dùng api của facebook để gửi tin nhắn
function sendMessage(senderId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: "POST",
    json: {
      recipient: {
        id: senderId,
      },
      message: {
        text: message,
      },
    },
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
