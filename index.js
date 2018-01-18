'use strict';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const request = require('request');

//import deps and setup http server
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); //create express http server
  
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

//set server port and log message on success
app.listen(process.env.PORT || 1337), () => console.log('webhook is listening');

app.post('/webhook', (req, res) => {
  let body = req.body;
  
  //checks if this is an event from a page subscription
  if(body.object === 'page') {
    
    body.entry.forEach(function(entry) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        
        //Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        
        //check if the event is a message or postback and
        //pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
    });
    
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404)
  }
});

app.get('/webhook', (req, res) => {
  
  //verify token
  let VERIFY_TOKEN = "u7VBH46vy6adDw1CP";
  
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  
  if (mode && token) {
    
    //checks the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      //respond with challenge token from request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
      
    } else {
      //respond with status '403 Forbidden' if verify tokens dont match
      res.sendStatus(403)
    }
  }
})

// handles messages events
function handleMessage(sender_psid, received_message) {
  let response;
  
  //check if the message contains text
  if (received_message.text) {
    
    //create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
  }
  
  callSendAPI(sender_psid, response);
}

//handles messaging_postback events
function handlePostback(sender_psid, received_postback) {
  
}

//sends respons messages via the send API
function callSendAPI(sender_psid, response){
  //construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  
  //send HTTP request to the Messenger platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "JSON": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent', body)
    } else {
      console.error("unable to send message: "+err);
    }
  });
}