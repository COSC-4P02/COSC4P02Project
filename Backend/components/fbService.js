var config = require("../data/config");
var { stats_one, stats_array_append } = require("./statsService");
var request = require("request");

function sending(msg) {
  msg = JSON.parse(msg);
  if (msg.type === "button") {
    for (const e in msg.options) {
      if (msg.options[e].action === "url")
        msg.text =
          msg.text + "\n" + msg.options[e].text + ": " + msg.options[e].value;
      if (msg.options[e].action === "postback")
        msg.text = msg.text + "\nAsk Me: " + msg.options[e].text;
    }
  }
  if (msg.type === "news") {
    for (const e in msg.news) {
      msg.text = msg.text + "\n" + msg.news[e].title + ": " + msg.news[e].href;
    }
  }
  return msg.text;
}

async function nlp_msg(
  message,
  print,
  errorlog,
  chatlog,
  threshold,
  nlpManager,
  dbMain,
  dbCache,
  senderPsid,
  version
) {
  stats_one(print, errorlog, dbMain, "msg/receive/brock");
  const result = await nlpManager.process(message);
  var answer =
    result.score > threshold && result.answer ? result.answer : "!notFound-";
  var answer2 = (" " + answer).slice(1);

  if (!(result.score > threshold && result.answer)) {
    stats_one(print, errorlog, dbMain, "nlp/brock/noanswer");
    stats_array_append(print, errorlog, dbMain, "nlp/brock/noanswer", message);
  }
  var obj = {};
  obj.msg = message;
  var r = "./answerProcess/answerProcessBrock.js";
  if (version === "game") r = "./answerProcess/answerProcessGame.js";
  var answerProcessBrock = require(r);
  answer = answerProcessBrock(
    obj,
    answer,
    function (msg) {
      var response = {
        text: sending(msg),
      };
      callSendAPI(senderPsid, response, version);
    },
    dbMain,
    dbCache,
    print,
    errorlog
  );
  if (answer == "!ignore") {
    // Ignore this send
    return;
  } else if (answer == "!json") {
    // Send this json directly
    const param = answer2.substr(answer2.indexOf("-") + 1, answer2.length - 1);
    answer = sending(param);
  }
  chatlog("Brock| User: " + message + " | Bot: " + answer);
  return answer;
}

async function handleMessage(
  version,
  senderPsid,
  receivedMessage,
  print,
  errorlog,
  chatlog,
  nlp_info,
  dbMain,
  dbCache
) {
  let response;
  var threshold = nlp_info[0];
  var nlpManagerBrock = nlp_info[1];
  var nlpManagerGame = nlp_info[2];

  // Checks if the message contains text
  if (receivedMessage.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of your request to the Send API
    var msg = "";
    if (version === "brock")
      msg = await nlp_msg(
        receivedMessage.text,
        print,
        errorlog,
        chatlog,
        threshold,
        nlpManagerBrock,
        dbMain,
        dbCache,
        senderPsid,
        version
      );
    else if (version === "game")
      msg = await nlp_msg(
        receivedMessage.text,
        print,
        errorlog,
        chatlog,
        threshold,
        nlpManagerGame,
        dbMain,
        dbCache,
        senderPsid,
        version
      );
    response = {
      text: msg,
    };
  } else if (receivedMessage.attachments) {
    let attachmentUrl = receivedMessage.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title:
                "Sorry, but I cant read attachments, do you want me to send it to my developer?",
              subtitle: "Tap a button to answer.",
              image_url: attachmentUrl,
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
  callSendAPI(senderPsid, response, version);
}

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback, version) {
  let response;

  // Get the payload for the postback
  let payload = receivedPostback.payload;

  // Set the response based on the postback payload
  response = { text: "Hi!" };
  if (payload === "yes") {
    response = { text: "Thanks!" };
  } else if (payload === "no") {
    response = { text: "Oops, I will keep it as a secret (Deleted)." };
  }
  // Send the message to acknowledge the postback
  callSendAPI(senderPsid, response, version);
}

// Sends response messages via the Send API
function callSendAPI(senderPsid, response, version) {
  // The page access token we have generated in your app settings
  var PAGE_ACCESS_TOKEN = "";
  if (version === "brock") PAGE_ACCESS_TOKEN = config.FB_brock.pageToken;
  else if (version === "game") PAGE_ACCESS_TOKEN = config.FB_game.pageToken;
  // Construct the message body
  let requestBody = {
    recipient: {
      id: senderPsid,
    },
    message: response,
  };
  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: requestBody,
    },
    (err, _res, _body) => {
      if (!err) {
        console.log("Message sent! ");
        // console.log(_res)
        // console.log(_body)
      } else {
        console.error("Unable to send message:" + err + _res + _body);
      }
    }
  );
}

module.exports = function (
  version,
  print,
  errorlog,
  chatlog,
  nlp_info,
  dbMain,
  dbCache,
  req,
  res
) {
  let body = req.body;
  // Checks if this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Get the sender PSID
      let senderPsid = webhookEvent.sender.id;
      console.log("Sender PSID: " + senderPsid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhookEvent.message) {
        handleMessage(
          version,
          senderPsid,
          webhookEvent.message,
          print,
          errorlog,
          chatlog,
          nlp_info,
          dbMain,
          dbCache
        );
      } else if (webhookEvent.postback) {
        handlePostback(senderPsid, webhookEvent.postback, version);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};
