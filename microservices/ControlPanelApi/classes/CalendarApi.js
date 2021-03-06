const alasql = require('alasql');
const fetch = require('node-fetch');

class CalendarApi {
	async setTimingStartEnd(res) {
		var tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
		console.log(res);
		await fetch('http://microservices:6000/addAlertTiming', {
			method: 'post',
			body: JSON.stringify({
				title: res.title,
				sensor_id: res.deviceId,
				value: 1,
				ts: new Date(new Date(res.startDate).getTime() - tzoffset)
					.toISOString()
					.slice(0, -1),

				dashboardID: res.roomId,
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then((res) => res);

		return await fetch('http://microservices:6000/addAlertTiming', {
			method: 'post',
			body: JSON.stringify({
				title: res.title,
				sensor_id: res.deviceId,
				value: 0,
				ts: new Date(new Date(res.endDate).getTime() - tzoffset)
					.toISOString()
					.slice(0, -1),

				dashboardID: res.roomId,
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then((res) => res);
    }
    

    async deleteScheduleEvent(res){
        return await fetch('http://microservices:6000/deleteAlertTiming', {
			method: 'post',
			body: JSON.stringify({
				title: res.title,
				sensor_id: res.deviceId,
				dashboardID: res.roomId,
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then((res) => res);
    }


	async getAllEvents() {
		var allEvents = await fetch(
			'http://microservices:6000/getAllTimingEvents',
			{ method: 'get' }
		).then(async (response) => await response.json());
		var startStopEvents = [];
		allEvents.map(() => {
			startStopEvents.push;
		});
		const alasql = require('alasql');

		var calendarResponce = alasql(
			`
        SELECT 
        startTable.id,  
        startTable.sensor_id as deviceId,
        startTable.title as title,
        startTable.ts as startDate,  
        endTable.ts as endDate 
         FROM ? as endTable
        
        INNER JOIN ? as startTable 
        on endTable.value != startTable.value AND endTable.title = startTable.title
     
        WHERE endTable.value = 0
        AND  startTable.value = 1
    
        `,
			[allEvents, allEvents]
		);

		return calendarResponce;

		return [
			{
				title: 'Website Re-Design Plan',
				startDate: new Date(2020, 8, 25, 9, 35),
				endDate: new Date(2020, 8, 25, 11, 30),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 0,
				roomId: 'room1',
			},
			{
				title: 'Book Flights to San Fran for Sales Trip',
				startDate: new Date(2020, 8, 25, 12, 11),
				endDate: new Date(2020, 8, 25, 13, 0),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 1,
				roomId: 'room1',
			},
			{
				title: 'Install New Router in Dev Room',
				startDate: new Date(2020, 8, 25, 14, 30),
				endDate: new Date(2020, 8, 25, 15, 35),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 2,
				roomId: 'room2',
			},
			{
				title: 'Approve Personal Computer Upgrade Plan',
				startDate: new Date(2020, 8, 26, 10, 0),
				endDate: new Date(2020, 8, 26, 11, 0),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 3,
				roomId: 'room2',
			},
			{
				title: 'Final Budget Review',
				startDate: new Date(2020, 8, 26, 12, 0),
				endDate: new Date(2020, 8, 26, 13, 35),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 4,
				roomId: 'room2',
			},
			{
				title: 'New Brochures',
				startDate: new Date(2020, 8, 26, 14, 30),
				endDate: new Date(2020, 8, 26, 15, 45),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 5,
				roomId: 'room2',
			},
			{
				title: 'Install New Database',
				startDate: new Date(2020, 8, 27, 9, 45),
				endDate: new Date(2020, 8, 27, 11, 15),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 6,
				roomId: 'room1',
			},
			{
				title: 'Approve New Online Marketing Strategy',
				startDate: new Date(2020, 8, 27, 12, 0),
				endDate: new Date(2020, 8, 27, 14, 0),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 7,
				roomId: 'room3',
			},
			{
				title: 'Upgrade Personal Computers',
				startDate: new Date(2020, 8, 27, 15, 15),
				endDate: new Date(2020, 8, 27, 16, 30),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 8,
				roomId: 'room3',
			},
			{
				title: 'Customer Workshop',
				startDate: new Date(2020, 8, 28, 11, 0),
				endDate: new Date(2020, 8, 28, 12, 0),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
				id: 9,
				roomId: 'room3',
			},
			{
				title: 'Prepare 2015 Marketing Plan',
				startDate: new Date(2020, 8, 28, 11, 0),
				endDate: new Date(2020, 8, 28, 13, 30),
				deviceId: 'SOL-25:11:11:11:11:11/switch',
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

module.exports = CalendarApi;

// var aE =  [
//     {
//     id: 1,
//     sensor_id: 'SOL-25:11:11:11:11:11/switch',
//     value: 0,
//     ts: '2020-09-27T23:00:00.000Z',
//     name: 'eeeeeee'
//     },
//     {
//     id: 2,
//     sensor_id: 'SOL-25:11:11:11:11:11/switch',
//     value: 1,
//     ts: '2020-09-27T23:30:00.000Z',
//     name: 'eeeeeee'
//     },
//     {
//     id: 3,
//     sensor_id: 'SOL-25:11:11:11:11:11/switch',
//     value: 0,
//     ts: '2020-09-28T23:30:00.000Z',
//     name: 'wewewqewqe'
//     },
//     {
//     id: 4,
//     sensor_id: 'SOL-25:11:11:11:11:11/switch',
//     value: 1,
//     ts: '2020-09-29T00:00:00.000Z',
//     name: 'wewewqewqe'
//     },
//     {
//     id: 5,
//     sensor_id: 'SOL-25:11:11:11:11:11/switch',
//     value: 0,
//     ts: '2020-09-30T00:30:00.000Z',
//     name: 'zzzzzzzzzzzz'
//     },
//     {
//     id: 6,
//     sensor_id: 'SOL-25:11:11:11:11:11/switch',
//     value: 1,
//     ts: '2020-09-30T01:00:00.000Z',
//     name: 'zzzzzzzzzzzz'
//     }
//     ]
//     console.table(alasql(`
//     SELECT
//     startTable.name as sName,
//     endTable.name as eName,
//     startTable.ts as startTs,
//     endTable.value as eValue,
//     startTable.value as sValue,
//     endTable.ts as endTs
//      FROM ? as endTable

//     INNER JOIN ? as startTable
//     on endTable.value != startTable.value AND endTable.name = startTable.name

//     WHERE endTable.value = 0
//     AND  startTable.value = 1

//     `,[aE, aE]));
