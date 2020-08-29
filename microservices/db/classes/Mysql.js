var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: 'password',
  database: "sol_db",
});
connection.connect();

class Mysql {
  constructor() {

  }

  writeDeviceData({ sensor_id, value }) {
    return new Promise((resolve)=>{
      connection.query({
          sql: "INSERT INTO measurements (value, sensor_id) VALUES (?,?)",
          values: [value, sensor_id],
        },
        function (error, results, fields) {
         
          if (error) throw error;
          resolve(results)
        }
      );
    })
  }

  addSensor({deviceId, sensorType}){
    return new Promise((resolve, reject)=>{
      connection.query({
        sql: "INSERT IGNORE INTO sensors (id, device_id, type, meta) VALUES (?,?,?,?)",
        values: [ `${deviceId}/${sensorType}`, deviceId, sensorType, JSON.stringify({}) ],
      },
      function (error, results, fields) {
        if (error) throw error;
        connection.query({
          sql: "SELECT * FROM sensors WHERE id = ?",
          values: [ `${deviceId}/${sensorType}` ],
        }, function (error, results, fields) {
            if (error) throw error;
            resolve(results[0]);
          })        
        }
      );
    })
  }
  
  getSensors(_a){
    return new Promise((resolve)=>{
      connection.query({
          sql: "SELECT * FROM sensors"
        }, 
        function (error, results, fields) { 
          if (error) throw error;
          resolve(results)
        }
      );
    })
  }
}
module.exports = Mysql;
