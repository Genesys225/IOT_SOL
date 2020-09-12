const mqtt = require('exec-mqtt');

const ExecuteApi = require('./classes/execute');

const setupExpress = require('./classes/initExpress');

const SensorsApi = require('./classes/SensorsApi');

const HelloWorld = require('./classes/HelloWorld');

///var SensorsApi = require('./classes/SensorsApi');

const GraphanaApi = require('./classes/GraphanaApi/GraphanaApi'); 

const graphanaApi = new GraphanaApi();

const sensorsApi = new SensorsApi();

const executeApi = new ExecuteApi();

const clientConnectionParams = {
	services: { sensorsApi, graphanaApi },
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
		return res.send(
			await graphanaApi.addDeviceFromDashboardToDashboard({idFrom:req.body.idFrom, idTo: req.body.idTo, deviceId: req.body.deviceId})
		);
	});
	
	
})();



// setInterval(() => {
// 	graphanaApi.registerAllDevices()
// }, 6000);