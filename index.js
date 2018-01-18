'use strict';

//import deps and setup http server
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); //create express http server
  
//set server port and log message on success
app.listen(process.env.PORT || 1337), () => console.log('webhook is listening');

app.post('/webhook', (req, res) => {
  let body = req.body;
  
  //checks if this is an event from a page subscription
  if(body.object === 'page') {
    
    body.entry.forEach(function(entry) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
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