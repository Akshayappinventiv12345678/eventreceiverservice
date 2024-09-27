const mqtt = require('mqtt');
const crypto = require('crypto');
const { Module } = require('module');
const { resolve } = require('path');
const { rejects } = require('assert');
require('dotenv').config();
const mqttServers=process.env.mqtt
// Options for connecting to the MQTT broker (optional)

console.log("MQTT Loading",mqttServers)

const  mqttClients = mqtt.connect(mqttServers);
  


const checkConnection = () => {
    if (mqttClients.connected) {
      console.log('MQTT connection is live');
    } else {
      console.log('MQTT connection is not live');
    }
  };

let reconnectThrotlling=false;
const reconnect= ()=>{
 return  new Promise((resolve,reject)=>{
      if(reconnectThrotlling){
        console.log(`Connecting1 .......`);
        resolve("Done");
        return;

      }
      
        console.log(`Connecting2 .......`);
        reconnectThrotlling=true;
        mqttClients.on('connect', () => {
          console.log(`Connected to  MQTT server`);
          console.log("------MQTT Loaded------",mqttServers)
          checkConnection();
          resolve("Done");
        
        });
        
      
     
  })
 
}

const start=()=>{
  mqttClients.on('connect', () => {
    console.log(`Connected to  MQTT server`);
    console.log("------MQTT Loaded------",mqttServers)
    checkConnection();
  });
  
mqttClients.on('error', (err) => {
    console.error(`MQTT connection error `, err);
  });
}
// start();
module.exports={mqttClients,reconnect}