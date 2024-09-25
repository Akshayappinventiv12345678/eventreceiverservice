const mqtt = require('mqtt');
const crypto = require('crypto');
const { Module } = require('module');
require('dotenv').config();
const mqttServers=process.env.mqtt
// Options for connecting to the MQTT broker (optional)

console.log("MQTT Loading",mqttServers)

const  mqttClients = mqtt.connect(mqttServers);
  
mqttClients.on('connect', () => {
    console.log(`Connected to  MQTT server`);
    console.log("------MQTT Loaded------",mqttServers)
  });
  
mqttClients.on('error', (err) => {
    console.error(`MQTT connection error `, err);
  });

const checkConnection = () => {
    if (mqttClients.connected) {
      console.log('MQTT connection is live');
    } else {
      console.log('MQTT connection is not live');
    }
  };

module.exports=mqttClients