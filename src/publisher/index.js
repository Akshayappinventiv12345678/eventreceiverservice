const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const crypto = require('crypto');
require('dotenv').config();
const mqttServers=process.env.mqtt
// Options for connecting to the MQTT broker (optional)

const app = express();
app.use(bodyParser.json());
console.log(mqttServers)

const orders={}
// Initialize MQTT Clients for each brand

const  mqttClients = mqtt.connect(mqttServers);
  
  mqttClients.on('connect', () => {
    console.log(`Connected to  MQTT server`);
  });
  
  mqttClients.on('error', (err) => {
    console.error(`MQTT connection error `, err);
  });


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

  // if (!mqttClients) {
  //   return res.status(404).send('Brand not supported');
  // }

  // Publish to the brand's MQTT topic
  const topic =getHashedTopic(brand, data.orderId);
  console.log("publishing topic",topic,data);
  // `/${brand}/updates`;
  mqttClients.publish(topic, JSON.stringify(data), (err) => {
    if (err) {
      console.error(`Error publishing to ${brand}:`, err);
      return res.status(500).send('Error publishing update');
    }

    console.log(`Published update for ${brand} on topic: ${topic}`);
    res.status(200).send('Update published successfully');
  });
});

// Endpoint for clients to get hashed topic
app.get('/topic/:brand/:orderId', (req, res) => {
  const { brand, orderId } = req.params;
  const hashedTopic = getHashedTopic(brand, orderId);
  res.status(200).json({ topic: hashedTopic });
});



app.get('/generate', (req, res) => {

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