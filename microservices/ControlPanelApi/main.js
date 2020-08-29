const mqtt = require("exec-mqtt");


const SensorsApi = require("./classes/SensorsApi")

const HelloWorld = require("./classes/HelloWorld");

const sensorsApi  = new SensorsApi()


const clientConnectionParams = {
  services: { sensorsApi },
  name: "ControlPanelApi",
  mqttSetting: {
    url: "mqtt://emqtt",
    port: 1883,
  },
};
const mqttClient = new mqtt(clientConnectionParams);
(async () => {

  await mqttClient.init()
  const app = setupExpress()
  app.post('/getSensors', async (req, res) => res.send(await sensorsApi.getSensors()))
})()



function setupExpress(){
  console.log(123)
  const express = require('express')
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const app = express();
  const port = 3000;

  // Where we will keep books
  let books = [];

  app.use(cors());

  // Configuring body parser middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post('/book', (req, res) => {
    // We will be coding here
  });

  app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));
  return app
}