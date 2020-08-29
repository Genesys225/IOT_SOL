const Grabber = require("./classes/Grabber");
const Registration = require('./classes/registerDivece');
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
      grabberClient.publish('presence', 'Grabber');
    }
  })
})




const mqttClient = new Mqtt(clientConnectionParams);




// message is Buffer

mqttClient.init().then((client) => {
 
  var registration = new Registration(mqttClient);
 
  grabberClient.on('message', function (topic, message) {
    // sensors/SOL-XXX/type
    // types: temp, co2, humidity, lux
    const [_sensors, deviceId, sensorType] = topic.split('/');
    registration.getSensorInst(`${deviceId}/${sensorType}`).then((sensor) => {
      return sensor.write(message.toString());
    })
  })
});
  
