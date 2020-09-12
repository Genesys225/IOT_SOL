const fetch = require('node-fetch');
const { panel, dashboard } = require('./templets');
const alasql = require('alasql')

class GraphanaApi {
    constructor() {
        setInterval(() => {
            this.registerAllDevices()
        }, 60000);
    }
    hashCode(s) {
        return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }
    async registerAllDevices() {
        var myPanels = (await this.getSensors()).map((r) => {
            const rawSql = "SELECT\n  UNIX_TIMESTAMP(ts) AS \"time\",\n  sensor_id AS metric,\n  value\nFROM measurements\nWHERE\n  $__timeFilter(ts)\n  AND sensor_id=\"" + r.id + "\"\nORDER BY ts"
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
         //dashboardTo.dashboard.panels = newPanelToAdd
 
        // ********************ADD PANEL***********************************
  

        // ********************DELETE PANEL***********************************

        if(idFrom !='All'){ 
   
            var dashboardFrom= await this.getDashboard(idFrom);

           
                var dashboardFromPanels = alasql(`
                select *
                from ?
                where uid  != ${uid} 
                `, [dashboardFrom.dashboard.panels]);
                console.log(555, dashboardFromPanels)
            console.log({deviceId,  uid})  
                dashboardFrom.dashboard.panels= dashboardFromPanels   
                console.log(dashboardFrom.dashboard.panels, 7777)
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
module.exports = GraphanaApi;   