var dashboard = function({id,uid, panels, title}){
    const dashboard =  {
      "dashboard": {
        "id": id || null,
        "uid": uid || null,
        "title": title,
        "annotations": {
          "list": [
            {
              "builtIn": 1,
              "datasource": "-- Grafana --",
              "enable": true,
              "hide": true,
              "iconColor": "rgba(0, 211, 255, 1)",
              "name": "Annotations & Alerts",
              "type": "dashboard"
            }
          ]
        },
        "editable": true,
        "gnetId": null,
        "graphTooltip": 0,
        "links": [],
         "panels": panels, 
        "refresh": "25s",
        "schemaVersion": 26,
        "style": "dark",
        "tags": [
          "templated"
        ],
        "templating": {
          "list": []
        },
        "time": {
          "from": "now-6h",
          "to": "now"
        },
        "timepicker": {
          "refresh_intervals": [
            "5s",
            "10s",
            "30s",
            "1m",
            "5m",
            "15m",
            "30m",
            "1h",
            "2h",
            "1d"
          ]
        },
        "timezone": "browser",
   
        "version": 924
      },
      "folderId": 0,
      "overwrite": true
      }
  
    
    // dashboard.panels = panels
    return dashboard
  }
  



  var panel = function({id, title, rawSql}){
    return {
          "aliasColors": {},
          "bars": false,
          "dashLength": 10,
          "dashes": false,
          "datasource": null,
          "fieldConfig": {
            "defaults": {
              "custom": {}
            },
            "overrides": []
          },
          "fill": 1,
          "fillGradient": 0,
          "gridPos": {
            "h": 9,
            "w": 12,
            "x": 0,
            "y": 0
          },
          "hiddenSeries": false,
          "id": id,
          "legend": {
            "avg": false,
            "current": false,
            "max": false,
            "min": false,
            "show": true,
            "total": false,
            "values": false
          },
          "lines": true,
          "linewidth": 1,
          "nullPointMode": "null",
          "percentage": false,
          "pluginVersion": "7.1.5",
          "pointradius": 2,
          "points": false,
          "renderer": "flot",
          "seriesOverrides": [],
          "spaceLength": 10,
          "stack": false,
          "steppedLine": false,
          "targets": [
            {
              "format": "time_series",
              "group": [],
              "metricColumn": "sensor_id",
              "rawQuery": true,
              "rawSql": rawSql, 
              "refId": "A",
              "select": [
                [
                  {
                    "params": [
                      "value"
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
          ],
          "thresholds": [],
          "timeFrom": null,
          "timeRegions": [],
          "timeShift": null,
          "title": title,
          "tooltip": {
            "shared": true,
            "sort": 0,
            "value_type": "individual"
          },
          "type": "graph",
          "xaxis": {
            "buckets": null,
            "mode": "time",
            "name": null,
            "show": true,
            "values": []
          },
          "yaxes": [
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            },
            {
              "format": "short",
              "label": null,
              "logBase": 1,
              "max": null,
              "min": null,
              "show": true
            }
          ],
          "yaxis": {
            "align": false,
            "alignLevel": null
          }
        }
        
      
    }


    module.exports = {dashboard, panel}








