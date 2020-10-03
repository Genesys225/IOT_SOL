const fetch = require('node-fetch');
const { dashboard, panel, alertT, textWidget, gaugeWidget, timingAlert, webhookNotification } = require('./templets');
const alasql = require('alasql')

class DevicesApi {
    constructor() {
        this.urlMap = {

            postWebhookNotificationChanel: 'http://grafana:3000/api/alert-notifications',
            postUpdateRoom: 'http://grafana:3000/api/dashboards/db'
        }

        this.defaultQuery = (id) => `SELECT\n  $__timeGroupAlias(ts,$__interval),\n  sensor_id AS metric,\n  avg(value) AS \"value\"\nFROM measurements\nWHERE\n  $__timeFilter(ts) AND\n  sensor_id = '${id}'\nGROUP BY 1,2\nORDER BY $__timeGroup(ts,$__interval)`
    }

    // ROOMS
    async getRoomsList() { return await this.send('http://grafana:3000/api/search?query=%') }

    async getRoom(roomId) { return await this.send(`http://grafana:3000/api/dashboards/uid/${roomId}`) }

    async updateRoom(roomJsonData) { return this.send('http://grafana:3000/api/dashboards/db', roomJsonData) }

    // DEVICES
    async addNewDevice(id) {
        var room = await this.getRoom('MainRoom');

        if (room.message === 'Dashboard not found') {
            await this.updateRoom(dashboard({ title: 'MainRoom', uid: 'MainRoom' }))
            room = await this.getRoom('MainRoom');
        }
        if (!room.dashboard.panels) room.dashboard.panels = [];
        // room.dashboard.panels = [];
        room.dashboard.panels.push(panel({ id: this.hashCode(id), title: id, rawSql: this.defaultQuery(id) }));
        return JSON.stringify(await this.updateRoom(room));
    }

    async deleteDevice() { }

    async moveDevice() { }

    async getAllDevices(roomId) {
        const allDashboards = await this.getRoomsList();
        for (const dash in allDashboards) {
            var dashboard = (await this.getRoom(allDashboards[dash].uid))['dashboard']
            allPannels.push({ room: dashboard.uid, deviceId: dashboard.panels.title, devices: alasql('select * from ? ', [dashboard.panels]) })
        }
        return allPannels
    }

    async postCreateDevice() { return await this.send(this.urlMap.getRoomsList) }

    async getAllPannels() {

    }

    async send(url, data) {
        var method = 'get';
        if (data) method = 'post'
        return await (await fetch(url, { method, body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', 'Authorization': process.env.GRAPHANA_API_KEY } })).json()
    }


    hashCode(s) {
        return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }

}

// var devicesApi = new DevicesApi();
// (async ()=>{
//     console.log(1111111, await devicesApi.addNewDevice('SOL-25:11:11:11:11:11/switch'))
// })() 
module.exports = DevicesApi;   