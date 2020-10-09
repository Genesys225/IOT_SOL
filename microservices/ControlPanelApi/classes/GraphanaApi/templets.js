const webhookNotification = function(){
return {
	id: 1,
	uid: 'webhook',
	name: 'webhook',
	type: 'webhook',
	isDefault: true,
	sendReminder: true,
	disableResolveMessage: false,
	frequency: '15s',
	settings: {
	  autoResolve: true,
		httpMethod: 'POST',
		severity: "critical",
	  uploadImage: false,
	  url: 'http://microservices:6000/webhook'
	}
  }
}


const alertT = function({ threshold, op }) {
	const alertTemplete = {
		alertRuleTags: {},
		conditions: [
			{
				evaluator: {
					params: [threshold],
					type: op,
				},
				operator: {
					type: 'and',
				},
				query: {
					params: ['A', '5m', 'now'],
				},
				reducer: {
					params: [],
					type: 'avg',
				},
				type: 'query',
			},
		],
		executionErrorState: 'alerting',
		for: '5m',
		frequency: '1m',
		handler: 1,
		name: 'SOL-15:11:11:11:11:11/hum alert',
		noDataState: 'no_data',
		notifications: [],
	};
	return alertTemplete;
};
const timingAlert = function({deviceId, threshold, op}){
	var alertObject =   {
        "alertRuleTags": {},
        "conditions": [
          {
            "evaluator": {
              "params": [
								0.9,
								0.1
              ],
              "type": "outside_range"
            },
            "operator": {
              "type": "or"
            },
            "query": {
              "params": [
                "B",
                "1m",
                "now"
              ]
            },
            "reducer": {
              "params": [],
              "type": "avg"
            },
            "type": "query"
          }
        ],
        "executionErrorState": "keep_state",
        "for": "1s",
        "frequency": "1s",
        "handler": 1,
        "name": deviceId+"Alert",
				"noDataState": "ok",
				"notifications": [
					{
						"uid": "webhook"
					}
				]
	  }
	  
	  const pannelTargetObject =  {
			"format": "time_series",
			"group": [
				{
					"params": [
						"1s",
						"previous"
					],
					"type": "time"
				}
			],
			"metricColumn": "sensor_id",
			"rawQuery": true,
			"rawSql": "SELECT\n  $__timeGroupAlias(ts,1s,previous),\n  sensor_id AS metric,\n  avg(value) AS \"value\"\nFROM timers\nWHERE\n  $__timeFilter(ts) AND\n  sensor_id = '"+deviceId+"' \nGROUP BY 1,2\nORDER BY $__timeGroup(ts,1s,previous)",
			"refId": "B",
			"select": [
				[
					{
						"params": [
							"value"
						],
						"type": "column"
					},
					{
						"params": [
							"avg"
						],
						"type": "aggregate"
					},
					{
						"params": [
							"value"
						],
						"type": "alias"
					}
				]
			],
			"table": "timers",
			"timeColumn": "ts",
			"timeColumnType": "timestamp",
			"where": [
				{
					"name": "$__timeFilter",
					"params": [],
					"type": "macro"
				},
				{
					"datatype": "varchar",
					"name": "",
					"params": [
						"sensor_id",
						"=",
						`"${deviceId}"`
					],
					"type": "expression"
				}
			]
	  }
	  return {alertObject, pannelTargetObject}
}
var dashboard = function({ id, uid, panels, title }) {
	const dashboard = {
		dashboard: {
			id: id || null,
			uid: uid || null,
			title: title,
			annotations: {
				list: [
					{
						builtIn: 1,
						datasource: '-- Grafana --',
						enable: true,
						hide: true,
						iconColor: 'rgba(0, 211, 255, 1)',
						name: 'Annotations & Alerts',
						type: 'dashboard',
					},
				],
			},
			editable: true,
			gnetId: null,
			graphTooltip: 0,
			links: [],
			panels: panels,
			refresh: '25s',
			schemaVersion: 26,
			style: 'dark',
			tags: ['templated'],
			templating: {
				list: [],
			},
			time: {
				from: 'now-7d',
				to: 'now',
			},
			timepicker: {
				refresh_intervals: [
					'5s',
					'10s',
					'30s',
					'1m',
					'5m',
					'15m',
					'30m',
					'1h',
					'2h',
					'1d',
				],
			},
			timezone: 'browser',

			version: 924,
		},
		folderId: 0,
		overwrite: true,
		version: 1,
	};

	// dashboard.panels = panels
	return dashboard;
};

var panel = function({ id,uid,  title, rawSql }) {
	var panelTemplete = {
		uid: uid,
		aliasColors: {},
		bars: false,
		dashLength: 10,
		dashes: false,
		datasource: null,
		fieldConfig: {
			defaults: {
				custom: {},
			},
			overrides: [],
		},
		fill: 1,
		fillGradient: 0,
		gridPos: {
			h: 9,
			w: 12,
			x: 0,
			y: 0,
		},
		hiddenSeries: false,
		id: id,
		legend: {
			avg: false,
			current: false,
			max: false,
			min: false,
			show: true,
			total: false,
			values: false,
		},
		lines: true,
		linewidth: 1,
		nullPointMode: 'null as zero',
		percentage: false,
		pluginVersion: '7.1.5',
		pointradius: 2,
		points: false,
		renderer: 'flot',
		seriesOverrides: [],
		spaceLength: 10,
		stack: false,
		steppedLine: false,
		targets: [
			{
				format: 'time_series',
				group: [],
				metricColumn: 'sensor_id',
				rawQuery: true,
				rawSql: rawSql,
				refId: 'A',
				select: [
					[
						{
							params: ['value'],
							type: 'column',
						},
					],
				],
				table: 'measurements',
				timeColumn: 'ts',
				timeColumnType: 'timestamp',
				where: [
					{
						name: '$__timeFilter',
						params: [],
						type: 'macro',
					},
				],
			},
		],
		thresholds: [],
		timeFrom: null,
		timeRegions: [],
		timeShift: null,
		title: title,
		
		type: 'graph',
		xaxis: {
			buckets: null,
			mode: 'time',
			name: null,
			show: true,
			values: [],
		},
		yaxes: [
			{
				format: 'short',
				label: null,
				logBase: 1,
				max: null,
				min: null,
				show: true,
			},
			{
				format: 'short',
				label: null,
				logBase: 1,
				max: null,
				min: null,
				show: true,
			},
		],
		yaxis: {
			align: false,
			alignLevel: null,
		},
	};

	panelTemplete.uid = uid;
	panelTemplete.title = title;
	panelTemplete.targets[0].rawSql = rawSql;
	return panelTemplete;
};

var textWidget = function({ id, title, rawSql }) {
	var panelTemplete = panel({ id, title, rawSql });

	panelTemplete.options = {
		colorMode: 'value',
		graphMode: 'none',
		justifyMode: 'auto',
		orientation: 'vertical',
		reduceOptions: {
			calcs: ['last'],
			fields: '',
			values: false,
		},
		textMode: 'value',
	};
	panelTemplete.type = 'stat';
	return panelTemplete;
};

var gaugeWidget = function({ id, title, rawSql }) {
	var panelTemplete = panel({ id, title, rawSql });
	panelTemplete.type = 'gauge';
	return panelTemplete;
};

module.exports = { dashboard, panel, alertT, textWidget, gaugeWidget , timingAlert, webhookNotification};
