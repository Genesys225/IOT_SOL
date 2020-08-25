const HelloWorld = require("./classes/HelloWorld");
const mqtt = require("exec-mqtt");
const Mysql = require("./classes/Mysql");

const helloWorld = new HelloWorld();
const mysql = new Mysql();

const clientConnectionParams = {
  services: { helloWorld, mysql },
  name: "db",
  mqttSetting: {
    url: "mqtt://localhost",
    port: 1883,
  },
};

const mqttClient = new mqtt(clientConnectionParams);

mqttClient.init().then((client) => {
  mqttClient
    .exec(
      "baseTemplete/helloWorld.hello",
      { uri: "XXXXXXXXXXXXXXXXXXXXXXXXX" },
      { timeout: 5555 }
    )
    .then((res) => {
      console.log(res);
    });
});
