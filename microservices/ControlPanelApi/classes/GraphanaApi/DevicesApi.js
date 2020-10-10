const fetch = require('node-fetch');
const { dashboard, panel, alertT, textWidget, gaugeWidget, timingAlert, webhookNotification } = require('./templets');
const alasql = require('alasql')

class DevicesApi {
    constructor() {

        setTimeout(() => {
            this.createWebhookNotificationChanel()
        }, 6000);


        this.urlMap = {
            postWebhookNotificationChanel: 'http://grafana:3000/api/alert-notifications',
            postUpdateRoom: 'http://grafana:3000/api/dashboards/db'
        }

        this.defaultQuery = (id) => `SELECT\n  $__timeGroupAlias(ts,$__interval),\n  sensor_id AS metric,\n  avg(value) AS \"value\"\nFROM measurements\nWHERE\n  $__timeFilter(ts) AND\n  sensor_id = '${id}'\nGROUP BY 1,2\nORDER BY $__timeGroup(ts,$__interval)`
    }
    // INIT STUFF
    async createWebhookNotificationChanel() { return await this.send('http://grafana:3000/api/alert-notifications', webhookNotification())}
    // ROOMS
    async getRoomsList() { return await this.send('http://grafana:3000/api/search?query=%') }

    async getRoom(roomId = 'MainRoom') { return await this.send(`http://grafana:3000/api/dashboards/uid/${roomId}`) }

    async updateRoom(roomJsonData) { return this.send('http://grafana:3000/api/dashboards/db', roomJsonData) }

    // DEVICES
    async addNewDevice(id) {
        var room = await this.getRoom('MainRoom');

        if (room.message === 'Dashboard not found') {
            await this.updateRoom(dashboard({ title: 'MainRoom', uid: 'MainRoom' }))
            room = await this.getRoom('MainRoom');
        }
        if (!room.dashboard.panels) room.dashboard.panels = [];
        var newPanel = panel({ uid: id, id: this.hashCode(id), title: id, rawSql: this.defaultQuery(id) })
        // add main room
        newPanel.roomId = 'MainRoom';
        room.dashboard.panels.push(newPanel);
        return JSON.stringify(await this.updateRoom(room));
    }

    async deleteDevice() { }

    async moveDevice({ idFrom, idTo, deviceId }) {

        var uid = (deviceId);
        var roomFrom = await this.getRoom(idFrom);
        var roomTo = await this.getRoom(idTo);
        var roomList = await this.getRoom('MainRoom');
        if (roomTo.message == 'Dashboard not found') { roomTo = dashboard({ uid: idTo, title: idTo, panels: [] }) }
        // get device to clone from roomList
        // var newPanelToAdd = alasql(`select * from ? where uid = ${uid}`, [roomList.dashboard.panels]);


        var newPanelToAdd = roomList.dashboard.panels.filter((res) => res.uid == uid)
        console.log(newPanelToAdd, deviceId, 999999, roomList)
        // add cloned device
        roomTo.dashboard.panels = roomTo.dashboard.panels.concat(newPanelToAdd);
        // update room

        await this.updateRoom(roomTo);
      
        // remove device from old room
        if (idFrom != 'MainRoom') {
            var roomFrom = await this.getRoom(idFrom);
            console.log(roomFrom, 8888888, idFrom)
            var dashboardFromPanels = roomFrom.dashboard.panels.filter((res) => res.uid !== uid)
            roomFrom.dashboard.panels = dashboardFromPanels
            await this.updateRoom(roomFrom);
        }

        // add label to roomList about device Location
        roomList.dashboard.panels = roomList.dashboard.panels.map((panel) => {
            console.log({ uid }, panel.uid == uid, panel.uid)
            if (panel.uid == uid) {
                panel.roomId = idTo;
                return panel
            } else {
                return panel
            }
        })
        await this.updateRoom(roomList);
        return { roomList }
    }

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

    /**************************************ALERTS**************************************/
    async addAlertTiming({ dashboardID, deviceId, threshold, op }) {
        var myDashboard = await this.getRoom(dashboardID);
        var { alertObject, pannelTargetObject } = timingAlert({ deviceId, threshold, op })
        var uid = (deviceId);
        


        var excledeOldPanel = myDashboard.dashboard.panels.filter((res) => res.uid !== uid)

        var newPanelToAdd = myDashboard.dashboard.panels.filter((res) => res.uid == uid)[0]
      
        newPanelToAdd.alert = alertObject
        newPanelToAdd["thresholds"] = [
            {
                "colorMode": "critical",
                "fill": true,
                "line": true,
                "op": op,
                "value": threshold,
                "yaxis": "left"
            }
        ]

        // validate if timing alert target exist
        if (!newPanelToAdd.targets) newPanelToAdd.targets = []
        var existTimer = newPanelToAdd.targets.filter((res) => res.deviceId == deviceId)
        if (existTimer.length == 0) {
            pannelTargetObject.deviceId = deviceId
            
        }
    
        myDashboard.dashboard.panels.push(newPanelToAdd )
        console.log( myDashboard.dashboard.panels)
        return await this.updateRoom(myDashboard);
    }

    async addAlertThreshold({ dashboardID, deviceId, threshold, op }) {
        var myDashboard = await this.getRoom(dashboardID);

        var uid = (deviceId);
        var newPanelToAdd = alasql(`
        select * 
        from ? 
        where uid = "${uid}"
        `, [myDashboard.dashboard.panels])[0];

        var excledeOldPanel = alasql(`
        select * 
        from ? 
        where uid != "${uid}"
        `, [myDashboard.dashboard.panels]);
        newPanelToAdd.alert = alertT({ threshold, op });
        console.log( JSON.stringify(newPanelToAdd.alert) , 988989889)
        newPanelToAdd["thresholds"] = [
            {
                "colorMode": "critical",
                "fill": true,
                "line": true,
                "op": op,
                "value": threshold,
                "yaxis": "left"
            }
        ]
        excledeOldPanel.push(newPanelToAdd)
        myDashboard.dashboard.panels = excledeOldPanel
        
        return await this.updateRoom(myDashboard);
    }
    /**************************************ALERTS**************************************/





}

// var devicesApi = new DevicesApi();
// (async ()=>{
//     console.log(1111111, await devicesApi.addNewDevice('SOL-25:11:11:11:11:11/switch'))
// })() 
module.exports = DevicesApi;   