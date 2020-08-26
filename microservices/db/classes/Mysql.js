var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: 'password',
  database: "sol_db",
});
connection.connect();
//connection.end();

class Mysql {
  constructor() {

  }

  writeDeviceData({ id, value }) {
    return new Promise((resolve)=>{
      connection.query(
        {
          sql: "INSERT INTO kuku (value, id) VALUES (?,?)",
          values: [id, value],
        },
        function (error, results, fields) {
         
          if (error) throw error;
          resolve(results)
          console.log("The solution is: ", results[0].solution);
        }
      );
    })


  }
}
module.exports = Mysql;
