const Grabber = require("./classes/Grabber");
const Mqtt = require("exec-mqtt");
const mqtt = require("mqtt")

const grabber = new Grabber();
const url = "mqtt://emqtt";
const port = 1883;
const clientConnectionParams = {
  services: { grabber },
  name: "grabber",
  mqttSetting: { url, port },
};
const grabberClient = mqtt.connect(url)
grabberClient.on('connect', function () {
  grabberClient.subscribe('sensors/#', function (err) {
    if (!err) {
      grabberClient.publish('presence', 'Grabber')
    }
  })
})
  
const mqttClient = new Mqtt(clientConnectionParams);
// message is Buffer
mqttClient.init().then((client) => {
  grabberClient.on('message', function (topic, message) {
    // sensors/SOL-XXX/type
    // types: temp, co2, humidity, lux
    const [_sensors, deviceId, sensorType] = topic.split('/')
    mqttClient.exec("db/mysql.writeDeviceData",
      { sensor_id: `${deviceId}/${sensorType}`, value: message.toString() },
      { timeout: 1000 }
      )
      .then((res) => { 
        console.log(res);
        return res
      });
    })
  });
  
