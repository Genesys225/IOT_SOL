const mqtt = require('exec-mqtt');

const ExecuteApi = require('./classes/execute');

const setupExpress = require('./classes/initExpress');

const SensorsApi = require('./classes/SensorsApi');

const HelloWorld = require('./classes/HelloWorld');

///var SensorsApi = require('./classes/SensorsApi');

// const GraphanaApi = require('./classes/GraphanaApi/GraphanaApi');

const CalendarApi = require('./classes/CalendarApi');

const calendarApi = new CalendarApi()

// const graphanaApi = new GraphanaApi();

const sensorsApi = new SensorsApi();

const executeApi = new ExecuteApi();

const DevicesApi = require('./classes/GraphanaApi/DevicesApi');

const devicesApi = new DevicesApi()

const NATS = require('nats')

const nc = NATS.connect({url:'nats://nats:4222', json: true })

nc.subscribe('ControlPanelApi/devicesApi/addNewDevice', async (msg, reply, subject, sid) => {
	console.log({msg, reply, subject, sid});
	nc.publish(reply, await devicesApi.addNewDevice(msg.deviceId))
})



const clientConnectionParams = {
	services: { sensorsApi },
	name: 'ControlPanelApi',
	mqttSetting: {
		url: 'mqtt://emqtt',
		port: 1883,
	},
};

const mqttClient = new mqtt(clientConnectionParams);
const app = setupExpress();

(async () => {
	await executeApi.initcMqtt();
	await mqttClient.init();

	sensorsApi.mqttClient = mqttClient;

	app.get('/getSensors', async (req, res) =>
		res.send(await sensorsApi.getSensors())
	);
	app.post('/sensorExecute', async (req, res) =>
		res.send(await executeApi.sensorExecute(req.body.id, req.body.message))
	);
	app.post('/updateSensor', async (req, res) => {
		console.log(req.body);
		return res.send(
			await sensorsApi.updateSensor(req.body.id, req.body.meta)
		);
	});
	app.get('/getLastData', async (req, res) =>
		res.send(await sensorsApi.getLastData())
	);

	app.get('/getAllTimingEvents', async (req, res) =>
		res.send(await sensorsApi.getAllTimingEvents())
	);

	app.post('/webhook', async (req, res) => {
		console.log(req.body)

			var evalMatches = req.body.evalMatches
			var message = evalMatches[0].value
			var deviceId = evalMatches[0].metric
			return res.send(await executeApi.sensorExecute(req.body.tags.deviceId, req.body.tags.message))
		
	
	}


	);
	// graphana api
 
	/**
	 {
			"idFrom": "All",
			"idTo": "room1",
			"deviceId": "SOL-14:11:11:11:11:11/temp"
	}
	http://localhost:6000/addDeviceFromDashboardToDashboard
	*/
	app.post('/addDeviceFromDashboardToDashboard', async (req, res) => {
		return res.send(await devicesApi.moveDevice({
			idFrom: req.body.idFrom,
			idTo: req.body.idTo,
			deviceId: req.body.deviceId,
		}));

		return res.send(
			await graphanaApi.addDeviceFromDashboardToDashboard({
				idFrom: req.body.idFrom,
				idTo: req.body.idTo,
				deviceId: req.body.deviceId,
			})
		);
	});

	// http://localhost:6000/addAlertThreshold
	// {"dashboardID":"room2", "deviceId":"SOL-14:11:11:11:11:11/temp", "threshold":8, "op":"gt"}
	app.post('/addAlertThreshold', async (req, res) => {
		return res.send(
			await devicesApi.addAlertThreshold({
				dashboardID: req.body.dashboardID,
				deviceId: req.body.deviceId,
				threshold: req.body.threshold,
				op: req.body.op,
				action : req.body.action
			})
		);
	});

	// {"sensor_id": "SOL-25:11:11:11:11:11/switch", "value": 2, "ts": "2020-09-21 21:55:02", "dashboardID":"room3"}
	// http://localhost:6000/addAlertTiming
	app.post('/addAlertTiming', async (req, res) => {
		const mysqlDb = await sensorsApi.addAlertTiming({ sensor_id: req.body.sensor_id, value: req.body.value, ts: req.body.ts, title: req.body.title });
		const gApi = devicesApi.addAlertTiming({ dashboardID: req.body.dashboardID, deviceId: req.body.sensor_id, threshold: req.body.value });
		return res.send(mysqlDb);
	});

	app.post('/deleteAlertTiming', async (req, res) => {
		const mysqlDb = await sensorsApi.deleteAlertTiming({ sensor_id: req.body.sensor_id, value: req.body.value, ts: req.body.ts, title: req.body.title });
		//const gApi = graphanaApi.deleteAlertTiming({dashboardID:req.body.dashboardID, deviceId:req.body.sensor_id, threshold: req.body.value});
		return res.send(mysqlDb);
	});

	app.get('/getAllAlerts', async (req, res) => {
		return res.send(await graphanaApi.getAllAlerts());
	});

	app.get('/getAllPanels', async (req, res) => {
		return res.send(await graphanaApi.getAllPannels());
	});







	/********************************CALENDAR API******************************************* */




	app.post('/deleteScheduleEvent', async (req, res) => {

		return res.send(await calendarApi.deleteScheduleEvent(req.body));
	});


	app.post('/setTimingStartEnd', async (req, res) => {

		return res.send(await calendarApi.setTimingStartEnd(req.body));
	});


	app.get('/getAllEvents', async (req, res) => {
		return res.send(await calendarApi.getAllEvents());
	});




	/*********************************NEW DEVICES API****************************************************/
	app.get('/getRoom/:roomId?', async (req, res) => {
		console.log(req.query);
		return res.send(await devicesApi.getRoom(req.params.roomId));
	});


	app.get('/getAlerts', async (req, res) => {
		console.log(req.query) 
		return res.send(await devicesApi.getAlerts());
	});

})();

// setInterval(() => {
// 	graphanaApi.registerAllDevices()
// }, 6000);
