'use strict';

//imports deps and set up http server

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());

//sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

//create webhook endpoint
app.post('/webhook', (req,res) => {

  let body = req.body;

  //check for event type
  if(body.object === 'page'){

    //iterate over each entry -- there may be multiple batched
    body.entry.forEach(function(entry) {
      //get message, which is in entry.messaging[0]
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
    });

    //returns a '200 OK' to all requests
    res.status(200).send('EVENT_RECEIVED');

  } else {
      //return a '404 not found'
      res.sendStatus(404);
  }
});

app.get('/webhook', (req,res) => {

  //verification token
  let VERIFY_TOKEN = "sdfhgsfgjdfgj575672";

  //parse query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  //check if token and mode are in query string of requests
  if (mode && token) {
    //check if mode and token are correct
    if(mode === 'subscribe' && token === VERIFY_TOKEN) {

      //respond with challenge token from request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      //respond with '403 forbidden if verify tokens dont match
      res.sendStatus(403);
    }
  }
})
