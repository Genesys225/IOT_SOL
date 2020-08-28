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
  addSensor({_sensors, deviceId, sensorType}){
    return new Promise((resolve, reject)=>{
      console.log(_sensors, deviceId, sensorType)
      connection.query({
          sql: "INSERT INTO `sol_db`.`sensors` (`id`, `device_id`, `type`, `meta`) VALUES (?,?,?,?);",
          values: [deviceId, deviceId, sensorType, "{}"],
        },
        function (error, results, fields) {
         
          if (error) throw error;
          resolve(results)
        }
      );
    })
  }
  
  getDevices(){
    return new Promise((resolve)=>{
      connection.query({
          sql: "SELECT * FROM sol_db.sensors"
        }, 
        function (error, results, fields) { 
         
          console.log("error, results," , results,  results.filter)
          if (error) throw error;
          resolve(results)
        }
      );
    })
  }
}
module.exports = Mysql;
