class Sensor {
    constructor(sensorObj, mqttClient) {
        this.mqttClient = mqttClient
        this.id = sensorObj.id
        this.type = sensorObj.type
        this.meta = JSON.parse(sensorObj.meta)
    }
   
    write(value) {
        this.mqttClient.exec("db/mysql.writeDeviceData",
        { sensor_id: this.id, value },
        { timeout: 500 }
        )
        .then((res) => { 
          //console.log(res);
          return res
        })
    }
}

class registerDevice {
    constructor(mqttClient){
        this.sensorsList = {}
        this.mqttClient = mqttClient
        this.mqttClient.exec("db/mysql.getSensors",{a:1},{ timeout: 5000 })
        .then((sensors) => {
            this.setSensors(sensors);  
            return sensors 
        }); 

    }  

    /** @returns Sensor */
    async getSensorInst(sensor_id) {
        const [deviceId, sensorType] = sensor_id.split('/')
        if (this.isDeviceExist(sensor_id))
            return this.sensorsList[sensor_id]
        else return this.registerDevice(deviceId, sensorType)
    }

    setSensors(sensors){
        sensors.foreach((sensor) => {
            this.sensorsList[sensor.id] = new Sensor(sensor, this.mqttClient)
        })
    } 

    getSensors(){
        return this.sensorsList 
    } 

    isDeviceExist(sensor_id){
        return Object.keys(this.sensorsList).indexOf(sensor_id) !== -1
    }

    registerDevice(deviceId, sensorType){
        this.mqttClient.exec("db/mysql.addSensor",{deviceId, sensorType},{ timeout: 5000 })
        .then((sensor) => {
            this.sensorsList[sensor.id] = new Sensor(sensor, this.mqttClient)
            return sensor 
        });
    }
}
module.exports = registerDevice