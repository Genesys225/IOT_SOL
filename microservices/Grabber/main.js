const Mqtt = require('exec-mqtt');
const mqtt = require('mqtt');
const NATS = require('nats');

const nc = NATS.connect({ url: 'nats://nats:4222', json: true });

const url = 'mqtt://emqtt';

const grabberClient = mqtt.connect(url);

const fetch = require('node-fetch');
class Grabber {
	constructor() {
		this.devices = [];
	}
	setDevices(devices) {
		this.devices = devices;
	}
	async subscribeToDataDevicesStream() {
		const grabberClient = await mqtt.connect(url);

		return new Promise((resolve) => {
			grabberClient.on('connect', () => {
				grabberClient.subscribe('sensors/#', (err) => {
					grabberClient.on('message', (topic, message) => {
						this.processMessage(topic, message);
						resolve('connected');
					});
				});
			});
		});
	}

	async setAllDevices() {
		const res = await fetch('http://127.0.0.1:6000/getRoom');
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
		return new Promise((resolve) => {
			nc.request(
				'db/mysql.writeDeviceData',
				{ deviceId: id, value: value.toString() },
				(msg) => {
					//console.log('Device was registered' + msg);
					resolve();
				}
			);
		});
	}

	addDevice(id) {
		return new Promise((resolve) => {
			nc.request(
				'ControlPanelApi/devicesApi/addNewDevice',
				{ deviceId: id.replace('sensors/', '') },
				(msg) => {
					resolve();
				}
			);
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
