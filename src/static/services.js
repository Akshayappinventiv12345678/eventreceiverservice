
const mqttClients=require("./mqttclient")

// Hashing function for topics
function getHashedTopic(brand, orderId) {
    // const hash = crypto.createHash('sha256');
    // hash.update(`${brand}-${orderId}`);
    // return hash.digest('hex');
    return orderId;
  }
  

function publishData(brand,data){

    return new Promise((reject,resolve)=>{
    // Publish to the brand's MQTT topic
        
    const topic =getHashedTopic(brand, data.orderId);
    console.log("publishing topic",topic,data);
    // `/${brand}/updates`;
    mqttClients.publish(topic, JSON.stringify(data), (err) => {
      if (err) {
        console.error(`Error publishing to ${brand}:`, err);
        reject('Error publishing update');
      }
    
      console.log(`Published update for ${brand} on topic: ${topic}`);
      resolve(`Published update for ${brand} on topic: ${topic}`);
      
    });
      
    })
    
        
    
    }

module.exports=publishData