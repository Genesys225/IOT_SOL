import { Client } from "https://deno.land/x/mysql/mod.ts";

class Mysql {
	constructor() {}
	async getLastData() {
			return await this.client.execute(`SELECT id, ROUND(AVG(value), 2) as value
			FROM
				(SELECT 
					DISTINCT(sensor_id) AS id, 
					value
				FROM measurements
				WHERE ts >= DATE_SUB(NOW(), INTERVAL 30 SECOND)
				) t1
			GROUP BY id
			ORDER BY id`)
	}
	async connect(){
	   this.client = await new Client().connect({
			hostname: "mysql",
			username: "root",
			db: "sol_db",
			poolSize: 3, // connection limit
			password: "password",
		  });
	}
	async addAlertTiming({ value, sensor_id, ts, title}) {
		return await this.client.execute('INSERT INTO timers (value, sensor_id, ts, title) VALUES (?,?,?, ?)', [value, sensor_id, ts, title]);
	}
	async deleteAlertTiming({ value, sensor_id, ts, title}) {
		return await this.client.execute('DELETE FROM timers WHERE title=?', [title]);
	}
	async writeDeviceData({ id, value }) {
		return await this.client.execute(`INSERT INTO measurements (value, sensor_id) VALUES (?,?)`, [value, id]);
	}

	// DEPRICATED
	async getAllTimingEvents(_a) {
		return await this.client.execute('SELECT * FROM sol_db.timers WHERE ts > now()');
	}


	async updateSensor({ id, meta }) {
		return await this.client.execute(`UPDATE sol_db.sensors SET meta = ? WHERE (id = ?);`,  [JSON.stringify(meta), id]);
	}

	async addSensor({ deviceId, sensorType }) {
		return await this.client.execute('INSERT IGNORE INTO sensors (id, device_id, type, meta) VALUES (?,?,?,?)',   [
			`${deviceId}/${sensorType}`,
			deviceId,
			sensorType,
			JSON.stringify({}),
		]);
	}

	async getSensors(_a) {
		return await this.client.execute('SELECT * FROM sensors ORDER BY id');
	}
}
export  {Mysql};
