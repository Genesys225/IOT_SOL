const HelloWorld = require('./classes/HelloWorld');
const mqtt = require('exec-mqtt');
const Mysql = require('./classes/Mysql');

const helloWorld = new HelloWorld();
const mysql = new Mysql();

const NATS = require('nats')

const nc = NATS.connect({url:'nats://nats:4222', json: true })

nc.subscribe('db/mysql.writeDeviceData', async (msg, reply, subject, sid) => {
	console.log({msg, reply, subject, sid});
	nc.publish(reply, await mysql.writeDeviceData({id:msg.deviceId, value: msg.value}))
})


const clientConnectionParams = {
	services: { helloWorld, mysql },
	name: 'db',
	mqttSetting: {
		url: 'mqtt://emqtt',
		port: 1883,
	},
};

const mqttClient = new mqtt(clientConnectionParams);

mqttClient.init().then((client) => {

	
});
