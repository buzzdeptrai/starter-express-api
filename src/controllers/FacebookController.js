require("dotenv").config();
const request = require("request");
let showListCart = require("../services/showcart");
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let postWebhook = (req, res) => {
  let body = req.body;

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
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};
let getWebhook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  //console.log('config');

  //console.log(dotenv);

  //console.log('TOKEN: '+VERIFY_TOKEN);
  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

// Handles messages events
async function handleMessage(sender_psid, received_message) {
  let response;
  let step_session = "";
  console.log("get Step", step_session);

  /// Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API

    let messMember = received_message.text;
    let messMemberCheck = messMember.toUpperCase();

    if (messMemberCheck == "HI") {
      response = await {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Welcome to Bot",
                subtitle: "Tap a button to answer.",
                buttons: [
                  {
                    type: "postback",
                    title: "Show Product",
                    payload: "SHOW_CART",
                  },
                  {
                    type: "postback",
                    title: "View Cart",
                    payload: "REVIEW_CART",
                  },

                  {
                    type: "web_url",
                    title: "Web Shop",
                    url: "https://facebook-bot-buz.herokuapp.com/facebook_cart",
                    webview_height_ratio: "full",
                    messenger_extensions: true,
                  },
                ],
              },
            ],
          },
        },
      };
    } else {
      var actionIncludeHandle = ["email", "phone", "name", "address1"];

      if (actionIncludeHandle.includes(step_session)) {
        var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (step_session == "email" && messMember.match(mailFormat) == false) {
          response = await {
            text: `is not a valid email address`,
          };
        } else if (step_session == "address1") {
          response = await showListCart.endCheckOut(sender_psid, messMember);
        } else {
          response = await showListCart.handleStep(
            sender_psid,
            step_session,
            messMember
          );
        }
      } else if (received_message.quick_reply) {
        console.log(
          `---------quick_reply ${received_message.quick_reply.payload}`
        );
        response = await showListCart.endCheckOut(
          sender_psid,
          received_message.quick_reply.payload
        );
      } else {
        console.log(`--------- default mess`);
        response = await {
          text: `đây là message text : "${received_message.text}". nodejs cyclic`,
        };
      }
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "type là attachment, test response postback",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;
  console.log("get payload for postback", payload);
  let params = [];
  if (payload.indexOf("_BUZZ_") !== -1) {
    var checkPayLoadArr = payload.split("_BUZZ_");
    payload = checkPayLoadArr[0];
    params = checkPayLoadArr;
  }
  console.log("New params", payload);
  console.log("get params", params);
  switch (payload) {
    case "yes":
      response = { text: "bạn đã chọn Yes!" };
      break;
    case "no":
      response = { text: "Oops, bạn đã chọn No." };
      break;
    case "GET_STARTED":
      //await chatbotService.handleGetStarted();
      response = { text: "OK, chào mừng bạn đến với page của buzz" };
      break;
    case "WELCOME_MESSAGE":
      await chatbotService.handleGetStarted(sender_psid);
      break;
    case "SHOW_CART":
      response = await showListCart.getListCart();
      break;
    case "CHECKOUT":
      response = await showListCart.getCheckout(sender_psid);
      break;
    case "REVIEW_CART":
      response = await showListCart.reviewCart(sender_psid);
      break;
    case "TO_CART":
      response = await showListCart.actionAddCart(sender_psid, params);
      break;
    case "CLEAR_CART":
      response = await showListCart.actionClearCart(sender_psid);
      break;

    default:
      response = { text: "hùm!!! oop, not deteach" };
  }
  // Send the message to acknowledge the postback
  console.log("end postback", response);
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    messaging_type: "RESPONSE",
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v15.0/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
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

//setupMenu
function setupMenu(req, res) {
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          // {
          //   type: "postback",
          //   title: "Mua Hàng",
          //   payload: "CARE_HELP",
          // },
          {
            type: "web_url",
            title: "Shop",
            url: "https://facebook-bot-buz.herokuapp.com/facebook_cart",
            webview_height_ratio: "full",
          },

          {
            type: "postback",
            title: "Xem Thông Tin",
            payload: "CURATION",
          },
          {
            type: "web_url",
            title: "Website của chúng tôi",
            url: "https://buzz.chayquangcaoads.com/",
            webview_height_ratio: "full",
          },
        ],
      },
    ],
  };
  request(
    {
      uri: `https://graph.facebook.com/v13.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      method: "POST",

      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
      } else {
        console.error("call api get profile error:" + err);
      }
    }
  );
  console.log("setup menu");
  res.send("done setup menu");
}

let setupProfile = function (req, res) {
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: "https://worcupgarena.cyclic.app",
  };
  request(
    {
      uri: `https://graph.facebook.com/v13.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      method: "POST",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
      } else {
        console.error("call api setup profile error:" + err);
      }
    }
  );
  console.log("setup profile");
  res.send("done setup profile");
};

let devFunctions = function (req, res) {
  res.send("done devFunctions :" + PAGE_ACCESS_TOKEN);
};
module.exports = {
  postWebhook: postWebhook,
  getWebhook: getWebhook,
  setupProfile: setupProfile,
  setupMenu: setupMenu,
  devFunctions: devFunctions,
};
