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
const timingAlert = function(){
	var alertObject =   {
        "alertRuleTags": {},
        "conditions": [
          {
            "evaluator": {
              "params": [
                1
              ],
              "type": "gt"
            },
            "operator": {
              "type": "and"
            },
            "query": {
              "params": [
                "B",
                "5m",
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
        "executionErrorState": "alerting",
        "for": "5m",
        "frequency": "1m",
        "handler": 1,
        "name": "SOL-25:11:11:11:11:11/switch alert",
        "noDataState": "no_data",
        "notifications": []
	  }
	  
	  const pannelTargetObject =  {
		"format": "time_series",
		"group": [],
		"metricColumn": "none",
		"rawQuery": true,
		"rawSql": "SELECT\n  $__timeGroupAlias(ts,$__interval),\n  sensor_id AS metric,\n  avg(value) AS \"value\"\nFROM timers\nWHERE\n  $__timeFilter(ts) AND\n  sensor_id = 'SOL-25:11:11:11:11:11/switch' AND \n    STR_TO_DATE(ts, '%Y-%m-%d %H:%i:%s') >= DATE_SUB(NOW(), INTERVAL 10 MINUTE) \n\nGROUP BY 1,2\nORDER BY $__timeGroup(ts,$__interval)\n \n\n\n\n",
		"refId": "B",
		"select": [
		  [
			{
			  "params": [
				"id"
			  ],
			  "type": "column"
			}
		  ]
		],
		"table": "measurements",
		"timeColumn": "ts",
		"timeColumnType": "timestamp",
		"where": [
		  {
			"name": "$__timeFilter",
			"params": [],
			"type": "macro"
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
				from: 'now-6h',
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

var panel = function({ id, title, rawSql }) {
	var panelTemplete = {
		uid: id,
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
		nullPointMode: 'null',
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

	panelTemplete.uid = id;
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

module.exports = { dashboard, panel, alertT, textWidget, gaugeWidget , timingAlert};
