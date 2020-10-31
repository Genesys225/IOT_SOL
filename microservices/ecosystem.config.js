module.exports = {
  apps: [
    {
      name: "db",
      script: "./db/main.js",
      watch       : true,
    },

    {
      name: "dbDeno",
      script: "./db/mainDeno.js",
      watch       : true,
      interpreter: 'deno',
      interpreter_args: 'run --unstable --allow-net --allow-write --allow-read --allow-plugin --allow-all ./db/mainDeno.js' 
    },
    {
      name: "grabber",
      script: "./graber/main.js",
      watch       : true,
      interpreter: 'deno',
      interpreter_args: 'run --unstable --allow-net --allow-write --allow-read --allow-plugin --allow-all ./graber/main.js' 
    },
    {
      name: "MockSensor",
      script: "./MockSensor/main.js",
      watch       : true,
    },
    {
      name: "ControlPanelApi",
      script: "./ControlPanelApi/main.js",
      watch       : true,
    }
  ],
};
