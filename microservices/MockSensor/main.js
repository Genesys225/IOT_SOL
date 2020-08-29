const Grabber = require("./classes/Grabber");
const Mqtt = require("exec-mqtt");
const mqtt = require("mqtt")

const grabber = new Grabber();
const url = "mqtt://emqtt";
const port = 1883;
const clientConnectionParams = {
  services: { grabber },
  name: "mockDevice",
  mqttSetting: { url, port },
};
const mockDevice = mqtt.connect(url)
mockDevice.on('connect', function () {
  mockDevice.subscribe('sensors/#', function (err) {
    if (!err) {
      setInterval(() => {
     
        mockDevice.publish('sensors/SOL-14:11:11:11:11:11/temp', Math.floor(Math.random() * 10).toString())
      }, 10000);
     
    }
  })
})
  