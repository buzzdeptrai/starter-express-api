const express = require("express");

var http = require("http");
var bodyParser = require("body-parser");
const request = require("request");

const viewEngine = require("./configs/viewEngine");
const indexRouter = require("./routes/index");

const db = require("./database/models/index");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const APP_SECRET = "b9454ba4c9fff5249a1192f6349c6a97";
const VALIDATION_TOKEN = "TokenTuyChon";
const PAGE_ACCESS_TOKEN =
  "EACC5TeW1tyMBABMWiLlZBCeLfElQWtswJBjSpMAZCkexz6GkYhIbEoi4kIBSbMeiB7dWmDUZBh0X4c98izqbScIN9rrZCbruxXWKLvZAtq6IheENMuvpZAeuqwpj11aGrbTBnYV5cJIaJzluDFqK2iqkrD8PkoqzQQ1WZA9ZC2urlOUcsMBBCoEP";

viewEngine(app);
indexRouter(app);

app.get("/", (req, res) => {
  res.status(201).send("Hello World!");
});

app.get("/home", (req, res) => {
  res.render("homepage.ejs");
});

// app.get("/webhook", function (req, res) {
//   if (req.query["hub.verify_token"] === VALIDATION_TOKEN) {
//     res.send(req.query["hub.challenge"]);
//   } else {
//     res.status(403).send("Error, wrong validation token");
//   }
// });

// app.post("/webhook", function (req, res) {
//   let body = req.body;
//   console.log(body);
//   if (body.object === "page") {
//     body.entry.forEach(function (entry) {
//       let webhook_event = entry.messaging[0];
//       console.log(webhook_event);
//       let sender_psid = webhook_event.sender.id;
//       console.log("Sender PSID: " + sender_psid);
//       if (webhook_event.message) {
//         handleMessage(sender_psid, webhook_event.message);
//       }
//       console.log("End Call FnSEnd PSID: " + sender_psid);
//     });
//     res.status(200).send("EVENT_RECEIVED");
//   } else {
//     res.sendStatus(404);
//   }
// });

// async function handleMessage(sender_psid, received_message) {
//   let response;

//   response = await {
//     text: `đây là message text : new server`,
//   };

//   // Send the response message
//   callSendAPI(sender_psid, response);
// }

// function callSendAPI(sender_psid, response) {
//   let request_body = {
//     messaging_type: "RESPONSE",
//     recipient: {
//       id: sender_psid,
//     },
//     message: response,
//   };

//   request(
//     {
//       uri: "https://graph.facebook.com/v15.0/me/messages",
//       qs: { access_token: PAGE_ACCESS_TOKEN },
//       method: "POST",
//       json: request_body,
//     },
//     (err, res, body) => {
//       if (!err) {
//         console.log("message sent!");
//       } else {
//         console.error("Unable to send message:" + err);
//       }
//     }
//   );
// }
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
