const Influx = require("influx");
var mqtt = require("mqtt");
var mqtt2 = require("mqtt");
var client = mqtt.connect("mqtt://emqtt-broker:1883");
var serverEventsClient = mqtt2.connect("mqtt://emqtt-broker:1883");

const influx = new Influx.InfluxDB({
  host: "database",
  username: "admin",
  password: "admin",
  database: "db0",
  schema: [
    {
      measurement: Influx.FieldType.STRING,
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: ["temp", "humidity", "co2", "lux"],
    },
  ],
});

client.on("connect", function () {
  client.subscribe("sensors/#", function (err) {
    if (!err) {
      client.publish("presence", "Hello mqtt");
    } else console.log(err);
  });
});
serverEventsClient.on("connect", function () {
  serverEventsClient.subscribe("$SYS/brokers/#", function (err) {
    if (!err) {
      serverEventsClient.publish("presence", "Hello mqtt");
    } else console.log(err);
  });
});

serverEventsClient.on("message", function (topic, value) {
  // value is Buffer
  console.log(`Request to ${topic} took ${value}ms`);
});

influx
  .getDatabaseNames()
  .then((names) => {
    if (!names.includes("db0")) {
      return influx.createDatabase("db0");
    }
  })
  .then(() => {
    client.on("message", function (topic, value) {
      // value is Buffer
      console.log(topic);
      const [_sensors, measurement, tag] = topic.split("/");
      console.log(`${measurement}/${tag} => ${value}`);
      const result = influx
        .writePoints([
          {
            measurement: `${measurement}/${tag}`,
            fields: {
              value: +value,
            },
            tags: [tag],
          },
        ])
        .catch((err) => {
          console.error(`Error saving data to InfluxDB! ${err.stack}`);
        });
    });
  })
  .catch((err) => {
    console.error(err);
  });
