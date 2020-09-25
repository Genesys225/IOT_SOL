
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
        return [
			{
				title: 'Website Re-Design Plan',
				startDate: new Date(2020, 9, 25, 9, 35),
				endDate: new Date(2020, 9, 25, 11, 30),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 0,
				roomId: 'room1',
			},
			{
				title: 'Book Flights to San Fran for Sales Trip',
				startDate: new Date(2020, 9, 25, 12, 11),
				endDate: new Date(2020, 9, 25, 13, 0),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 1,
				roomId: 'room1',
			},
			{
				title: 'Install New Router in Dev Room',
				startDate: new Date(2020, 9, 25, 14, 30),
				endDate: new Date(2020, 9, 25, 15, 35),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 2,
				roomId: 'room2',
			},
			{
				title: 'Approve Personal Computer Upgrade Plan',
				startDate: new Date(2020, 9, 26, 10, 0),
				endDate: new Date(2020, 9, 26, 11, 0),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 3,
				roomId: 'room2',
			},
			{
				title: 'Final Budget Review',
				startDate: new Date(2020, 9, 26, 12, 0),
				endDate: new Date(2020, 9, 26, 13, 35),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 4,
				roomId: 'room2',
			},
			{
				title: 'New Brochures',
				startDate: new Date(2020, 9, 26, 14, 30),
				endDate: new Date(2020, 9, 26, 15, 45),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 5,
				roomId: 'room2',
			},
			{
				title: 'Install New Database',
				startDate: new Date(2020, 9, 27, 9, 45),
				endDate: new Date(2020, 9, 27, 11, 15),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 6,
				roomId: 'room1',
			},
			{
				title: 'Approve New Online Marketing Strategy',
				startDate: new Date(2020, 9, 27, 12, 0),
				endDate: new Date(2020, 9, 27, 14, 0),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 7,
				roomId: 'room3',
			},
			{
				title: 'Upgrade Personal Computers',
				startDate: new Date(2020, 9, 27, 15, 15),
				endDate: new Date(2020, 9, 27, 16, 30),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 8,
				roomId: 'room3',
			},
			{
				title: 'Customer Workshop',
				startDate: new Date(2020, 9, 28, 11, 0),
				endDate: new Date(2020, 9, 28, 12, 0),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 9,
				roomId: 'room3',
			},
			{
				title: 'Prepare 2015 Marketing Plan',
				startDate: new Date(2020, 9, 28, 11, 0),
				endDate: new Date(2020, 9, 28, 13, 30),
				deviceId: "SOL-25:11:11:11:11:11/switch",
				id: 10,
				roomId: 'room1',
			},
		];
    }

    async setTimingStartEndFetch(dash) {
        // {"sensor_id": "SOL-25:11:11:11:11:11/switch", "value": 2, "ts": "2020-09-21 21:55:02", "dashboardID":"room3"}
        // http://localhost:6000/addAlertTiming

    }
}

module.exports = CalendarApi