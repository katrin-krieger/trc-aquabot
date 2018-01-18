'use strict';

//import deps and setup http server
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); //create express http server
  
//set server port and log message on success
app.listen(process.env.PORT || 1337), () => console.log('webhook is listening');