const HelloWorld = require("./classes/HelloWorld");
const mqtt = require("exec-mqtt");
const helloWorld = new HelloWorld();

const clientConnectionParams = {
  services: { helloWorld },
  name: "baseTemplete",
  mqttSetting: {
    url: "mqtt://emqtt",
    port: 1883,
  },
};
  
const mqttClient = new mqtt(clientConnectionParams);
// setTimeout(() => {
//   mqttClient.init().then((client) => {
//     // console.log(client)
//     mqttClient
//       .exec( 
//         "db/mysql.writeDeviceData",
//         { sensor_id: "httpsrestco", value: "dasdsadassad" },
//         { timeout: 5555 }
//       )
//       .then((res) => { 
//         console.log(res);
//       });
//   });
  
// }, 2000);
