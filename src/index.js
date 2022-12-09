const express = require("express");

var http = require("http");
var bodyParser = require("body-parser");
const request = require("request");

const viewEngine = require("./configs/viewEngine");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

const APP_SECRET = "b9454ba4c9fff5249a1192f6349c6a97";
const VALIDATION_TOKEN = "TokenTuyChon";
const PAGE_ACCESS_TOKEN =
  "EACC5TeW1tyMBABMWiLlZBCeLfElQWtswJBjSpMAZCkexz6GkYhIbEoi4kIBSbMeiB7dWmDUZBh0X4c98izqbScIN9rrZCbruxXWKLvZAtq6IheENMuvpZAeuqwpj11aGrbTBnYV5cJIaJzluDFqK2iqkrD8PkoqzQQ1WZA9ZC2urlOUcsMBBCoEP";

viewEngine(app);
app.get("/", (req, res) => {
  res.status(201).send("Hello World!");
});

app.get("/home", (req, res) => {
  res.render("homepage.ejs");
});

app.get("/webhook", function (req, res) {
  // Đây là path để validate tooken bên app facebook gửi qua
  if (req.query["hub.verify_token"] === VALIDATION_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.status(403).send("Error, wrong validation token");
  }
});

app.post("/webhook", function (req, res) {
  let body = req.body;
  console.log(body);
  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      // if (webhook_event.message) {
      //   handleMessage(sender_psid, webhook_event.message);
      // } else if (webhook_event.postback) {
      //   handlePostback(sender_psid, webhook_event.postback);
      // }

      handleMessage(sender_psid, webhook_event.message);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

async function handleMessage(sender_psid, received_message) {
  let response;

  /// Checks if the message contains text
  // response = await {
  //   attachment: {
  //     type: "template",
  //     payload: {
  //       template_type: "generic",
  //       elements: [
  //         {
  //           title: "Welcome to Bot",
  //           subtitle: "Tap a button to answer.",
  //           buttons: [
  //             {
  //               type: "postback",
  //               title: "Show Product",
  //               payload: "SHOW_CART",
  //             },
  //             {
  //               type: "postback",
  //               title: "View Cart",
  //               payload: "REVIEW_CART",
  //             },

  //             {
  //               type: "web_url",
  //               title: "Web Shop",
  //               url: "https://facebook-bot-buz.herokuapp.com/facebook_cart",
  //               webview_height_ratio: "full",
  //               messenger_extensions: true,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  // };

  response = await {
    text: `đây là message text : new server`,
  };

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
