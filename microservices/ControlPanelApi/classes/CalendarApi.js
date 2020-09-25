
const alasql = require('alasql')
const fetch = require('node-fetch');

class CalendarApi {

    async setTimingStartEnd(res) {
       
        await fetch('http://microservices:6000/addAlertTiming', {
            method: 'post',
            body: JSON.stringify({ "sensor_id": res.deviceId.deviceId, "value": 0, "ts":  new Date(res.startDate).toISOString().slice(0, 19).replace('T', ' '), "dashboardID": res.roomId }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => (res))
 


        return await fetch('http://microservices:6000/addAlertTiming', {
            method: 'post',
            body: JSON.stringify({ "sensor_id": res.deviceId.deviceId, "value": 1, "ts":  new Date(res.endDate).toISOString().slice(0, 19).replace('T', ' '), "dashboardID": res.roomId }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => (res))
    }

    getAllEvents() {

    }

    async setTimingStartEndFetch(dash) {
        // {"sensor_id": "SOL-25:11:11:11:11:11/switch", "value": 2, "ts": "2020-09-21 21:55:02", "dashboardID":"room3"}
        // http://localhost:6000/addAlertTiming

    }
}

module.exports = CalendarApi