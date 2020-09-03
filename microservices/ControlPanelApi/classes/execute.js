const mqtt = require('mqtt');
const url = 'mqtt://emqtt';
const cMqtt = mqtt.connect(url);


 


class ExecuteApi{

    async sensorExecute(id, message){
        this.cMqtt.publish(id, message);
        return  {id, message}
    }

    initcMqtt(){
        return new Promise((resolve)=>{
            cMqtt.on('connect', () => {
                cMqtt.subscribe('sensors/#', (err) => {
                    if (!err) {
                        this.cMqtt = cMqtt;
                        resolve(cMqtt);
                    }
                });
            });
        })
    }
}

module.exports = ExecuteApi