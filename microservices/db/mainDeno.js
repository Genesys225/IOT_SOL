import {   connect, StringCodec  } from 'https://raw.githubusercontent.com/nats-io/nats.deno/main/src/mod.ts'
import {Mysql} from './classes/mysqlDeno.js'

const mysql = new Mysql();

// to create a connection to a nats-server:
const nc = await connect({ servers: "nats://nats:4222" });

// create a codec
const sc = StringCodec();
// create a simple subscriber and iterate over messages
// matching the subscription
const sub = nc.subscribe("db/mysql.writeDeviceData");
(async () => {
	await mysql.connect()
  for await (const m of sub) {
	  var data = JSON.parse(sc.decode(m.data))
	  console.log(data)
	  await mysql.writeDeviceData({id:data.deviceId, value: data.value})
  }
  console.log("subscription closed");
})();

nc.publish("hello", sc.encode("world"));








// const HelloWorld = require('./classes/HelloWorld');
// const mqtt = require('exec-mqtt');
// const Mysql = require('./classes/Mysql');

// const helloWorld = new HelloWorld();
// const mysql = new Mysql();

// const NATS = require('nats')

// const nc = NATS.connect({url:'nats://nats:4222', json: true })


// nc.subscribe('db/mysql.writeDeviceData', async (msg, reply, subject, sid) => {
// 	//console.log({msg, reply, subject, sid});
// 	nc.publish(reply, await mysql.writeDeviceData({id:msg.deviceId, value: msg.value}))
// })


// const clientConnectionParams = {
// 	services: { helloWorld, mysql },
// 	name: 'db',
// 	mqttSetting: {
// 		url: 'mqtt://emqtt',
// 		port: 1883,
// 	},
// };

// const mqttClient = new mqtt(clientConnectionParams);

// mqttClient.init().then((client) => {

	
// });
