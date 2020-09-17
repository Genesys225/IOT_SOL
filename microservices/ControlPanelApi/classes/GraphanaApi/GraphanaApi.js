const fetch = require('node-fetch');
const { panel, dashboard , alertT} = require('./templets');
const alasql = require('alasql')

class GraphanaApi {
    constructor() {
        setInterval(() => {
            this.registerAllDevices()
        }, 6000);
    }
    hashCode(s) {
        return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }
    async registerAllDevices() {
        var myPanels = (await this.getSensors()).map((r) => {
            const rawSql = `SELECT\n  $__timeGroupAlias(ts,$__interval),\n  sensor_id AS metric,\n  avg(value) AS \"value\"\nFROM measurements\nWHERE\n  $__timeFilter(ts) AND\n  sensor_id = '${r.id}'\nGROUP BY 1,2\nORDER BY $__timeGroup(ts,$__interval)`
            console.log(this.hashCode(r.id), r.id)
            return panel({ id: this.hashCode(r.id), title: r.id, rawSql })
        })

        const allPanels = dashboard({ uid: 'All', title: 'All', panels: myPanels })
        await this.updateDashboard(allPanels)
    } 

    createNewPanel({ id, title, rawSql }) {
        return panel({ id: null, title: sensorId, rawSql })
    }

    async addDeviceToDashboard({ deviceId, dashboardUid }) {
        var allDashboard = await this.getDashboard('All');
        var uid = this.hashCode(deviceId)
        var newPanelToAdd = alasql(`
        select * 
        from ? 
        where uid = ${uid}
        `, [allDashboard.dashboard.panels])
     
        const allPanels = dashboard({ uid: dashboardUid, title: dashboardUid, panels: newPanelToAdd })
        await this.updateDashboard(allPanels);
    } 

    async addAlertThreshold({dashboardID, deviceId, threshold, op}){
        
        var myDashboard = await this.getDashboard(dashboardID);
  
        var uid = this.hashCode(deviceId);
        var newPanelToAdd = alasql(`
        select * 
        from ? 
        where uid = ${uid}
        `, [myDashboard.dashboard.panels])[0];
       
        var excledeOldPanel = alasql(`
        select * 
        from ? 
        where uid != ${uid}
        `, [myDashboard.dashboard.panels]);
        newPanelToAdd.alert = alertT({threshold, op});
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
        await this.updateDashboard(myDashboard);
    }
 

    async addDeviceFromDashboardToDashboard({ idFrom, idTo, deviceId }) {
        console.log({ idFrom, idTo, deviceId }, 9999)
        // ********************ADD PANEL***********************************
        var dashboardTo = await this.getDashboard(idTo);
        var allDashboard = await this.getDashboard('All');
        if ( dashboardTo.message == 'Dashboard not found') { dashboardTo = dashboard({ uid: idTo, title: idTo, panels: [] }) }
        var uid = this.hashCode(deviceId);
        var newPanelToAdd = alasql(`
        select * 
        from ? 
        where uid = ${uid}
        `, [allDashboard.dashboard.panels]);
        dashboardTo.dashboard.panels = dashboardTo.dashboard.panels.concat(newPanelToAdd); 
        await this.updateDashboard(dashboardTo);
        // ********************ADD PANEL***********************************
  

        // ********************DELETE PANEL***********************************
        if(idFrom !='All'){ 
   
            var dashboardFrom= await this.getDashboard(idFrom);
                var dashboardFromPanels = alasql(`
                select *
                from ?
                where uid  != ${uid} 
                `, [dashboardFrom.dashboard.panels]);
                dashboardFrom.dashboard.panels= dashboardFromPanels   
                await this.updateDashboard(dashboardFrom);
        }
        // ********************DELETE PANEL***********************************
    }



    async getDashboard(dashboardUid) {
        return await fetch('http://grafana:3000/api/dashboards/uid/' + dashboardUid, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': process.env.GRAPHANA_API_KEY },
        })
            .then(res => res.json())
            .then(json => json || []);
    }

    async getAllPannels(){
        const allDashboards = await this.getAllDashboards();
        const allPannels = []
        for(const dash in allDashboards){
            var dashboard  = (await this.getDashboard(allDashboards[dash].uid))['dashboard']
           allPannels.push({room:dashboard.uid, deviceId: dashboard.panels.title, devices: alasql('select * from ? ', [dashboard.panels])})
        } 

        return allPannels
    }

    async getAllAlerts(){
        const allDashboards = await this.getAllDashboards();
        const allAlerts = []
        for(const dash in allDashboards){
            var dashboard  = (await this.getDashboard(allDashboards[dash].uid))['dashboard']
            if(alasql('select title, alert from ? ', [dashboard.panels]).length > 0) allAlerts.push({dashboardUid:dashboard.uid, deviceId: dashboard.panels.title, alert: alasql('select title, alert from ? ', [dashboard.panels])})
        } 

        return allAlerts
    } 
    
    async getAllDashboards() {
        return await fetch('http://grafana:3000/api/search?query=%', {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': process.env.GRAPHANA_API_KEY },
        })
            .then(res => res.json())
            .then(json => json || []);
    }

    async getSensors(dashboardUid) {
        return await fetch('http://microservices:6000/getSensors', {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': process.env.GRAPHANA_API_KEY },
        })
            .then(res => res.json())
            .then(json => json);
    }
   
    async updateDashboard(dash) {

        return await fetch('http://grafana:3000/api/dashboards/db', {
            method: 'post',
            body: JSON.stringify(dash),
            headers: { 'Content-Type': 'application/json', 'Authorization': process.env.GRAPHANA_API_KEY },
        })
            .then(res => res.json(dash))
            .then(json => console.log(JSON.stringify(json), 999));
    }
}
//SOL-16:11:11:11:11:11/light
var g = new GraphanaApi();  
sensorUid = 'SOL-15:11:11:11:11:11/hum' 
//sensorUid = 'SOL-16:11:11:11:11:11/light'
//g.addDeviceToDashboard({ dashboardUid: 'room1', deviceId: sensorUid });
//g.addDeviceFromDashboardToDashboard({ idFrom: 'room2', idTo: 'room1', deviceId: sensorUid })
g.getAllAlerts()
module.exports = GraphanaApi;   