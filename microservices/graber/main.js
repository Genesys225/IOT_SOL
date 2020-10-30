import {   connect, StringCodec  } from 'https://raw.githubusercontent.com/nats-io/nats.deno/main/src/mod.ts'
import { Client } from 'https://deno.land/x/mqtt/deno/mod.ts'; // Deno (ESM)
const sc = StringCodec();


const nc = await connect({ servers: "nats://nats:4222" });

//const nc = NATS.connect({ url: 'nats://nats:4222', json: true });

const url = 'mqtt://emqtt';

//const grabberClient = mqtt.connect(url);
//const grabberClient = new Client({ url: url }); // Deno and Node.js
//const fetch = require('node-fetch');

//
 
class Grabber {
	devices = []
	constructor() {
		this.devices = []; 
	}  
	setDevices(devices) {
		this.devices = devices;
	}
	async subscribeToDataDevicesStream() {
		
		const client = new Client({ url: url });  
		await client.connect();
		await client.subscribe('sensors/#');
		
		client.on('message', (topic, payload) => {
		  //console.log({topic,payload:  new TextDecoder("utf-8").decode(payload)});
		  this.processMessage(topic, new TextDecoder("utf-8").decode(payload));
		});
	}

	async setAllDevices() { 
		const res = await fetch('http://microservices:6000/getRoom');
		const rowRes = await res.json();
		if (!rowRes.dashboard) return [];
		const devices = rowRes.dashboard.panels.map((r) => r.uid);
		this.devices = devices;
		return devices; 
	} 
	async processMessage(topic = [], message) {
		var deviceData = topic.split('/');
		var deviceType = deviceData[2];
		var deviceName = deviceData[1];
		var systemDeviceId = deviceName + '/' + deviceType;
		if (this.devices.includes(systemDeviceId)) {
			this.write({ id: systemDeviceId, value: message });
		} else {
			await this.addDevice(topic);
			await this.setAllDevices();
		}
	}
	write({ id, value }) {
		return new Promise(async (resolve) => {
			
			await nc.request('db/mysql.writeDeviceData',sc.encode(JSON.stringify({ deviceId: id, value: value.toString() })), { timeout: 1000 })
				.then((m) => {
					//console.log(m)
					resolve();
					//console.log(`got response: ${sc.decode(m.data)}`);
				})
				.catch((err) => {
				//	console.log(`problem with request: ${err.message}`);
				});
	
		});
	}

	addDevice(id) {
		return new Promise(async (resolve) => {

			await nc.request('ControlPanelApi/devicesApi/addNewDevice',sc.encode(JSON.stringify({ deviceId: id.replace('sensors/', '') })), { timeout: 1000 })
			.then((m) => {
				console.log(m)
				resolve();
				//console.log(`got response: ${sc.decode(m.data)}`);
			})
			.catch((err) => {
			//	console.log(`problem with request: ${err.message}`);
			});



		});
	}
}

const grabber = new Grabber();

(async () => {
	setTimeout(async () => {
		console.log('allDevices: ', await grabber.setAllDevices());
		await grabber.subscribeToDataDevicesStream();
	}, 1000);
})();



