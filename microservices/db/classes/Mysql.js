var mysql = require('mysql');
var connection = mysql.createConnection({
	// debug: true,
	host: 'mysql',
	user: 'root',
	password: 'password',
	database: 'sol_db',
});
connection.connect();

class Mysql {
	constructor() {}
	getLastData() {
		return new Promise((resolve) => {
			connection.query(
				`SELECT id, ROUND(AVG(value), 2) as value
					FROM
						(SELECT 
							DISTINCT(sensor_id) AS id, 
							value
						FROM measurements
						WHERE ts >= DATE_SUB(NOW(), INTERVAL 30 SECOND)
						) t1
					GROUP BY id
					ORDER BY id`,
				// `SELECT sensor_id AS id, ROUND(AVG(value), 2) AS value
				// FROM measurements
				// WHERE (sensor_id, ts) IN (
				// 	SELECT
				// 		sensor_id, MAX(ts)
				// 	FROM
				// 		measurements
				// 	GROUP BY
				// 		sensor_id
				// )
				// GROUP BY
				// 		sensor_id
				// ORDER BY sensor_id`,
				function(error, results, fields) {
					if (error) throw error;
					resolve(results);
				}
			);
		});
	}

	addAlertTiming({ value, sensor_id, ts, title}) {
		return new Promise((resolve) => {
			connection.query({sql: 'INSERT INTO timers (value, sensor_id, ts, title) VALUES (?,?,?, ?)', values: [value, sensor_id, ts, title]},
				function(error, results, fields) {
					if (error) throw error;
					resolve(results);
				}
			);
		});
	}
	deleteAlertTiming({ value, sensor_id, ts, title}) {
		return new Promise((resolve) => {
			console.log(value, sensor_id, ts, 9999999999)
			connection.query({sql: 'DELETE FROM timers WHERE title=?', values: [title]},
				function(error, results, fields) {
					if (error) throw error;
					resolve(results);
				}
			);
		});
	}
	writeDeviceData({ id, value }) {
		console.log(id, value, 9898989)
		return new Promise((resolve) => {
			connection.query(
				{
					sql:
						'INSERT INTO measurements (value, sensor_id) VALUES (?,?)',
					values: [value, id],
				},
				function(error, results, fields) {
					if (error) throw error;
					resolve(results);
				}
			);
		});
	}
	updateSensor({ id, meta }) {
		return new Promise((resolve, reject) => {
			connection.query(
				{
					sql: `UPDATE sol_db.sensors SET meta = ? WHERE (id = ?);`,
					values: [JSON.stringify(meta), id],
				},
				function(error, results, fields) {
					if (error) throw error;
					console.log(results);
					resolve(results);
				}
			);
		});
	}

	addSensor({ deviceId, sensorType }) {
		return new Promise((resolve, reject) => {
			connection.query(
				{
					sql:
						'INSERT IGNORE INTO sensors (id, device_id, type, meta) VALUES (?,?,?,?)',
					values: [
						`${deviceId}/${sensorType}`,
						deviceId,
						sensorType,
						JSON.stringify({}),
					],
				},
				function(error, results, fields) {
					if (error) throw error;
					connection.query(
						{
							sql: 'SELECT * FROM sensors WHERE id = ?',
							values: [`${deviceId}/${sensorType}`],
						},
						function(error, results, fields) {
							if (error) throw error;
							resolve(results[0]);
						}
					);
				}
			);
		});
	}

	getSensors(_a) {
		return new Promise((resolve) => {
			connection.query(
				{
					sql: 'SELECT * FROM sensors ORDER BY id',
				},
				function(error, results, fields) {
					if (error) throw error;
					resolve(results);
				}
			);
		});
	}

	getAllTimingEvents(_a) {
		return new Promise((resolve) => {
			connection.query(
				{
					sql: 'SELECT * FROM sol_db.timers WHERE ts > now()',
				},
				function(error, results, fields) {
					if (error) throw error;
					resolve(results);
				}
			);
		});
	}
}
module.exports = Mysql;
