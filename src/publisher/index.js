const express = require('express');
const bodyParser = require('body-parser');

const crypto = require('crypto');
const { Module } = require('module');

const simulateOrders=require('./eventsgenerator')

require('dotenv').config();
const mqttServers=process.env.mqtt

const {mqttClients,reconnect}=require("../static/mqttclient")
const publishData=require("../static/services")

const app = express();
app.use(bodyParser.json());


const orders={}
// Initialize MQTT Clients for each brand


// Hashing function for topics
function getHashedTopic(brand, orderId) {
  // const hash = crypto.createHash('sha256');
  // hash.update(`${brand}-${orderId}`);
  // return hash.digest('hex');
  return orderId;
}

// middleware 
app.use((req,res,next)=>{
  console.log("Middleware Test MQTT Connection",mqttClients.connected);
  if(!mqttClients.connected)
  {
    reconnect();
    res.send("MQTT Connection Reset try 10 sec later")
  }
  else{
    next()
  }


})

// Webhook to handle incoming brand updates
app.post('/webhook/:brand', (req, res) => {
  const { brand } = req.params;
  const data = req.body;


  publishData(brand,data).then(msg=> res.send(msg)).catch(err=>res.status(400).send("Error :"+err))
  


});

// Endpoint for clients to get hashed topic
app.get('/topic/:brand/:orderId', (req, res) => {
  const { brand, orderId } = req.params;
  const hashedTopic = getHashedTopic(brand, orderId);
  res.status(200).json({ topic: hashedTopic });
});




app.get('/generate', (req, res) => {
  simulateOrders();
  res.status(200).json({ generated:"generated OK" });
});

app.get('/', (req, res) => {
  res.status(200).send("Use, /topic/brand/orderId to get topic ,  /generate   to generate events and /webhook to push event ");
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

