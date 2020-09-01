class SensorsApi{

    constructor(mqttClient){
       // this.mqttClient = mqttClient
    } 

    async getSensors(){
        return await this.mqttClient.exec("db/mysql.getSensors",{a:1},{ timeout: 5000 })
    }

    async updateSensor(id, meta){
        return await this.mqttClient.exec("db/mysql.updateSensor",{id, meta},{ timeout: 5000 })
    }
}
module.exports = SensorsApi