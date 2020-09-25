class SensorsApi {
	constructor(mqttClient) {
		// this.mqttClient = mqttClient
	}

	async addAlertTiming({ value, sensor_id, ts}) {
		return await this.mqttClient.exec('db/mysql.addAlertTiming',{ value, sensor_id, ts}, { timeout: 5000 });
	}


	async getSensors() {
		const mqttRes = await this.mqttClient.exec(
			'db/mysql.getSensors',
			{ a: 1 },
			{ timeout: 5000 }
		);
		if (mqttRes.length > 0)
			return mqttRes.map((sensor) => {
				sensor.meta = JSON.parse(sensor.meta);
				return sensor;
			});
		else return [];
	}

	async updateSensor(id, meta) {
		return await this.mqttClient.exec(
			'db/mysql.updateSensor',
			{ id, meta },
			{ timeout: 5000 }
		);
	}

	async getLastData() {
		const mqttRes = await this.mqttClient.exec(
			'db/mysql.getLastData',
			{ a: 1 },
			{ timeout: 5000 }
		);
		return mqttRes;
	}

	async getAllTimingEvents() {
		const mqttRes = await this.mqttClient.exec(
			'db/mysql.getAllTimingEvents',
			{ a: 1 },
			{ timeout: 5000 }
		);
		return mqttRes;
	}

	
}
module.exports = SensorsApi;
