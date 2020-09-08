const fetch = require('node-fetch');

const { panel, dashboard } = require('./dashboard');



class GraphanaApi {


    async registerAllDevices() {

        var myPanels = (await this.getSensors()).map((r) => {
            const rawSql = "SELECT\n  UNIX_TIMESTAMP(ts) AS \"time\",\n  sensor_id AS metric,\n  value\nFROM measurements\nWHERE\n  $__timeFilter(ts)\n  AND sensor_id=\"" + r.id + "\"\nORDER BY ts"
            return panel({ id: r.id, title: r.id, rawSql })
        })

        const allPanels = this.addPanelToDashboard({ dashboardUid: 'All', dashboardTitle: 'All', panel: myPanels })
        await this.updateDashboard(allPanels)
    }

    createNewPanel({ id, title, rawSql }) {
        return panel({ id: null, title: sensorId, rawSql })
    }

    addPanelToDashboard({ dashboardUid, dashboardTitle, panel }) {
        return dashboard({
            uid: dashboardUid,
            title: dashboardUid,
            panels: panel,
        })
    }

    async getDashboard(dashboardUid) {
        return await fetch('http://grafana:3000/api/dashboards/uid/' + dashboardUid, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': process.env.GRAPHANA_API_KEY },
        })
            .then(res => res.json())
            .then(json => json.dashboard.panels || []);
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


module.exports = GraphanaApi;