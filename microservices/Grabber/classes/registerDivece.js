class registerDevice{
    constructor(mqttClient){
        console.log('CONSTRUCTOR', mqttClient.exec)
        this.setDevices(3123131); 
        this.mqttClient = mqttClient
        this.mqttClient.exec("db/mysql.getDevices",{a:1},{ timeout: 5000 })
        .then((res) => {
          
            console.log(111,  res, 222)
            this.setDevices(res);  
          return res 
        }); 

    }  
    setDevices(devices){
        this.devices = devices
    } 

    getDevices(){
        return this.devices 
    } 
    isDeviceExist(deviceId, sensorType){
        var foundDevices = 0
        this.getDevices().filter((device)=>{
            if (device.device_id==deviceId) foundDevices = 1
        })
        if(foundDevices==0) {return false} else {return true}
    }

    registerDevice(_sensors, deviceId, sensorType){
        this.mqttClient.exec("db/mysql.addSensor",{_sensors, deviceId, sensorType},{ timeout: 5000 })
        .then((res) => {
            this.setDevices(res); 
          return res 
        });
    }
}
module.exports = registerDevice