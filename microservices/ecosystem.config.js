module.exports = {
  apps: [
    {
      name: "db",
      script: "./db/main.js",
      watch       : true,
    },
    // {
    //   name: "grabber",
    //   script: "./Grabber/main.js",
    //   watch       : true,
    // },
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
