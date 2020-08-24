const Influx = require("influx");
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://emqtt-broker:1883");

const influx = new Influx.InfluxDB({
  host: "database",
  username: "admin",
  password: "admin",
  database: "db0",
  schema: [
    {
      measurement: "test/temp",
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: ["temp"],
    },
    {
      measurement: "test/humidity",
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: ["humidity"],
    },
    {
      measurement: "test/co2",
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: ["co2"],
    },
    {
      measurement: "test/lux",
      fields: {
        value: Influx.FieldType.FLOAT,
      },
      tags: ["lux"],
    },
  ],
});

client.on("connect", function () {
  client.subscribe("test/#", function (err) {
    if (!err) {
      client.publish("presence", "Hello mqtt");
    }
  });
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
      console.log(value.toString());
      console.log(`Request to ${topic} took ${value}ms`);

      influx
        .writePoints([
          {
            measurement: topic,
            fields: {
              value: +value,
            },
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
