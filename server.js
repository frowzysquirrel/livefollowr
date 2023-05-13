const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname+'/dist/livefollowers'));

app.get('/',function(req, res){
  res.sendFile(path.join(__dirname+'/dist/livefollowers/index.html'));
});

app.get('*',function(req, res){
  res.sendFile(path.join(__dirname+'/dist/livefollowers/index.html'));
});

app.listen(process.env.PORT || 8080);
