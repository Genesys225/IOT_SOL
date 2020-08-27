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
}
module.exports = Mysql;
