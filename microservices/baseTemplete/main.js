const HelloWorld = require("./classes/HelloWorld");
const mqtt = require("exec-mqtt");
const helloWorld = new HelloWorld();

const clientConnectionParams = {
  services: { helloWorld },
  name: "baseTemplete",
  mqttSetting: {
    url: "mqtt://localhost",
    port: 1883,
  },
};

const mqttClient = new mqtt(clientConnectionParams);

mqttClient.init().then((client) => {
  mqttClient
    .exec(
      "db/mysql.writeDeviceData",
      { id: "https://restcountries.eu/rest/v2/all", value: "dasdsadassad" },
      { timeout: 5555 }
    )
    .then((res) => {
      console.log(res);
    });
});
