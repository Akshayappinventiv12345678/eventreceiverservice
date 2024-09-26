const express = require('express');
const bodyParser = require('body-parser');

const crypto = require('crypto');
const { Module } = require('module');
const simulateOrders=require('./eventsgenerator')

require('dotenv').config();
const mqttServers=process.env.mqtt

const  mqttClients = require('../static/mqttclient');
// Options for connecting to the MQTT broker (optional)

const app = express();
app.use(bodyParser.json());
console.log(mqttServers)

const orders={}
// Initialize MQTT Clients for each brand


// Hashing function for topics
function getHashedTopic(brand, orderId) {
  // const hash = crypto.createHash('sha256');
  // hash.update(`${brand}-${orderId}`);
  // return hash.digest('hex');
  return orderId;
}


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

function publishData(brand,data){

return new Promise((resolve,reject)=>{
// Publish to the brand's MQTT topic
    
const topic =getHashedTopic(brand, data.orderId);
console.log("publishing topic",topic,data);
// `/${brand}/updates`;
mqttClients.publish(topic, JSON.stringify(data), (err) => {
  if (err) {
    console.log(`Error publishing to ${brand}:`, err);
    reject('Error publishing update');
  }

  console.log(`Published update for ${brand} on topic: ${topic}`);
  resolve(`Published update for ${brand} on topic: ${topic}`);
  
});
  
})

    

}
