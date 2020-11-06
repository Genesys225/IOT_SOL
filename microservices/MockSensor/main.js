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

var switch1Status = '0';
mockDevice.on('connect', function () {
  mockDevice.subscribe('alive/#', function (err) {
    setInterval(() => {
      mockDevice.publish('alive/SOL-25:11:11:11:11:11/switch', 'on')
    }, 5000);
  })
  mockDevice.subscribe('controls/SOL-25:11:11:11:11:11/switch/#')




  mockDevice.subscribe('sensors/#', function (err) {
    if (!err) {



      // **************************SENSORS*****************************************
      setInterval(() => {
        mockDevice.publish('sensors/SOL-14:11:11:11:11:11/temp', Math.floor(Math.random() * 10).toString())
      }, 5000);


      setInterval(() => {
        mockDevice.publish('sensors/SOL-15:11:11:11:11:11/hum', Math.floor(Math.random() * 10).toString())
      }, 10000);


      setInterval(() => {
        mockDevice.publish('sensors/SOL-16:11:11:11:11:11/light', Math.floor(Math.random() * 10).toString())
      }, 1000);


      // SWITCH
      setInterval(() => {
        mockDevice.publish("sensors/SOL-25:11:11:11:11:11/switch/0", switch1Status)
      }, 10000);
      // **************************SENSORS*****************************************




      // **************************SWITCHES*****************************************
      mockDevice.on('message', function (topic, message) {
        // message is Buffer
        if (topic === "sensors/SOL-25:11:11:11:11:11/switch/0/set" && message.toString() == 'on') {
          switch1Status = '1'
          mockDevice.publish("sensors/SOL-25:11:11:11:11:11/switch/0", switch1Status)
        }
        
        if (topic === "sensors/SOL-25:11:11:11:11:11/switch/0" && message.toString() == 'off') {
          switch1Status = '0'
          mockDevice.publish("sensors/SOL-25:11:11:11:11:11/switch/0", switch1Status)
        }

      })
      // **************************SWITCHES*****************************************





      
    }
  })
})
