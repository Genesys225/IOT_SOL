var GraphanaApi = require('./GraphanaApi/GraphanaApi'); 
var graphanaApi = new GraphanaApi();
class Sensor { 
    constructor(sensorObj, SR) {
        this.id = sensorObj.id
        this.type = sensorObj.type
        this.meta = sensorObj.meta && JSON.parse(sensorObj.meta)
        this.SR = SR
    }
   
    write(value) {
        this.SR.mqttClient.exec("db/mysql.writeDeviceData",
        { sensor_id: this.id, value },
        { timeout: 5000 }
        )
        .then((res) => { 
          return res
        })
    }
}

class registerDevice {
    constructor(mqttClient){
        this.sensorsList = {}
        this.mqttClient = mqttClient

    }  


    async initAllSensorsData(){
        var sensors = await this.mqttClient.exec("db/mysql.getSensors",{a:1},{ timeout: 5000 })
        //console.log(sensors)
        this.setSensors(sensors);       
        return sensors
    }

    /** @returns Sensor */
    async getSensorInst(sensor_id) {
        const [ deviceId, sensorType ] = sensor_id.split('/')
        if (this.isDeviceExist(sensor_id))
            return this.sensorsList[sensor_id] 
        else return this.registerDevice(deviceId, sensorType)
    }

    setSensors(sensors) {
        sensors.forEach((sensor) => {
            this.sensorsList[sensor.id] = new Sensor(sensor, this)
        })
    } 

    getSensors(){
        return this.sensorsList 
    } 

    isDeviceExist(sensor_id){
        return Object.keys(this.sensorsList).indexOf(sensor_id) !== -1
    }

    registerDevice(deviceId, sensorType){

        graphanaApi.registerAllDevices( deviceId)

        this.mqttClient.exec("db/mysql.addSensor",{deviceId, sensorType},{ timeout: 5000 })
        .then((sensor) => {
            this.sensorsList[sensor.id] = new Sensor(sensor, this)
            return sensor 
        });
    }
}
module.exports = registerDevice